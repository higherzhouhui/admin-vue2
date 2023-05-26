<template>
  <div class="app-container">
    <div v-if="$route.query.agentAcccount" class="titles">
      <span class="title">
        <span>{{ $route.query.agentAcccount }}</span>
        的直属会员
      </span>
      <span>
        <el-button size="small" type="primary" @click="backToMyAgent">所有会员</el-button>
        <el-button size="small" type="info" @click="backToLastPage">
          返回上一页
        </el-button>
      </span>
    </div>
    <div class="flex-top-center">
      <div>
        <DatePicker v-model="listQuery.pickerValue" :date-type="1" @change="handleSearchFilter">
          <el-form-item>
            <el-select
              v-model="listQuery.timeType"
              style="width: 100px"
              size="small"
              placeholder="请选择查询时间"
              @change="handleSearchFilter"
            >
              <el-option v-for="item in timeTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </DatePicker>
        <el-form :inline="true">
          <!-- <el-form-item>
            <span class="search_info">注册时间</span>
            <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="daterange" range-separator="~"
              start-placeholder="开始日期" end-placeholder="结束日期" align="right" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              @change="handleSearchFilter" />
          </el-form-item> -->
          <el-form-item v-if="!this.$route.query.agentId">
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
            <!-- <el-tag type="info">会员账号:</el-tag> -->
            <el-input
              v-model="listQuery.uid"
              size="small"
              class="input-with-select"
              placeholder="请输入会员账号"
              clearable
              maxlength="16"
              @keyup.enter.native="handleSearchFilter"
              @clear="handleSearchFilter"
            />
          </el-form-item>

          <el-form-item>
            <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
            <!-- 重置 -->
            <el-button size="small" icon="el-icon-refresh" @click="resets">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 导出 -->
      <el-button size="small" :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">
        导出Excel
      </el-button>
    </div>

    <el-table v-cloading="listLoading" :data="list" size="mini" highlight-current-row>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="agentIdX" label="代理ID" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.agentId }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="uid"
        label="会员账号"
        width="110"

      >
        <template slot-scope="{ row }">
          <div class="link" @click="routerToDetail(row.uid)">{{ row.uid }}</div>
        </template>
      </el-table-column> -->
      <el-table-column prop="uid" label="会员ID" width="125">
        <template slot-scope="{ row }">
          <div class="link" @click="routerToDetail(row.uid)"><user-drawer :uid="row.uid" /></div>
        </template>
      </el-table-column>
      <el-table-column prop="firstDepositAmt" label="首存金额" width="110" sortable />
      <el-table-column :key="Math.random()" prop="lastDepositAmt" label="最后存款金额" width="120" sortable />
      <el-table-column prop="totalDepositAmt" label="总存款金额" sortable min-width="115" />
      <el-table-column label=" 总提款金额">
        <el-table-column prop="verifyingAmt" label="审批中" sortable min-width="115">
          <template slot-scope="{ row }">
            {{ row.auditWithdrawAmt }}
          </template>
        </el-table-column>
        <el-table-column prop="finishedAmt" label=" 已提款" sortable min-width="115">
          <template slot-scope="{ row }">
            {{ row.totalWithdrawAmt }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column prop="totalGiftAmt" label=" 总打赏金额" sortable min-width="115" />
      <el-table-column prop="totalBetAmt" label=" 总投注金额" sortable min-width="115" />
      <el-table-column prop="netProfitAmt" label=" 净盈利" sortable min-width="95">
        <template slot-scope="{ row }">
          <div :class="`${row.netProfitAmt > 0 ? 'red' : 'green'}`">
            {{ row.netProfitAmt }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="activityBonusDepositAmt" label=" 红利金额" sortable min-width="115" />
      <el-table-column prop="availableBalance" label=" 账户余额" sortable min-width="115" />
      <el-table-column prop="lastLoginTime" label="上次登陆时间" width="140">
        <template slot-scope="{ row }">
          {{ handleTimeZoneShow(row.lastLoginTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间" width="140">
        <template slot-scope="{ row }">
          {{ handleTimeZoneShow(row.createTime) }}
        </template>
      </el-table-column>
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
  getNumberList,
  memberListExport
} from '@/api/agentManagement/agentManagement'
import UserDrawer from '@/components/UserDrawer'
import { formatUnixTime, getNowFormatDay } from '@/utils/tools'
// const NOW_TIME_START = getNowFormatDay('-')

export default {
  name: 'AgentManagementMemberList',
  components: {
    UserDrawer
  },
  data() {
    return {
      list: [],
      todayList: [],
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        pickerValue: [],
        uid: '',
        timeType: 1
      },
      timeTypeOptions: [{
        label: '注册时间',
        value: 1
      },
      {
        label: '登录时间',
        value: 2
      }],
      listQueryData() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 20,
          total: 0,
          pickerValue: [this.getMonth, this.getMonth],
          timeType: 1
        }
      },
      downloadLoading: false
    }
  },
  computed: {
    getMonth() {
      const noTime = this.$store.getters.timerDate[0]
      return getNowFormatDay('-', true, noTime)
    }
  },
  created() {
    this.listQuery.pickerValue = [this.getMonth, this.getMonth]
    this.fetchData()
  },
  methods: {
    handleTimeZoneShow(time) {
      return formatUnixTime(time)
    },
    // 获取列表数据
    fetchData() {
      let agentId = this.listQuery.agentId
      if (this.$route.query.agentId) {
        agentId = String(this.$route.query.agentId).split(',').pop() * 1
        if (isNaN(agentId)) {
          agentId = undefined
        }
      }
      this.listLoading = true
      getNumberList({
        ...this.listQuery,
        startDate:
          this.listQuery.pickerValue !== null
            ? this.$moment(this.listQuery.pickerValue[0]).format('yyyy-MM-DD')
            : null,
        endDate:
          this.listQuery.pickerValue !== null
            ? this.$moment(this.listQuery.pickerValue[1]).format('yyyy-MM-DD')
            : null,
        agentId
      }).then((item) => {
        this.list = item.rows || []
        this.listQuery.total = item.total
        this.listLoading = false
        this.todayListLoading = false
      })
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
    backToMyAgent() {
      this.$router.push({
        path: '/agentManagement/agentManagement/memberList'
      })
    },
    backToLastPage() {
      const idsArray = String(this.$route.query.agentId).split(',')
      const namesArray = String(this.$route.query.agentAcccount).split('->')
      idsArray.pop()
      namesArray.pop()
      const ids = idsArray.join(',')
      const names = namesArray.join('->')
      if (ids) {
        this.$router.push({
          path: '/agentManagement/agentManagement/list',
          query: { agentId: ids, agentAcccount: names }
        })
      } else {
        this.$router.push({
          path: '/agentManagement/agentManagement/list'
        })
      }
    },
    routerToDetail(uid) {
      if (this.$route.query.agentId) {
        this.$router.push({
          path: '/agentManagement/agentManagement/memberDetail',
          query: {
            agentId: this.$route.query.agentId,
            agentAcccount: this.$route.query.agentAcccount,
            detailId: uid
          }
        })
      } else {
        this.$router.push({
          path: '/agentManagement/agentManagement/memberDetail',
          query: { detailId: uid }
        })
      }
    },
    // 导出
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      let agentId = this.listQuery.agentId
      if (this.$route.query.agentId) {
        agentId = String(this.$route.query.agentId).split(',').pop() * 1
        if (isNaN(agentId)) {
          agentId = undefined
        }
      }
      this.downloadLoading = true
      memberListExport({
        ...this.listQuery,
        startDate:
          this.listQuery.pickerValue !== null
            ? this.$moment(this.listQuery.pickerValue[0]).format('yyyy-MM-DD')
            : null,
        endDate:
          this.listQuery.pickerValue !== null
            ? this.$moment(this.listQuery.pickerValue[1]).format('yyyy-MM-DD')
            : null,
        agentId
      }) // 导出的接口
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
          link.download = '会员列表报表'
          document.body.appendChild(link)
          // 模拟点击事件
          link.click() // 设置点击事件
        })
        .catch((err) => {
          this.downloadLoading = false
          console.log(err)
        })
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
  font-weight: bold;
}

.green {
  color: #3be13b;
  font-weight: bold;
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

  .myAgent {
    min-width: fit-content;
    padding: 5px 10px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 15px;
  }
}

.link {
  color: blue;
  text-decoration: underline;
  padding: 3px 5px;
  cursor: pointer;
}
</style>
