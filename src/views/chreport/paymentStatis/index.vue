<template>
  <div class="app-container">
    <div class="flex-top-center">
      <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />

      <!-- <el-form :inline="true">
      <el-form-item>
        <el-tag type="info">日期:</el-tag>
        <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange" range-separator="~"
          start-placeholder="开始日期" end-placeholder="结束日期" align="right" format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']" value-format="timestamp" @change="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
        重置
        <el-button size="small" icon="el-icon-refresh" @click="resets" >重置</el-button>

      </el-form-item>
    </el-form> -->
    <el-button size="small" :loading="downloadLoading" style="margin-left: 0 0 0px 0px" type="primary"
      icon="el-icon-document" @click="handleDownload">
      导出Excel
    </el-button>
  </div>
   

    <el-table v-cloading="listLoading" :data="list" size="mini" fit highlight-current-row show-summary
      :summary-method="getSummaries">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="paymentType" label="支付类型" min-width="180" />
      <el-table-column prop="orderNum" label="订单笔数" />
      <el-table-column prop="validOrderNum" label="有效订单笔数" min-width="150"  />
      <el-table-column prop="failOrderNumUser" label="订单失败笔数"  min-width="150" />
      <el-table-column prop="oneTotalOrderNumToA" label="单笔充值订单数(10w以内)" min-width="170" />
      <el-table-column prop="totalAmtToA" label="充值总额(10w以内)"  min-width="150" />
      <el-table-column prop="oneTotalOrderNumToB" label="单笔充值订单数(10w-1000w)" min-width="180"  />
      <el-table-column prop="totalAmtToB" label="充值总额(10w-1000w)" min-width="180"  />
      <el-table-column prop="oneTotalOrderNum" label="单笔充值订单数(1000w以上)" min-width="180"  />
      <el-table-column prop="totalAmtToC" label="充值总额(1000w以上)" min-width="180"  />
      <el-table-column prop="totalAmt" label="充值总金额" />
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>
  
  <script>
import { paymentStatis, paymentStatisTotal } from '@/api/chreport/paymentStatis'
import mixin from '../mixin'
import { getDateTime } from '@/utils/tools'
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: 'ChReportPaymentStatisIndex',
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        pickerValue: [],
      },
      totalList: {},
      downloadLoading: false,
      currentTotal: [], //当前页收益
      allPageTotal: [],
      allEl: null,
      // 重新设置表单数据
      resetCreateModel() {
        this.createModel = {
          list: [],
          listLoading: true,
          listQuery: {
            pageNum: 1,
            pageSize: 20,
            pickerValue: [],
          },
        }
      },
    }
  },
  mixins: [mixin],
  created() {
    
    // this.fetchData()
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.listQuery.pickerValue = vm.$store.getters.timerDate
      vm.fetchData()
    })
  },
  computed: {
    setAll() {
      return {
        list: this.list,
        totalList: this.totalList,
        el: this.allEl,
      }
    },
  },
  //  合并当前页合计第一第二列
  watch: {
    list(e) {
      this.$nextTick(() => {
        let tds = document
          .querySelector('.el-table__footer-wrapper')
          .querySelector('tr')
          .getElementsByTagName('td')
        tds[0].setAttribute('colspan', 2)
        if (tds.length > 11) {
          tds[1].remove()
        }
        this.allEl = tds
      })
    },
    //显示所有页总数列
    setAll(item) {
      let e = item.totalList
      if (!e || e.length === 0) return
      this.$nextTick(() => {
        this.allPageTotal = [
          '所有页合计',
          '',
          this.totalList.orderNum || 0,
          this.totalList.validOrderNum || 0,
          this.totalList.failOrderNumUser || 0,
          this.totalList.oneTotalOrderNumToA || 0,
          this.totalList.totalAmtToA || 0,
          this.totalList.oneTotalOrderNumToB || 0,
          this.totalList.totalAmtToB || 0,
          this.totalList.oneTotalOrderNum || 0,
          this.totalList.totalAmtToC || 0,
          this.totalList.totalAmt || 0,
        ]
        let tabel = document
          .getElementsByClassName('el-table__footer-wrapper')[0]
          .getElementsByClassName('has-gutter')
        tabel[0].querySelectorAll('tr').forEach((val, index) => {
          index > 0 && val.remove()
        })
        let tr = tabel[0].querySelector('tr').cloneNode(true)
        tr.querySelectorAll('td')[0].querySelector('div').innerHTML =
          this.allPageTotal[0]
        tr.querySelectorAll('td')[1].querySelector('div').innerHTML =
          this.allPageTotal[2]
        tr.querySelectorAll('td')[2].querySelector('div').innerHTML =
          this.allPageTotal[3]
        tr.querySelectorAll('td')[3].querySelector('div').innerHTML =
          this.allPageTotal[4]
        tr.querySelectorAll('td')[4].querySelector('div').innerHTML =
          this.allPageTotal[5]
        tr.querySelectorAll('td')[5].querySelector('div').innerHTML =
          this.allPageTotal[6]
        tabel[0].append(tr)
      })
    },
  },
  methods: {
    // 获取列表数据
    async fetchData() {
      let params = this.initDataParams()
      try {
        const res = await paymentStatis(params)
        this.list = this.setList(res.data.list)
        this.listQuery.total = res.data.total || 0
        this.listLoading = false
      } catch (error) {
        this.list = null
        this.listQuery.total = 0
        this.listLoading = false
        this.$message.error(error)
      }
      this.totalList = []
      try {
        const res = await paymentStatisTotal(params)
        this.totalList = res.data
      } catch (error) {
        this.totalList = {}
      }
    },
    //当前页合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '当前页合计'
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            if (!isNaN(curr)) {
              return this.accAdd(prev, curr)
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
      })
      this.currentTotal = sums
      return sums
    },
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          '序号',
          '支付类型',
          '订单笔数',
          '有效订单笔数',
          '订单失败笔数',
          '单笔充值订单数(10w以内)',
          '充值总额(10w以内)',
          '单笔充值订单数(10w-1000w)',
          '充值总额(10w-1000w)',
          '单笔充值订单数(1000w以上)',
          '充值总额(1000w以上)',
          '充值总金额',
        ]
        const filterVal = [
          'aid',
          'paymentType',
          'orderNum',
          'validOrderNum',
          'failOrderNumUser',
          'oneTotalOrderNumToA',
          'totalAmtToA',
          'oneTotalOrderNumToB',
          'totalAmtToB',
          'oneTotalOrderNum',
          'totalAmtToC',
          'totalAmt',
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '支付统计报表',
          merges: [
            `A${list.length + 2}:B${list.length + 2}`,
            `A${list.length + 3}:B${list.length + 3}`,
          ],
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      let result = jsonData.map((v, key) =>
        filterVal.map((j, i) => {
          if (j === 'aid') {
            return key + 1
          } else return v[j]
        })
      )
      result.push(this.currentTotal)
      result.push(this.allPageTotal)
      return result
    },
  },
}
</script>