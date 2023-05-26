<template>
  <div class="app-container">
    <div class="flex-top-center">
      <div>
        <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
        <el-form :inline="true">
        <!-- <el-form-item>
          <el-tag type="info">日期:</el-tag>
          <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange" range-separator="~"
            start-placeholder="开始日期" end-placeholder="结束日期" align="right" format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']" value-format="timestamp" @change="handleSearchFilter"
            style="max-width: 350px;" />
        </el-form-item> -->
        <el-form-item>
          <!-- <el-tag type="info">代理ID:</el-tag> -->
          <el-input v-model="listQuery.agentId" size="small" class="input-with-select" placeholder="请输入代理ID" clearable
            maxlength="16" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter"
            style="max-width: 150px;" />
        </el-form-item>
        <el-form-item>
          <!-- <el-tag type="info">用户ID:</el-tag> -->
          <el-input v-model="listQuery.uid" size="small" class="input-with-select" placeholder="请输入用户ID" clearable
            maxlength="16" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter"
            style="max-width: 150px;" />
        </el-form-item>
        <el-form-item>
          <!-- <el-tag type="info">用户昵称:</el-tag> -->
          <el-input v-model="listQuery.nickname" size="small" class="input-with-select" placeholder="请输入用户昵称" clearable
            maxlength="16" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter"
            style="max-width: 150px;" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
          <!-- 重置 -->
          <el-button size="small" icon="el-icon-refresh" @click="resets" >重置</el-button>
        </el-form-item>
      </el-form>
      </div>
    <el-button size="small" :loading="downloadLoading" style="margin-left: 0 0 0px 0px" type="primary"
          icon="el-icon-document" @click="handleDownload">
          导出Excel
        </el-button>
    </div>
    

    <el-table v-cloading="listLoading" :data="list" size="mini" fit highlight-current-row show-summary
      :summary-method="getSummaries">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="agentId" label="代理ID" />
      <el-table-column prop="userId" label="用户ID" min-width="125"/>
      <el-table-column prop="nickname" label="用户昵称" min-width="125"/>
      <el-table-column prop="userTypeName" label="用户标签" min-width="125"/>
      <el-table-column prop="balance" label="余额" min-width="120"/>
      <el-table-column prop="totalRechargeAmt" label="总存款" min-width="125"/>
      <el-table-column prop="rechargeNum" label="存款次数" />
      <el-table-column prop="totalWithdraw" label="总取款" />
      <el-table-column prop="withdrawNum" label="取款次数" />
      <el-table-column prop="diffAmtA" label="取存差额" min-width="125"/>
      <el-table-column prop="totalBonus" label="总红利" min-width="125"/>
      <el-table-column prop="bonusAmt" label="存红利差额" min-width="125"/>
      <el-table-column prop="totalBetAmt" label="投注金额" min-width="125"/>
      <el-table-column prop="winLoseCoin" label="输赢金额" min-width="125"/>
      <el-table-column prop="validBetCoin" label="有效投注金额" min-width="125"/>
      <el-table-column prop="betRate" label="盈利率" min-width="125"/>
      <!-- <el-table-column prop="positiveAmt" label="冲正负金额"   /> -->
      <el-table-column prop="registerTime" label="注册时间" min-width="135"/>
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
  userAccessStatis,
  userAccessStatisTotal,
} from '@/api/chreport/userAccessStatis'
import mixin from '../mixin'
import { formatUnixTime, getDateTime } from '@/utils/tools'
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()
export default {
  name: 'ChReportUserAccessStatisIndex',
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
    next((vm)=>{
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
        tds[0].setAttribute('colspan', 5)
        if (tds.length > 15) {
          for (let i = 4; i > 0; i--) {
            tds[1].remove()
          }
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
          '',
          '',
          '',
          this.totalList.balance || 0,
          this.totalList.totalRechargeAmt || 0,
          this.totalList.rechargeNum || 0,
          this.totalList.totalWithdraw || 0,
          this.totalList.withdrawNum || 0,
          this.totalList.diffAmtA || 0,
          this.totalList.totalBonus || 0,
          this.totalList.bonusAmt || 0,
          this.totalList.totalBetAmt || 0,
          this.totalList.winLoseCoin || 0,
          this.totalList.validBetCoin || 0,
          '-',
          '-',
          '-',
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
          this.allPageTotal[5]
        tr.querySelectorAll('td')[2].querySelector('div').innerHTML =
          this.allPageTotal[6]
        tr.querySelectorAll('td')[3].querySelector('div').innerHTML =
          this.allPageTotal[7]
        tr.querySelectorAll('td')[4].querySelector('div').innerHTML =
          this.allPageTotal[8]
        tr.querySelectorAll('td')[5].querySelector('div').innerHTML =
          this.allPageTotal[9]
        tr.querySelectorAll('td')[6].querySelector('div').innerHTML =
          this.allPageTotal[10]
        tr.querySelectorAll('td')[7].querySelector('div').innerHTML =
          this.allPageTotal[11]
        tr.querySelectorAll('td')[8].querySelector('div').innerHTML =
          this.allPageTotal[12]
        tr.querySelectorAll('td')[9].querySelector('div').innerHTML =
          this.allPageTotal[13]
        tr.querySelectorAll('td')[10].querySelector('div').innerHTML =
          this.allPageTotal[14]
        tr.querySelectorAll('td')[11].querySelector('div').innerHTML =
          this.allPageTotal[15]
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
        const res = await userAccessStatis(params)
        this.list = this.setList(res.data.list).map((v) => {
          let t = new Date(Number(v.registerTime))
          return Object.assign(v, {
            registerTime:
              t.toLocaleDateString().replace(/\//g, '-') +
              ` ${t.toLocaleTimeString()}`,
            betRate: v.betRate + '%',
          })
        })
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
        const res = await userAccessStatisTotal(params)
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
        if (index === 18) {
          sums[index] = '-'
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
          sums[index] = '-'
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
          '代理ID',
          '用户ID',
          '用户昵称',
          '用户标签',
          '余额',
          '总存款',
          '存款次数',
          '总取款',
          '取款次数',
          '取存差额',
          '总红利',
          '存红利差额',
          '投注金额',
          '输赢金额',
          '有效投注金额',
          '投注盈利率',
          // '冲正负金额',
          '注册时间',
        ]
        const filterVal = [
          'aid',
          'agentId',
          'userId',
          'nickname',
          'userTypeName',
          'balance',
          'totalRechargeAmt',
          'rechargeNum',
          'totalWithdraw',
          'withdrawNum',
          'diffAmtA',
          'totalBonus',
          'bonusAmt',
          'totalBetAmt',
          'winLoseCoin',
          'validBetCoin',
          'betRate',
          'positiveAmt',
          'registerTime',
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '用户存取投注',
          merges: [
            `A${list.length + 2}:E${list.length + 2}`,
            `A${list.length + 3}:E${list.length + 3}`,
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