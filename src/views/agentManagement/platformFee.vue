<template>
  <div class="app-container">
    <div class="flex-top-center">
      <el-form :inline="true">
        <el-form-item>
          <!-- <el-tag type="info">查询时间:</el-tag> -->
          <el-date-picker v-model="listQuery.month" clearable size="small" type="month" placeholder="选择月"
            value-format="yyyy-MM" @change="handleSearchFilter" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.agentId" size="small" class="input-with-select" placeholder="请输入代理ID" clearable
            maxlength="16" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.agentAccount" size="small" class="input-with-select" placeholder="请输入代理账号"
            clearable maxlength="16" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
        </el-form-item>
        <!-- <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        <el-form-item>
          <el-input v-model="listQuery.parentAgent" size="small" class="input-with-select" placeholder="请输入上级账号" clearable
            maxlength="16" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
          <!-- 重置 -->
          <el-button size="small" icon="el-icon-refresh" @click="resets">
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 导出 -->
      <el-button size="small" :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">
        导出Excel
      </el-button>
    </div>
    <el-table v-cloading="listLoading" :data="list" size="mini" :cell-style="cellStyle" fit highlight-current-row
      show-summary>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="month" label="统计日期" min-width="100" />
      <el-table-column prop="" label="代理ID" width="90">
        <template slot-scope="{ row }">
          {{ row.agentId }}
        </template>
      </el-table-column>
      <el-table-column prop="agentAccount" label="代理账号" min-width="100" />

      <!-- <el-table-column prop="outerNo" label="第三方订单号" min-width="80"  ></el-table-column> -->
      <el-table-column prop="pagentAccount" label="上级账号" min-width="100">
        <template slot-scope="{ row }">
          {{
            row.pagentAccount == null || row.pagentAccount == undefined
            ? "总代"
            : row.pagentAccount
          }}
        </template>
      </el-table-column>
      <el-table-column prop="demo1" label="输赢金额" min-width="150">
        <el-table-column v-for="(item, index) in gamesTypeList.profit" :key="index" :prop="item.prop"
          :label="item.label" />
        <el-table-column prop="totalProfit" label="合计">
          <template slot-scope="{ row }">
            <div :class="
              Number(row.totalProfit) > 0
                ? 'color1'
                : Number(row.totalProfit) < 0
                  ? 'color2'
                  : ''
            ">
              {{ row.totalProfit }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="demo2" label="平台费率" min-width="150">
        <el-table-column v-for="(item, index) in gamesTypeList.ratio" :key="index" :prop="item.prop"
          :label="item.label" />
      </el-table-column>
      <el-table-column prop="demo3" label="平台费" min-width="150">
        <el-table-column v-for="(item, index) in gamesTypeList.amt" :key="index" :prop="item.prop" :label="item.label" />
        <el-table-column prop="totalProfit" label="合计">
          <template slot-scope="{ row }">
            <div :class="
              Number(row.totalAmt) > 0
                ? 'color1'
                : Number(row.totalAmt) < 0
                  ? 'color2'
                  : ''
            ">
              {{ row.totalAmt }}
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
  gamePlatformStatisTable,
  gamePlatformStatisExport
} from '@/api/agentManagement/tabledetail'
import { getNowFormatDay } from '@/utils/tools'
// const NOW_MONTH = getNowFormatDay('-', false)
import Decimal from "decimal.js";

export default {
  name: 'AgentManagementPlatformFee',
  data() {
    return {
      list: [],
      todayList: [],
      listLoading: true,
      downloadLoading: false,
      gamesTypeList: {},
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        month: ''
      },
      listQueryData() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 20,
          total: 0,
          month: this.getMonth
        }
      }
    }
  },
  computed: {
    getMonth() {
      let noTime = this.$store.getters.timerDate[0]
      return getNowFormatDay('-', false, noTime)
    }
  },
  created() {
    this.listQuery.month = this.getMonth
    this.fetchData()
  },
  methods: {
    cellStyle(row, column, rowIndex, columnIndex) {
      // 根据报警级别显示颜色
      // console.log(row);
      // console.log(row.column);
      if (row.column.label === '商户名称') {
        return 'color:#42b983'
      }
    },
    accAdd(arg1, arg2) {
      return Decimal(arg1).add(Decimal(arg2)).toNumber();
    },
    // 重置刷新
    resets() {
      this.listQueryData()
      this.fetchData()
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.todayListLoading = true
      gamePlatformStatisTable(this.listQuery)
        .then((res) => {
          this.todayListLoading = false
          this.listLoading = false
          const data = res.rows || []
          if (res.code === 200) {
            data.forEach(item => {
              let totalProfit = 0
              let totalAmt = 0
              if (item.gamePlatformVOList.length) {
                const profit = []
                const amt = []
                const ratio = []
                item.gamePlatformVOList.forEach(cplat => {
                  item[cplat.gameTypeName + 'Profit'] = cplat.totalProfit
                  item[cplat.gameTypeName + 'Amt'] = cplat.platformAmt
                  item[cplat.gameTypeName + 'Ratio'] = cplat.platformRatio + '%'
                  totalProfit = this.accAdd(cplat.totalProfit, totalProfit)
                  totalAmt = this.accAdd(cplat.platformAmt, totalAmt)
                  if (!this.gamesTypeList.Profit) {
                    profit.push({ label: cplat.gameTypeName, prop: cplat.gameTypeName + 'Profit' })
                    amt.push({ label: cplat.gameTypeName, prop: cplat.gameTypeName + 'Amt' })
                    ratio.push({ label: cplat.gameTypeName, prop: cplat.gameTypeName + 'Ratio' })
                    this.gamesTypeList = {
                      profit,
                      amt,
                      ratio
                    }
                  }
                })
                item.totalProfit = Math.round(totalProfit * 100) / 100
                item.totalAmt = Math.round(totalAmt * 100) / 100
              }
            })
            this.list = data
            this.listQuery.total = res.total
          }
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },
    // 导出
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      this.downloadLoading = true
      gamePlatformStatisExport(this.listQuery) // 导出的接口
        .then((result) => {
          this.downloadLoading = false
          console.log(result)
          const link = document.createElement('a') // 创建a标签
          const blob = new Blob([result], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }) // 设置文件流
          link.style.display = 'none'
          // 设置连接
          link.href = URL.createObjectURL(blob) // 将文件流转化为blob地址
          link.download = '游戏平台费统计报表'
          document.body.appendChild(link)
          // 模拟点击事件
          link.click() // 设置点击事件
        })
        .catch((err) => {
          this.downloadLoading = false
          console.log(err)
        })
    },
    // 过滤
    handleSearchFilter() {
      this.listQuery.pageNum = 1
      this.fetchData()
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.listQuery.pageNum = 1
      this.fetchData()
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.fetchData()
    },

    // 佣金发放
    showUpdateDialogClick(row) {
      console.log('佣金发放', row)
    }
  }
}
</script>
<style scoped>
.input-with-select {
  background-color: #fff;

  /* .el-input-group__prepend {
              background-color: #fff;
            } */
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}

.color1 {
  color: red;
}

.color2 {
  color: #008000;
}
</style>
