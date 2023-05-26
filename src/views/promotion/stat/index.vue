<template>
  <div class="app-container">
    <div style="margin-bottom: 20px;" />

    <div style="margin: 40px 0px;">
      <el-divider content-position="left"><h2>今日统计</h2></el-divider>
    </div>

    <!-- 选择框 -->
    <div style="margin-bottom: 20px;display: flex;justify-content: space-between;">
      <!-- 级联选择器 -->
      <el-cascader
        v-model="todayListQuery.channel"
        size="small"
        :props="cascaderProps"
        :show-all-levels="false"
        placeholder="请选择"
        clearable
        @change="handleTodaySearchFilter"
      />
      <el-button size="medium" plain @click="refreshTodayClick">刷新</el-button>
      <!--   <el-button style="margin: 10px" type="primary" @click="changeStart()">昨日统计</el-button> -->
    </div>

    <el-table v-cloading="todayListLoading" :data="todayList">
      <el-table-column prop="channel" label="渠道标识" min-width="60"   />
      <el-table-column label="游戏总盈利" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.gameTotalCoin}VND` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="彩票总盈利" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.cpTotalCoin}VND` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开元游戏总盈利" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.kyTotalCoin}VND` }}</span>
        </template>
      </el-table-column>
      <!--  <el-table-column label="至尊游戏总盈利" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.zzTotalCoin}VND` }}</span>
        </template>
      </el-table-column> -->
      <!--   <el-table-column label="AG游戏总盈利" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.agTotalCoin}VND` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="富翁游戏总盈利" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.fwTotalCoin}VND` }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="activeCount" label="活跃用户数量" min-width="60"   />
      <el-table-column label="新增用户" min-width="80"  >
        <template slot-scope="{ row }">
          <span>{{ `苹果${row.addCountApple} 安卓${row.addCountAndroid} (合计：${row.addCount})` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值金额" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.payAmountAll}VND     (代充${row.agentAmountAll}VND 银行卡${row.bankAmountAll}VND)` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当日新增充值金额" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.payAmountDay}VND` }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payCountAll" label="充值人数" min-width="60"   />
      <el-table-column prop="payCountDay" label="当日新增充值人数" min-width="60"   />
      <el-table-column prop="disBindAddCount" label="过滤绑定率人数" min-width="60"   />
      <el-table-column prop="disIpAddCount" label="过滤IP人数 " min-width="60"   />
      <el-table-column prop="disUdidAddCount" label="过滤UDID人数" min-width="60"   />
    </el-table>

    <div style="margin: 40px 0px;">
      <el-divider content-position="left"><h2>历史统计</h2></el-divider>
    </div>

    <div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
      <div style="display: flex;">
        <!-- 日期选择 -->
        <el-date-picker
          v-model="historyListQuery.pickerValue"
          clearable
          size="small"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          format="yyyy-MM-dd HH:mm"
          :picker-options="pickerOptions"
          @change="handleHistorySearchFilter"
        />
        <span style="margin: 5px;" />
        <!-- 级联选择器 -->
        <el-cascader
          v-model="historyListQuery.channel"
          size="small"
          :props="cascaderProps"
          :show-all-levels="false"
          placeholder="请选择"
          clearable
          @change="handleHistorySearchFilter"
        />
      </div>
      <el-button size="medium" plain @click="refreshHistoryClick">刷新</el-button>
    </div>

    <el-table v-cloading="historyListLoading" :data="historyList">
      <el-table-column type="index" label="序号" width="60"   />
      <el-table-column prop="date" label="日期(天)" width="120"   />
      <el-table-column prop="channel" label="渠道标识" min-width="60"   />
      <!-- <el-table-column prop="clickCount" label="点击量" min-width="60"  ></el-table-column>
      <el-table-column prop="installCount" label="安装量" min-width="60"  ></el-table-column> -->
      <el-table-column prop="activeCount" label="活跃用户数量" min-width="60"   />
      <el-table-column label="新增用户" min-width="80"  >
        <template slot-scope="{ row }">
          <span>{{ `苹果${row.addCountApple} 安卓${row.addCountAndroid} (合计：${row.addCount})` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="充值金额" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.payAmountAll}VND  (代充${row.agentAmount}VND 银行卡${row.bankAmount}VND)` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当日新增充值金额" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.payAmountDay}VND` }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payCountAll" label="充值人数" min-width="60"   />
      <el-table-column prop="payCountDay" label="当日新增充值人数" min-width="60"   />
      <el-table-column prop="disBindAddCount" label="过滤绑定率人数" min-width="60"   />
      <el-table-column prop="disIpAddCount" label="过滤IP人数 " min-width="60"   />
      <el-table-column prop="disUdidAddCount" label="过滤UDID人数" min-width="60"   />
      <el-table-column label="次日留存" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.seconddayPreserve}%` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="三日留存" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.thirddayPreserve}%` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周留存" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.weekPreserve}%` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="月留存" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.monthPreserve}%` }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-cloading="totalListLoading" :data="totalList">
      <el-table-column type="" label="序号" width="60"   />
      <el-table-column prop="" label="日期" width="120"   />
      <el-table-column prop="" label="渠道标识" min-width="60"   />
      <el-table-column prop="" label="" min-width="60"   />
      <el-table-column label="总新增用户" min-width="80"  >
        <template slot-scope="{ row }">
          <span>{{ `苹果${row.totalCountApple} 安卓${row.totalCountAndroid} (合计：${row.totalAddCount})` }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalPayAmountAll" label="总充值金额" min-width="60"   />
      <el-table-column prop="totalPayAmountDay" label="当日总新增充值金额" min-width="60"   />
      <el-table-column prop="totalPayCountAll" label="总充值人数" min-width="60"   />
      <el-table-column prop="totalPayCountDay" label="当日总新增充值人数" min-width="60"   />
      <el-table-column prop="totalDisBindAddCount" label="总过滤绑定率人数" min-width="60"   />
      <el-table-column prop="totalDisIpAddCount" label="总过滤IP人数 " min-width="60"   />
      <el-table-column prop="totalDisUdidCount" label="总过滤UDID人数" min-width="60"   />
      <el-table-column label="次日留存率" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.seconddayPreserve}%` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="三日留存率" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.thirddayPreserve}%` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周留存率" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.weekPreserve}%` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="月留存率" min-width="60"  >
        <template slot-scope="{ row }">
          <span>{{ `${row.monthPreserve}%` }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="historyListQuery.page"
      :page-sizes="[10, 20, 50]"
      :page-size="historyListQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="historyListQuery.total"
      @size-change="handleHistorySizeChange"
      @current-change="handleHistoryCurrentChange"
    />
  </div>
</template>

<script>
import { getStatToday, getStatHistoryList, getTotal, testNewJob } from '@/api/promotion/stat'
import { getPromotionChannelList } from '@/api/promotion/channel_base'
import { getAllPromotionChannelUrlList } from '@/api/promotion/channel_url'
import { emptyS, nullS, formatUnixTime, sortBy } from '@/utils/tools'
import clip from '@/utils/clipboard'

export default {
  name: 'StatPromotionChannelController',
  filters: {},
  data() {
    const cascaderRawDatas = [
      { id: 1, label: '全部', value: 'all', leaf: true },
      { id: 2, label: '自然增长', value: 'natural', leaf: true },
      { id: 3, label: '用户推广', value: 'user', leaf: true },
      { id: 4, label: '渠道推广', value: 'channel', leaf: false },
      { id: 5, label: '用户过滤', value: 'userdis', leaf: true },
      { id: 6, label: '渠道过滤', value: 'channeldis', leaf: true }
    ]
    return {
      // 今日
      todayList: null,
      todayListLoading: true,
      todayListQuery: {
        channel: null
      },

      // 历史
      historyList: null,
      historyListLoading: true,
      historyListQuery: {
        page: 1,
        limit: 20,
        total: 0,
        channel: null,
        pickerValue: []
      },

      // 级联选择器
      cascaderProps: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          const { level, value, data } = node
          if (level === 0) {
            resolve(cascaderRawDatas)
          } else if (level === 1) {
            if (`${value}` === 'channel') {
              // 获取所有渠道列表
              getPromotionChannelList({})
                .then(res => {
                  var nodes = (res.data.list || []).map(item => {
                    return {
                      id: item.id,
                      value: `${item.channel}`,
                      label: `${item.channel}`,
                      leaf: false
                    }
                  })
                  // 排序
                  const sortNodes = nodes.sort(sortBy('value'))
                  resolve(sortNodes)
                })
                .catch(err => {
                  this.$message.error(err)
                  resolve([])
                })
            } else {
              resolve([])
            }
          } else if (level === 2) {
            // 或者指定渠道所有链接列表
            getAllPromotionChannelUrlList({
              channelId: data.id
            })
              .then(res => {
                var nodes = (res.data.list || []).map(item => {
                  return {
                    id: item.id,
                    value: `${item.channel}`,
                    label: `${item.channel}`,
                    leaf: true
                  }
                })
                // 排序
                // const sortNodes = nodes.sort(sortBy('value'));
                resolve(nodes)
              })
              .catch(err => {
                this.$message.error(err)
                resolve([])
              })
          } else {
            resolve([])
          }
        }
      },

      // 日期选项
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
    this.fetchTodayData()
    this.fetchHistoryData()
  },
  methods: {

    resetCreateModel() {
      this.createModel = {
        parentId: 1,
        level: 0,
        name: null,
        icon: null,
        gameId: null,
        type: 1,
        status: 0
      }
    },

    // 获取今日数据
    fetchTodayData() {
      this.todayListLoading = true

      var channel = ''
      var type = null
      const channelQuerys = this.todayListQuery.channel
      if (Array.isArray(channelQuerys)) {
        if (channelQuerys.length > 0) {
          const sel = channelQuerys[0]
          if (sel === 'channel') {
            // 是渠道
            if (channelQuerys.length === 2) {
              // 选择第二级
              channel = channelQuerys[1]
              type = 0
            } else if (channelQuerys.length === 3) {
              // 选择第三级
              channel = channelQuerys[2]
              type = 1
            } else {
              channel = sel
            }
          } else {
            // 其他
            channel = sel
          }
        }
      }

      console.error(channel)
      console.error(type)
      getStatToday(channel, type)
        .then(res => {
          var list = []
          if (res.data != null && res.data != undefined && JSON.stringify(res.data) != '{}') {
            list.push(res.data)
          }
          this.todayList = list
          this.todayListLoading = false
        })
        .catch(err => {
          this.todayList = null
          this.todayListLoading = false
          this.$message.error(err)
        })
    },

    // 获取历史数据
    fetchHistoryData() {
      this.historyListLoading = true
      this.totalListLoading = true
      var channel = ''
      const channelQuerys = this.historyListQuery.channel
      if (Array.isArray(channelQuerys)) {
        if (channelQuerys.length > 0) {
          const sel = channelQuerys[0]
          if (sel === 'channel') {
            // 是渠道
            if (channelQuerys.length === 2) {
              // 选择第二级
              channel = channelQuerys[1]
            } else if (channelQuerys.length === 3) {
              // 选择第三级
              channel = channelQuerys[2]
            } else {
              channel = sel
            }
          } else {
            // 其他
            channel = sel
          }
        }
      }

      console.error(channel)
      getTotal({
        pageSize: this.historyListQuery.limit,
        pageNum: this.historyListQuery.page,
        channel: channel,
        pickerValue: this.historyListQuery.pickerValue
      })
        .then(res => {
          var allList = []
          if (res.data != null && res.data != undefined && JSON.stringify(res.data) != '{}') {
            allList.push(res.data)
          }
          this.totalList = allList
          this.totalListLoading = false
          this.historyListLoading = false
          return getStatHistoryList({ pageSize: this.historyListQuery.limit, pageNum: this.historyListQuery.page, channel: channel,
            pickerValue: this.historyListQuery.pickerValue })
        })
        .then(res => {
          this.historyList = res.data.list || null
          this.historyListQuery.total = res.data.total
          this.historyListLoading = false
        })
        .catch(err => {
          this.historyList = null
          this.historyListQuery.total = 0
          this.historyListLoading = false
          this.$message.error(err)
        })
    },

    /**
     * --------------- 今日 ---------------
     */

    // 过滤
    handleTodaySearchFilter() {
      this.fetchTodayData()
    },

    refreshTodayClick() {
      this.todayListQuery.channel = null
      this.fetchTodayData()
    },

    changeStart() {
      this.$confirm('是否进行昨日统计？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          testNewJob()
            .then(res => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '统计成功',
                type: 'success',
                duration: 1500
              })
              setTimeout(_ => {
                this.fetchData()
              }, 200)
            })
            .catch(err => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },

    /**
     * --------------- 历史 ---------------
     */

    // 过滤
    handleHistorySearchFilter() {
      this.historyListQuery.page = 1
      this.fetchHistoryData()
    },

    // 每页的条数改变
    handleHistorySizeChange(val) {
      this.historyListQuery.limit = val
      this.historyListQuery.page = 1
      this.fetchHistoryData()
    },

    // 当前页改变
    handleHistoryCurrentChange(val) {
      this.historyListQuery.page = val
      this.fetchHistoryData()
    },

    refreshHistoryClick() {
      this.historyListQuery.page = 1
      this.historyListQuery.channel = null
      this.historyListQuery.pickerValue = []
      this.fetchHistoryData()
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
  margin: 20px 0px;
  padding: 0px;
}
</style>
