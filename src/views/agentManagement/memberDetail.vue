<template>
  <div class="app-container">
    <div class="titles">
      <span class="title">
        <span v-if="$route.query.detailId">{{ $route.query.detailId }}</span>
        会员详情
      </span>
      <span v-if="$route.query.detailId">
        <el-button size="small" type="primary" @click="backToLastPage">
          返回上一页
        </el-button>
      </span>
    </div>
    <div class="searchTabWrapper">
      <el-form :inline="true">
        <el-form-item>
          <span type="info">查询时间:</span>
          <el-date-picker
            v-model="listQuery.month"
            clearable
            size="small"
            type="month"
            placeholder="选择时间"
            value-format="yyyy-MM"
            @change="handleSearchFilter"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            icon="el-icon-search"
            type="primary"
            @click="handleSearchFilter"
          >搜索</el-button>
          <!-- 重置 -->
          <el-button size="small" icon="el-icon-refresh" @click="resets" >重置</el-button>
        </el-form-item>
      </el-form>
      <div class="tabsList">
        <el-button
          v-for="(item, index) in tabList"
          :key="index"
          class="tab"
          size="small"
          :type="currentType === item.type ? 'primary' : 'default'"
          @click="shiftTab(item.type)"
        >
          {{ item.label }}
        </el-button>
      </div>
    </div>
    <el-table
      v-if="currentType === tabList[0].type"
      v-cloading="listLoading"
      :data="list"
      size="mini"
      border
      fit
      show-summary
      sum-text="当前页合计"
      highlight-current-row
     >
      <!-- 游戏 -->
      <el-table-column
        prop="gameName"
        label="游戏名称"
        min-width="120"
         
      />
      <el-table-column
        prop="betAmt"
        label="投注金额"
        min-width="120"
         
      />
      <el-table-column
        :key="Math.random()"
        prop="payoutAmt"
        label="派彩金额"
         
      />
      <el-table-column
        :key="Math.random()"
        prop="validBetAmt"
        label="有效投注金额"
        min-width="100"
         
      />
      <el-table-column
        :key="Math.random()"
        prop="winLoseAmt"
        label=" 输赢金额"
        min-width="100"
         
      >
        <template slot-scope="{ row }">
          <div :class="`${row.winLoseAmt > 0 ? 'red' : 'green'}`">{{ row.winLoseAmt }}</div>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="currentType === tabList[1].type"
      v-cloading="listLoading"
      :data="list"
      size="mini"
      border
      fit
      show-summary
      sum-text="当前页合计"
      highlight-current-row
     >
      <!-- 存款明细 -->
      <el-table-column
        prop="orderNo"
        label=" 订单号"
        min-width="100"
         
      />
      <el-table-column
        prop="uid"
        label=" 会员账号"
        min-width="100"
         
      >
        <template>
          {{ $route.query.detailId }}
        </template>
      </el-table-column>
      <el-table-column
        :key="Math.random()"
        prop="depositAmt"
        label=" 存款金额"
        min-width="100"
         
      />
      <el-table-column
        prop="orderTime"
        label="订单时间"
        width="140"
         
      />
    </el-table>
    <el-table
      v-if="currentType === tabList[2].type"
      v-cloading="listLoading"
      :data="list"
      size="mini"
      border
      fit
      show-summary
      sum-text="当前页合计"
      highlight-current-row
     >
      <!-- 提款明细 -->
      <el-table-column
        :key="Math.random()"
        prop="orderNo"
        label="订单号"
        min-width="140"
         
      />
      <el-table-column
        prop="uid"
        label="会员账号"
        min-width="140"
         
      >
        <template>
          <div>{{ $route.query.detailId }}</div>
        </template>
      </el-table-column>
      <el-table-column
        :key="Math.random()"
        prop="withdrawAmt"
        label="取款金额"
        min-width="140"
         
      />
      <el-table-column
        prop="orderTime"
        label="订单时间"
        min-width="140"
         
      />
      <el-table-column
        prop="stausType"
        label="状态"
        min-width="140"
         
      >
        <template slot-scope="{ row }">
          <el-tag :type="statusType[row.status || 0].class">
            {{ statusType[row.status || 0].label }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="currentType === tabList[3].type"
      v-cloading="listLoading"
      :data="list"
      size="mini"
      border
      fit
      show-summary
      sum-text="当前页合计"
      highlight-current-row
     >
      <!-- 红利明细 -->
      <el-table-column
        :key="Math.random()"
        prop="orderNo"
        label="订单号"
        min-width="140"
         
      />
      <el-table-column
        prop="uid"
        label="会员账号"
        min-width="140"
         
      >
        <template>
          <div>{{ $route.query.detailId }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="typeNameZh"
        label="红利类型"
        min-width="140"
         
      />
      <el-table-column
        prop="bonusAmt"
        label="金额"
        min-width="140"
         
      />
      <el-table-column
        prop="orderTime"
        label="订单时间"
        min-width="140"
         
      />
    </el-table>
    <el-table
      v-if="currentType === tabList[4].type"
      v-cloading="listLoading"
      :data="list"
      size="mini"
      border
      fit
      show-summary
      sum-text="当前页合计"
      highlight-current-row
     >
      <!-- 打赏明细 -->
      <el-table-column
        :key="Math.random()"
        prop="rewardTime"
        label="日期"
        min-width="140"
         
      />
      <el-table-column
        prop="giftAmt"
        label="打赏金额"
        min-width="140"
         
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
import { queryMemberGameData, queryMemberDepositData, queryMemberWithdrawData, queryMemberBonusData, queryMemberGiftData } from '@/api/agentManagement/agentManagement'
export default {
  name: 'AgentManagementMemberDetail',
  data() {
    return {
      list: [],
      todayList: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        pickerValue: null,
        uid: ''
      },
      listQueryData() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 20,
          total: 0,
          month: ''
        }
      },
      tabList: [
        { label: '游戏输赢明细', type: 'gameWin' },
        { label: '存款明细', type: 'saveDetail' },
        { label: '提款明细', type: 'useDetail' },
        { label: '红利明细', type: 'sendDetail' },
        { label: '打赏明细', type: 'giftDetail' }
      ],
      currentType: '',
      uid: '',
      statusType: [
        { label: '待审核', class: 'info', value: 0 },
        { label: '成功', class: 'success', value: 1 },
        { label: '已拒绝', class: 'danger', value: 2 },
        { label: '锁定', class: 'danger', value: 3 },
        { label: '解锁', class: 'success', value: 4 },
        { label: '代付', class: 'info', value: 5 },
        { label: '人工加代付', class: 'default', value: 6 },
        { label: '代付中', class: 'info', value: 7 }
      ]
    }
  },
  created() {
    this.currentType = this.$route.query.type || this.tabList[0].type
    this.uid = this.$route.query.detailId
    this.fetchData()
  },
  methods: {
    // 获取列表数据
    fetchData() {
      const uid = this.$route.query.detailId
      const data = {
        ...this.listQuery,
        uid
      }
      this.listLoading = true
      switch (this.currentType) {
        case this.tabList[0].type:
          queryMemberGameData(data).then(res => {
            this.listLoading = false
            this.list = res.rows || []
            this.listQuery.total = res.total
          })
          break
        case this.tabList[1].type:
          queryMemberDepositData(data).then(res => {
            this.listLoading = false
            this.list = res.rows || []
            this.listQuery.total = res.total
          })
          break
        case this.tabList[2].type:
          queryMemberWithdrawData(data).then(res => {
            this.listLoading = false
            this.list = res.rows || []
            this.listQuery.total = res.total
            // this.list.map(item => {
            //   item.withdrawAmt = Math.abs(item.withdrawAmt)
            // })
          })
          break
        case this.tabList[3].type:
          queryMemberBonusData(data).then(res => {
            this.listLoading = false
            this.list = res.rows || []
            this.listQuery.total = res.total
          })
          break
        case this.tabList[4].type:
          queryMemberGiftData(data).then(res => {
            this.listLoading = false
            this.list = res.rows || []
            this.listQuery.total = res.total
          })
          break
      }
    },
    // 重置刷新
    resets() {
      this.listQueryData()
      this.fetchData()
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
    backToLastPage() {
      if (this.$route.query.agentId) {
        this.$router.push({ path: '/agentManagement/agentManagement/memberList', query: { agentId: this.$route.query.agentId, agentAcccount: this.$route.query.agentAcccount }})
      } else {
        this.$router.push({ path: '/agentManagement/agentManagement/memberList' })
      }
    },
    shiftTab(type) {
      const query = {
        ...this.$route.query,
        type
      }
      this.$router.push({ path: '/agentManagement/agentManagement/memberDetail', query })
    }
  }
}
</script>
<style scoped lang="scss">
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
.form_item_font {
  color: red;
}
.support {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  white-space: nowrap;
}
.support_center {
  width: 100px;
  height: 42px;
}
.PlatformFee {
  border-radius: 10px;
  border: 1px solid rgb(180, 166, 166);
  padding: 10px;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  grid-template-areas: 1fr 1fr;
  white-space: nowrap;
}
.PlatformFee_div {
  display: flex;
  align-items: center;
}
.table-remark {
  max-height: 100px;
  overflow-y: auto;
}
.red {
  color: red;
}
.green {
  color: green;
}
.titles {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  padding: 6px 0 16px 0;
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .return {
    padding: 5px 10px;
    background: var(--background);
    color: #fff;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    min-width: fit-content;
  }
  .myAgent {
    min-width: fit-content;
    padding: 5px 10px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 15px;
  }
}
.searchTabWrapper {
  display: flex;
  justify-content: space-between;
}
.tabsList {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
  .tab {
    margin-left: 12px;
  }
}
</style>
