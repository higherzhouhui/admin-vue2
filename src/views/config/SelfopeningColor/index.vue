<template>
  <div class="app-container">
    <!-- 状态 -->
    <el-form :inline="true">
      <el-form-item>
        <!-- <el-tag type="info">实时刷新：</el-tag> -->
        <el-select
          v-model="listQuery.lotteryCode"
          style="width: 130px"
          size="small"
          placeholder="请选彩票种类"
          @change="lotteryCodeF"
        >
          <el-option
            v-for="item in getLotteryTypeMethodD"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-select
          v-model="listQuery.lotteryPlayMethodCode"
          size="small"
          style="width: 200px"
          placeholder="请选择玩法类型"
          clearable
          @change="handleSearchFilter"
          @clear="handleSearchFilter"
        >
          <el-option v-for="item in playMethods" :key="item.code" :label="item.name" :value="item.code" />
        </el-select>
      </el-form-item> -->
      <!-- <el-input -->
      <!-- <el-form-item>
        <el-input
          v-model="listQuery.expect"
          style="width: 150px"
          size="small"
          placeholder="请输入期号"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item> -->
      <!-- <span style="margin-right: 10px;"></span>
        <el-dropdown split-button type="primary"     trigger="click" >
           刷新时间
          <el-dropdown-menu slot="dropdown">
             <el-dropdown-item @click.native="handleClick(300000000)">不刷新</el-dropdown-item>
             <el-dropdown-item @click.native="handleClick(5000)">5秒</el-dropdown-item>
             <el-dropdown-item @click.native="handleClick(10000)">10秒</el-dropdown-item>
             <el-dropdown-item @click.native="handleClick(20000)">20秒</el-dropdown-item>
             <el-dropdown-item @click.native="handleClick(30000)">30秒</el-dropdown-item>
             <el-dropdown-item @click.native="handleClick(60000)">60秒</el-dropdown-item>
             <el-dropdown-item @click.native="handleClick(120000)">120秒</el-dropdown-item>
             <el-dropdown-item @click.native="handleClick(300000)">300秒</el-dropdown-item>
           </el-dropdown-menu>
         </el-dropdown> -->

      <!--  <div style="display: flex;align-items: center;">审核时间</div> -->
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchFilter"
        >搜索</el-button>
      </el-form-item>
      <el-form-item>
        <!-- <el-tag type="info">页面刷新时间：</el-tag> -->
        <el-select
          v-model="timerType"
          :disabled="
            listQuery.lotteryCode == null ||
              listQuery.lotteryCode == undefined ||
              listQuery.lotteryCode.length == 0
          "
          style="width: 100px"
          size="small"
          placeholder="请选择刷新方式"
          @change="refresh"
        >
          <el-option
            v-for="item in timerList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="timerType !== -1">
        <span
          style="font-size: 14px"
        >将在 <span style="color: red">{{ num }}</span> 秒后刷新数据</span>
      </el-form-item>
    </el-form>
    <!-- 实时刷新自开彩信息 -->
    <div class="title">当前期数据：</div>
    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
      max-height="150px"
    >
      <el-table-column label="星期" min-width="100" prop="week" />
      <el-table-column prop="orderNo" label="开奖倒计时" min-width="170">
        <template slot-scope="{ row }">
          <!-- <div>{{ row.openRewardTime2 }}</div>
          <div>{{ row.closeRewardTime2 }}</div> -->
          {{
            SealingDiskT <= timeLong && SealingDiskT > timeLong - 5
              ? "封盘"
              : SealingDiskT
          }}
        </template>
      </el-table-column>
      <el-table-column prop="expect" label="期数" min-width="140" />
      <el-table-column prop="winningNumbers" label="开奖号码" min-width="230" />
      <el-table-column
        v-for="(item, index) in playMessageList"
        :key="index"
        :prop="item"
        :label="item"
        min-width="80"
      />
      <el-table-column prop="betAmountAll" label="总投注金额" width="140" />
      <el-table-column prop="openMethod" label="开奖方式" width="140">
        <template slot-scope="{ row }">
          <el-tag
            :type="
              row.openMethod == 1
                ? 'success'
                : row.openMethod == 2
                  ? 'warning'
                  : row.openMethod == 3
                    ? ''
                    : 'info'
            "
          >
            {{
              row.openMethod == 1
                ? "控制开奖"
                : row.openMethod == 2
                  ? "补偿开奖"
                  : row.openMethod == 3
                    ? "人工开奖"
                    : "未开奖"
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" fixed="right">
        <template slot-scope="{ row }">
          <span
            class="operation_btn"
            plain
            type="success"
            size="mini"
            @click="showOpenGiftDialog(row)"
          >开奖设定</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 历史记录 -->
    <el-form :inline="true" style="margin-top: 15px; display: none;">
      <el-form-item>
        <el-select
          v-model="listQueryHistory.lotteryCode"
          style="width: 130px"
          size="small"
          placeholder="请选彩票种类"
          @change="lotteryCodeFHistory"
        >
          <el-option
            v-for="item in getLotteryTypeMethodDHistory"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchFilterHistory"
        >搜索</el-button>
      </el-form-item>
      <el-form-item>
        <!-- <el-tag type="info">页面刷新时间：</el-tag> -->
        <el-select
          v-model="timerTypeHistory"
          :disabled="
            listQueryHistory.lotteryCode == null ||
              listQueryHistory.lotteryCode == undefined ||
              listQueryHistory.lotteryCode.length == 0
          "
          style="width: 100px"
          size="small"
          placeholder="请选择刷新方式"
          @change="refreshHistory"
        >
          <el-option
            v-for="item in timerListHistory"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="timerTypeHistory !== -1">
        <span
          style="font-size: 14px"
        >将在
          <span style="color: red">{{ numHistory }}</span> 秒后刷新数据</span>
      </el-form-item>
    </el-form>
    <div class="title" style="margin-top: 22px">历史数据：</div>
    <el-table
      v-cloading="listLoadingHistory"
      :data="listHistory"
      highlight-current-row
      size="mini"
    >
      <el-table-column label="星期" min-width="100" prop="week" />
      <el-table-column prop="orderNo" label="开奖时间/开奖完成" min-width="170">
        <template slot-scope="{ row }">
          <div>{{ row.openRewardTime2 }}</div>
          <div>{{ row.closeRewardTime2 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="expect" label="期数" min-width="140" />
      <el-table-column prop="winningNumbers" label="开奖号码" min-width="230" />
      <el-table-column
        v-for="(item, index) in currentColums"
        :key="index"
        :prop="item"
        :label="item"
        min-width="80"
      />
      <el-table-column prop="winLoseGoldCoin" label="本局输赢" width="140" />
      <el-table-column prop="openMethod" label="开奖方式" width="140">
        <template slot-scope="{ row }">
          <el-tag
            :type="
              row.openMethod == 1
                ? 'success'
                : row.openMethod == 2
                  ? 'warning'
                  : row.openMethod == 3
                    ? ''
                    : 'info'
            "
          >
            {{
              row.openMethod == 1
                ? "控制开奖"
                : row.openMethod == 2
                  ? "补偿开奖"
                  : row.openMethod == 3
                    ? "人工开奖"
                    : "未开奖"
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作人" min-width="80" />
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQueryHistory.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQueryHistory.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQueryHistory.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      :title="`${createModel.name}开奖设定`"
      :visible.sync="dialogCreateVisible"
      :show-close="true"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :inline="true"
          :model="createModel"
          label-position="top"
          label-width="130px"
          size="medium"
        >
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: center;
            "
          >
            <el-form-item label="开奖倒计时:" prop="joinCase">
              <div>
                {{
                  SealingDiskT <= timeLong && SealingDiskT > timeLong - 5
                    ? "封盘"
                    : SealingDiskT
                }}
              </div>
            </el-form-item>
            <el-form-item label="当前期数:" prop="joinCase">
              <div>{{ createModel.expect }}</div>
            </el-form-item>
            <el-form-item label="开奖结果设定:" prop="joinCase">
              <div class="radioWrapper">
                <div
                  v-for="(key, index) in Object.keys(
                    playMethodRadio
                  )"
                  :key="index"
                  class="myRadio"
                >
                  <el-radio
                    v-for="(citem, cindex) in playMethodRadio[key]"
                    v-if="playMethodRadio[key].length > 1"
                    :key="cindex"
                    v-model="createModel.definObj[citem.group]"
                    size="small"
                    :label="citem.name"
                    @click.native="clickRadio(citem.group, citem.name)"
                  />
                  <el-checkbox
                    v-else
                    v-model="
                      createModel.definObj[
                        playMethodRadio[key][0].group
                      ]
                    "
                    class="myCheck"
                  >{{ playMethodRadio[key][0].name }}</el-checkbox>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="开奖结果:" prop="joinCase">
              <div>
                <!-- <el-input
                  v-model="createModel.demo1"
                  style="width: 50px"
                  oninput="value=value.replace(/[^1-6]/g,'')"
                  maxlength="1"
                />
                <el-input
                  v-model="createModel.demo2"
                  style="width: 50px; margin: 0 10px"
                  oninput="value=value.replace(/[^1-6]/g,'')"
                  maxlength="1"
                />
                <el-input
                  v-model="createModel.demo3"
                  style="width: 50px"
                  oninput="value=value.replace(/[^1-6]/g,'')"
                  maxlength="1"
                /> -->
                <!-- <el-input
                  v-for="(item, index) in Array(listQuery.lotteryCode === 'ft' ? 4 : 3).fill('result')"
                  :key="index"
                  v-model="resultObj[`${item}${index}`]"
                  style="width: 50px; margin-right: 12px;"
                  oninput="value=value.replace(/[^1-6]/g,'')"
                  maxlength="1"
                /> -->
                <el-select
                  v-for="(citem, cindex) in Array(
                    selectOptionLength[createModel.name]
                  ).fill('result')"
                  :key="cindex"
                  v-model="resultObj[`${citem}${cindex}`]"
                  style="width: 120px; margin: 0 12px 12px 0"
                  :placeholder="getPlaceholder(cindex)"
                  @change="createModel.definObj = {}"
                >
                  <el-option
                    v-for="(item, index) in selectOption[createModel.name]"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div>
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-refresh-right"
                  @click="handleRefresh"
                >
                  刷新
                </el-button>
                <el-button
                  style="margin-left: 10px"
                  size="small"
                  icon="el-icon-refresh"
                  @click="handleReset"
                >
                  重置
                </el-button>
              </div>
            </el-form-item>
            <el-form-item label="预计输赢金额:" prop="joinCase">
              <div v-if="getResultMoneyLoading" class="jisuan">计算中...</div>
              <div v-else>
                <span v-if="Number(WinOrLose) > 0" style="color: #00cc00">
                  {{ WinOrLose }}</span>
                <span v-if="Number(WinOrLose) == 0"> {{ WinOrLose }}</span>
                <span v-if="Number(WinOrLose) < 0" style="color: red">
                  {{ WinOrLose }}</span>
              </div>
              <div>
                <el-button
                  icon="el-icon-refresh-right"
                  size="small"
                  @click="caculateMoney(resultObj)"
                >重新计算</el-button>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          size="medium"
          @click="
            dialogCreateVisible = false;
            refresh();
          "
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
import {
  cancelResultByExpect,
  getLotteryTypeMethod,
  getResultByNumber,
  queryControlLotteryHistoryList,
  queryControlLotteryListV2,
  openResultByNumber,
  manMadeLotteryResult
} from '@/api/config/SelfopeningColor'
import { formatUnixTime } from '@/utils/tools'

export default {
  name: 'ConfigSelfopeningColorIndex',
  filters: {
    statusFilter(status) {
      const map = { 1: 'info', 2: 'success', 3: 'danger' }
      return map[status]
    }
  },
  data() {
    return {
      list: [],
      listLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        lotteryCode: ''
      },
      SealingDisks: null, // 定时器名称
      SealingDiskT: 0,
      currentColums: [],
      timer: null, // 定时器名称
      //   timerList: [
      //     { label: "10秒", value: 10 },
      //     { label: "30秒", value: 30 },
      //     { label: "1分钟", value: 60 },
      //     { label: "3分钟", value: 180 },
      //     { label: "5分钟", value: 300 },
      //     { label: "10分钟", value: 600 },
      //     { label: "不刷新", value: -1 },
      //   ],
      timerList: [
        // { label: "2秒", value: 2 },
        { label: '3秒', value: 3 },
        { label: '4秒', value: 4 },
        { label: '5秒', value: 5 },
        { label: '6秒', value: 6 },
        { label: '不刷新', value: -1 }
      ],
      timerType: -1,
      num: 0,
      getLotteryTypeMethodD: [],
      playMethods: [],

      WinOrLose: '', // 输赢金额
      createModel: {
        demo1: null,
        demo2: null,
        demo3: null,
        playMethodRadio: {}
      }, // 弹窗数据
      dialogCreateVisible: false,
      dialogCreateLoading: false,

      //   历史数据
      listHistory: [],
      listLoadingHistory: false,
      listQueryHistory: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        lotteryCode: null,
        lotteryPlayMethodCode: null,
        expect: null
      },
      timerHistory: null, // 定时器名称
      timerListHistory: [
        { label: '30秒', value: 30 },
        { label: '1分钟', value: 60 },
        { label: '不刷新', value: -1 }
      ],
      timerTypeHistory: -1,
      numHistory: 0,
      getLotteryTypeMethodDHistory: [],
      playMethodsHistory: [],
      rowData: {},
      playMessageList: [],
      resultObj: {
        result0: 0,
        result1: 0,
        result2: 0
      },
      getResultMoneyLoading: false,
      selectOptionLength: {
        一分快三: 3,
        五分快三: 3,
        骰宝: 3,
        鱼虾蟹: 3,
        彩碟: 4,
        赛车: 2
      },
      selectOption: {
        一分快三: [
          { label: 1, value: 1 },
          { label: 2, value: 2 },
          { label: 3, value: 3 },
          { label: 4, value: 4 },
          { label: 5, value: 5 },
          { label: 6, value: 6 }
        ],
        五分快三: [
          { label: 1, value: 1 },
          { label: 2, value: 2 },
          { label: 3, value: 3 },
          { label: 4, value: 4 },
          { label: 5, value: 5 },
          { label: 6, value: 6 }
        ],
        骰宝: [
          { label: 1, value: 1 },
          { label: 2, value: 2 },
          { label: 3, value: 3 },
          { label: 4, value: 4 },
          { label: 5, value: 5 },
          { label: 6, value: 6 }
        ],
        鱼虾蟹: [
          { label: '鹿', value: 1 },
          { label: '葫芦', value: 2 },
          { label: '鸡', value: 3 },
          { label: '鱼', value: 4 },
          { label: '蟹', value: 5 },
          { label: '虾', value: 6 }
        ],
        彩碟: [
          { label: '红', value: 'RED' },
          { label: '白', value: 'WHITE' }
        ],
        赛车: [
          { label: 1, value: 1 },
          { label: 2, value: 2 },
          { label: 3, value: 3 },
          { label: 4, value: 4 },
          { label: 5, value: 5 },
          { label: 6, value: 6 },
          { label: 7, value: 7 },
          { label: 8, value: 8 },
          { label: 9, value: 9 },
          { label: 10, value: 10 }
        ]
      },
      timeLong: 0,
      playMethodRadio: {},
      radioClickFlag: true
    }
  },
  watch: {
    createModel: {
      deep: true,
      handler: function() {
        this.hanleCreateModlData()
      }
    },
    resultObj: {
      deep: true,
      handler: function(val) {
        this.caculateMoney(val)
      }
    },
    $route(val) {
      if (val.fullPath != '/finance/config/bank_record/index') {
        clearInterval(this.timer)
      }
    }
  },
  created() {
    this.getLotteryTypeMethodF()
  },
  mounted() {
    clearInterval(this.timer)
    this.refresh()

    clearInterval(this.timerHistory)
    this.refreshHistory()
  },
  activated() {
    this.refresh()

    this.refreshHistory()
  },
  beforeDestroy() {
    clearInterval(this.timer)

    clearInterval(this.timerHistory)
  },
  methods: {
    getPlaceholder(index) {
      if (this.createModel.name === '赛车') {
        if (index === 0) {
          return '冠军号码'
        }
        if (index === 1) {
          return '亚军号码'
        }
      } else {
        return '请选择'
      }
    },
    handleRefresh() {
      this.hanleCreateModlData()
    },
    handleReset() {
      Object.keys(this.createModel.definObj).forEach(item => {
        if (typeof this.createModel.definObj[item] === 'boolean') {
          this.createModel.definObj[item] = false
        } else {
          this.createModel.definObj[item] = ''
        }
      })
      const playMethod = this.playMethodRadio
      this.playMethodRadio = JSON.parse(JSON.stringify(playMethod))
      this.resultObj = {}
    },
    hanleCreateModlData() {
      const arr = []
      const data = this.createModel.definObj || {}
      Object.keys(data).forEach((key) => {
        if (data[key] && typeof data[key] === 'string') {
          arr.push(data[key])
        } else if (typeof data[key] === 'boolean') {
          if (data[key]) {
            const number = key.replace('group', '')
            this.createModel.playMessageList.forEach((item) => {
              if (item.group == number) {
                arr.push(item.name)
              }
            })
          }
        }
      })
      if (arr.length) {
        manMadeLotteryResult({
          lotteryCode: this.listQuery.lotteryCode,
          lotteryType: arr
        }).then((res) => {
          if (res.code === 200) {
            const data = res.data || []
            if (data.length) {
              data.forEach((item, index) => {
                const obj = {
                  name: `result${index}`,
                  value: item
                }
                this.resultObj[obj.name] = obj.value
              })
              this.resultObj = JSON.parse(JSON.stringify(this.resultObj))
            } else {
              this.$message.warning('开奖结果规则设定有误,请重新设定！')
              this.handleReset()
            }
          } else {
            this.$message.error(res.message)
            this.handleReset()
          }
        })
      }
    },
    // 封盘时间
    SealingDiskTimes(time) {
      this.SealingDiskT = time || this.timeLong
      clearInterval(this.SealingDisks)
      if (this.SealingDiskT <= 0) return
      const _this = this
      this.SealingDisks = setInterval((num) => {
        _this.SealingDiskT = this.SealingDiskT - 1
        if (this.SealingDiskT === 0) {
          this.SealingDiskT = this.timeLong
          if (this.dialogCreateVisible && this.createModel.expect) {
            this.createModel.expect = Number(this.createModel.expect) + 1
          }
          this.fetchData()
        }
      }, 1000)
    },
    clickRadio(key, value) {
      if (this.radioClickFlag) {
        this.createModel.definObj[key] = value === this.createModel.definObj[key] ? '' : value
        this.hanleCreateModlData()
      }
      this.radioClickFlag = true
      setTimeout(() => {
        this.radioClickFlag = false
      }, 300)
    },
    // 刷新
    refresh(num) {
      this.num = this.timerType
      clearInterval(this.timer)
      if (this.num == -1) return
      const _this = this
      this.timer = setInterval((num) => {
        _this.num = this.num - 1
        if (this.num === 0) {
          this.num = this.timerType
          this.fetchData('onlyCurrent')
        }
        // 1016
      }, 1000)
    },
    // 刷新历史
    refreshHistory(num) {
      this.numHistory = this.timerTypeHistory
      clearInterval(this.timerHistory)
      if (this.numHistory == -1) return
      const _this = this
      this.timerHistory = setInterval((num) => {
        _this.numHistory = this.numHistory - 1
        if (this.numHistory === 0) {
          this.numHistory = this.timerTypeHistory
          this.fetchDataHistory()
        }
      }, 1000)
    },

    // 获取彩票种类、玩法
    getLotteryTypeMethodF() {
      getLotteryTypeMethod().then((item) => {
        const data = item.data || []
        this.getLotteryTypeMethodD = data
        this.getLotteryTypeMethodDHistory = data
        // 默认查询历史记录
        this.listQuery.lotteryCode = data[0].code
        this.fetchData()
      })
    },
    // 选择彩票种类
    lotteryCodeF(e) {
      const a = this.getLotteryTypeMethodD.filter((value, index, array) => {
        return value.code == e
      })
      if (a[0] != undefined) {
        this.playMethods = a[0].playMethod
      } else {
        this.playMethods = []
      }
      this.listQuery.lotteryPlayMethodCode = null
      this.handleSearchFilter()
    },

    // 选择彩票种类  历史
    lotteryCodeFHistory(e) {
      const a = this.getLotteryTypeMethodDHistory.filter(
        (value, index, array) => {
          return value.code == e
        }
      )
      if (a[0] != undefined) {
        this.playMethodsHistory = a[0].playMethod
      } else {
        this.playMethodsHistory = []
      }
      this.listQueryHistory.lotteryPlayMethodCode = null
      this.handleSearchFilterHistory()
    },
    // 获取列表数据
    fetchData(refreshAll) {
      this.listLoading = true
      // this.listLoading = true;
      queryControlLotteryListV2(this.listQuery)
        .then((res) => {
          res.data.openRewardTime2 = formatUnixTime(res.data.openRewardTime)
          res.data.closeRewardTime2 = formatUnixTime(res.data.closeRewardTime)
          clearInterval(this.SealingDisks)
          this.SealingDiskTimes(Math.abs(res.data.downTime || 0))
          this.timeLong = (res.data.timelong || 1) * 60
          if (res.code === 200) {
            const playMessageList = res.data.playMessageList || []
            this.playMessageList = []
            playMessageList.forEach((item) => {
              this.playMessageList.push(item.name)
              res.data[item.name] = item.goldCoin
            })
            res.data.winningNumbers = this.shiftToNumber(
              res.data.winningNumbers,
              this.listQuery.lotteryCode
            )
          }
          this.list = [res.data] || []
          this.listLoading = false
        })
        .catch((err) => {
          this.list = []
          this.listLoading = false
          this.$message.error(err)
        })
      if (refreshAll !== 'onlyCurrent') {
        this.fetchDataHistory()
      }
    },
    // 获取历史列表数据
    fetchDataHistory() {
      this.listLoadingHistory = true
      queryControlLotteryHistoryList({ ...this.listQuery, pageNum: this.listQueryHistory.pageNum, pageSize: this.listQueryHistory.pageSize })
        .then((res) => {
          const data = res.data.list || []
          if (data.length) {
            const playMessageList = data[0].playMessageList || []
            this.currentColums = []
            playMessageList.forEach((item) => {
              this.currentColums.push(item.name)
            })
          }
          data.forEach((value, index, array) => {
            value.openRewardTime2 = formatUnixTime(value.openRewardTime)
            value.closeRewardTime2 = formatUnixTime(value.closeRewardTime)
            value.playMessageList.forEach((item) => {
              value[item.name] = item.goldCoin
            })
            value.winningNumbers = this.shiftToNumber(
              value.winningNumbers,
              this.listQuery.lotteryCode
            )
          })
          this.listHistory = data
          this.listQueryHistory.total = res.data.total || ((res.data.totalPage || 0) * this.listQueryHistory.pageSize)
          this.listLoadingHistory = false
        })
        .catch((err) => {
          this.listHistory = []
          this.listLoadingHistory = false
          this.$message.error(err)
        })
    },
    shiftToNumber(numberList, lotteryCode) {
      if (numberList && lotteryCode === 'yuxx') {
        const arrString = []
        JSON.parse(numberList).forEach((item) => {
          this.selectOption['鱼虾蟹'].forEach((citem) => {
            if (item == citem.value) {
              arrString.push(citem.label)
            }
          })
        })
        return `[${arrString.join(',')}]`
      } else if (numberList && lotteryCode === 'ft') {
        try {
          const arrString = []
          const newNumberLit = numberList.replace(/\\"/g, "'")
          JSON.parse(newNumberLit).forEach((item) => {
            this.selectOption['彩碟'].forEach((citem) => {
              if (item == citem.value) {
                arrString.push(citem.label)
              }
            })
          })
          return `[${arrString.join(',')}]`
        } catch (error) {
          console.error(error)
          return numberList
        }
      } else {
        return numberList
      }
    },
    caculateMoney(val) {
      const data = []
      for (var key in val) {
        if (val[key]) {
          data.push(val[key])
        }
      }
      if (this.createModel.name === '赛车') {
        const options = [
          { label: 1, value: 1 },
          { label: 2, value: 2 },
          { label: 3, value: 3 },
          { label: 4, value: 4 },
          { label: 5, value: 5 },
          { label: 6, value: 6 },
          { label: 7, value: 7 },
          { label: 8, value: 8 },
          { label: 9, value: 9 },
          { label: 10, value: 10 }
        ]
        const newOption = options.filter(item => {
          return !data.includes(item.label)
        })
        this.selectOption[this.createModel.name] = newOption
      }
      const currentLen = this.selectOptionLength[this.createModel.name]
      if (
        data.length === currentLen &&
        data.length === Object.keys(val).length
      ) {
        this.getResultMoneyLoading = true
        getResultByNumber(
          this.createModel.expect,
          data.join(','),
          this.listQuery.lotteryCode
        ).then((res) => {
          this.getResultMoneyLoading = false
          if (res.code === 200) {
            this.WinOrLose = res.data
          } else {
            this.WinOrLose = 0
            this.$message.error(res.message)
          }
        }).catch(error => {
          this.getResultMoneyLoading = false
          this.$message.error('预计输赢金额:' + error)
        })
      }
    },
    showOpenGiftDialog(row) {
      clearInterval(this.timer)
      this.rowData = row
      let name = ''
      this.getLotteryTypeMethodD.forEach((item) => {
        if (item.code === this.listQuery.lotteryCode) {
          name = item.name
        }
      })
      let playMessageList = row.playMessageList
      if (this.listQuery.lotteryCode === 'yuxx') {
        playMessageList = [
          { name: '对子', group: 1 },
          { name: '二不同号', group: 1 }
        ]
      }
      const playMethodRadio = {}
      playMessageList.forEach((item, index) => {
        if (
          (item.name === '一同号' || item.name === '二同号') &&
          this.listQuery.lotteryCode !== 'yuxx'
        ) {
          return
        }
        if (!item.showInDetail) {
          return
        }
        const group = item.group
        if (!playMethodRadio[group]) {
          playMethodRadio[group] = []
        }
        playMethodRadio[group].push({
          name: item.name,
          group: `group${group}`
        })
      })
      this.createModel = {
        ...row,
        name,
        result: [],
        definObj: {}
      }
      this.playMethodRadio = playMethodRadio
      this.resultObj = {}
      this.WinOrLose = 0
      this.dialogCreateVisible = true
    },

    // 获取输赢金额
    getResultByNumberF() {
      let t = true
      if (t) {
        if (
          this.createModel.demo1 == null ||
          this.createModel.demo1 == undefined ||
          this.createModel.demo1.length == 0
        ) {
          this.$message({
            message: '请输入参与条件',
            type: 'warning'
          })
          t = false
          return
        }
        if (
          this.createModel.demo2 == null ||
          this.createModel.demo2 == undefined ||
          this.createModel.demo2.length == 0
        ) {
          this.$message({
            message: '请输入完整参与条件',
            type: 'warning'
          })
          t = false
          return
        }
        if (
          this.createModel.demo3 == null ||
          this.createModel.demo3 == undefined ||
          this.createModel.demo3.length == 0
        ) {
          this.$message({
            message: '请输入完整参与条件',
            type: 'warning'
          })
          t = false
          return
        }
      }

      if (t) {
        this.dialogCreateLoading = true
        const { demo1, demo2, demo3 } = this.createModel
        const data = `${demo1},${demo2},${demo3}`
        getResultByNumber(this.rowData.expect, data)
          .then((item) => {
            console.log('获取输赢金额', item.data)
            this.WinOrLose = item.data
            this.dialogCreateLoading = false
          })
          .catch(() => {
            this.dialogCreateLoading = false
          })
      }
    },

    // 取消
    checkAnchorRefuseClick(row) {
      if (row.expect == null || row.expect < 0) {
        this.$message.error('参数错误')
        return
      }
      clearInterval(this.timer)

      this.$confirm('是否取消注单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          cancelResultByExpect(row.expect)
            .then((item) => {
              this.listLoading = false
              this.$message({
                message: '取消成功',
                type: 'success'
              })
              this.fetchData()
              this.refresh()
            })
            .catch((value) => {
              this.listLoading = false
              this.refresh()
            })
        })
        .catch(() => {
          this.refresh()
        })
    },

    // 确定
    handleDataClick() {
      const data = []
      for (var key in this.resultObj) {
        if (this.resultObj[key]) {
          data.push(this.resultObj[key])
        }
      }
      const currentLen = this.selectOptionLength[this.createModel.name]

      if (currentLen === data.length && data.length === Object.keys(this.resultObj).length) {
        this.dialogCreateLoading = true
        openResultByNumber(
          {
            name: this.listQuery.lotteryCode,
            result: data.join(','),
            issue: this.createModel.expect,
            operator: this.$store.state.user.name
          }
        ).then((item) => {
          this.dialogCreateLoading = false
          if (item.code === 200) {
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success'
            })
            this.dialogCreateVisible = false
            this.fetchData()
            this.refresh()
          }
        }).catch(error => {
          this.dialogCreateLoading = false
          this.$message({
            message: error,
            type: 'error'
          })
        })
      } else {
        this.$message.warning('请设定开奖结果！')
      }
    },

    // 过滤
    handleSearchFilter() {
      if (
        this.listQuery.lotteryCode != null &&
        this.listQuery.lotteryCode != undefined &&
        this.listQuery.lotteryCode.length > 0
      ) {
        this.listQuery.pageNum = 1
        this.num = this.timerType
        this.fetchData()
      } else {
        this.$message({
          message: '请先选择彩票种类',
          type: 'warning'
        })
      }
    },
    // 过滤历史数据
    handleSearchFilterHistory() {
      if (
        this.listQueryHistory.lotteryCode != null &&
        this.listQueryHistory.lotteryCode != undefined &&
        this.listQueryHistory.lotteryCode.length > 0
      ) {
        this.listQueryHistory.pageNum = 1
        this.fetchDataHistory()
        this.numHistory = this.timerTypeHistory
      } else {
        this.$message({
          message: '请先选择彩票种类',
          type: 'warning'
        })
      }
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQueryHistory.pageSize = val
      this.listQueryHistory.pageNum = 1
      this.fetchData()
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQueryHistory.pageNum = val
      this.fetchData()
    }
  }
}
</script>
<style scoped lang="scss">
.input-with-select {
  background-color: #fff;
  width: 250px;
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
.radioWrapper {
  display: flex;
  .myRadio {
    padding: 0 10px;
    margin-right: 20px;
    border: 1px solid #e5e5ef;
  }
}
.title {
  font-weight: bold;
  margin-bottom: 12px;
}
</style>
