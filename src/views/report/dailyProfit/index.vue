<template>
  <div class="app-container">
    <div class="flex-top-center">
      <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
      <!-- <el-for
       -->
      <el-button size="small" :loading="downloadLoading" style="margin-left: 0 0 0px 0px" type="primary"
        icon="el-icon-document" @click="handleDownload">
        导出Excel
      </el-button>
    </div>


    <el-table v-cloading="listLoading" :data="list" size="mini" fit highlight-current-row show-summary
      :summary-method="getSummaries">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="reportDate" min-width="120" label="日期" />
      <el-table-column prop="lotteryProfitAmt" min-width="120" label="自营彩输赢" />
      <el-table-column prop="gameProfitAmt" min-width="120" label="三方游戏输赢" />
      <el-table-column prop="allProfitAmt" min-width="120" label="游戏总输赢" />
      <el-table-column prop="giftProfitAmt" min-width="120" label="礼物打赏" />
      <el-table-column prop="roomProfitAmt" min-width="120" label="付费收益" />
      <el-table-column prop="propsBuyAmt" label="道具购买" />
      <el-table-column prop="vipBuyAmt" min-width="120" label="VIP购买" />
      <el-table-column prop="anchorSalaryAmt" min-width="120" label="主播工资" />
      <el-table-column prop="familyAgencyAmt" min-width="120" label="中介费" />
      <el-table-column prop="giftCommissionAmt" min-width="120" label="打赏抽成" />
      <el-table-column prop="lotteryCommissionAmt" min-width="120" label="彩票抽成" />
      <el-table-column prop="roomLockCommissionAmt" min-width="120" label="付费分成" />
      <el-table-column prop="anchorSubsidyAmt" min-width="120" label="日榜补贴" />
      <el-table-column prop="moneyCount" min-width="160" label="总盈利">
        <template slot-scope="{ row }">
          <div :class="{ redMoney: moneyCount(row) < 0 }">
            {{ moneyCount(row) }}
          </div>
        </template>
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
import { dailyProfit, liveProfitTotal } from '@/api/report/dailyProfit'
import mixin from '../mixin'
import { getDateTime } from '@/utils/tools'
const { NOW_TIME_START, NOW_TIME_END } = getDateTime()
export default {
  name: 'ReportDailyProfitIndex',
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        pickerValue: [NOW_TIME_START, NOW_TIME_END],
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
        if (tds.length > 15) {
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
          this.totalList.lotteryProfitAmt || 0,
          this.totalList.gameProfitAmt || 0,
          this.totalList.allProfitAmt || 0,
          this.totalList.giftProfitAmt || 0,
          this.totalList.roomProfitAmt || 0,
          this.totalList.propsBuyAmt || 0,
          this.totalList.vipBuyAmt || 0,
          this.totalList.anchorSalaryAmt || 0,
          this.totalList.familyAgencyAmt || 0,
          this.totalList.giftCommissionAmt || 0,
          this.totalList.lotteryCommissionAmt || 0,
          this.totalList.roomLockCommissionAmt || 0,
          this.totalList.anchorSubsidyAmt || 0,
          this.moneyCount(this.totalList),
        ]
        let tabel = document
          .getElementsByClassName('el-table__footer-wrapper')[0]
          .getElementsByClassName('has-gutter')
        tabel[0].querySelectorAll('tr').forEach((val, index) => {
          index > 0 && val.remove()
        })
        let Doms = tabel[0].querySelectorAll('tr')[0].querySelectorAll('td')
        let lastDom = Doms[Doms.length - 1].querySelector('div')
        let values = lastDom.innerHTML
        if (values * 1 < 0) {
          lastDom.classList.add('redMoney')
        }
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
        tr.querySelectorAll('td')[11].querySelector('div').innerHTML =
          this.allPageTotal[12]
        tr.querySelectorAll('td')[12].querySelector('div').innerHTML =
          this.allPageTotal[13]
        tr.querySelectorAll('td')[13].querySelector('div').innerHTML =
          this.allPageTotal[14]
        tr.querySelectorAll('td')[14].querySelector('div').innerHTML =
          this.allPageTotal[15]
        if (this.allPageTotal[15] < 0) {
          tr.querySelectorAll('td')[14].querySelector('div').classList.add('redMoney')
        }
        tabel[0].append(tr)
      })
    },
  },
  methods: {
    //计算直播盈利
    moneyCount(row) {
      console.log(row)
      return (
        Math.floor(
          (row.allProfitAmt +
            row.giftProfitAmt +
            row.roomProfitAmt +
            row.propsBuyAmt +
            row.vipBuyAmt -
            row.anchorSalaryAmt -
            row.familyAgencyAmt -
            row.giftCommissionAmt -
            row.lotteryCommissionAmt -
            row.roomLockCommissionAmt -
            row.anchorSubsidyAmt) *
          100
        ) / 100
      )
    },
    // 获取列表数据
    async fetchData() {
      const params = this.initDataParams()
      // 请求服务器
      try {
        const res = await dailyProfit(params)
        this.list = this.setList(res.data.list || [])
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
        const res = await liveProfitTotal(params)
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
          '日期',
          '自营彩输赢',
          '三方游戏输赢',
          '游戏总输赢',
          '礼物打赏',
          '付费收益',
          '道具购买',
          'VIP购买',
          '主播工资',
          '中介费',
          '打赏抽成',
          '彩票抽成',
          '付费分成',
          '日榜补贴',
          '总盈利',
        ]
        const filterVal = [
          'aid',
          'reportDate',
          'lotteryProfitAmt',
          'gameProfitAmt',
          'allProfitAmt',
          'giftProfitAmt',
          'roomProfitAmt',
          'propsBuyAmt',
          'vipBuyAmt',
          'anchorSalaryAmt',
          'familyAgencyAmt',
          'giftCommissionAmt',
          'lotteryCommissionAmt',
          'roomLockCommissionAmt',
          'anchorSubsidyAmt',
          'moneyCount',
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '平台日盈亏报表',
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