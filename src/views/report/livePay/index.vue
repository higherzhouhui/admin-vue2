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
      <el-table-column prop="reportDate" label="日期" />
      <el-table-column prop="giftAmt" label="礼物打赏" />
      <el-table-column prop="roomLockAmt" label="锁房付费" />
      <el-table-column prop="lotteryAmt" label="彩票流水" />
      <el-table-column label="主播">
        <el-table-column prop="anchorGiftAmt" label="礼物提成" />
        <el-table-column prop="anchorRoomLockAmt" label="锁房付费提成" />
        <el-table-column prop="anchorLotteryAmt" label="彩票提成" />
        <el-table-column prop="anchorSalaryAmt" label="主播工资" />
        <el-table-column prop="anchorSubsidyAmt" label="日榜补贴" />
      </el-table-column>
      <el-table-column label="家族长">
        <el-table-column prop="familyGiftAmt" label="礼物提成" />
        <el-table-column prop="familyRoomLockAmt" label="锁房付费提成" />
        <el-table-column prop="familyLotteryAmt" label="彩票提成" />
        <el-table-column prop="familyAgencyAmt" label="中介费" />
      </el-table-column>
      <el-table-column prop="moneyCount" label="资金合计" />
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import { liveprofitList, liveprofitTotal } from '@/api/report/livepay'
import mixin from '../mixin'
import { getDateTime } from '@/utils/tools'
const { NOW_TIME_START, NOW_TIME_END } = getDateTime()
export default {
  name: 'ReportLivepayIndex',
  mixins: [mixin],
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
      currentTotal: [], // 当前页收益
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
        const tds = document
          .querySelector('.el-table__footer-wrapper')
          .querySelector('tr')
          .getElementsByTagName('td')
        for (const val of tds) {
          val.setAttribute('rowspan', 1)
        }
        tds[0].setAttribute('colspan', 2)
        if (tds.length > 14) {
          tds[1].remove()
        }
        this.allEl = tds
      })
    },
    // 显示所有页总数列
    setAll(item) {
      let e = item.totalList
      if (!e || e.length === 0) return
      this.$nextTick(() => {
        this.allPageTotal = [
          '所有页合计',
          '',
          this.totalList.giftAmt || '0',
          this.totalList.roomLockAmt || '0',
          this.totalList.lotteryAmt || '0',
          this.totalList.anchorGiftAmt || '0',
          this.totalList.anchorRoomLockAmt || '0',
          this.totalList.anchorLotteryAmt || '0',
          this.totalList.anchorSalaryAmt || '0',
          this.totalList.anchorSubsidyAmt || '0',
          this.totalList.familyGiftAmt || '0',
          this.totalList.familyRoomLockAmt || '0',
          this.totalList.familyLotteryAmt || '0',
          this.totalList.familyAgencyAmt || '0',
          this.moneyCount(this.totalList),
        ]
        const tabel = document
          .getElementsByClassName('el-table__footer-wrapper')[0]
          .getElementsByClassName('has-gutter')
        tabel[0].querySelectorAll('tr').forEach((val, index) => {
          index > 0 && val.remove()
        })
        const tr = tabel[0].querySelector('tr').cloneNode(true)
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
        tabel[0].append(tr)
      })
    },
  },
  created() {
    // this.fetchData()
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.fetchData()
    })
  },
  methods: {
    // 计算资金合计
    moneyCount(row) {
      return (
        Math.floor(
          (row.anchorGiftAmt +
            row.anchorRoomLockAmt +
            row.anchorLotteryAmt +
            row.anchorSalaryAmt +
            row.anchorSubsidyAmt +
            row.familyGiftAmt +
            row.familyRoomLockAmt +
            row.familyLotteryAmt +
            row.familyAgencyAmt) *
          100
        ) / 100
      )
    },
    // 获取列表数据
    async fetchData() {
      const params = this.initDataParams()
      // 请求服务器
      try {
        const res = await liveprofitList(params)
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
        const res = await liveprofitTotal(params)
        this.totalList = res.data
      } catch (error) {
        this.totalList = {}
      }
    },
    // 当前页合计
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
          '礼物打赏',
          '锁房付费',
          '彩票流水',
          '主播',
          '主播',
          '主播',
          '主播',
          '主播',
          '家族长',
          '家族长',
          '家族长',
          '家族长',
          '资金合计',
        ]
        const tHeader2 = [
          '序号',
          '日期',
          '礼物打赏',
          '锁房付费',
          '彩票流水',
          '礼物提成',
          '锁房付费提成',
          '彩票提成',
          '主播工资',
          '日榜补贴',
          '礼物提成',
          '锁房付费提成',
          '彩票提成',
          '中介费',
          '资金合计',
        ]
        const filterVal = [
          'aid',
          'reportDate',
          'giftAmt',
          'roomLockAmt',
          'lotteryAmt',
          'anchorGiftAmt',
          'anchorRoomLockAmt',
          'anchorLotteryAmt',
          'anchorSalaryAmt',
          'anchorSubsidyAmt',
          'familyGiftAmt',
          'familyRoomLockAmt',
          'familyLotteryAmt',
          'familyAgencyAmt',
          'moneyCount',
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          headerArr: [tHeader1, tHeader2],
          data,
          filename: '直播支出统计',
          merges: [
            'A1:A2',
            'B1:B2',
            'C1:C2',
            'D1:D2',
            'E1:E2',
            'F1:J1',
            'K1:N1',
            `A${list.length + 3}:B${list.length + 3}`,
            `A${list.length + 4}:B${list.length + 4}`,
          ],
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      const result = jsonData.map((v, key) =>
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
