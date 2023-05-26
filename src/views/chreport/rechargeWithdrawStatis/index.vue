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
        <el-button size="small" icon="el-icon-refresh" @click="resets">重置</el-button>
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
      <el-table-column prop="reportDate" width="90" label="日期" />
      <el-table-column label="用户">
        <el-table-column prop="rechargeNumUser" label="充值人数" />
        <el-table-column prop="rechargeAmtUser" label="充值金额" />
        <el-table-column prop="withdrawNumUser" label="提款人数" />
        <el-table-column prop="withdrawAmtUser" label="提款金额" />
        <el-table-column prop="diffAmtUser" label="充提差">
          <template slot-scope="{ row }">
            <div :class="row.diffAmtUser > 0 ? 'greenMoney' : row.diffAmtUser < 0 ? 'redMoney' : ''">
              {{ row.diffAmtUser }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="主播">
        <el-table-column prop="rechargeNumAnchor" label="充值人数" />
        <el-table-column prop="rechargeAmtAnchor" label="充值金额" />
        <el-table-column prop="withdrawNumAnchor" label="提款人数" />
        <el-table-column prop="withdrawAmtAnchor" label="提款金额" />
        <el-table-column prop="diffAmtAnchor" label="充提差">
          <template slot-scope="{ row }">
            <div :class="row.diffAmtAnchor > 0 ? 'greenMoney' : row.diffAmtAnchor < 0 ? 'redMoney' : ''">
              {{ row.diffAmtAnchor }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>
  
<script>
import {
  rechargeWithdrawStatis,
  rechargeWithdrawStatisTotal,
} from '@/api/chreport/rechargeWithdrawStatis'
import mixin from '../mixin'
import { getDateTime } from '@/utils/tools'
// const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: 'ChReportRechargeWithdrawStatisIndex',
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
  computed: {
    setAll() {
      return {
        list: this.list,
        totalList: this.totalList,
        el: this.allEl,
      }
    },
    initTimer() {
      return this.$store.getters.timerDate
    }
  },
  created() {
    this.listQuery.pickerValue = this.initTimer
    this.fetchData()
  },
  //  合并当前页合计第一第二列
  watch: {
    list(e) {
      this.$nextTick(() => {
        let tds = document
          .querySelector('.el-table__footer-wrapper')
          .querySelector('tr')
          .getElementsByTagName('td')
        for (let val of tds) {
          val.setAttribute('rowspan', 1)
        }
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
          this.totalList.rechargeNumUser || 0,
          this.totalList.rechargeAmtUser || 0,
          this.totalList.withdrawNumUser || 0,
          this.totalList.withdrawAmtUser || 0,
          this.totalList.diffAmtUser || 0,
          this.totalList.rechargeNumAnchor || 0,
          this.totalList.rechargeAmtAnchor || 0,
          this.totalList.withdrawNumAnchor || 0,
          this.totalList.withdrawAmtAnchor || 0,
          this.totalList.diffAmtAnchor || 0,
        ]
        let tabel = document
          .getElementsByClassName('el-table__footer-wrapper')[0]
          .getElementsByClassName('has-gutter')
        tabel[0].querySelectorAll('tr').forEach((val, index) => {
          index > 0 && val.remove()
        })

        let Doms = tabel[0].querySelectorAll('tr')[0].querySelectorAll('td')
        Doms.forEach((value, index) => {
          if (index == 5 || index == Doms.length - 1) {
            let dom = value.querySelector('div')
            let values = dom.innerHTML
            let className = ''
            if (values * 1 < 0) {
              className = 'redMoney'
            } else if (values * 1 > 0) {
              className = 'greenMoney'
            }
            dom.classList.add(className)
          }
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
        tr.querySelectorAll('td')[6].querySelector('div').innerHTML =
          this.allPageTotal[7]
        tr.querySelectorAll('td')[7].querySelector('div').innerHTML =
          this.allPageTotal[8]
        tr.querySelectorAll('td')[8].querySelector('div').innerHTML =
          this.allPageTotal[9]
        tr.querySelectorAll('td')[9].querySelector('div').innerHTML =
          this.allPageTotal[10]
        tr.querySelectorAll('td')[10].querySelector('div').innerHTML =
          this.allPageTotal[11]
        tabel[0].append(tr)
      })
    },
  },
  methods: {
    // 获取列表数据
    async fetchData() {
      let params = this.initDataParams()
      // 请求服务器
      try {
        const res = await rechargeWithdrawStatis(params)
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
        const res = await rechargeWithdrawStatisTotal(params)
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
        const tHeader1 = [
          '序号',
          '日期',
          '用户',
          '用户',
          '用户',
          '用户',
          '用户',
          '主播',
          '主播',
          '主播',
          '主播',
          '主播',
        ]
        const tHeader2 = [
          '序号',
          '日期',
          '充值人数',
          '充值金额',
          '提款人数',
          '提款金额',
          '充提差',
          '充值人数',
          '充值金额',
          '提款人数',
          '提款金额',
          '充提差',
        ]
        const filterVal = [
          'aid',
          'reportDate',
          'rechargeNumUser',
          'rechargeAmtUser',
          'withdrawNumUser',
          'withdrawAmtUser',
          'diffAmtUser',
          'rechargeNumAnchor',
          'rechargeAmtAnchor',
          'withdrawNumAnchor',
          'withdrawAmtAnchor',
          'diffAmtAnchor',
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          headerArr: [tHeader1, tHeader2],
          data,
          filename: '每日充提报表',
          merges: [
            'A1:A2',
            'B1:B2',
            'C1:G1',
            'H1:L1',
            `A${list.length + 3}:B${list.length + 3}`,
            `A${list.length + 4}:B${list.length + 4}`,
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