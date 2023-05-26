<template>
  <div class="app-container">
    <div class="flex-top-center">
      <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />

      <!-- <el-form :inline="true">
        <el-form-item>
          <el-tag type="info">日期:</el-tag>
          <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange" range-separator="~"
            start-placeholder="开始日期" end-placeholder="结束日期" align="right" format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"  @change="handleSearchFilter" />
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
      <el-table-column prop="typeName" min-width="120" label="游戏类型" />
      <el-table-column prop="betNum" min-width="120" label="投注人数" />
      <el-table-column prop="betCoin" min-width="120" label="投注金额" />
      <el-table-column prop="validBetCoin" min-width="120" label="有效投注" />
      <el-table-column prop="winLoseCoin" min-width="120" label="输赢金额">
        <template slot-scope="{ row }">
          <div :class="row.winLoseCoin > 0 ? 'greenMoney' : row.winLoseCoin < 0 ? 'redMoney' : ''">
            {{ row.winLoseCoin }}
          </div>
        </template> </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>
  
<script>
import { winLoseReport } from '@/api/chreport/winLoseReport'
import mixin from '../mixin'
import { getDateTime } from '@/utils/tools'
// const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: 'ChReportWinLoseReportIndex',
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        pickerValue: [],
      },
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
  computed: {
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
      let tds = document
        .querySelector('.el-table__footer-wrapper')
        .querySelector('tr')
        .getElementsByTagName('td')
      tds[0].setAttribute('colspan', 2)
      if (tds.length > 5) {
        tds[1].remove()
      }
      this.$nextTick(() => {
        let tabel = document
          .getElementsByClassName('el-table__footer-wrapper')[0]
          .getElementsByClassName('has-gutter')
        let Doms = tabel[0].querySelectorAll('tr')[0].querySelectorAll('td')
        Doms.forEach((value, index) => {
          if (index == Doms.length - 1) {
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
      })
    },
  },
  methods: {
    // 获取列表数据
    async fetchData() {
      let params = this.initDataParams()
      // 请求服务器
      try {
        const res = await winLoseReport(params)
        this.list = res.data || []
        this.listQuery.total = res.data.total || 0
        this.listLoading = false
      } catch (error) {
        this.list = null
        this.listQuery.total = 0
        this.listLoading = false
        this.$message.error(error)
      }
    },
    //当前页合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
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
          '游戏类型',
          '投注人数',
          '投注金额',
          '有效投注',
          '输赢金额',
        ]
        const filterVal = [
          'aid',
          'typeName',
          'betNum',
          'betCoin',
          'validBetCoin',
          'winLoseCoin',
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '游戏输赢统计',
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