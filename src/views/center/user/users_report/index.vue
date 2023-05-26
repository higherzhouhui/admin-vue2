<template>
  <div class="app-container">
    <!--  <el-button size="medium" type="primary" icon="el-icon-edit-outline" @click="showChangeDialogClick()">设置用户流水</el-button>
        <el-button size="medium" type="primary" icon="el-icon-edit-outline" @click="showChangeActivityDialogClick()">清除用户活动流水</el-button> -->
    <div class="flex-top-center">
      <div>
         <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter">
          <el-form-item>
            <span>存款时间</span>
          </el-form-item>
        </DatePicker>
        <DatePicker v-model="listQuery.pickerValue2" @change="handleSearchFilter">
          <el-form-item>
            <span>注册时间</span>
          </el-form-item>
        </DatePicker>

        <el-form :inline="true">
          <!-- <el-form-item> -->
          <!-- <el-tag type="info">充值时间:</el-tag> -->
          <!-- <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
            :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
            align="right" format="yyyy-MM-dd HH:mm:ss" value-format="timestamp" :default-time="['00:00:00', '23:59:59']"
            @change="handleSearchFilter" />
        </el-form-item> -->
          <el-form-item>
            <el-input v-model="listQuery.uid" size="small" style="width: 170px" class="input-with-select"
              placeholder="请输入用户ID" clearable oninput="value=value.replace(/[^\d]/g,'')"
              @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="listQuery.nickName" size="small" style="width: 170px" class="input-with-select"
              placeholder="请输入用户昵称" clearable maxlength="10" @keyup.enter.native="handleSearchFilter"
              @clear="handleSearchFilter" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="listQuery.account" size="small" style="width: 170px" class="input-with-select"
              placeholder="请输入手机号码" clearable maxlength="15" @keyup.enter.native="handleSearchFilter"
              @clear="handleSearchFilter" />
          </el-form-item>
          <!--      <el-form-item>-->
          <!--        <el-select v-model="listQuery.bindType" style="width: 150px" clearable placeholder="请选择来源" size="small" @change="handleSearchFilter">-->
          <!--          <el-option-->
          <!--            v-for="item in bindTypeItem"-->
          <!--            :key="item.value"-->
          <!--            :label="item.label"-->
          <!--            :value="item.value"-->
          <!--          />-->
          <!--        </el-select>-->
          <!--      </el-form-item>-->
          <el-form-item>
            <el-input v-model="listQuery.pChannel" size="small" style="width: 170px" class="input-with-select"
              placeholder="请输入父级渠道链接" clearable @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="listQuery.channel" size="small" style="width: 170px" class="input-with-select"
              placeholder="请输入渠道链接" clearable @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
          </el-form-item>
          <!--      <el-form-item>-->
          <!--        <el-select v-model="listQuery.orderBy" style="width: 150px" clearable placeholder="请选择排序" size="small" @change="handleSearchFilter">-->
          <!--          <el-option-->
          <!--            v-for="item in options"-->
          <!--            :key="item.value"-->
          <!--            :label="item.label"-->
          <!--            :value="item.value"-->
          <!--          />-->
          <!--        </el-select>-->
          <!--      </el-form-item>-->
          <br>
          <el-form-item>
            <el-input v-model="listQuery.minCoin" size="small" style="width: 170px" class="input-with-select"
              placeholder="请输入小于当前金币" clearable maxlength="20" oninput="value=value.replace(/[^\d]/g,'')"
              @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
              <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="listQuery.bigCoin" size="small" style="width: 170px" class="input-with-select"
              placeholder="请输入大于当前金币" clearable maxlength="20" oninput="value=value.replace(/[^\d]/g,'')"
              @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
              <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
            <el-button size="small" icon="el-icon-refresh" @click="refreshData">重置</el-button>
          </el-form-item>
        </el-form>
      </div>


      <el-button :loading="downloadLoading" size="small" type="primary" icon="el-icon-document" @click="handleDownload">
        导出Excel
      </el-button>
    </div>
    <!-- :header-cell-style="{background:'#eef1f6',color:'#606266'}" -->
    <el-table v-cloading="listLoading" :data="list" size="mini" @sort-change="tableSortChange">
      <el-table-column label="用户ID" min-width="120">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column width="95" prop="telephone" label="手机号" />
      <!--      <el-table-column prop="bindTypeString" label="来源" min-width="100"   />-->
      <el-table-column prop="name" label="用户层级" />
      <el-table-column prop="userLevel" label="用户等级" />
      <el-table-column prop="pChannelurl" label="父级渠道链接" min-width="100" />
      <el-table-column prop="channelurl" label="渠道链接" min-width="120" />
      <el-table-column sortable="custom" prop="totalConsumeString" label="总消费(金币)" min-width="120" />
      <el-table-column sortable="custom" prop="configBankGoldCoin1" label="公司总入款(金币)" min-width="140" />
      <!--      <el-table-column sortable="custom" prop="totalUSDTGoldString" label="USDT总入款(金币)" min-width="150"   />-->
      <el-table-column sortable="custom" prop="rechargeMoney1" label="入款优惠(金币)" min-width="125" />
      <!--      <el-table-column sortable="custom" prop="totalUSDTRewardGoldString" label="USDT入款总优惠(金币)" min-width="170"   />-->
      <el-table-column sortable="custom" prop="payGoldCoin1" label="线上总存款(金币)" min-width="140" />
      <el-table-column sortable="custom" prop="Toto1" label="总存款(金币)" min-width="120">
        <!--  <template slot-scope="{row}">
            <span>{{ `${ row.configBankGoldCoin + row.payGoldCoin}`}}</span>
          </template> -->
      </el-table-column>
      <el-table-column sortable="custom" prop="withdrawGoldCoin1" label="总出款(金币)" min-width="120" />
      <el-table-column sortable="custom" prop="betAmount1" label="总彩票流水(金币)" min-width="140" />
      <el-table-column sortable="custom" prop="handsel1" label="总活动彩金(金币)" min-width="140" />
      <el-table-column sortable="custom" prop="totalBalanceString" label="总盈亏(金币)" min-width="130" />
      <el-table-column sortable="custom" prop="goldCoinString" label="余额(金币)" min-width="130" />
      <el-table-column prop="loginTimeString" label="最后登录时间" min-width="145" />
      <el-table-column prop="registerTimeString" label="注册时间" min-width="145" />
      <el-table-column prop="gmtCreateString" label="充值时间" min-width="145" />
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <!-- 新建编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true" top="5vh" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
          <!--  <el-form-item prop="n" label="用户呢称:"><el-input v-model="createModel.nickname" clearable placeholder="提现密码" maxlength="10" /></el-form-item> -->
          <el-form-item label="用户昵称" prop="nickName"><el-input v-model="createModel.nickName" :disabled="true" clearable
              placeholder="请输入用户昵称" maxlength="200" /></el-form-item>
          <el-form-item prop="cashPassword" label="提现密码:"><el-input v-model="createModel.cashPassword" clearable
              placeholder="提现密码" maxlength="10" oninput="value=value.replace(/[^\d]/g,'')" /></el-form-item>
          <el-form-item prop="pwd" label="设置登陆密码:"><el-input v-model="createModel.pwd" clearable placeholder="设置登陆密码"
              maxlength="10" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="updateCashPasswordClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新建/编辑 消息公告 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogChangeVisible" :close-on-click-modal="false"
      :destroy-on-close="true" width="35%">
      <div v-cloading="dialogChangeLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="changeModel" :rules="rules" label-position="top" size="medium">
          <!-- <el-form-item label="用户ID" prop="chinese"><el-input :disabled="true" v-model="createModel.uid" clearable placeholder="请输入用户ID" maxlength="100" /></el-form-item> -->
          <el-form-item label="用户昵称" prop="nickName"><el-input v-model="createModel.nickName" :disabled="true" clearable
              placeholder="请输入用户昵称" maxlength="200" /></el-form-item>
          <el-form-item label="用户流水">
            <el-input v-model="createModel.turnover" clearable placeholder="请输入流水" maxlength="200" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogChangeVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleChangeDataClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新建编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap1[dialogStatus]" :visible.sync="dialogCreateVisible1" :close-on-click-modal="false"
      :destroy-on-close="true" top="5vh" width="35%">
      <div v-cloading="dialogCreateLoading1" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
          <!-- <el-form-item prop="uid" label="用户id"><el-input :disabled="true" v-model="createModel.uid" clearable placeholder="用户id" maxlength="20" /></el-form-item> -->
          <el-form-item label="用户昵称" prop="nickName"><el-input v-model="createModel.nickName" :disabled="true" clearable
              placeholder="请输入用户昵称" maxlength="200" /></el-form-item>
          <el-form-item prop="typeDetail" label="备注"><el-input v-model="createModel.typeDetail" type="textarea" clearable
              placeholder="备注" maxlength="10000" @input="change($event)" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible1 = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUser_report_List,
  updateCashPassword,
  updateUsesRemark,
  getHierarchyList,
  getUserFamilyList,
  changeUserTurnover,
  changeUserActivityTurnover,
} from '@/api/center/assets/assets'
import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: 'CenterUserAssetsController',
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
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        nickName: null,
        account: null,
        userId: 1,
        familyIds: null,
        anchorCoin: null,
        goldCoin: null,
        status: null,
        orderBy: null,
        bigCoin: null,
        minCoin: null,
        bindType: null,
        pickerValue: [NOW_TIME_START, NOW_TIME_END],
        pickerValue2: [],
        channel: null,
        pChannel: null,
        orderField: null,
      },
      downloadLoading: false,
      rules: {
        uid: [{ required: true, message: '用户id', trigger: 'blur' }],
        /*  cashPassword: [{ required: true, message: '提现密码不能为空', trigger: 'blur' }] */
      },
      logstypeOptions: [
        { value: 1, label: '会员' },
        { value: 2, label: '主播' },
        { value: 3, label: '家族长' },
        { value: 4, label: '全部' },
      ],
      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogChangeVisible: false,
      dialogChangeLoading: false,

      dialogCreateVisible1: false,
      dialogCreateLoading1: false,
      dialogChangeVisible1: false,
      dialogChangeLoading1: false,

      dialogStatus: '',
      dialogTitleMap: {
        update: '修改提现密码',
        change: '设置流水',
        changeActivity: '清除活动流水',
      },
      dialogTitleMap1: {
        update: '编辑用户备注',
        change: '设置流水',
        changeActivity: '清除活动流水',
      },

      familyList: null,

      // 家族
      dialogFamilyVisible: false,
      dialogFamilyLoading: false,
      dialogFamilyValue: null,
      dialogFamilyOptions: [],

      // 表单模型
      createModel: {
        uid: 0,
        cashPassword: null,
        failReason: null,
      },
      options: [
        {
          value: 0,
          label: '总出款从高到低',
        },
        {
          value: 1,
          label: '总出款从低到高',
        },
        {
          value: 2,
          label: '总入款从高到低',
        },
        {
          value: 3,
          label: '总入款从低到高',
        },
      ],
      bindTypeItem: [
        {
          value: 0,
          label: '自然推广',
        },
        {
          value: 1,
          label: '用户推广',
        },
        {
          value: 2,
          label: '渠道推广',
        },
      ],
      /*   cellStyle(row,column,rowIndex,columnIndex){//根据报警级别显示颜色
             //  console.log("nidemade d ekdnkjfaskjf");
               //console.log(row.column);

             if( row.column.label ==="V8游戏盈亏(金币)"&& eval(row.row.kyCoin1) - eval(row.row.kyCoin) < 0 ){
                      return 'background:red'
              }else if( row.column.label ==="V8游戏盈亏(金币)"&& eval(row.row.kyCoin1) - eval(row.row.kyCoin) > 0 ){
                       return 'background:yellow'
              }else if( row.column.label ==="彩票盈亏(金币)"&& eval(row.row.realProfitAmount) - eval(row.row.betAmount) < 0 ){
                      return 'background:red'
              }else if( row.column.label ==="彩票盈亏(金币)"&& eval(row.row.realProfitAmount) - eval(row.row.betAmount) > 0 ){
                       return 'background:yellow'
              }

            }, */
      // 表单模型
      changeModel: {
        uid: null,
        turnover: null,
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
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 刷新
    refreshData() {
      this.list = []
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        status: null,
        familyIds: null,
        anchorCoin: null,
        goldCoin: null,
        channel: null,
        pickerValue: [NOW_TIME_START, NOW_TIME_END],
        pickerValue2: []
      }
      this.fetchData()
    },
    // 重新设置表单数据
    resetChangeModel() {
      this.changeModel = {
        uid: null,
        turnover: null,
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.familyList = null
      this.listLoading = true
      return getUser_report_List(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      )
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            let bindTypeString = ''
            if (item.bindType === 0) {
              bindTypeString = '自然增长'
            } else if (item.bindType === 1) {
              bindTypeString = '用户推广'
            } else if (item.bindType === 2) {
              bindTypeString = '渠道推广'
            }
            this.$set(
              item,
              'rechargeMoney1',
              item.configBankGoldCoin +
              item.goldCoinUsdt -
              item.rechargeMoney -
              item.rechargeMoneyUsdt +
              (item.adminLotterySum || 0)
            ) // 入款优惠
            this.$set(
              item,
              'configBankGoldCoin1',
              item.rechargeMoney + item.rechargeMoneyUsdt
            )
            this.$set(item, 'payGoldCoin1', item.payGoldCoin)
            this.$set(item, 'withdrawGoldCoin1', item.withdrawGoldCoin)
            this.$set(item, 'handsel1', item.handsel)
            this.$set(
              item,
              'Toto1',
              item.configBankGoldCoin + item.payGoldCoin + item.goldCoinUsdt
            )
            this.$set(item, 'betAmount1', item.betAmount)
            this.$set(item, 'gmtCreateString', formatUnixTime(item.gmtUpdate))
            this.$set(item, 'bindTypeString', bindTypeString)
            this.$set(item, 'loginTimeString', formatUnixTime(item.loginTime))
            this.$set(
              item,
              'registerTimeString',
              formatUnixTime(item.registerTime)
            )
            this.$set(item, 'totalConsumeString', item.totalConsume)
            this.$set(item, 'totalBalanceString', item.totalBalance)
            this.$set(item, 'goldCoinString', item.goldCoin)
            this.$set(item, 'totalUSDTGoldString', item.totalUSDTGold)
            this.$set(
              item,
              'totalUSDTRewardGoldString',
              item.totalUSDTRewardGold
            )
            return item
          })
          this.listQuery.total = res.data.total
          this.listLoading = false
        })
        .catch((err) => {
          this.list = []
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        uid: 0,
        userId: null,
        cashPassword: null,
        failReason: null,
      }
    },

    change(e) {
      this.$forceUpdate()
    },

    // 显示修改密码弹出窗
    showUpdateDialogClick(row) {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'update'
      this.createModel = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 创建/更新 数据
    handleChangeDataClick() {
      const formDic = Object.assign({}, this.createModel)
      const params = {
        uid: formDic.uid,
        turnover: formDic.turnover,
      }
      // 请求服务器
      this.dialogChangeVisible = true
      if (this.dialogStatus === 'change') {
        changeUserTurnover(params)
          .then((res) => {
            this.dialogChangeLoading = false
            this.dialogChangeVisible = false
            this.$notify({
              title: '提示',
              message: '修改用户流水成功',
              type: 'success',
              duration: 1500,
            })
            setTimeout((_) => {
              this.fetchData()
            }, 200)
          })
          .catch((err) => {
            this.dialogChangeLoading = false
            this.$message.error(err)
          })
      } else if (this.dialogStatus === 'changeActivity') {
        changeUserActivityTurnover(params)
          .then((res) => {
            this.dialogChangeLoading = false
            this.dialogChangeVisible = false
            this.$notify({
              title: '提示',
              message: '修改用户流水成功',
              type: 'success',
              duration: 1500,
            })
            setTimeout((_) => {
              this.fetchData()
            }, 200)
          })
          .catch((err) => {
            this.dialogChangeLoading = false
            this.$message.error(err)
          })
      }
    },

    // 修改用户备注
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogCreateLoading1 = true
          const params = {
            uid: formDic.uid,
            typeDetail: nullS(formDic.typeDetail),
          }
          updateUsesRemark(params)
            .then((res) => {
              this.dialogCreateLoading1 = false
              this.dialogCreateVisible1 = false
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
              this.dialogCreateLoading1 = false
              this.$message.error(err)
            })
        }
      })
    },

    // 显示备注弹出窗
    showUpdateDialogClick1(row) {
      this.resetCreateModel()
      this.dialogCreateVisible1 = true
      this.dialogStatus = 'update'
      this.createModel = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 显示编辑弹出窗
    showChangeDialogClick(row) {
      this.resetChangeModel()
      this.dialogChangeVisible = true
      this.dialogStatus = 'change'
      this.createModel = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示编辑弹出窗
    showChangeActivityDialogClick() {
      this.resetChangeModel()
      this.dialogChangeVisible = true
      this.dialogStatus = 'changeActivity'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新提现密码
    updateCashPasswordClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)

          // 请求服务器
          this.dialogCreateLoading = true
          const params = {
            uid: formDic.uid,
            cashPassword: formDic.cashPassword,
            pwd: formDic.pwd,
          }
          updateCashPassword(params)
            .then((res) => {
              this.dialogCreateLoading = false
              this.dialogCreateVisible = false
              this.$notify({
                title: '提示',
                message: '修改成功',
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
          '用户ID',
          '手机号',
          '用户层级',
          '父级渠道链接',
          '渠道链接',
          '总消费(金币)',
          '公司总入款(金币)',
          'USDT总入款(金币)',
          '入款优惠(金币)',
          'USDT入款总优惠(金币)',
          '线上总存款(金币)',
          '总存款(金币)',
          '总出款(金币)',
          '总彩票流水(金币)',
          '总活动彩金(金币)',
          '总盈亏(金币)',
          '余额(金币)',
          '最后登录时间',
          '注册时间',
          '充值时间',
        ]
        const filterVal = [
          'uid',
          'telephone',
          'name',
          'pChannelurl',
          'channelurl',
          'totalConsumeString',
          'configBankGoldCoin1',
          'totalUSDTGoldString',
          'rechargeMoney1',
          'totalUSDTRewardGoldString',
          'payGoldCoin1',
          'Toto1',
          'withdrawGoldCoin1',
          'betAmount1',
          'handsel1',
          'totalBalanceString',
          'goldCoinString',
          'loginTimeString',
          'registerTimeString',
          'gmtCreateString',
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
        })
      )
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
    commenAreat(val) {
      if (val.order === 'ascending') {
        this.$set(this.listQuery, 'orderBy', 1)
      } else if (val.order === 'descending') {
        this.$set(this.listQuery, 'orderBy', 0)
      } else {
        this.$set(this.listQuery, 'orderBy', null)
        this.$set(this.listQuery, 'orderField', null)
      }
    },
    // 后端排序
    tableSortChange(val) {
      this.$set(this.listQuery, 'page', 1)
      // 总出款
      if (val.prop === 'withdrawGoldCoin1') {
        this.$set(this.listQuery, 'orderField', 'withdrawGoldCoin')
        this.commenAreat(val)
      }
      // 公司总入款
      if (val.prop === 'configBankGoldCoin1') {
        this.$set(this.listQuery, 'orderField', 'rechargeMoneyTotal')
        this.commenAreat(val)
      }
      // 优惠金额
      if (val.prop === 'rechargeMoney1') {
        this.$set(this.listQuery, 'orderField', 'rechargeMoneyDiscount')
        this.commenAreat(val)
      }
      // 线上总存款
      if (val.prop === 'payGoldCoin1') {
        this.$set(this.listQuery, 'orderField', 'payGoldCoin')
        this.commenAreat(val)
      }
      // 总存款
      if (val.prop === 'Toto1') {
        this.$set(this.listQuery, 'orderField', 'totalRecharge')
        this.commenAreat(val)
      }
      // 总彩票流水
      if (val.prop === 'betAmount1') {
        this.$set(this.listQuery, 'orderField', 'betAmount')
        this.commenAreat(val)
      }
      // 总活动彩金
      if (val.prop === 'handsel1') {
        this.$set(this.listQuery, 'orderField', 'handsel')
        this.commenAreat(val)
      }
      // 总盈亏
      if (val.prop === 'totalBalanceString') {
        this.$set(this.listQuery, 'orderField', 'totalBalance')
        this.commenAreat(val)
      }
      // 余额
      if (val.prop === 'goldCoinString') {
        this.$set(this.listQuery, 'orderField', 'goldCoin')
        this.commenAreat(val)
      }
      // 总消费
      if (val.prop === 'totalConsumeString') {
        this.$set(this.listQuery, 'orderField', 'totalConsume')
        this.commenAreat(val)
      }
      // usdt总入款
      if (val.prop === 'totalUSDTGoldString') {
        this.$set(this.listQuery, 'orderField', 'totalUSDTGold')
        this.commenAreat(val)
      }
      // usdt入款总优惠
      if (val.prop === 'totalUSDTRewardGoldString') {
        this.$set(this.listQuery, 'orderField', 'totalUSDTRewardGold')
        this.commenAreat(val)
      }
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
