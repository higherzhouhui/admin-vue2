<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
        <el-select
          v-model="listQuery.openMethod"
          size="small"
          placeholder="请选择开奖方式"
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in openMethodsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item> -->
        <!-- <el-tag type="primary">日期:</el-tag> -->
        <!-- <el-date-picker
          v-model="listQuery.pickerValue"
          size="small"
          clearable
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd HH:mm"
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <!-- <el-form-item>
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
          @click="reset"
        >重置</el-button>
      </el-form-item> -->
    </el-form>

    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
     >
      <el-table-column
        prop="showName"
        label="彩种"
        min-width="120"
         
        sortable
      />
      <el-table-column
        prop="betNum"
        label="投注人数"
        min-width="120"
         
        sortable
      />
      <el-table-column
        prop="betAmount"
        label="投注额"
        min-width="130"
         
        sortable
      />
      <el-table-column
        prop="profitAmount"
        label="派彩额"
        min-width="160"
         
        sortable
      />
      <el-table-column
        prop="profitAndLossAmountOperate"
        label="盈亏额（人工）"
        min-width="150"
         
        sortable
      />
      <el-table-column
        prop="profitAndLossRateOperate "
        label="盈亏率（人工）"
        min-width="160"
         
        sortable
      >
        <template slot-scope="{ row }">
          <span>{{ `${row.profitAndLossRateOperate}%` }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="profitAndLossAmountSystem"
        label="盈亏额（系统）"
        min-width="150"
         
        sortable
      />
      <el-table-column
        prop="profitAndLossRateSystem "
        label="盈亏率（系统）"
        min-width="160"
         
        sortable
      >
        <template slot-scope="{ row }">
          <span>{{ `${row.profitAndLossRateSystem}%` }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->
  </div>
</template>

<script>
import { queryLotteryList } from '@/api/game/cp/total'
import { getDateTime } from '@/utils/tools'

// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()
export default {
  name: 'CpWinRecordController',
  filters: {
    typeFilter(type) {
      const map = { 0: 'info', 1: 'success', 2: 'danger' }
      return map[type]
    },
    statusFilter(status) {
      const map = { 0: 'info', 2: 'success', 3: 'danger' }
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
        pickerValue: [],
        lotteryName: ''
      },
      openMethodsOptions: [
        { value: 1, label: '系统开奖' },
        { value: 3, label: '人工开奖' }
      ],
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
  computed: {
    initTimer() {
      return this.$store.getters.timerDate
    }
  },
  created() {
    this.listQuery.pickerValue = this.initTimer
    this.fetchData()
  },
  methods: {
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      let startTime = ''
      let endTime = ''
      if (this.listQuery.pickerValue && this.listQuery.pickerValue.length) {
        startTime = this.listQuery.pickerValue[0]
        endTime = this.listQuery.pickerValue[1]
      }
      queryLotteryList({...this.listQuery, startTime, endTime })
        .then((res) => {
          var totallist = []
          this.list = res.data || []
          this.listLoading = false
          this.listQuery.total = totallist.length
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        pickerValue: this.initTimer
      }
      this.fetchData()
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
