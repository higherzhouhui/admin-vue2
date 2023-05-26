<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- 状态 -->
      <el-form-item>
        <el-select
          v-model="listQuery.seriesType"
          size="small"
          placeholder="关次类型"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in seriesTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.orderStatus"
          size="small"
          placeholder="订单状态"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in orderStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.orderNum"
          size="small"
          placeholder="请输入订单号"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          style="width: 180px"
          size="small"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
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
        <el-button
          size="small"
          icon="el-icon-search"
          type="primary"
          @click="handleSearchFilter"
        >搜索</el-button>
        <el-button
          size="small"
          icon="el-icon-refresh"
          @click="reset"
        >重置</el-button>
      </el-form-item>
      <br>
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          @click="(dialogCreateVisible = true), resetCreateModel()"
        >补偿</el-button>
      </el-form-item>
      <el-form-item v-if="newestTime">
        <span>
          最新拉取时间：{{ newestTime }}
        </span>
      </el-form-item>
    </el-form>

    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="用户ID" min-width="120">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="订单号" min-width="150" />
      <el-table-column prop="fbOrderId" label="三方订单id" min-width="150" />
      <el-table-column prop="stakeAmount" label="投注金额" min-width="80" />
      <el-table-column label="关次类型" width="80">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.seriesType | typeFilter">{{
            row.seriesTypeString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="seriesValue" label="串几关" min-width="60" />
      <el-table-column label="选项数" width="80">
        <template slot-scope="{ row }">
          <span style="margin-left: 10px">{{ row.itemCount }}</span>
          <el-button
            style="margin: 0; padding: 0"
            type="text"
            @click="showDrawerClick(row.orderNum)"
          >
            <i
              class="el-icon--right"
            ><svg-icon
              icon-class="eye-open"
              class-name="see-btn"
            /></i>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="betNum" label="子单数" min-width="60" />
      <el-table-column prop="betType" label="投注类型" min-width="80" />
      <el-table-column prop="settleAmount" label="结算返还" min-width="80" />
      <el-table-column label="订单状态" width="80">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.orderStatus | orderStatusFilter">{{
            row.orderStatusString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTimeString" label="创建时间" width="160" />
      <el-table-column prop="settleTimeString" label="结算时间" width="160" />
    </el-table>

    <!--    <el-table v-cloading="todayListLoading" :data="todayList" border size="mini">-->
    <!--      <el-table-column type="" label="" width="60"   />-->
    <!--      <el-table-column prop="" label="" min-width="60"   />-->
    <!--      <el-table-column prop="" label="" min-width="60"   />-->
    <!--      <el-table-column prop="" label="" min-width="60"   />-->
    <!--      <el-table-column prop="upCoin" label="总代入(金币)" min-width="60"   />-->
    <!--      <el-table-column prop="downCoin" label="总代出(金币)" width="80"   />-->
    <!--      <el-table-column prop="allCoin" label="总盈亏(金币)" min-width="120"   />-->
    <!--      <el-table-column prop="" label="" min-width="60"   />-->
    <!--      <el-table-column label="" width="80"   />-->
    <!--      <el-table-column prop="" label="" width="160"   />-->
    <!--      <el-table-column prop="" label="" width="160"   />-->
    <!--    </el-table>-->

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

    <el-drawer
      :title="'投注明细: ' + orderNum"
      :append-to-body="true"
      :modal-append-to-body="false"
      :close-on-press-escape="true"
      :wrapper-closable="true"
      :show-close="true"
      :destroy-on-close="true"
      :visible.sync="drawer"
      size="80%"
    >
      <div class="app-container">
        <el-table
          v-cloading="detailListLoading"
          :data="detailList"
          highlight-current-row
          size="mini"
        >
          <el-table-column prop="matchName" label="比赛名称" min-width="140" />
          <el-table-column
            prop="tournamentName"
            label="联赛名称"
            min-width="100"
          />
          <el-table-column prop="optionName" label="选项名称" min-width="120" />
          <el-table-column prop="marketName" label="玩法名称" min-width="60" />
          <el-table-column prop="betOdds" label="投注时赔率" min-width="60" />
          <el-table-column prop="odds" label="欧式赔率" min-width="60" />
          <el-table-column label="结算状态" width="100">
            <template slot-scope="{ row }">
              <el-tag
                size="medium"
                :type="row.settleStatus | settleStatusFilter"
              >{{ row.settleStatusString }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="结算结果" width="100">
            <template slot-scope="{ row }">
              <el-tag
                v-if="row.settleResult"
                size="medium"
                :type="row.settleResult | settleResultFilter"
              >{{ row.settleResultString }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>

    <!-- 游戏数据手动补偿 -->
    <el-dialog
      title="游戏数据补偿"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :inline="true"
          :model="createModel2"
          label-position="top"
          label-width="100px"
          size="medium"
          style="display: flex; flex-direction: column; align-items: center"
        >
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
            "
          >
            <el-form-item label="补偿日期">
              <!-- <el-date-picker
                style="width: 260px"
                v-model="createModel.day"
                type="date"
                format="yyyy-MM-dd HH"
                value-format="yyyyMMddHH"
                placeholder="请选择补偿日期"
              >
              </el-date-picker> -->
              <el-date-picker
                v-model="createModel2.day"
                type="datetime"
                placeholder="请选择补偿日期"
                value-format="yyyyMMddHH"
              />
            </el-form-item>
            <!-- <el-form-item label="游戏类型">
            <el-select
              v-model="createModel.gameType"
              placeholder="请选择游戏类型"
              style="width: 260px"
            >
              <el-option label="BG捕鱼大师" value="105"></el-option>
              <el-option label="西游捕鱼" value="411"></el-option>
              <el-option label="大仙捕鱼大师" value="484"></el-option>
            </el-select>
          </el-form-item> -->
            <el-form-item label="添加流水">
              <el-radio-group v-model="createModel2.addFlow">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div slot="footer">
        <el-button
          size="medium"
          @click="dialogCreateVisible = false"
        >取消</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="handleDataClick()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTransList, getTransTotal, getDetail } from '@/api/game/fb/trans'
import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import { hourCompensate } from '@/api/platformGameRecord/bgRealPerson'
import UserDrawer from "@/components/UserDrawer";

export default {
  name: 'FbGameTransController',
  components: {
    UserDrawer
  },
  filters: {
    typeFilter(type) {
      const map = { 0: 'info', 1: 'success', 2: 'danger' }
      return map[type]
    },
    settleStatusFilter(type) {
      const map = {
        0: 'danger',
        1: 'warning',
        2: 'info',
        3: 'info',
        4: '',
        5: 'success'
      }
      return map[type]
    },
    settleResultFilter(type) {
      const map = {
        0: 'danger',
        1: 'warning',
        2: 'info',
        3: 'info',
        4: '',
        5: 'success',
        6: 'success'
      }
      return map[type]
    },
    orderStatusFilter(type) {
      const map = {
        0: 'danger',
        1: 'warning',
        2: 'info',
        3: 'info',
        4: '',
        5: 'success',
        6: 'success'
      }
      return map[type]
    },
    statusFilter(status) {
      const map = { 0: 'info', 2: 'success', 3: 'danger' }
      return map[status]
    }
  },
  data() {
    return {
      drawer: false,
      list: [],
      detailList: null,
      todayList: null,
      listLoading: true,
      detailListLoading: true,
      orderNum: '',
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        orderNum: null,
        seriesType: null,
        uid: null,
        orderStatus: null,
        pickerValue: []
      },
      newestTime: '',
      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {},
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
      // 表单模型
      createModel: {
        uid: 0
      },

      // 表单模型
      createModel2: {
        day: null,
        gameName: '',
        gameType: '',
        addFlow: false
      },
      seriesTypes: [
        { value: 0, label: '单关' },
        { value: 1, label: '串关' }
      ],
      orderStatus: [
        { value: 0, label: '未确认' },
        { value: 1, label: '确认中' },
        { value: 2, label: '已拒单' },
        { value: 3, label: '已取消' },
        { value: 4, label: '已接单' },
        { value: 5, label: '已结算' }
      ],

      rules: {
        uid: [
          { required: true, message: '请输入用户ID', trigger: 'change' },
          { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.listQuery.pickerValue = this.$store.getters.timerDate
    this.fetchData()
  },
  methods: {
    resetCreateModel() {
      this.createModel = {
        uid: 0
      }
      this.createModel2 = {
        day: null,
        gameName: '',
        gameType: '',
        addFlow: false
      }
    },
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        pickerValue: this.$store.getters.timerDate
      }
      this.fetchData()
    },
    showDrawerClick(orderNum) {
      this.detailList = null
      this.orderNum = orderNum
      getDetail(orderNum)
        .then((res) => {
          this.detailList = res.data
          this.detailListLoading = false
          return getDetail(orderNum)
        })
        .then((res) => {
          console.log(res)
          this.detailList = (res.data || []).map((item) => {
            var settleStatusString = ''
            if (item.settleStatus == 0) {
              settleStatusString = 'unsettle'
            } else if (item.settleStatus == 1) {
              settleStatusString = 'settled'
            } else if (item.settleStatus == 2) {
              settleStatusString = 'canceled'
            } else if (item.settleStatus == 3) {
              settleStatusString = 'confirmed'
            } else if (item.settleStatus == 4) {
              settleStatusString = 'refused'
            } else if (item.settleStatus == 5) {
              settleStatusString = 'canceling'
            } else if (item.settleStatus == 6) {
              settleStatusString = 'rolling back'
            }
            var settleResultString = ''
            if (item.settleResult == 0) {
              settleResultString = 'NoResulted'
            } else if (item.settleResult == 2) {
              settleResultString = 'Return'
            } else if (item.settleResult == 3) {
              settleResultString = 'Lost'
            } else if (item.settleResult == 4) {
              settleResultString = 'Won'
            } else if (item.settleResult == 5) {
              settleResultString = 'WinReturn'
            } else if (item.settleResult == 6) {
              settleResultString = 'LooseReturn'
            } else if (item.settleResult == 7) {
              settleResultString = 'Cancel'
            }
            this.$set(item, 'settleStatusString', settleStatusString)
            this.$set(item, 'settleResultString', settleResultString)
            return item
          })
          this.listLoading = false
          this.listQuery.total = res.data.total
        })
        .catch((err) => {
          this.detailList = null
          this.detailListLoading = false
          this.$message.error(err)
        })
      this.drawer = true
    },
    handleDataClick() {
      // this.createModel
      // this.dialogCreateVisible = false;
      if (
        this.createModel2.day == null ||
        this.createModel2.day == undefined ||
        this.createModel2.day.length == 0
      ) {
        this.$message({
          message: '请选择补偿时间',
          type: 'warning'
        })
        return
      }
      this.dialogCreateLoading = true
      this.createModel2.gameName = 'fb'
      console.log('this.createModel', this.createModel2)
      hourCompensate(this.createModel2)
        .then((item) => {
          this.$notify({
            title: '提示',
            message: '操作成功！',
            type: 'success',
          })
          this.dialogCreateVisible = false
          this.dialogCreateLoading = false
        })
        .catch((err) => {
          this.dialogCreateLoading = false
          this.$message.error(err)
        })
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.todayListLoading = true
      getTransList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      ).then((res) => {
        this.newestTime = formatUnixTime(res.data.ext.lastTime)
        this.list = (res.data.list || []).map((item) => {
          var orderStatusString = ''
          if (item.orderStatus == -1) {
            orderStatusString = '确认中'
          } else if (item.orderStatus == 0) {
            orderStatusString = '未确认'
          } else if (item.orderStatus == 2) {
            orderStatusString = '已拒单'
          } else if (item.orderStatus == 3) {
            orderStatusString = '已取消'
          } else if (item.orderStatus == 4) {
            orderStatusString = '已确认'
          } else if (item.orderStatus == 5) {
            orderStatusString = '已结算'
          }
          var seriesTypeString = ''
          if (item.seriesType == 0) {
            seriesTypeString = '单关'
          } else if (item.seriesType == 1) {
            seriesTypeString = '串关'
          }
          this.$set(item, 'orderStatusString', orderStatusString)
          this.$set(item, 'seriesTypeString', seriesTypeString)
          this.$set(
            item,
            'createTimeString',
            formatUnixTime(item.createTime * 1)
          )
          if (item.settleTime) {
            this.$set(
              item,
              'settleTimeString',
              formatUnixTime(item.settleTime * 1)
            )
          }

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
