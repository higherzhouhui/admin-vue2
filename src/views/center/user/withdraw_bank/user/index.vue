<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true" class="searchFormWrapper">
      <!-- <el-form-item>
        <span class="search_info">审核时间:</span>
        <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
          :picker-options="withdrawOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="left" format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" value-format="timestamp"
          @change="handleSearchFilter" />
      </el-form-item> -->
      <el-form-item>
        <el-select v-model="listQuery.status" size="small" placeholder="请选择支付状态" clearable @change="handleSearchFilter">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.coinStatus" size="small" placeholder="请选择金币区间" clearable
          @change="handleSearchFilter">
          <el-option v-for="item in coinStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" style="width: 150px" class="input-with-select"
          placeholder="请输入用户ID" clearable maxlength="20" oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
          <!-- <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.trueName" size="small" style="width: 205px" class="input-with-select"
          placeholder="请输入提款人姓名" clearable maxlength="200" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter">
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter" /> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.orderNo" size="small" style="width: 205px" class="input-with-select"
          placeholder="请输入订单号" clearable maxlength="200" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter">
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter" /> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.cardNo" size="small" style="width: 180px" class="input-with-select"
          placeholder="请输入银行卡号" clearable maxlength="50" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter">
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter" /> -->
        </el-input>
      </el-form-item>
      <!--        <span style="margin: 5px;"></span>-->

      <el-form-item>
        <el-input v-model="listQuery.minCoin" size="small" style="width: 180px" class="input-with-select"
          placeholder="请输入小于当前金币" clearable maxlength="20" oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.bigCoin" size="small" style="width: 180px" class="input-with-select"
          placeholder="请输入大于当前金币" clearable maxlength="20" oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" plain icon="el-icon-refresh" @click="refreshData()">重置</el-button>
      </el-form-item>
      <el-form-item class="export_btn">
        <el-button :loading="downloadLoading" size="small" type="primary" icon="el-icon-document"
          @click="handleDownload">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
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
        <span size="mini" plain type="primary" :loading="todayListLoading">总花费金币:
          <b>{{ todayList.length ? todayList[0].totalCoin.toLocaleString() : 0 }}</b></span>
      </el-form-item>
    </el-form>
    <!-- <div style="margin-bottom: 20px;display: flex;justify-content: space-between;align-items: center;"> -->
    <!--    <div id="app" style="margin-bottom: 20px;display: flex;align-items: center;">-->
    <!--      <el-button :loading="downloadLoading" style="margin-left:0 0 0px 0px;" type="primary" icon="el-icon-document" @click="handleDownload">导出Excel</el-button>-->
    <!-- <div style="">提现审核时间</div> //buttone.visible=false -->

    <!--  <el-button style="margin: 10px" type="primary" @click="changeStart()">开启大象代付通道</el-button> -->
    <!-- <el-button style="margin: 10px" type="danger" @click="changeStop()">关闭代付A通道</el-button> -->
    <!--  <el-button style="margin: 10px" type="primary" @click="vankeStart()">开启东风代付通道</el-button>
     <el-button style="margin: 10px" type="primary" @click="buttonStart()">开启新时代代付通道</el-button> -->
    <!-- <el-button style="margin: 10px" type="primary" @click="buttonSixStart()">开启聯發代付通道:{{ message }}</el-button> -->
    <!--  <span style="color:#F00 ;font-size:25px">状态:{{ message }}</span> -->
    <!--  <el-button style="margin: 10px" type="danger" @click="buttonStop()">关闭代付B通道</el-button> -->
    <!--    </div>-->

    <el-table v-cloading="listLoading" :data="list" size="mini">
      <!-- <el-table-column type="expand">
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
      </el-table-column>
 -->
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="用户ID" min-width="110">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="cashString" label="实际提现金额(VND）" min-width="160" sortable />
      <el-table-column prop="categoryName" label="用户标签" min-width="120">
        <template slot-scope="{ row }">
          <div :class="getLabelName(row.userType).class">{{ getLabelName(row.userType).name }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="goldCoin" label="花费金币" min-width="100" sortable />
      <el-table-column prop="orderNo" label="订单号" min-width="140" />
      <el-table-column prop="withdrawCount" label="提现次数" min-width="100" sortable />
      <!-- <el-table-column prop="fee" label="手续费(%)" min-width="80"  ></el-table-column> -->
      <!-- <el-table-column label="提现渠道" width="75"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.withdrawWay | wayFilter">{{ row.withdrawWayString }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column prop="cardNo" label="银行账号" min-width="120" />
      <el-table-column prop="trueName" label="真实姓名" min-width="80" />
      <el-table-column prop="bankName" label="开户银行" min-width="80" />
      <el-table-column prop="name" label="用户层级" min-width="70" />
      <el-table-column label="状态" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.status | statusFilter">{{
            row.statusString
          }}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="failReason" label="失败原因" min-width="80"  ></el-table-column> -->
      <el-table-column prop="merchantName" label="代付商户" width="70" />
      <el-table-column prop="gmtCreateString" label="创建时间" width="140" />
      <el-table-column prop="gmtCompleteString" label="审核时间" width="140" />
      <!--   <el-table-column label="用户标识" width="80"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.flag | flagFilter">{{ row.flagString }}</el-tag>
        </template>
      </el-table-column> -->
      <!--  <el-table-column prop="typeName" label="类型名称" min-width="60"  ></el-table-column> -->

      <el-table-column prop="failReason" label="备注" min-width="150" label-width="auto" />
      <el-table-column prop="operator" label="操作人" min-width="70" />
      <!--  <el-table-column prop="typeDetail" label="备注" min-width="600"   label-width="auto" ></el-table-column> -->

      <el-table-column v-if="$store.getters.buttonPermission.includes('用户出款审核操作')" label="操作" width="70" fixed="right">
        <template slot-scope="{ row }">
          <!-- <el-popover v-if="row.status !== 3" trigger="hover" placement="left">
            <div style="margin-bottom: 6px">
              <el-button size="mini" type="primary" @click="checkUserAgentClick(row)">代付</el-button>
              <el-button size="mini" type="warning" @click="checkLockOkStatus(row)">锁定</el-button>
              <el-button size="mini" type="success" @click="checkUserPassClick(row)">人工</el-button>
            </div>
            <el-button size="mini" type="danger" @click="checkUserRefuseClick(row)">
              驳回
            </el-button>
            <el-button size="mini" type="" @click="showUpdateDialogClick(row)">
              备注
            </el-button>
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
                <div @click="checkUserAgentClick(row)">代付</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="checkLockOkStatus(row)">锁定</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="checkUserPassClick(row)">人工</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="checkUserRefuseClick(row)">驳回</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="showUpdateDialogClick(row)">备注</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-if="false" v-cloading="todayListLoading" :data="todayList" size="mini">
      <!-- 展开 -->
      <el-table-column type="expand" />

      <el-table-column type="" label="" width="60" />
      <el-table-column label="" min-width="100" />
      <!-- <el-table-column prop="totalAmount" label="总金额" min-width="80"  ></el-table-column> -->
      <el-table-column prop="totalCoin" label="总金币" min-width="100" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column label="" width="80" />
      <el-table-column prop="" label="" min-width="120" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column label="" width="80" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column prop="" label="" width="140" />
      <el-table-column prop="" label="" width="140" />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column label="" width="300" />
    </el-table>

    <!-- 新建编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true" top="5vh" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
          <el-form-item prop="uid" label="用户id"><el-input v-model="createModel.uid" clearable placeholder="用户id"
              maxlength="20" /></el-form-item>
          <el-form-item prop="failReason" label="备注"><el-input v-model="createModel.failReason" type="textarea"
              clearable placeholder="备注" maxlength="10000" @input="change($event)" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import {
  getWithdrawUserList,
  checkUserStatus,
  updateUsesRemark1,
  checkAgentStatus,
  checkLockStatus,
  setPayStatus,
  getWithdrawUser,
  getAisleStatus,
} from '@/api/center/user/withdraw_bank'
import { nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
import { createHierarchyUser } from '@/api/center/hierarchy/hierarchy'
import { getUserCategoryList } from '@/api/center/assets/assets'
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: 'CenterBankWithdrawUserController',
  filters: {
    statusFilter(status) {
      const map = { 0: 'info', 1: 'success', 2: 'danger', 5: 'success' }
      return map[status]
    },
    coinStatusFilter(status) {
      const map = {
        1: 'info',
        2: 'success',
        3: 'danger',
        4: 'info',
        5: 'success',
      }
      return map[status]
    },
    wayFilter(status) {
      const map = { 1: 'success', 2: '' }
      return map[status]
    },
    flagFilter(status) {
      const map = { 0: 'success', 1: 'danger' }
      return map[status]
    },
  },
  components: {
    UserDrawer,
  },
  data() {
    return {
      list: [],
      listLoading: true,
      message: null,
      todayList: [],
      downloadLoading: false,
      labelOptionList: [],
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        status: null,
        statusOptions: null,
        bigCoin: null,
        minCoin: null,
        pickerValue: [],
        withdrawValue: [],
        downloadLoading: false,
        filename: '',
        autoWidth: true,
        bookType: 'xlsx',
        display: '0',
        trueName: null,
        cardNo: null,
        orderNo: null,
      },
      createModel: {
        id: null,
        uid: 0,
        nickname: null,
        typeDetail: null,
        failReason: null,
      },
      rules: {
        uid: [{ required: true, message: '请输入用户ID', trigger: 'change' }],
      },

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

      timer: null, // 定时器名称
      // 状态选择
      statusOptions: [
        { label: '待审核', value: 0 },
        { label: '人工', value: 1 },
        { label: '已驳回', value: 2 },
        { label: '锁定中', value: 3 },
        { label: '代付', value: 5 },
        { label: '失败', value: 6 },
        { label: '代付中', value: 7 },
        { label: '人工加代付', value: 8 },
      ],
      coinStatusOptions: [
        { label: '1000及以下', value: 1 },
        { label: '1001-2000', value: 2 },
        { label: '2001-5000', value: 3 },
        { label: '5001-10000', value: 4 },
        { label: '10000以上', value: 5 },
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
  computed: {
    initTimer() {
      return this.$store.getters.timerDate
    }
  },
  created() {
    this.listQuery.pickerValue = this.initTimer
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
  // mounted() {
  //   if	(this.timer) {
  //     clearInterval(this.timer);
  //   } else {  this.timer = setInterval(()=>{
  //     this.fetchData();
  //     }, 30000);
  //   }
  // },

  // beforeDestroy(){
  //   clearInterval(this.timer);
  // },

  methods: {
    // 刷新
    refreshData() {
      this.list = null
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        status: null,
        pickerValue: this.initTimer,
      }
      this.fetchData()
      this.num = this.timerType
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

    // const timer = setInterval(() =>{
    //     // 某些定时器操作
    // }, 5000);
    // // 通过$once来监听定时器
    // // 在beforeDestroy钩子触发时清除定时器
    // this.$once('hook:beforeDestroy', () => {
    //     clearInterval(timer);
    // })

    // 获取列表数据
    async fetchData() {
      this.listLoading = true
      this.todayListLoading = true
      this.message = null
      if (!this.labelOptionList.length) {
        const res = await getUserCategoryList({})
        this.labelOptionList = res.data || []
      }
      getAisleStatus().then((res) => {
        if (
          res.data != null &&
          res.data != undefined &&
          JSON.stringify(res.data) != '{}'
        ) {
          var status = null
          status = res.data
          if (status === '3') {
            this.message = '  已开启  '
          } else {
            this.message = '  已关闭  '
          }
          //  console.log(this.message)
        }
      })
      getWithdrawUser(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      ).then((res) => {
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
        // 获取金币体现列表
      })
      getWithdrawUserList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      )
        .then((res) => {
          this.list = (res.data != null ? res.data.list : []).map((item) => {
            var statusString = ''
            var labelStr = this.getLabelName(item.userType).name

            var cashString = item.cash.toLocaleString()
            if (item.status == 0) {
              statusString = '待审核'
            } else if (item.status == 1) {
              statusString = '人工'
            } else if (item.status == 2) {
              statusString = '已驳回'
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

            // var flagString ='';
            // if(item.flag==1){
            //   flagString ="风险用户";
            // }else if(item.flag==0){
            //    flagString ="正常用户";
            // }
            this.$set(item, 'cashString', cashString)
            this.$set(item, 'statusString', statusString)
            this.$set(item, 'labelStr', labelStr)
            this.$set(item, 'withdrawWayString', withdrawWayString)
            this.$set(item, 'gmtCreateString', formatUnixTime(item.gmtCreate))
            this.$set(
              item,
              'gmtCompleteString',
              formatUnixTime(item.gmtComplete)
            )
            return item
          })
          this.listQuery.total = res.data != null ? res.data.total : 0
          this.listLoading = false
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
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
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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

    checkUserPassClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      if (row.status == 1 || row.status == 2 || row.status == 5) {
        this.$message.error('已审核，请勿重复操作')
        return
      }
      // if (row.status == 3) {
      //   this.$message.error('已锁定，请先解锁');
      //   return;
      // }
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
          checkUserStatus(rowDic.id, rowDic.uid, 1, 1)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '审核成功',
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
        .catch(() => {})
    },

    checkUserAgentClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      if (
        row.status == 1 ||
        row.status == 2 ||
        row.status == 5 ||
        row.status == 7 ||
        row.status == 6
      ) {
        this.$message.error('已审核，请勿重复操作')
        return
      }
      // if (row.status == 3) {
      //   this.$message.error('已锁定，请先解锁');
      //   return;
      // }
      const rowDic = Object.assign({}, row)

      this.$confirm('是否使用代付处理？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          checkAgentStatus(rowDic.id, rowDic.uid, 1, 1)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '审核成功',
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
        .catch(() => {})
    },

    checkUserRefuseClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      if (row.status == 1 || row.status == 2 || row.status == 5) {
        this.$message.error('已审核，请勿重复操作')
        return
      }
      // if (row.status == 3) {
      //   this.$message.error('已锁定，请先解锁');
      //   return;
      // }
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
          checkUserStatus(rowDic.id, rowDic.uid, 2, 1)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '驳回成功',
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
        .catch(() => {})
    },

    checkLockOkStatus(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      if (row.status == 1 || row.status == 2 || row.status == 5) {
        this.$message.error('已审核，请勿重复操作')
        return
      }
      // if (row.status == 3) {
      //   this.$message.error('已锁定，请勿重复操作');
      //   return;
      // }
      const rowDic = Object.assign({}, row)

      this.$confirm('是否锁定该订单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          checkLockStatus(rowDic.id, 3)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '锁定成功',
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
        .catch(() => {})
    },
    getLabelName(type) {
      const flist = this.labelOptionList.filter((item) => {
        return item.code == type
      })
      const obj = {
        name: '普通',
        class: 'mkeyi',
      }
      if (flist.length) {
        obj.name = flist[0].categoryName
        if (type == 1) {
          obj.class = 'mputong'
        }
        if (type == 9) {
          obj.class = 'mdaili'
        }
        if (type == 10) {
          obj.class = 'mteyao'
        }
        if (type == 11) {
          obj.class = 'myouzhi'
        }
      }
      return obj
    },
    // checkLockFailStatus(row) {
    //   if (row.id == null || row.id < 0) {
    //     this.$message.error('参数错误');
    //     return;
    //   }
    //   if (row.status == 1 || row.status == 2) {
    //     this.$message.error('已审核，请勿重复操作');
    //     return;
    //   }
    //   if (row.status == 0) {
    //     this.$message.error('待操作状态,请勿解锁');
    //     return;
    //   }
    //   if (row.status == 4) {
    //     this.$message.error('已解锁，请勿重复操作');
    //     return;
    //   }
    //   const rowDic = Object.assign({}, row);

    //   this.$confirm('是否解锁该订单？', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //     showClose: false
    //   })
    //     .then(() => {
    //       // 请求网络
    //       this.listLoading = true;
    //       checkLockStatus(rowDic.id, 4)
    //         .then(res => {
    //           this.listLoading = false;
    //           this.$notify({
    //             title: '提示',
    //             message: '解锁成功',
    //             type: 'success',
    //             duration: 1500
    //           });
    //           setTimeout(_ => {
    //             this.fetchData();
    //           }, 200);
    //         })
    //         .catch(err => {
    //           this.listLoading = false;
    //           this.$message.error(err);
    //         });
    //     })
    //     .catch(() => {});
    // },
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }

      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          '用户ID',
          '实际提现金额',
          '花费金币',
          '订单号',
          '手续费',
          '银行卡号',
          '真实姓名',
          '开户银行',
          '状态',
          '失败原因',
          '审核人',
          '申请时间',
          '审核时间',
        ]
        const filterVal = [
          'uid',
          'cashString',
          'goldCoin',
          'orderNo',
          'fee',
          'cardNo',
          'trueName',
          'bankName',
          'statusString',
          'failReason',
          'operator',
          'gmtCreateString',
          'gmtCompleteString',
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType,
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j]

          /* debugger;
          if (j === 'gmtCreate') {
            return formatUnixTime(v[j]);
          }
          if (j === 'gmtComplete' && v[j] != null) {
            return formatUnixTime(v[j]);
          }
          if (j === 'status' && v[j] != null) {
            if (v[j] === '0') {
              return '待审核';
            } else if (v[j] === 1) {
              return '人工';
            } else if (v[j] === 2) {
              return '已驳回';
            } else if (v[j] === 3) {
              return '锁定中';
            } else if (v[j] === 5) {
              return '已代付';
            }
            return v[j];
          } else {
            return v[j];
          } */
        })
      )
    },
    changeStart() {
      this.$confirm('是否开启大象代付？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          setPayStatus(1)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '开启成功',
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
        .catch(() => {})
    },

    vankeStart() {
      this.$confirm('是否开启万科代付？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          setPayStatus(4)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '开启成功',
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
        .catch(() => {})
    },

    changeStop() {
      this.$confirm('是否关闭代付通道A？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          setPayStatus(2)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '关闭成功',
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
        .catch(() => {})
    },

    buttonStart() {
      this.$confirm('是否开启新时代代付?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          setPayStatus(2)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '开启成功',
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
        .catch(() => {})
    },

    buttonSixStart() {
      this.$confirm('是否开启六福代付?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          setPayStatus(3)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '开启成功',
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
        .catch(() => {})
    },

    buttonSixStart() {
      this.$confirm('是否开启聯發代付?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          setPayStatus(3)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '开启成功',
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
        .catch(() => {})
    },

    buttonJHStart() {
      this.$confirm('是否开启蓝苏打代付?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          setPayStatus(3)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '开启成功',
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
        .catch(() => {})
    },

    buttonStop() {
      this.$confirm('是否关闭代付通道B？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          setPayStatus(4)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '关闭成功',
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
        .catch(() => {})
    },

    // 过滤
    handleSearchFilter() {
      this.listQuery.page = 1
      this.fetchData()
      this.num = this.timerType
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
