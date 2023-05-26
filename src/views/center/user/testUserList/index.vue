<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
        <span class="search_info">更新时间:</span>
        <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
          :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm:ss" value-format="timestamp" :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter" />
      </el-form-item> -->
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" style="width: 130px" class="input-with-select"
          placeholder="请输入用户ID" clearable oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.agentId" size="small" style="width: 130px" class="input-with-select"
          placeholder="请输入代理ID" clearable oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.nickName" size="small" style="width: 140px" class="input-with-select"
          placeholder="请输入用户昵称" clearable maxlength="10" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter" />
      </el-form-item>
      <!-- <el-form-item>
        <el-input
          v-model="listQuery.channelName"
          size="small"
          style="width: 170px"
          class="input-with-select"
          placeholder="请输入渠道链接"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item> -->
      <!-- <el-form-item>
        <el-input
          v-model="listQuery.pChannelUrl"
          size="small"
          style="width: 170px"
          class="input-with-select"
          placeholder="请输入上级渠道链接"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <el-input v-model="listQuery.account" size="small" style="width: 180px" class="input-with-select"
          placeholder="请输入手机号码或邮箱" clearable @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.userType" style="width: 145px" size="small" placeholder="请选择用户标签">
          <el-option key="00" label="全部" value="" />
          <el-option v-for="item in logstypeOptions" :key="item.code" :label="item.categoryName" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-refresh" @click="handleSearchFilter('reset')">重置</el-button>
      </el-form-item>

    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="handleShowtesttUser">
          添加测试用户
        </el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" size="mini">
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column label="用户ID" min-width="130">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="昵称" min-width="100" />

      <!--  <el-table-column prop="bossName" label="家族名称" min-width="100"  ></el-table-column> -->
      <!--  <el-table-column prop="account" label="电话号码" min-width="90"  ></el-table-column> -->
      <el-table-column prop="goldCoin" label="余额" min-width="120" />
      <el-table-column prop="userLevel" label="用户等级" min-width="70" />
      <el-table-column prop="userExp" label="用户经验" min-width="80" />
      <el-table-column prop="name" label="用户层级" min-width="70" />
      <el-table-column prop="sendCoin" label="送出金币" min-width="70" />
      <el-table-column prop="gameQuota" label="游戏娱乐后提现额度" min-width="170" />
      <el-table-column prop="drawQuota" label="游戏娱乐已提取额度" min-width="170" />
      <el-table-column prop="need" label="用户当前需要流水" min-width="130" />
      <el-table-column prop="allNow" label="用户当前游戏流水" min-width="130" />
      <el-table-column prop="liveNow" label="用户当前消费" min-width="100" />
      <el-table-column prop="channelName" label="渠道链接" min-width="100" />
      <el-table-column prop="pChannelUrl" label="上级渠道链接" min-width="100" />
      <el-table-column prop="agentId" label="代理Id" min-width="100" />
      <el-table-column prop="categoryName" label="用户标签" min-width="100" />
      <el-table-column prop="typeDetail" label="添加备注" width="100" />
      <el-table-column prop="gmtCreateString" label="更新时间" width="140" />
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="{ row }">
          <el-dropdown trigger="hover">
            <span class="el-dropdown-link">
              <span class="operation_btn" type="primary" size="mini"> 操作 </span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="showUpdateDialogClick2(row)">修改用户标签</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="showUpdateDialogClick(row)">重置密码</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="showChangeDialogClick(row)">设置流水</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="showUpdateDialogClick1(row)">添加备注</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="showChangeActivityDialogClick(row)">
                  清除活动优惠流水
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="showBindAgentIdClick(row)">
                  {{ (row.agentId ? "修改" : "绑定") + "代理ID" }}
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <!-- 新建编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
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
      :destroy-on-close="true">
      <div v-cloading="dialogChangeLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" size="medium">
          <el-form-item label="用户昵称" prop="nickName"><el-input v-model="createModel.nickName" :disabled="true" clearable
              placeholder="请输入用户昵称" maxlength="200" /></el-form-item>
          <el-form-item label="用户流水" prop="turnover">
            <el-input v-model.number="createModel.turnover" clearable placeholder="请输入流水" maxlength="200" />
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
      :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading1" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
          <el-form-item label="用户昵称" prop="nickName"><el-input v-model="createModel.nickName" :disabled="true" clearable
              placeholder="请输入用户昵称" maxlength="200" /></el-form-item>
          <el-form-item prop="typeDetail" label="备注"><el-input v-model="createModel.typeDetail" type="textarea"
              clearable placeholder="备注" maxlength="10000" @input="change($event)" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible1 = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 测试用户 -->
    <el-dialog :title="'修改用户标签'" :visible.sync="dialogCreateVisible2" :close-on-click-modal="false"
      :destroy-on-close="true" top="5vh" width="35%">
      <div v-cloading="dialogCreateLoading1" style="width: 100%; height: 100%">
        <el-form ref="dataForm2" :model="createModel2" :rules="rules2" label-position="top" label-width="120px"
          size="medium">
          <el-form-item label="用户ID" prop="uid"><el-input v-model="createModel2.uid" :disabled="true"
              maxlength="200" /></el-form-item>
          <el-form-item label="用户昵称" prop="nickName"><el-input v-model="createModel2.nickName" :disabled="true"
              maxlength="200" /></el-form-item>
          <el-form-item prop="typeDetail" label="用户标签">
            <el-select v-model="createModel2.userType" style="width: 100%" size="small" placeholder="请选择用户标签">
              <el-option v-for="item in logstypeOptions" :key="item.code" :label="item.categoryName"
                :value="item.code" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible2 = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick2()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'绑定代理ID'" :visible.sync="dialogAgentIdVisible" :close-on-click-modal="false"
      :destroy-on-close="true" top="5vh" width="35%">
      <div v-cloading="dialogAgentIdLoading" style="width: 100%; height: 100%">
        <el-form ref="dataAgentIdForm" :model="createAgentIdModel" :rules="agentIdRules" label-position="top"
          label-width="120px" size="medium">
          <el-form-item label="代理ID" prop="agentId"><el-input v-model="createAgentIdModel.agentId" clearable
              oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入代理ID" /></el-form-item>
          <el-form-item label="备注" prop="remarks"><el-input v-model="createAgentIdModel.remakes" type="textarea"
              clearable placeholder="请输入备注" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogAgentIdVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataAgentId()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加测试用户" :visible.sync="dialogChangeTestVisible" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div v-cloading="dialogChangeTestLoading" style="width: 100%; height: 100%">
        <el-form ref="dataplusTestUserIdForm" :model="createTestUserChangeModel" :rules="plusTestUserIdRules"
          label-position="top" label-width="180px" size="medium" @submit.native.prevent>
          <el-form-item label="用户ID/手机号/昵称" prop="queryParam"><el-input
              v-model="createTestUserChangeModel.queryParam" name="queryParam" clearable
              placeholder="请输入用户的ID/手机号/昵称" @keyup.enter.native="handleClickChangeTest">
              <template slot="append">
                <div @click="handleClickChangeTest">搜索</div>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <el-table v-cloading="listTestersLoading" :data="listTesters" height="200" size="mini">
          <el-table-column prop="uid" label="用户ID" />
          <el-table-column prop="nickName" label="昵称" />
          <el-table-column prop="account" label="手机号" />
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="{ row }">
              <el-select v-model="changeUserType" style="width: 140px" size="small" placeholder="请选择用户标签" @change="
                  (e) => {
                    onselectChange(e, row);
                  }
                ">
                <el-option v-for="item in logstypeOptions" :key="item.code" :label="item.categoryName"
                  :value="item.code" />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="handleClosetestUser">关闭</el-button>
        <!-- <el-button
          size="medium"
          type="primary"
          @click="handleClickChangeTest"
        >确认</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTestUserAssetsList,
  getUserCategoryList,
  getnormalUserToTestUser,
  updateCashPassword,
  updateUsesRemark,
  changeUserTurnover,
  changeUserActivityTurnover,
  updateUser,
  updateUserAgentId,
} from '@/api/center/assets/assets'

import { nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
let {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: 'TestUserListIndex',
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
    var checkWater = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('用户流水不能为0'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value < 1) {
            callback(new Error('用户流水不可小于1'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    return {
      list: null,
      listLoading: true,
      listTesters: null,
      listTestersLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        nickName: null,
        account: null,
        userType: '',
        familyIds: null,
        anchorCoin: null,
        goldCoin: null,
        status: null,
        pickerValue: [NOW_TIME_START, NOW_TIME_END],
        pChannelUrl: null,
        channelName: null,
        agentId: null,
      },
      familyList: null,
      rules: {
        uid: [{ required: true, message: '用户id', trigger: 'blur' }],
        turnover: [{ validator: checkWater, trigger: 'blur', required: true }],
        /*  cashPassword: [{ required: true, message: '提现密码不能为空', trigger: 'blur' }] */
      },
      rules2: {
        uid: [{ required: true, message: '用户id', trigger: 'blur' }],
        userType: [
          { required: true, message: '请选择是否为测试用户', trigger: 'blur' },
        ],
      },
      agentIdRules: {
        agentId: [{ required: true, message: '请输入代理ID', trigger: 'blur' }],
      },
      plusTestUserIdRules: {
        queryParam: [
          {
            required: true,
            message: '请输入ID/手机号/昵称',
            trigger: 'blur',
          },
        ],
      },
      logstypeOptions: [],
      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogChangeVisible: false,
      dialogChangeLoading: false,

      dialogCreateVisible1: false,
      dialogCreateLoading1: false,
      dialogChangeVisible1: false,
      dialogChangeLoading1: false,
      dialogCreateVisible2: false,
      dialogCreateLoading2: false,

      dialogStatus: '',
      dialogTitleMap: {
        update: '修改提现密码',
        change: '设置流水',
        changeActivity: '清除活动流水',
      },
      dialogTitleMap1: {
        update: '编辑用户备注',
        change: '设置流水',
        changeActivity: '清除活动优惠流水',
      },
      // familyList: null,
      // 家族
      dialogFamilyVisible: false,
      dialogFamilyLoading: false,
      dialogFamilyValue: null,
      dialogFamilyOptions: [],
      // 绑定代理ID
      dialogAgentIdVisible: false,
      dialogAgentIdLoading: false,
      // 绑定代理ID
      dialogChangeTestVisible: false,
      dialogChangeTestLoading: false,
      // 表单模型
      createModel: {
        uid: 0,
        cashPassword: null,
        failReason: null,
      },
      createAgentIdModel: {},
      // 表单模型1
      createModel2: {
        uid: 0,
        userType: null,
      },
      // 表单模型
      changeModel: {
        uid: null,
        turnover: null,
      },
      // 搜索正式用户
      createTestUserChangeModel: {},
      changeUserType: null,
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
      this.list = null
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        status: null,
        familyIds: null,
        anchorCoin: null,
        goldCoin: null,
        pickerValue: [],
        agentId: null,
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
    async fetchData() {
      this.listLoading = true
      this.familyList = null
      // 只执行第一次
      if (!this.logstypeOptions.length) {
        // 1 正确用户 2 测试用户
        const userTypeRes = await getUserCategoryList({ pid: 2 })
        this.logstypeOptions = userTypeRes.data || []
      }
      const pickerValue = this.listQuery.pickerValue

      getTestUserAssetsList({
        ...this.listQuery,
        startTime: pickerValue ? pickerValue[0] : undefined,
        endTime: pickerValue ? pickerValue[1] : undefined,
        pageNum: this.listQuery.page,
        pageSize: this.listQuery.limit,
        queryParam: this.createTestUserChangeModel.queryParam,
      })
        .then((res) => {
          this.list = (res.data.list || res.data || []).map((item) => {
            this.$set(item, 'gmtCreateString', formatUnixTime(item.gmtUpdate))
            item.categoryName = '正式用户'
            this.logstypeOptions.map((ctype) => {
              if (ctype.code == item.userType) {
                item.categoryName = ctype.categoryName
              }
            })
            return item
          })
          this.listQuery.total = res.data.total
          this.listLoading = false
          // 重置搜索ID
          this.createTestUserChangeModel = {}
        })
        .catch((err) => {
          this.list = null
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
        userType: null,
        cashPassword: null,
        failReason: null,
      }
    },

    change(e) {
      this.$forceUpdate()
    },
    showUpdateDialogClick2(row) {
      this.resetCreateModel()
      this.dialogCreateVisible2 = true
      this.dialogStatus = 'update'
      if (row.categoryName && row.categoryName === '正式用户') {
        row.userType = ''
      } else {
        row.userType = row.userType + ''
      }
      row.userType = row.userType + ''
      this.createModel2 = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm2'].clearValidate()
      })
    },
    handleDataClick2() {
      this.$refs['dataForm2'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel2)
          // 请求服务器
          this.dialogCreateLoading2 = true
          const params = {
            uid: formDic.uid,
            userType: formDic.userType,
          }
          updateUser(params)
            .then((res) => {
              this.dialogCreateLoading2 = false
              this.dialogCreateVisible2 = false
              this.$notify({
                title: '提示',
                message: '操作成功',
                type: 'success',
                duration: 1500,
              })
              setTimeout((_) => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.dialogCreateLoading2 = false
              this.$message.error(err)
            })
        }
      })
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
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
                  message: '修改用户活动流水成功',
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
        }
      })
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
    showChangeActivityDialogClick(row) {
      this.resetChangeModel()
      this.dialogChangeVisible = true
      this.dialogStatus = 'changeActivity'
      this.createModel = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 绑定代理ID
    showBindAgentIdClick(row) {
      this.createAgentIdModel = {}
      this.dialogAgentIdVisible = true
      this.createAgentIdModel = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataAgentIdForm'].clearValidate()
      })
    },
    handleDataAgentId() {
      this.$refs['dataAgentIdForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createAgentIdModel)
          // 请求服务器
          this.dialogAgentIdLoading = true
          const params = {
            uid: formDic.uid,
            agentId: formDic.agentId,
            operator: this.$store.state.user.name,
            remakes: formDic.remakes,
          }
          updateUserAgentId(params)
            .then((res) => {
              this.dialogAgentIdLoading = false
              this.dialogAgentIdVisible = false
              this.$notify({
                title: '提示',
                message: '操作成功',
                type: 'success',
                duration: 1500,
              })
              setTimeout((_) => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.dialogAgentIdLoading = false
              this.$message.error(err)
            })
        }
      })
    },
    handleClickChangeTest() {
      this.$refs['dataplusTestUserIdForm'].validate((valid) => {
        if (valid) {
          this.listTestersLoading = true
          getnormalUserToTestUser(
            this.createTestUserChangeModel.queryParam
          ).then((res) => {
            this.listTesters = res.data || []
            this.listTestersLoading = false
          })
        }
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

    // 过滤
    handleSearchFilter(type) {
      this.listQuery.page = 1
      if (type === 'reset') {
        this.listQuery = {
          page: 1,
          limit: this.listQuery.limit,
          pickerValue: [NOW_TIME_START, NOW_TIME_END]
        }
      }
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
    onselectChange(e, row) {
      this.changeUserType = e
      const params = {
        uid: row.uid,
        userType: e,
      }
      this.listTestersLoading = true
      updateUser(params).then((res) => {
        this.$notify({
          title: '提示',
          message: '操作成功',
          type: 'success',
          duration: 1500,
        })
        this.listTestersLoading = false
      })
    },
    handleShowtesttUser() {
      this.dialogChangeTestVisible = true
      this.createTestUserChangeModel = {}
    },
    handleClosetestUser() {
      this.listTesters = []
      this.dialogChangeTestVisible = false
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
