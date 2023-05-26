<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
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
          format="yyyy-MM-dd HH:mm"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          style="width: 150px"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.status"
          style="width: 120px"
          size="small"
          placeholder="请选择状态"
          clearable
          @change="handleSearchFilter"
        >
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.lotteryName"
          size="small"
          placeholder="请输入彩票名称"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.expect"
          style="width: 150px"
          size="small"
          placeholder="请输入彩票期号"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.trn"
          size="small"
          placeholder="请输入交易编号"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.trnAward"
          size="small"
          placeholder="请输入派彩交易编号"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.flagTest" clearable placeholder="请选择是否统计" size="small" @change="handleSearchFilter">
          <el-option
            v-for="item in [{label: '统计', value: 0}, {label: '不统计', value: 1}]"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inlie="true">
      <el-form-item>
        <span size="small" plain type="primary" :loading="todayListLoading">
          总投注金币:{{ todayList && todayList[0].totalCoin.toLocaleString() }}
        </span>
        <span style="margin-left: 20px;" size="small" plain type="primary" :loading="todayListLoading">
          总派彩额:{{ todayList && todayList[0].totalProfitCoin.toLocaleString() }}
        </span>
      </el-form-item>
    </el-form>
    <!--   <el-button style="margin: 10px" type="primary" @click="changeStart()">开启彩票弹窗</el-button>
    <el-button style="margin: 10px" type="primary" @click="changeStop()">关闭彩票弹窗</el-button>

    <el-button style="margin: 10px" type="primary" @click="buttonStart()">开启彩票按钮</el-button>
    <el-button style="margin: 10px" type="primary" @click="buttonStop()">关闭彩票按钮</el-button>
 -->
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <!--  <el-table-column prop="id" label="ID" min-width="60"  ></el-table-column> -->
      <el-table-column label="用户ID" min-width="120">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>

      <el-table-column prop="betAmount" label="投注金币" min-width="100" sortable />
      <el-table-column prop="times" label="投注倍数" min-width="100" sortable />
      <el-table-column prop="lotteryName" label="彩票名称" min-width="100" />
      <el-table-column prop="expect" label="期号" min-width="105" />
      <el-table-column prop="playNum" label="投注详情" min-width="200" />
      <!-- <el-table-column prop="result" label="开奖号码" min-width="200"  ></el-table-column> -->
      <el-table-column label="开奖号码" width="150px">
        <template slot-scope="{ row }">
          <el-popover placement="top" width="150" trigger="click">
            <p>{{ lotteryCode }}</p>
            <span
              slot="reference"
              class="operation_btn"
              size="small"
              type="success"
              style="width: 100px"
              @click="lotteryResultCode(row.lotteryName, row.expect)"
            >
              查看开奖号码</span>
          </el-popover>
        </template>
      </el-table-column>
      <!--   <el-table-column prop="profitAmount" label="应派彩金额" width="80"  ></el-table-column> -->
      <el-table-column prop="realProfitAmount" label="派彩金额" width="100" sortable />

      <el-table-column label="投注状态" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.betStatus | statusFilter">{{
            row.statusString
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="中奖状态" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.awardStatus | statusFilter">{{
            row.awardStatusString
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="派奖方式" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.payMethd | statusFilter">{{
            row.payMethdString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否统计" width="100">
        <template slot-scope="{ row }">
          <!-- 是否统计 0 统计 1不统计 -->
          {{ row.flagTest ? '不统计' : '统计' }}
        </template>
      </el-table-column>
      <el-table-column prop="trn" label="交易编号" min-width="150" />
      <el-table-column prop="trnAward" label="派奖-交易编号" min-width="140" />
      <el-table-column prop="createTimeString" label="创建时间" width="135" />
      <el-table-column prop="updateTimeString" label="更新时间" width="135" />
    </el-table>

    <el-table v-if="todayList && todayList.length > 1" v-cloading="todayListLoading" :data="todayList" size="mini">
      <el-table-column type="" label="" width="60" />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column prop="totalCoin" label="总投注金币" min-width="60" />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column prop="" label="" min-width="100" />
      <el-table-column label="" width="80" />
      <el-table-column prop="" label="" width="160" />
      <el-table-column prop="" label="" width="160" />
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- <el-popover
    ref="popover4"
    placement="right"
    width="400"
    trigger="click">
    <el-table :data="gridData">
      <el-table-column width="150" property="date" label="日期"></el-table-column>
      <el-table-column width="100" property="name" label="姓名"></el-table-column>
      <el-table-column width="300" property="address" label="地址"></el-table-column>
    </el-table>
  </el-popover> -->
  </div>
</template>

<script>
import {
  getRecordList,
  getTotalList,
  startCp,
  stopCp,
  startCpButton,
  stopCpButton,
  getLotteryCode
} from '@/api/game/cp/txsscrecord'
import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
// const { NOW_TIME_START, NOW_TIME_END } = getDateTime()
export default {
  name: 'LotteryRecordController',
  filters: {
    statusFilter(status) {
      const map = { 1: 'success', 2: 'danger', 3: 'info' }
      return map[status]
    }
  },
  components: {
    UserDrawer
  },
  data() {
    return {
      lotteryCode: null,
      list: null,
      todayList: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        cpName: null,
        uid: null,
        status: null,
        trn: null,
        trnAward: null,
        pickerValue: [],
        agentId: null
      },

      statusOptions: [
        { value: 1, label: '下注成功' },
        { value: 2, label: '下注失败' },
        { value: 4, label: '未中奖' },
        { value: 5, label: '已中奖' },
        { value: 6, label: '未派发' },
        { value: 7, label: '正常派发' },
        { value: 8, label: '系统补偿' }
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
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        cpName: null,
        uid: null,
        status: null,
        trn: null,
        trnAward: null,
        pickerValue: this.initTimer,
        agentId: null
      }
      this.fetchData()
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.todayListLoading = true
      getTotalList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          var totallist = []
          if (
            res.data != null &&
            res.data != undefined &&
            JSON.stringify(res.data) != '{}'
          ) {
            totallist.push(res.data)
          }
          this.todayList = totallist
          this.todayListLoading = false
          this.listLoading = false
        })
      getRecordList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      ).then((res) => {
        this.list = (res.data.list || []).map((item) => {
          var statusString = ''
          if (item.betStatus == 1) {
            statusString = '成功'
          } else if (item.betStatus == 2) {
            statusString = '失败'
          } else if (item.betStatus == 3) {
            statusString = '未知'
          }

          var awardStatusString = ''
          if (item.awardStatus == 1) {
            awardStatusString = '未中奖'
          } else if (item.awardStatus == 2) {
            awardStatusString = '已中奖'
          } else {
            awardStatusString = '未开奖'
          }

          var payMethdString = ''
          if (item.payMethd == 0) {
            payMethdString = '未派发'
          } else if (item.payMethd == 1) {
            payMethdString = '正常派发'
          } else if (item.payMethd) {
            payMethdString = '系统补偿'
          }

          this.$set(item, 'awardStatusString', awardStatusString)
          this.$set(item, 'payMethdString', payMethdString)
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

    changeStart() {
      this.$confirm('是否开启彩票弹窗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          startCp()
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '开启成功',
                type: 'success',
                duration: 1500
              })
              setTimeout((_) => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => { })
    },

    changeStop() {
      this.$confirm('是否关闭彩票弹窗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          stopCp()
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '关闭成功',
                type: 'success',
                duration: 1500
              })
              setTimeout((_) => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => { })
    },

    buttonStart() {
      this.$confirm('是否开启彩票按钮？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          startCpButton()
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '开启成功',
                type: 'success',
                duration: 1500
              })
              setTimeout((_) => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => { })
    },

    buttonStop() {
      this.$confirm('是否关闭彩票按钮？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          stopCpButton()
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '关闭成功',
                type: 'success',
                duration: 1500
              })
              setTimeout((_) => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => { })
    },
    lotteryResultCode(lotteryName, expect) {
      this.lotteryCode = null
      getLotteryCode(lotteryName, expect).then((res) => {
        if (
          res.data != null &&
          res.data != undefined &&
          JSON.stringify(res.data) != '{}'
        ) {
          //  console.log("==============");
          this.lotteryCode = res.data
        }
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
.input-with-select {
  background-color: #fff;
  width: 300px;
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
