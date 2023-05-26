<template>
  <div class="app-container">
    <div class="flex-top-center">
      <el-form :inline="true">
        <el-form-item>
          <!-- <el-tag type="info">查询时间:</el-tag> -->
          <el-date-picker
            v-model="listQuery.month"
            clearable
            size="small"
            type="month"
            placeholder="选择月"
            value-format="yyyy-MM"
            @change="handleSearchFilter"
          />
        </el-form-item>
        <el-form-item>
          <!-- <el-tag type="info">代理ID:</el-tag> -->
          <el-input
            v-model="listQuery.agentId"
            size="small"
            class="input-with-select"
            placeholder="请输入代理ID"
            clearable
            maxlength="16"
            @keyup.enter.native="handleSearchFilter"
            @clear="handleSearchFilter"
          />
        </el-form-item>
        <el-form-item>
          <!-- <el-tag type="info">代理账号:</el-tag> -->
          <el-input
            v-model="listQuery.agentAccount"
            size="small"
            class="input-with-select"
            placeholder="请输入团队代理账号"
            clearable
            maxlength="16"
            @keyup.enter.native="handleSearchFilter"
            @clear="handleSearchFilter"
          />
        </el-form-item>
        <!-- <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        <el-form-item>
          <el-button
            size="small"
            icon="el-icon-search"
            type="primary"
            @click="handleSearchFilter"
          >搜索</el-button>
          <!-- 重置 -->
          <el-button size="small" icon="el-icon-refresh" @click="resets" >
          重置
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 导出 -->
      <el-button
        size="small"
        :loading="downloadLoading"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >
        导出Excel
      </el-button>

    </div>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
      :cell-style="cellStyle"
      fit
      highlight-current-row
       sum-text="当前页汇总"
      show-summary
    >
      <!-- <el-table-column type="index" label="序号" width="60"   /> -->
      <el-table-column
        prop="month"
        label="日期"
        min-width="100"
         
      />
      <el-table-column
        prop="agentIdX"
        label="代理ID"
        min-width="120"
         
      >
        <template slot-scope="{ row }">
          <span>{{ row.agentId }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="agentAccount" label="团队账号"   />
      <!-- <el-table-column prop="outerNo" label="第三方订单号" min-width="80"  ></el-table-column> -->
      <el-table-column
        prop="totalProfit"
        label="本月游戏输赢"
        sortable
        min-width="140"
         
      >
        <template slot-scope="{ row }">
          <div
            :class="
              Number(row.totalProfit) > 0
                ? 'color2'
                : Number(row.totalProfit) < 0
                  ? 'color1'
                  : ''
            "
          >
            {{ row.totalProfit }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="bonusAmt"
        label="本月优惠红利"
        min-width="140"
        sortable
         
      />
      <el-table-column
        prop="platformAmt"
        label="本月平台费"
        min-width="120"
        sortable
         
      />

      <el-table-column
        prop="netProfitAmt"
        label="本月净盈利"
        min-width="120"
        sortable
         
      />
      <el-table-column
        prop="newValidPerson"
        label="本月新增有效会员数"
        sortable
        width="160"
         
      />
      <el-table-column
        prop="commissionRatioX"
        label="佣金比例"
        min-width="100"
        sortable
         
      >
        <template slot-scope="{ row }">
          {{ row.commissionRatio + "%" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="giftAmt"
        label="打赏抽成"
        width="100"
        sortable
         
      />
      <el-table-column
        :key="Math.random()"
        prop="modifyAmt"
        label="调整佣金"
        sortable
        width="100"
         
      />
      <!-- <el-table-column
        prop="totalAmt"
        label="实际佣金"
        width="100"
         
        :key="Math.random()"
      /> -->
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import {
  teamCommissionStatis,
  teamCommissionStatisExport
} from '@/api/agentManagement/tabledetail'
import { getNowFormatDay } from '@/utils/tools'
// const NOW_MONTH = getNowFormatDay('-', false)
export default {
  name: 'AgentManagementTeamSettlement',
  data() {
    return {
      list: [],
      todayList: null,
      downloadLoading: false,
      listLoading: true,
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

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.todayListLoading = true
      teamCommissionStatis(this.listQuery)
        .then((res) => {
          this.todayListLoading = false
          this.listLoading = false
          if (res.code === 200) {
            this.list = res.rows
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
    // 重置刷新
    resets() {
      this.listQueryData()
      this.fetchData()
    },
    // 合计
    // getSummaries(param) {
    //   const { columns, data } = param
    //   const sums = []
    //   columns.forEach((column, index) => {
    //     if (index === 1) {
    //       sums[index] = '当前页汇总'
    //       return
    //     }
    //     if (index === 2 || index === 8) {
    //       sums[index] = '--'
    //       return
    //     }
    //     const values = data.map((item) => Number(item[column.property]))
    //     if (!values.every((value) => isNaN(value))) {
    //       sums[index] = values.reduce((prev, curr) => {
    //         const value = Number(curr)
    //         if (!isNaN(value)) {
    //           return prev + curr
    //         } else {
    //           return prev
    //         }
    //       }, 0)
    //       sums[index] += ''
    //     } else {
    //       sums[index] = ''
    //     }
    //   })

    //   return sums
    // },

    // 过滤
    handleSearchFilter() {
      this.listQuery.pageNum = 1
      this.fetchData()
    },
    // 导出
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      this.downloadLoading = true
      teamCommissionStatisExport(this.listQuery) // 导出的接口
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
          link.download = '团队佣金统计报表'
          document.body.appendChild(link)
          // 模拟点击事件
          link.click() // 设置点击事件
        })
        .catch((err) => {
          this.downloadLoading = false
          console.log(err)
        })
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
  width: auto;
  /* .el-input-group__prepend {
        background-color: #fff;
      } */
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
.color1 {
  color: #008000;
}
.color2 {
  color: red;
}
/* ::v-deep .el-table th.gutter {
  display: table-cell !important;
} */
</style>
