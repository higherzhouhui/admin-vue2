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
          <!-- <el-tag type="info">代理ID:</el-tag> -->
          <el-input v-model="listQuery.agentId" size="small" class="input-with-select" placeholder="请输入代理ID" clearable
            maxlength="16" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
        </el-form-item>
        <el-form-item>
          <!-- <el-tag type="info">代理账号:</el-tag> -->
          <el-input v-model="listQuery.agentAccount" size="small" class="input-with-select" placeholder="请输入代理账号"
            clearable maxlength="16" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
        </el-form-item>
        <el-form-item>
          <!-- <el-tag type="info">上级账号:</el-tag> -->
          <el-input v-model="listQuery.parentAgent" size="small" class="input-with-select" placeholder="请输入上级账号" clearable
            maxlength="16" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
          <!-- 重置 -->
          <el-button size="small" icon="el-icon-refresh" @click="resets">
            刷新
          </el-button>
        </el-form-item>
      </el-form>
      <!-- 导出 -->
      <el-button size="small" :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">
        导出Excel
      </el-button>
      <!-- 选择指定时间 -->
      <!-- <div>
        <el-button
          v-for="item in selectTime"
          :key="item.name"
          :class="item.Check ? 'Check1' : 'Check2'"
          @click="Check(item)"
          size="small"
          >{{ item.name }}</el-button
        >
      </div> -->
    </div>
    <el-table v-cloading="listLoading" :data="list" size="mini" :cell-style="cellStyle" fit highlight-current-row
      sum-text="当前页汇总" show-summary>
      <!-- <el-table-column type="index" label="序号" width="60"   /> -->
      <el-table-column prop="month" label="日期" min-width="100">
        <template slot-scope="{ row }">
          <router-link :to="`/agentManagement/agentManagement/game_day?agentId=${row.agentId}&month=${row.month}`"
            class="link">
            {{ row.month }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="agentIdX" label="代理ID" min-width="120">
        <template slot-scope="{ row }">
          <span>{{ row.agentId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="agentAccount" label="代理账号" min-width="80" />

      <el-table-column prop="pagentAccountX" label="上级代理" min-width="80">
        <template slot-scope="{ row }">
          {{
            row.pagentAccount == null || row.pagentAccount == undefined
            ? "总代"
            : row.pagentAccount
          }}
        </template>
      </el-table-column>
      <el-table-column prop="agentLevelx" label="代理级别" min-width="100" :formatter="formatterType" />
      <!-- <el-table-column
        prop="trueRmbString"
        label="游戏名称"
        min-width="80"
         
      /> -->
      <el-table-column prop="totalBetPerson" label="投注人数" sortable min-width="120" />
      <el-table-column prop="totalBetAmt" label="投注金额" sortable min-width="120" />
      <el-table-column prop="totalValidPerson" label="有效会员人数" sortable min-width="120" />
      <el-table-column prop="totalBetValidAmt" label="投注有效流水" sortable min-width="120" />
      <el-table-column prop="totalProfit" label="输赢金额" sortable min-width="120">
        <template slot-scope="{ row }">
          <div :class="
            Number(row.totalProfit) > 0
              ? 'color2'
              : Number(row.totalProfit) < 0
                ? 'color1'
                : ''
          ">
            {{ row.totalProfit }}
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
import {
  gameStatisTable,
  gameStatisExport
} from '@/api/agentManagement/tabledetail'
import { getNowFormatDay } from '@/utils/tools'
// const NOW_MOUTH = getNowFormatDay('-', false)
export default {
  name: 'AgentManagementGame',
  data() {
    return {
      list: [],
      todayList: [],
      listLoading: true,
      downloadLoading: false,
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
    // 重置刷新
    resets() {
      this.listQueryData()
      this.fetchData()
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.todayListLoading = true
      gameStatisTable({
        ...this.listQuery
      })
        .then((res) => {
          this.listLoading = false
          this.list = res.rows
          this.listQuery.total = res.total
        })
        .catch((err) => {
          this.list = []
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
      gameStatisExport(this.listQuery) // 导出的接口
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
          link.download = '游戏输赢报表'
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
      console.log(this.listQuery)

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

    // 切换
    Check(data) {
      console.log('这是什么数据', data)
      this.selectTime.forEach((item) => {
        if (item.name === data.name) {
          item.Check = true
        } else {
          item.Check = false
        }
      })
    },
    formatterType(row) {
      if (row.agentLevel === 1) {
        return '总代'
      } else if (row.agentLevel === 2) {
        return '一级代理'
      } else if (row.agentLevel === 3) {
        return '二级代理'
      } else if (row.agentLevel === 4) {
        return '三级代理'
      } else if (row.agentLevel === 5) {
        return '四级代理'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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

.Check1 {
  background: linear-gradient(128deg, #eb9bff 0%, #e067ff 37%, #5e29e0 100%);
  border-radius: 5px;
  border: none;
  font-size: 14px;
  color: #fff;
}

.Check2 {
  background: #f5f7fe;
  border-radius: 5px;
  border: none;

  font-size: 14px;
  color: #333333;

  &:hover {
    background: #d3d4da;
    color: #514b4b;
  }
}

.color1 {
  color: #008000;
}

.color2 {
  color: red;
}

.link {
  color: blue;
  text-decoration: underline;
  padding: 3px 5px;
  cursor: pointer;
}
</style>
