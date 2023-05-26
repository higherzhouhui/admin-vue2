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
      <el-table-column prop="reportDate" min-width="120" label="日期" />
      <el-table-column prop="ae" min-width="120" label="AE" />
      <el-table-column prop="ag" min-width="120" label="AG" />
      <el-table-column prop="bg" min-width="120" label="BG" />
      <el-table-column prop="bti" min-width="120" label="BTI" />
      <el-table-column prop="cf" min-width="120" label="CF" />
      <el-table-column prop="cp" min-width="120" label="CP" />
      <el-table-column prop="ky" min-width="120" label="KY" />
      <el-table-column prop="pp" min-width="120" label="PP" />
      <el-table-column prop="rsg" min-width="120" label="RSG" />
      <el-table-column prop="sb" min-width="120" label="SHABA" />
      <el-table-column prop="sc" min-width="120" label="SC" />
      <el-table-column prop="ww" min-width="120" label="WinWin" />
      <el-table-column prop="xg" min-width="120" label="XG" />
      <el-table-column prop="fb" min-width="120" label="FB" />
      <el-table-column prop="profit" min-width="120" label="游戏盈利">
        <template slot-scope="scope">
          <div :class="{ redMoney: scope.row.profit < 0 }">
            {{ scope.row.profit }}
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
import { gameProfit, gameProfitTotal } from '@/api/chreport/gameProfit'
import mixin from '../mixin'
import { getDateTime } from '@/utils/tools'
const { NOW_TIME_START, NOW_TIME_END } = getDateTime()
export default {
  name: 'ChReportGameProfitIndex',
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
        if (tds.length > 16) {
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
          this.totalList.ae || 0,
          this.totalList.ag || 0,
          this.totalList.bg || 0,
          this.totalList.bti || 0,
          this.totalList.cf || 0,
          this.totalList.cp || 0,
          this.totalList.ky || 0,
          this.totalList.pp || 0,
          this.totalList.rsg || 0,
          this.totalList.sb || 0,
          this.totalList.sc || 0,
          this.totalList.ww || 0,
          this.totalList.xg || 0,
          this.totalList.fb || 0,
          this.totalList.profit || 0,
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
        tr.querySelectorAll('td')[15].querySelector('div').innerHTML =
          this.allPageTotal[16]
        if (this.allPageTotal[16] < 0) {
          tr.querySelectorAll('td')[15].querySelector('div').classList.add('redMoney')
        }
        tabel[0].append(tr)
      })
    },
  },
  methods: {
    // 获取列表数据
    async fetchData() {
      const params = this.initDataParams()
      // 请求服务器
      try {
        const res = await gameProfit(params)
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
        const res = await gameProfitTotal(params)
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
          'AE',
          'AG',
          'BG',
          'BTI',
          'CF',
          'CP',
          'KY',
          'PP',
          'RSG',
          'SHABA',
          'SC',
          'WinWin',
          'XG',
          'FB',
          '游戏盈利',
        ]
        const filterVal = [
          'aid',
          'reportDate',
          'ae',
          'ag',
          'bg',
          'bti',
          'cf',
          'cp',
          'ky',
          'pp',
          'rsg',
          'sb',
          'sc',
          'ww',
          'xg',
          'fb',
          'profit',
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '游戏盈利报表',
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