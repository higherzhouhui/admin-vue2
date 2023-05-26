<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
        <span class="search_info">创建时间</span>
        <el-date-picker
          v-model="listQuery.pickerValue"
          size="small"
          clearable
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          placeholder="请输入获取收益用户ID"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.childUid"
          size="small"
          placeholder="请输入被邀请用户ID"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-form-item>
          <el-select
            v-model="listQuery.status"
            style="width: 150px"
            size="small"
            placeholder="请选择提现状态"
            clearable
            @change="handleSearchFilter"
          >
            <el-option
              label="全部"
              value=""
            />
            <el-option
              label="待发放"
              value="2"
            />
            <el-option
              label="已发放"
              value="1"
            />
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchFilter"
        >搜索</el-button>
        <el-button
          size="small"
          icon="el-icon-refresh"
          @click="reset"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
      show-summary
      :summary-method="summaryCurrentPage"
    >
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column
        prop="incomeDay"
        label="日期"
        min-width="100"
         
      />
      <el-table-column
        prop="uid"
        label="获取收益人ID"
        min-width="120"
         
      >
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="nickname"
        label="获取收益人昵称"
        min-width="130"
         
      /> -->
      <el-table-column
        prop="lotteryBetCoin"
        label="彩票流水"
        min-width="100"
        sortable
         
      />
      <el-table-column
        prop="lotteryIncome"
        label="彩票返水"
        min-width="100"
        sortable
         
      />
      <el-table-column
        prop="giftCoin"
        label="打赏总额"
        min-width="110"
        sortable
         
      />
      <el-table-column
        prop="giftIncome"
        label="打赏提成"
        min-width="100"
        sortable
         
      />
      <el-table-column
        prop="childUid"
        label="被邀请人ID"
        min-width="120"
         
      >
        <template slot-scope="{ row }">
          <user-drawer :uid="row.childUid" />
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="nickname"
        label="被邀请人昵称"
        min-width="120"
         
      /> -->
      <el-table-column label="状态" width="100"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.status | statusFilter">{{
            row.statusString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="160"
         
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
import { getShareList } from '@/api/promotion/share_detail'
import { formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: 'ShareDetails',
  components: {
    UserDrawer
  },
  filters: {
    statusFilter(status) {
      const map = { 0: 'info', 1: 'success', 2: 'danger' }
      return map[status]
    },
    typeFilter(type) {
      const map = { 0: 'info', 1: 'success', 2: 'danger' }
      return map[type]
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        uid: null,
        orderNo: null,
        status: '',
        type: null,
        cardName: null,
        pickerValue: []
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
      },

      // 状态选择
      statusOptions: [
        { label: '成功', value: 1 },
        { label: '失败', value: 2 },
        { label: '处理中', value: 3 }
      ],
      typeOptions: [
        { label: '金币提现', value: 1 },
        { label: '魅力提现', value: 2 },
        { label: '分享提现', value: 3 }
      ]
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
    reset() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 20,
        pickerValue: this.initTimer
      }
      this.fetchData()
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      const newQuery = {
        ...this.listQuery,
        startTime: this.listQuery.pickerValue && this.listQuery.pickerValue.length ? this.listQuery.pickerValue[0] : '',
        endTime: this.listQuery.pickerValue && this.listQuery.pickerValue.length ? this.listQuery.pickerValue[1] : ''
      }
      getShareList(newQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var statusString = ''
            if (item.status == 1) {
              statusString = '已发放'
            } else {
              statusString = '未发放'
            }
            this.$set(item, 'statusString', statusString)
            this.$set(
              item,
              'createTimeString',
              formatUnixTime(item.createTime)
            )
            this.$set(
              item,
              'updateTimeString',
              formatUnixTime(item.updateTime)
            )
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
    summaryCurrentPage(param) {
      const { columns, data } = param
      const sums = []
      const whiteList = ['lotteryBetCoin', 'lotteryIncome', 'giftCoin', 'giftIncome']
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '当前页合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (whiteList.includes(column.property)) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return Math.round((prev + curr) * 100) / 100
            } else {
              return prev
            }
          }, 0)
          sums[index]
        }
      })
      return sums
    }
  }
}
</script>
<style scoped>
.vue-pagination {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0px;
  padding: 0px;
}
</style>
