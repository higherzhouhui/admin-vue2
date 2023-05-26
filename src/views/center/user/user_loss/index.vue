<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-date-picker
          v-model="listQuery.pickerValue"
          size="small"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd HH:mm"
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchFilter"
        >搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-refresh"
          @click="fetchData()"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
      @sort-change="tableSortChange"
    >
      <el-table-column type="index" label="序号" width="60"   />
      <el-table-column
        prop="uid"
        label="用户ID"
        min-width="60"
         
      />
      <el-table-column
        prop="nickname"
        label="用户昵称"
        min-width="60"
         
      />
      <!-- <el-table-column prop="loss" label="用户亏损" min-width="60"   /> -->
      <el-table-column
        sortable="custom"
        prop="bet_amount"
        label="总投注"
        min-width="60"
         
      />
      <el-table-column
        sortable="custom"
        prop="real_profit_amount"
        label="总派彩"
        min-width="60"
         
      />
      <el-table-column
        sortable="custom"
        prop="loss"
        label="用户彩票亏损(金币)"
        min-width="60"
         
      />

      <!--  <el-table-column   prop="handsel1" label="用户彩票亏损(金币)" min-width="120"  >
        <template  slot-scope="{row}">
          <span>{{ `${ row.real_profit_amount - row.bet_amount }`}}</span>
        </template>
      </el-table-column> -->

      <!-- <el-table-column prop="goldCoin" label="彩金" min-width="200"   />
      <el-table-column prop="theme" label="活动主题" min-width="80"   />
      <el-table-column label="状态" width="120"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.status | statusFilter">{{ row.statusString }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="msg" label="备注" min-width="80"   />
      <el-table-column prop="createTimeString" label="更新时间" width="150"   /> -->
      <!--  <el-table-column prop="updateTimeString" label="更新时间" width="150"   /> -->
      <!--  <el-table-column label="操作" width="160"  >
        <template slot-scope="{ row }">
          <el-button plain type="primary" size="mini" @click="switchChangeFlag(row)">更改状态</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getUserLossList } from '@/api/center/user/user_loss'
import { formatUnixTime } from '@/utils/tools'

export default {
  name: 'LotteryUserLossController',
  filters: {
    statusFilter(status) {
      const map = { 1: 'info', 0: 'success', 2: 'danger' }
      return map[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        pickerValue: []
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '昨天',
            onClick(picker) {
              const start =
                new Date(new Date().toLocaleDateString()).getTime() -
                3600 * 1000 * 24
              const end = start + (24 * 3600 - 1) * 1000
              picker.$emit('pick', [start, end])
            }
          },
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
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加过滤用户ID',
        update: '编辑过滤用户ID'
      },

      // 表单模型
      createModel: {
        id: null,
        uid: null,
        details: null
      },
      // 验证规则
      rules: {
        uid: [{ required: true, message: '请输入用户ID', trigger: 'change' }]
      }
    }
  },
  created() {
    const start =
      new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24
    const end = start + (24 * 3600 - 1) * 1000
    this.listQuery.pickerValue = [start, end]
    this.fetchData()
  },
  methods: {
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: null,
        uid: null,
        details: null
      }
    },

    // 刷新
    refreshData() {
      this.list = null
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        pickerValue: []
      }
      this.fetchData()
    },

    // 获取列表数据
    fetchData() {
      if (this.listQuery.pickerValue === null) {
        this.$message.error('请选择时间查询')
        return
      }
      this.listLoading = true
      getUserLossList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            return item
          })
          this.listLoading = false
          this.listQuery.total = res.data.total
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },

    // 显示创建弹出窗
    showCreateDialogClick() {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'update'
      this.createModel = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 过滤
    handleSearchFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.listQuery.page = 1
      this.fetchData()
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    },
    // 后端排序
    commenAreat(val) {
      if (val.order === 'ascending') {
        this.$set(this.listQuery, 'orderType', 1)
      } else if (val.order === 'descending') {
        this.$set(this.listQuery, 'orderType', 2)
      } else {
        this.$set(this.listQuery, 'orderType', null)
        this.$set(this.listQuery, 'orderField', null)
      }
    },
    tableSortChange(val) {
      this.$set(this.listQuery, 'page', 1)
      // 总投注
      if (val.prop === 'bet_amount') {
        this.$set(this.listQuery, 'orderField', 'bet_amount')
        this.commenAreat(val)
      }
      // 总派彩
      if (val.prop === 'real_profit_amount') {
        this.$set(this.listQuery, 'orderField', 'real_profit_amount')
        this.commenAreat(val)
      }
      // 用户彩票盈亏
      if (val.prop === 'loss') {
        this.$set(this.listQuery, 'orderField', 'loss')
        this.commenAreat(val)
      }
      this.fetchData()
    }
  }
}
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
  width: 360px;
  margin-right: 10px;

  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}

.vue-pagination {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0px;
  padding: 0px;
}
</style>
