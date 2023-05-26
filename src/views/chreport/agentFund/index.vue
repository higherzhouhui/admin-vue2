<template>
  <div class="app-container">
    <div class="flex-top-center">
      <el-form :inline="true">
      <el-form-item>
        <!-- 重置 -->
        <el-button size="small" icon="el-icon-refresh" @click="resets" >重置</el-button>
      </el-form-item>
    </el-form>
    <el-button size="small" :loading="downloadLoading" style="margin-left: 0 0 0px 0px" type="primary"
          icon="el-icon-document" @click="handleDownload">
          导出Excel
        </el-button>
    </div>
 

    <el-table v-cloading="listLoading" :data="list" size="mini" fit highlight-current-row show-summary
      :summary-method="getSummaries">
      <el-table-column type="index" label="序号" width="60"   />
      <el-table-column prop="reportDate" min-width="120" label="日期"   />
      <el-table-column prop="totalBetAmt" min-width="120" label="投注金额"   />
      <el-table-column prop="totalProfitAmt" min-width="120" label="游戏输赢"   />
      <el-table-column prop="bonusAmt" min-width="120" label="优惠红利"   />
      <el-table-column prop="directMemberAmt"  min-width="120" label="直属佣金"   />
      <el-table-column prop="directAgentAmt" min-width="120" label="代理提成"   />
      <el-table-column prop="lotteryRebate" min-width="120" label="彩票返水"   />
      <el-table-column prop="supportAmt" min-width="120" label="扶持佣金"   />
      <el-table-column prop="giftAmt" min-width="120" label="打赏抽成"   />
      <el-table-column prop="modifyAmt" min-width="120" label="调整佣金"   />
      <el-table-column prop="reversalAmt" min-width="120" label="本月冲正"   />
      <el-table-column prop="totalAmt" min-width="120" label="实际佣金"   />
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>
  
  <script>
import { agentStatis, agentStatisTotal } from '@/api/chreport/agentFund'
import mixin from '../mixin'
export default {
  name: 'ChReportAgentFundIndex',
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
    this.fetchData()
  },
  //  合并当前页合计第一第二列
  watch: {
    list(e) {
      let tds = document
        .querySelector('.el-table__footer-wrapper')
        .querySelector('tr')
        .getElementsByTagName('td')
      tds[0].setAttribute('colspan', 2)
      if (tds.length > 6) {
        tds[1].remove()
      }
    },
    //显示所有页总数列
    totalList(e) {
      if (!e || e.length === 0) return
      this.$nextTick(() => {
        this.allPageTotal = [
          '所有页合计',
          '',
          this.totalList.totalBetAmt || 0,
          this.totalList.totalProfitAmt || 0,
          this.totalList.bonusAmt || 0,
          this.totalList.directMemberAmt || 0,
          this.totalList.directAgentAmt || 0,
          this.totalList.lotteryRebate || 0,
          this.totalList.supportAmt || 0,
          this.totalList.giftAmt || 0,
          this.totalList.modifyAmt || 0,
          this.totalList.reversalAmt || 0,
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
        tabel[0].append(tr)
        tabel[0].querySelector('tr').remove()
      })
    },
  },
  methods: {
    // 获取列表数据
    async fetchData() {
      let params = this.initDataParams()
      // 请求服务器
      try {
        const res = await agentStatis(params)
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
        const res = await agentStatisTotal(params)
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
          sums[index] = '所有页合计'
          return
        }
        const values = data.map(
          (item) => Math.floor(item[column.property] * 100) / 100
        )
        if (!values.every((value) => isNaN(value))) {
          const currentColumnSum = values.reduce((prev, curr) => {
            const value = Math.floor(curr * 100) / 100
            if (!isNaN(value)) {
              return this.accAdd(prev, curr)
            } else {
              return prev
            }
          }, 0)
          sums[index] = Math.floor(currentColumnSum * 100) / 100
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
          '投注金额',
          '游戏输赢',
          '优惠红利',
          '直属佣金',
          '代理提成',
          '彩票返水',
          '扶持佣金',
          '打赏抽成',
          '调整佣金',
          '本月冲正',
          '实际佣金',
        ]
        const filterVal = [
          'aid',
          'reportDate',
          'totalBetAmt',
          'totalProfitAmt',
          'bonusAmt',
          'directMemberAmt',
          'directAgentAmt',
          'lotteryRebate',
          'supportAmt',
          'giftAmt',
          'modifyAmt',
          'reversalAmt',
          'totalAmt',
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '代理资金统计',
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