<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter">
      <el-form-item>
        <el-select v-model="listQuery.timeType" style="width: 100px" size="small" @change="handleSearchFilter"
          placeholder="请选择查询时间">
          <el-option v-for="item in timeTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </DatePicker>
    <el-form :inline="true">

      <!-- <el-form-item>
        <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
          :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm:ss" value-format="timestamp" :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter" />
      </el-form-item> -->
      <el-form-item>
        <el-select v-model="listQuery.status" style="width: 150px" size="small" placeholder="请选择提现状态" clearable
          @change="handleSearchFilter">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.type" size="small" placeholder="请选择提现类型" clearable @change="handleSearchFilter">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" placeholder="请输入用户ID" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.orderNo" size="small" placeholder="请输入订单号" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <!--  <span style="margin-right: 10px;"></span> -->
      <el-form-item>
        <el-input v-model="listQuery.cardName" size="small" placeholder="提款人姓名" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" fixed="left" />
      <el-table-column prop="uid" label="用户ID" min-width="120" fixed="left">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="订单号" min-width="160" />
      <el-table-column prop="amount" label="金额(VND)" min-width="120" sortable />
      <el-table-column prop="merchantName" label="代理商户" min-width="100" />
      <el-table-column prop="cardNum" label="卡号" min-width="130" />
      <el-table-column prop="bankId" label="银行名称" min-width="110" />
      <el-table-column prop="cardName" label="提款人姓名" min-width="120" />
      <el-table-column prop="branch" label="支行地址" min-width="100" />
      <el-table-column label="状态" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.status | statusFilter">{{
            row.statusString || '未知'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提现类型" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.type | typeFilter">{{
            row.typeString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="用户层级" min-width="100" />
      <el-table-column prop="reson" label="原因" min-width="180" />
      <el-table-column prop="operator" label="操作人" min-width="100" />
      <el-table-column prop="createTimeString" label="创建时间" width="150" />
      <el-table-column prop="updateTimeString" label="完成时间" width="150" />
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import { getAgentPayList } from '@/api/agent/pay'
import { formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
// const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: 'AgentPayController',
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
  components: {
    UserDrawer
  },
  data() {
    return {
      list: [],
      listLoading: true,
      timeTypeOptions: [{
        label: '创建时间',
        value: 1
      },
      {
        label: '完成时间',
        value: 2
      }
      ],
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        orderNo: null,
        status: null,
        type: null,
        cardName: null,
        pickerValue: [],
        timeType: 1
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
      let timeType = this.listQuery.timeType
      this.listQuery = {
        page: 1,
        limit: 20,
        timeType,
        pickerValue: this.initTimer,
      }
      this.fetchData()
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getAgentPayList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var statusString = ''
            if (item.status == 1) {
              statusString = '成功'
            } else if (item.status == 2) {
              statusString = '失败'
            } else if (item.status == 3) {
              statusString = '代付中'
            }
            var typeString = ''
            if (item.type == 1) {
              typeString = '金币提现'
            } else if (item.type == 2) {
              typeString = '魅力提现'
            } else if (item.type == 3) {
              typeString = '分享提现'
            }
            this.$set(item, 'statusString', statusString)
            this.$set(item, 'typeString', typeString)
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
.vue-pagination {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0px;
  padding: 0px;
}
</style>
