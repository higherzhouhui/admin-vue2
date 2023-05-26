<template>
  <div class="app-container">
    <DatePicker v-model="pickerValue" @change="handleSearchFilter2(listQuery.flagTime, $event)">
      <el-form-item>
        <!-- 筛选状态 -->
        <el-select v-model="listQuery.flagTime" size="small" placeholder="请选择启禁状态" @change="handleSearchFilter2">
          <el-option v-for="item in flagOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </DatePicker>
    <el-form :inline="true">
      <!-- <el-form-item>
        <el-tag type="info">投注时间:</el-tag>
        <el-date-picker
          v-model="listQuery.pickerValue2"
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
          style="width: 200px"
          placeholder="请输入用户ID"
          clearable
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <!-- <el-form-item>
        <el-tag type="info">结算时间:</el-tag>
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
        <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
        <!-- 重置 -->
        <el-button size="small" icon="el-icon-refresh" @click="refreshData">重置</el-button>
      </el-form-item>
      <!-- <el-form-item>
          <el-button
            size="small"
            :loading="downloadLoading"
            type="success"
            icon="el-icon-document"
            @click="handleDownload"
          >
            导出Excel
          </el-button>
        </el-form-item> -->
      <br>
      <el-form-item>
        <el-button type="primary" size="small" @click="(dialogCreateVisible = true), resetCreateModel()">补偿</el-button>
      </el-form-item>
      <el-form-item v-if="newestTime">
        <span>
          最新拉取时间：{{ newestTime }}
        </span>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="list" size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="用户ID" min-width="120">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="pl" label="损益" min-width="100" />
      <el-table-column prop="nonCashOutAmount" label="兑现股份后剩余金额" min-width="160" />
      <el-table-column prop="comBoBounsAmount" label="组合奖金金额" min-width="120" />
      <el-table-column prop="betSettledDate" label="结算时间" width="100" />
      <el-table-column prop="purchaseId" label="注单购买ID" min-width="100" />
      <el-table-column prop="updateDate" label="更新时间" min-width="100" />
      <el-table-column prop="odds" label="美国盘口" width="120" />
      <el-table-column prop="oddsInUserStyle" label="玩家看到的赔率" width="120" />
      <el-table-column prop="oddsStyleOfUser" label="玩家使用的盘口" min-width="120" />
      <el-table-column prop="totalStake" label="下注金额" min-width="160" />
      <el-table-column prop="oddsDec" label="欧洲盘赔率" min-width="150" sortable />
      <el-table-column prop="vaildStake" label="下注金额（如果是提前兑现永远是0）" min-width="320" />
      <el-table-column prop="platForm" label="平台名称" min-width="100" />

      <el-table-column prop="returnA" label="玩家获取的数目" min-width="120" />
      <el-table-column prop="domainId" label="系统给代理的域名ID" width="120" />

      <el-table-column prop="betStatus" label="下注状态" width="140" />
      <el-table-column prop="brand" label="代理名" width="100" />
      <el-table-column prop="ueerName" label="用户名" width="100" />
      <el-table-column prop="betTypeName" label="下注类别" width="100" />
      <el-table-column prop="creationDate" label="创建时间" width="100" />
      <!-- <el-table-column prop="betTypeId" label="Bet类型标识符" width="100" /> -->
      <!-- <el-table-column prop="status" label="下注状态" width="100" /> -->
      <el-table-column prop="customerId" label="BTI系统内的玩家ID" width="140" />
      <el-table-column prop="merchantCustomerId" label="商户系统内的玩家ID" width="140" />
      <el-table-column prop="currency" label="货币代码ISO4217" width="120" />
      <el-table-column prop="playerLevelId" label="玩家级别标识符" width="120" />
      <el-table-column prop="playerLevelName" label="玩家级别名称" width="100" />
      <el-table-column prop="searchDateTime" label="用于搜索的日期字段" width="140" />
      <!-- <el-table-column
        prop="selections"
        label="投注内选项"
        width="120"

      /> -->
      <el-table-column prop="validBetAmount" label="有效投注" width="100" />
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
    <!-- 游戏数据手动补偿 -->
    <el-dialog title="游戏数据补偿" :visible.sync="dialogCreateVisible" :close-on-click-modal="false" :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :inline="true"
          :model="createModel"
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
              <el-date-picker
                v-model="createModel.day"
                style="width: 260px"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyyMMdd"
                placeholder="请选择补偿日期"
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
              <el-radio-group v-model="createModel.addFlow">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { recordKy } from '@/api/platformGameRecord/btiPhysicalCulture'
import { dayCompensate } from '@/api/platformGameRecord/bgRealPerson'

import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: 'PlatformGameRecordBtiPhysicalCulture',
  components: {
    UserDrawer
  },
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        type: null,
        pickerValue: [],
        pickerValue2: [],
        flagTime: 0
      },
      pickerValue: [],
      flagOptions: [
        { label: '投注时间', value: 0 },
        { label: '结算时间', value: 1 }
      ],
      newestTime: '',
      downloadLoading: false,
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
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      // 表单模型
      createModel: {
        day: null,
        gameName: '',
        gameType: '',
        addFlow: false
      },
      // 重新设置表单数据
      resetCreateModel() {
        this.createModel = {
          day: null,
          gameName: '',
          gameType: '',
          addFlow: false
        }
      }
    }
  },
  computed: {
    initTimer() {
      return this.$store.getters.timerDate
    }
  },
  created() {
    this.pickerValue = this.initTimer
    this.listQuery.uid = this.$route.query.uid
    this.fetchData()
  },
  methods: {
    // 刷新
    refreshData() {
      this.list = []
      const flagTime = this.listQuery.flagTime
      this.pickerValue = this.initTimer
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        type: null,
        pickerValue: [],
        pickerValue2: [],
        flagTime
      }
      setTimeout(() => {
        this.fetchData()
      }, 80)
    },
    handleDataClick() {
      // this.createModel
      // this.dialogCreateVisible = false;
      if (
        this.createModel.day == null ||
        this.createModel.day == undefined ||
        this.createModel.day.length == 0
      ) {
        this.$message({
          message: '请选择补偿时间',
          type: 'warning'
        })
        return
      }
      this.dialogCreateLoading = true
      this.createModel.gameName = 'bti'
      console.log('this.createModel', this.createModel)
      dayCompensate(this.createModel)
        .then((item) => {
          this.$notify({
            title: '提示',
            message: '游戏数据补偿成功',
            type: 'success',
            duration: 1500
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
      this.familyList = []
      if (this.listQuery.flagTime == 0) this.listQuery.pickerValue2 = this.pickerValue
      else this.listQuery.pickerValue = this.pickerValue
      recordKy(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.newestTime = formatUnixTime(res.data.ext.lastTime)
          this.list = (res.data.list || []).map((item) => {
            // var goldMedalString = "否";
            // if (item.goldMedal == 0) {
            //   goldMedalString = "否";
            // } else if (item.goldMedal == 1) {
            //   goldMedalString = "是";
            // } else if (item.goldMedal == 2) {
            //   goldMedalString = "纯提成";
            // }
            // var familyName = "暂无家族";
            // for (const family of this.familyList) {
            //   if (family.value == item.bossId) {
            //     familyName = family.label;
            //     break;
            //   }
            // }
            // this.$set(item, "goldMedalString", goldMedalString);
            // this.$set(item, "familyName", familyName);
            // this.$set(item, "gmtCreateString", formatUnixTime(item.gmtCreate));
            // this.$set(
            //   item,
            //   "gmtCompleteString",
            //   formatUnixTime(item.gmtComplete)
            // );
            return item
          })
          this.listQuery.total = res.data.total
          this.listLoading = false
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          '主播ID',
          '主播昵称',
          '家族名称',
          '是否金牌主播',
          '总礼物价值',
          '总付费价值',
          '总彩票流水',
          '主播收益',
          '家族长收益',
          '发放收益星币',
          '有效时间',
          '收益归属时间',
          '创建时间'
        ]
        const filterVal = [
          'uid',
          'nickname',
          'familyName',
          'goldMedalString',
          'totalMl',
          'totalFfml',
          'totalCp',
          'anchorProfit',
          'bossProfit',
          'subsidy',
          'activeTime',
          'belong',
          'gmtCreateString'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j]
        })
      )
    },
    handleSearchFilter2(val, arr = [NOW_TIME_START, NOW_TIME_END]) {
      if (val == 0) {
        delete this.listQuery.pickerValue
        this.listQuery.pickerValue2 = this.pickerValue
      } else {
        delete this.listQuery.pickerValue2
        this.listQuery.pickerValue = this.pickerValue
      }
      // this.pickerValue = arr
      this.handleSearchFilter()
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
  margin: 20px 0px;
  padding: 0px;
}
</style>
