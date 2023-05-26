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
        <span class="search_info">申请时间</span>
        <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
          :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" value-format="timestamp"
          @change="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <span class="search_info">审核时间</span>
        <el-date-picker v-model="listQuery.withdrawValue" size="small" clearable type="datetimerange"
          :picker-options="withdrawOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" value-format="timestamp"
          @change="handleSearchFilter" />
      </el-form-item> -->
      <el-form-item>
        <el-select v-model="listQuery.status" size="small" style="width: 180px" placeholder="请选择状态" clearable
          @change="handleSearchFilter">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.familyIds" size="small" multiple filterable clearable placeholder="请输入或选择家族"
          @clear="handleSearchFilter">
          <el-option v-for="item in familyList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" style="width: 200px" class="input-with-select"
          placeholder="请输入主播ID" clearable maxlength="20" oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
          <!-- <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.orderNo" size="small" style="width: 200px" class="input-with-select"
          placeholder="请输入订单号" clearable maxlength="200" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter">
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter" /> -->
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-input v-model="listQuery.trueName" size="small" style="width: 200px" class="input-with-select"
          placeholder="请输入提款人姓名" clearable maxlength="200" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter">
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter" /> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.cardNo" size="small" style="width: 220px" class="input-with-select"
          placeholder="请输入银行卡号" clearable maxlength="50" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter">
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter" /> -->
        </el-input>
      </el-form-item>
      <!-- <div style="display: flex;align-items: center;">申请时间</div>
        <span style="margin: 10px;"></span>
        <el-date-picker
          size="small"
          clearable
          v-model="listQuery.pickerValue"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="timestamp"
          @change="handleSearchFilter"
        ></el-date-picker>
        <div style="display: flex;align-items: center;">审核时间</div>
        <el-date-picker
          size="small"
          clearable
          v-model="listQuery.withdrawValue"
          type="datetimerange"
          :picker-options="withdrawOptions"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="timestamp"
          @change="handleSearchFilter"
        ></el-date-picker> -->
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" plain icon="el-icon-refresh" @click="refreshData()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-edit-outline"
          @click="multipleDateClick(list)">一键审核</el-button>
      </el-form-item>
      <el-form-item>
        <span type="info">页面刷新时间：</span>
        <el-select v-model="timerType" style="width: 100px" size="small" placeholder="请选择刷新方式" @change="refresh">
          <el-option v-for="item in timerList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="timerType !== -1">
        <span style="font-size: 14px">将在 <span style="color: red">{{ num }}</span> 秒后刷新数据</span>
      </el-form-item>
      <el-form-item>
        <span plain size="small" type="primary" :loading="todayListLoading">
          总魅力:{{ todayList && todayList[0].totalCoin.toLocaleString() }}
        </span>
      </el-form-item>
    </el-form>
    <el-table ref="multipleTable" v-cloading="listLoading" :data="list" size="mini" @selection-change="selRoleChangeHand">
      <!-- <div style="margin-top: 20px">   ref="multipleTable" :data="tableData3"
        <el-button @click="toggleSelection(tableData3)">全选</el-button>
        <el-button @click="toggleSelection()" :disabled="multipleSelection.length == 0">取消选择</el-button>
      </div>
 -->

      <!-- 展开 -->
      <!--  <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="开户省">
              <span>{{ props.row.bankProvince }}</span>
            </el-form-item>
            <el-form-item label="开户市">
              <span>{{ props.row.bankCity }}</span>
            </el-form-item>
            <el-form-item label="开户行支行">
              <span>{{ props.row.bankSub }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column> -->

      <el-table-column type="selection" width="50" :disable="isdisable" />
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="主播ID" min-width="110">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="cashString" label="实际提现金额" min-width="130" sortable />
      <el-table-column prop="anchorCoinString" label="花费魅力" min-width="100" sortable />
      <!--  <el-table-column prop="fee" label="手续费" min-width="50"  ></el-table-column> -->
      <el-table-column prop="familyName" label="家族名称" min-width="120" />
      <el-table-column prop="flagWarn" label="是否警告" min-width="160">
        <template slot-scope="{ row }">
          <div>
            <el-tag :type="row.flagWarn == 1 ? 'danger' : 'info'">{{
              row.flagWarn == 1 ? "警告" : "否"
            }}</el-tag>
            <div v-if="row.flagWarn == 1">
              <div>魅力值明细金额:{{ row.curDetailTotalAnchorCoin }}</div>
              <div>魅力值总额:{{ row.anchorCoinTotal }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="curDetailTotalAnchorCoin"
        label="当前魅力值明细金额"
        min-width="160"

        sortable
      />
      <el-table-column
        prop="anchorCoinTotal"
        label="当前魅力值总额"
        min-width="140"

        sortable
      /> -->

      <!--  <el-table-column label="提现渠道" width="80"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.withdrawWay | wayFilter">{{ row.withdrawWayString }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="orderNo" label="订单号" min-width="140" />
      <el-table-column prop="cardNo" label="主播提现帐号" min-width="130" />
      <el-table-column prop="trueName" label="真实姓名" min-width="120" />
      <el-table-column prop="bankName" label="开户银行" min-width="150" />
      <el-table-column label="状态" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.status | statusFilter">{{
            row.statusString
          }}</el-tag>
        </template>
      </el-table-column>
      <!--  <el-table-column prop="failReason" label="失败原因" min-width="80"  ></el-table-column> -->
      <!--   <el-table-column prop="typeName" label="类型名称" min-width="100"  ></el-table-column> -->
      <!--  <el-table-column prop="typeDetail" label="类型描述" min-width="60"  ></el-table-column> -->
      <el-table-column prop="merchantName" label="代付商户" width="70" />
      <el-table-column prop="gmtCreateString" label="创建时间" width="140" />
      <el-table-column prop="gmtCompleteString" label="审核时间" width="140" />

      <el-table-column prop="failReason" label="备注" min-width="120" label-width="auto" />
      <el-table-column prop="operator" label="操作人" min-width="60" />
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="{ row }">
          <!-- <el-popover trigger="hover" placement="left">
            <div style="margin-bottom: 6px">
              <el-button v-if="row.flagWarn == 1" plain type="primary" size="mini"
                @click="charmUpdateDialogClick(row)">核准魅力值</el-button>
              <el-button plain type="primary" size="mini" @click="showUpdateDialogClick(row)">备注</el-button>
              <el-button plain type="success" size="mini" @click="checkUserAgentClick(row)">代付</el-button>
              <el-button plain type="info" size="mini" @click="checkAnchorPassClick(row)">人工</el-button>
            </div>
            <el-button plain type="danger" size="mini" @click="checkAnchorRefuseClick(row)">驳回</el-button>
            <div slot="reference" class="name-wrapper">
              <span class="operation_btn" size="medium">操作</span>
            </div>
          </el-popover> -->
          <el-dropdown trigger="hover">
            <span class="el-dropdown-link">
              <span class="operation_btn" type="primary" size="mini"> 操作 </span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="showUpdateDialogClick(row)">备注</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="checkUserAgentClick(row)">代付</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="checkAnchorPassClick(row)">人工</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="checkAnchorRefuseClick(row)">驳回</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

        </template>
      </el-table-column>

      <!-- <el-table-column
        v-if="$store.getters.buttonPermission.includes('主播出款审核操作')"
        label="编辑"
        min-width="75"

        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-button
            plain
            type="primary"
            size="mini"
            @click="showUpdateDialogClick(row)"
          >备注</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <el-table v-if="todayList && todayList.length > 1" v-cloading="todayListLoading" :data="todayList" size="mini">
      <!-- 展开 -->
      <el-table-column type="" label="" width="60" />
      <el-table-column label="" min-width="80" />
      <!-- <el-table-column prop="totalAmount" label="总金额" min-width="80"  ></el-table-column> -->
      <el-table-column prop="totalCoin" label="总魅力" min-width="100" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column prop="" label="" min-width="100" />
      <el-table-column label="" width="80" />
      <el-table-column prop="" label="" min-width="120" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column label="" width="80" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column prop="" label="" width="140" />
      <el-table-column prop="" label="" width="140" />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column label="" width="160" />
    </el-table>

    <!-- 新建编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true" top="5vh" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" label-position="top" label-width="120px" size="medium">
          <el-form-item prop="uid" label="用户id"><el-input v-model="createModel.uid" clearable placeholder="用户id"
              maxlength="20" /></el-form-item>
          <el-form-item prop="failReason" label="备注"><el-input v-model="createModel.failReason" type="textarea" clearable
              placeholder="备注" maxlength="10000" @input="change($event)" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import {
  getWithdrawAnchorList,
  checkUserStatus,
  updateUsesRemark1,
  checkAgentStatus,
  getWithdrawAnchor,
  multipleDate,
  checkAgentPayStatus,
  getUserFamilyList,
  flagSureAnchorCoin,
} from '@/api/center/user/withdraw_bank'
import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import { parseTime } from '@/utils'
import UserDrawer from '@/components/UserDrawer'
const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: 'CenterBankWithdrawAnchorController',
  filters: {
    statusFilter(status) {
      const map = { 0: 'info', 1: 'success', 2: 'danger' }
      return map[status]
    },
    wayFilter(status) {
      const map = { 1: 'success', 2: '' }
      return map[status]
    },
  },
  components: {
    UserDrawer,
  },
  data() {
    return {
      pickerValue: [NOW_TIME_START, NOW_TIME_END],
      list: [],
      isdisable: false,
      listLoading: true,
      todayListLoading: true,
      todayList: [],
      flagOptions: [
        { label: '申请时间', value: 0 },
        { label: '审核时间', value: 1 }
      ],
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        status: null,
        familyIds: null,
        pickerValue: [],
        withdrawValue: [],
        downloadLoading: false,
        filename: '',
        autoWidth: true,
        bookType: 'xlsx',
        trueName: null,
        cardNo: null,
        orderNo: null,
        flagTime: 0
      },
      createModel: {
        id: null,
        uid: 0,
        nickname: null,
        typeDetail: null,
        failReason: null,
      },
      multipleDate: [],
      familyList: null,
      // 状态选择
      // statusOptions: [{ label: '待审核', value: 0 }, { label: '已发', value: 1 }, { label: '驳回', value: 2 }],
      statusOptions: [
        { label: '待审核', value: 0 },
        { label: '人工', value: 1 },
        { label: '已驳回', value: 2 },
        { label: '锁定中', value: 3 },
        { label: '解锁', value: 4 },
        { label: '代付', value: 5 },
        { label: '失败', value: 6 },
        { label: '代付中', value: 7 },
        { label: '人工加代付', value: 8 },
      ],

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogChangeVisible: false,
      dialogChangeLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        update: '编辑用户备注',
        create: '添加用户层级',
      },

      // 家族
      dialogFamilyVisible: false,
      dialogFamilyLoading: false,
      dialogFamilyValue: null,
      dialogFamilyOptions: [],

      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },

      withdrawOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      timerList: [
        { label: '5秒', value: 5 },
        { label: '10秒', value: 10 },
        { label: '30秒', value: 30 },
        { label: '1分钟', value: 60 },
        { label: '3分钟', value: 180 },
        { label: '5分钟', value: 300 },
        { label: '10分钟', value: 600 },
        { label: '不刷新', value: -1 },
      ],
      timerType: -1,
      num: 0,
    }
  },
  created() {
    this.listQuery.uid = this.$route.query.uid
    this.fetchData()
  },
  mounted() {
    clearInterval(this.timer)
    this.refresh()
  },
  activated() {
    this.refresh()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // 刷新
    refreshData() {
      this.list = null
      this.listLoading = true
      let flagTime = this.listQuery.flagTime
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        status: null,
        familyIds: null,
        pickerValue: [],
        withdrawValue: [],
        flagTime
      }
      this.pickerValue = [NOW_TIME_START, NOW_TIME_END]
      this.fetchData()
    },
    // 刷新
    refresh() {
      this.num = this.timerType
      clearInterval(this.timer)
      if (this.num == -1) return
      const _this = this
      this.timer = setInterval((num) => {
        _this.num = this.num - 1
        if (this.num === 0) {
          this.num = this.timerType
          this.fetchData()
        }
      }, 1016)
    },

    // multipleDate: [],
    selRoleChangeHand(val) {
      // 获取到选中行的数据
      this.listQuery.pickerValue = val
    },
    // 表单模型
    //  createModel: {
    //    id:null,
    //    uid: 0,
    //    nickname: null,
    //    typeDetail: null,
    //    failReason: null
    //   },
    resetCreateModel() {
      this.createModel = {
        id: null,
        uid: 0,
        nickname: null,
        typeDetail: null,
        failReason: null,
      }
    },

    // handleDownload() {
    //   this.downloadLoading = true
    //   import('@/vendor/Export2Excel').then(excel => {
    //     const tHeader = ['主播id', '实际提现金额', '花费魅力', '手续费', '家族名称','银行卡号或支付宝账号', '真实姓名', '开户银行', '开户行支行', '开户省','开户市','状态', '失败原因', '创建时间', '审核时间', '操作人']
    //     const filterVal = ['uid', 'cash', 'anchorCoin', 'fee','familyName','cardNo','trueName','bankName','bankSub', 'bankProvince','bankCity','status','failReason','gmtCreate','gmtComplete', 'operator']
    //     const list = this.list
    //     const data = this.formatJson(filterVal, list)
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: this.filename,
    //       autoWidth: this.autoWidth,
    //       bookType: this.bookType
    //     })
    //     this.downloadLoading = false
    //   })
    // },
    // formatJson(filterVal, jsonData) {
    //   return jsonData.map(v => filterVal.map(j => {
    //     debugger;
    //     if (j === 'gmtCreate') {
    //       return new Date(v[j])
    //     } if (j === 'gmtComplete' && v[j] != null) {
    //       return new Date(v[j])
    //     } else {
    //       return v[j]
    //     }
    //   }))
    // },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.familyList = null
      if (this.listQuery.flagTime == 0) {
        delete this.listQuery.withdrawValue
        this.listQuery.pickerValue = this.pickerValue
      } else {
        delete this.listQuery.pickerValue
        this.listQuery.withdrawValue = this.pickerValue
      }

      // 获取家族列表
      getUserFamilyList()
        .then((res) => {
          console.log('1', res)
          this.familyList = (res.data.list || []).map((item) => {
            return {
              value: item.bossId || 0,
              label: nullS(item.familyName),
            }
          })
          this.todayListLoading = true
          return getWithdrawAnchor(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          )
        })
        .then((res) => {
          console.log('2', res)
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
          // 获取魅力体现列表
          return getWithdrawAnchorList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          )
        })
        .then((res) => {
          console.log('3', res)
          this.list = ((res.data !== null && res.data.list) || []).map(
            (item) => {
              var cashString = item.cash.toLocaleString()
              var anchorCoinString = item.anchorCoin.toLocaleString()
              var statusString = ''
              if (item.status == 0) {
                statusString = '待审核'
              } else if (item.status == 1) {
                statusString = '人工'
              } else if (item.status == 2) {
                statusString = '驳回'
              } else if (item.status == 3) {
                statusString = '锁定中'
              } else if (item.status == 4) {
                statusString = '已解锁'
              } else if (item.status == 5) {
                statusString = '代付'
              } else if (item.status == 6) {
                statusString = '代付失败'
              } else if (item.status == 7) {
                statusString = '代付中'
              }
              var withdrawWayString = ''
              if (item.withdrawWay == 1) {
                withdrawWayString = '银行卡'
              } else if (item.withdrawWay == 2) {
                withdrawWayString = '支付宝'
              }
              var familyName = '暂无家族'
              for (const family of this.familyList) {
                if (family.value == item.familyId) {
                  familyName = family.label
                  break
                }
              }
              this.$set(item, 'anchorCoinString', anchorCoinString)
              this.$set(item, 'cashString', cashString)
              this.$set(item, 'familyName', familyName)
              this.$set(item, 'statusString', statusString)
              this.$set(item, 'withdrawWayString', withdrawWayString)
              this.$set(item, 'gmtCreateString', formatUnixTime(item.gmtCreate))
              this.$set(
                item,
                'gmtCompleteString',
                formatUnixTime(item.gmtComplete)
              )
              return item
            }
          )
          this.listQuery.total = (res.data !== null && res.data.total) || 0
          this.listLoading = false
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
          this.familyList = null
          console.log(err)
          this.$message.error(err)
        })
    },

    // 解决输入框无法输入的问题
    change(e) {
      this.$forceUpdate()
    },

    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'update'
      this.createModel = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 显示新建弹出窗
    showCreateDialogClick() {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'create'
      /* this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        }); */
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogCreateLoading = true
          const params = {
            id: formDic.id,
            uid: formDic.uid,
            failReason: nullS(formDic.failReason),
          }
          if (this.dialogStatus === 'create') {
            createHierarchyUser(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建用户层级成功',
                  type: 'success',
                  duration: 1500,
                })
                setTimeout((_) => {
                  this.fetchData()
                }, 200)
              })
              .catch((err) => {
                this.dialogCreateLoading = false
                this.$message.error(err)
              })
          } else {
            updateUsesRemark1(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改用户备注成功',
                  type: 'success',
                  duration: 1500,
                })
                setTimeout((_) => {
                  this.fetchData()
                }, 200)
              })
              .catch((err) => {
                this.dialogCreateLoading = false
                this.$message.error(err)
              })
          }
        }
      })
    },

    checkAnchorPassClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      if (row.status > 0) {
        this.$message.error('已审核，请勿重复操作')
        return
      }
      const rowDic = Object.assign({}, row)

      this.$confirm('是否通过？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          checkUserStatus(rowDic.id, rowDic.uid, 1, 2)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '处理成功',
                type: 'success',
                duration: 1500,
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

    multipleDateClick() {
      if (this.listQuery.pickerValue.length == 0) {
        this.$message.error('请勾选数据')
        return
      }
      const date = this.listQuery.pickerValue

      this.$confirm('是否通过？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          multipleDate(date)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '处理成功',
                type: 'success',
                duration: 1500,
              })
              this.listQuery.pickerValue = []
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
    // 核准魅力值
    charmUpdateDialogClick(row) {
      if (row.uid == null || row.uid < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('是否核准魅力值？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          flagSureAnchorCoin(row.uid)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '提交成功',
                type: 'success',
                duration: 1500,
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

    checkUserAgentClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      if (row.status > 0) {
        this.$message.error('已审核，请勿重复操作')
        return
      }

      /* if (row.status == 1 || row.status == 2 || row.status == 5) {
        this.$message.error('已审核，请勿重复操作');
        return;
      } */

      const rowDic = Object.assign({}, row)
      this.$confirm('是否代付处理？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          checkAgentPayStatus(rowDic.id, rowDic.uid, 1, 2)
            .then((res) => {
              this.listLoading = false
              if (res.code === 200) {
                this.$notify({
                  title: '提示',
                  message: res.message || '操作成功',
                  type: 'success',
                })
                setTimeout((_) => {
                  this.fetchData()
                }, 200)
              }
            })
            .catch((err) => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => { })
    },

    checkAnchorRefuseClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      if (row.status == 1 || row.status == 2 || row.status == 5) {
        this.$message.error('已审核，请勿重复操作')
        return
      }
      const rowDic = Object.assign({}, row)

      this.$confirm('是否驳回？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          checkUserStatus(rowDic.id, rowDic.uid, 2, 2)
            .then((res) => {
              this.listLoading = false
              if (res.code === 200) {
                this.$notify({
                  title: '提示',
                  message: '驳回成功',
                  type: 'success',
                })
                setTimeout((_) => {
                  this.fetchData()
                }, 200)
              }
            })
            .catch((err) => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => { })
    },
    handleSearchFilter2(val, arr = [NOW_TIME_START, NOW_TIME_END]) {
      if (val == 1) {
        delete this.listQuery.pickerValue
        this.listQuery.withdrawValue = this.pickerValue
      } else {
        delete this.listQuery.withdrawValue
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
    },
  },
}
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
</style>
