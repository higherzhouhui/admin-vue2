<template>
  <div class="app-container">
    <div style="display: flex; border-bottom: 1px solid #eee; margin-bottom: 8px;">
      <el-form :inline="true">
        <el-form-item>
          <el-tag type="info">用户ID</el-tag>
          <el-input
            v-model="listQuery.uid"
            size="small"
            class="input-with-select"
            placeholder="请输入用户ID"
            clearable
            maxlength="500"
            @keyup.enter.native="handleSearchFilter"
            @clear="handleSearchFilter"
          />
        </el-form-item>
        <el-form-item>
          <el-tag type="info">日期:</el-tag>
          <el-date-picker
            v-model="listQuery.pickerValue"
            size="small"
            clearable
            :picker-options="pickerOptions"
            type="datetimerange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="handleSearchFilter"
          />
        </el-form-item>
        <el-form-item>
          <!-- 搜索 -->
          <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter" />
          <!-- 重置 -->
          <el-button size="small" icon="el-icon-refresh" @click="resets" />
          <!-- 导出 -->
          <el-button
            size="small"
            :loading="downloadLoading"
            type="success"
            icon="el-icon-document"
            @click="handleDownload"
          >
            导出Excel
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
      :cell-style="cellStyle"
      fit
      highlight-current-row
      show-summary
      sum-text="当前页汇总："
    >
      <el-table-column
        prop="uid"
        label="用户ID"
        width="125"
         
      >
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column
        prop="typeName"
        label="游戏类型"
         
      />
      <el-table-column
        prop="typeDetail"
        label="游戏厂商"
         
      >
        <template slot-scope="{ row }">
          <div
            v-for="(items, index) in row.profitStatisDetailVOS"
            :key="index"
            class="content-column"
          >
            {{ items.typeDetail }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="profit" label="输赢" min-width="80"  >
        <template slot-scope="{ row }">
          <div
            v-for="(items, index) in row.profitStatisDetailVOS"
            :key="index"
            class="content-column"
          >
            {{ items.profit }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalProfit"
        label="输赢总和"
        min-width="100"
         
      />
      <!--     :formatter="formatterType" -->
      <!-- <el-table-column
          prop="trueRmbString"
          label="游戏名称"
          min-width="80"
           
        /> -->
      <el-table-column
        prop="betValidAmt"
        label="流水"
        min-width="80"
         
      >
        <template slot-scope="{ row }">
          <div
            v-for="items in row.profitStatisDetailVOS"
            :key="`${items.typeName}-${items.typeDetail}`"
            class="content-column"
          >
            {{ items.betValidAmt }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalBetValidAmt"
        label="流水总和"
        min-width="80"
         
      />
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
  usersProfitStatis,
  usersProfitStatisExport
} from '@/api/agentManagement/tabledetail'
import UserDrawer from '@/components/UserDrawer'

export default {
  name: 'AllUserformReport',
  components: {
    UserDrawer
  },
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
        pickerValue: []
      },
      listQueryData() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 20,
          total: 0,
          pickerValue: []
        }
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  created() {
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
      usersProfitStatis({
        ...this.listQuery,
        startDate:
          this.listQuery.pickerValue != null &&
          this.listQuery.pickerValue[0] !== undefined
            ? this.listQuery.pickerValue[0]
            : null,
        endDate:
          this.listQuery.pickerValue != null &&
          this.listQuery.pickerValue[0] !== undefined
            ? this.listQuery.pickerValue[1]
            : null
      })
        .then((res) => {
          this.listLoading = false
          this.list = res.rows || []
          this.listQuery.total = res.total || 0
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
      const data = {
        ...this.listQuery,
        startDate:
          this.listQuery.pickerValue[0] !== undefined
            ? this.listQuery.pickerValue[0]
            : null,
        endDate:
          this.listQuery.pickerValue[0] !== undefined
            ? this.listQuery.pickerValue[1]
            : null
      }
      this.downloadLoading = true
      usersProfitStatisExport(data) // 导出的接口
        .then((result) => {
          this.downloadLoading = false
          const link = document.createElement('a') // 创建a标签
          const blob = new Blob([result], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          }) // 设置文件流
          link.style.display = 'none'
          // 设置连接
          link.href = URL.createObjectURL(blob) // 将文件流转化为blob地址
          link.download = '平台总输赢报表'
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
::v-deep .el-table tr td {
  padding: 0;
}
::v-deep .el-table .cell {
  padding: 0;
}
.el-form-item {
  margin-bottom: 8px;
}
.content-column {
  line-height: 24px;
  border-top: 1px solid #eee;
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
</style>
