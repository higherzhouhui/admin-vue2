<template>
  <div class="app-container">
    <!--  <el-button size="medium" type="primary" icon="el-icon-edit-outline" @click="showChangeDialogClick()">设置用户流水</el-button>
        <el-button size="medium" type="primary" icon="el-icon-edit-outline" @click="showChangeActivityDialogClick()">清除用户活动流水</el-button> -->
    <DatePicker v-model="pickerValue" @change="handleSearchFilter2($event)">
      <el-form-item>
        <!-- 筛选状态 -->
        <el-select v-model="listQuery.flagTime" size="small" placeholder="请选择启禁状态" @change="handleSearchFilter2()">
          <el-option v-for="item in flagOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </DatePicker>
    <el-form :inline="true" class="searchFormWrapper">
      <!-- <el-form-item>
        <span class="search_info">注册时间</span>
        <el-date-picker v-model="listQuery.registerTime" size="small" clearable type="datetimerange"
          :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm:ss" value-format="timestamp" :default-time="['00:00:00', '23:59:59']"
          class="w-330" @change="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <span class="search_info">更新时间</span>
        <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
          :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm:ss" value-format="timestamp" class="w-330"
          :default-time="['00:00:00', '23:59:59']" @change="handleSearchFilter" />
      </el-form-item> -->
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" style="width: 130px" class="input-with-select"
          placeholder="请输入用户ID" clearable oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.nickName" size="small" style="width: 140px" class="input-with-select"
          placeholder="请输入用户昵称" clearable maxlength="10" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.agentId" size="small" style="width: 130px" class="input-with-select"
          placeholder="请输入代理ID" clearable oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.agentLevel" size="small" style="width: 150px" class="input-with-select"
          placeholder="请输入代理等级" clearable oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>

      <el-form-item>
        <el-input v-model="listQuery.channelName" size="small" style="width: 170px" class="input-with-select"
          placeholder="请输入渠道链接" clearable @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.pChannelUrl" size="small" style="width: 170px" class="input-with-select"
          placeholder="请输入上级渠道链接" clearable @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.account" size="small" style="width: 180px" class="input-with-select"
          placeholder="请输入手机号码" clearable @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        </el-input>
      </el-form-item>
      <!--   <span style="margin: 5px;"></span>
        <el-input
          size="small"
          style="width: 240px;"
          v-model="listQuery.goldCoin"
          class="input-with-select"
          placeholder="请输入大于当前金币"
          clearable
          maxlength="10"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
          oninput="value=value.replace(/[^\d]/g,'')"
        >
         <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button>
        </el-input>  -->
      <!--  <el-input
          size="small"
          style="width: 240px;"
          v-model="listQuery.anchorCoin"
          class="input-with-select"
          placeholder="请输入大于当前魅力值"
          clearable
          maxlength="10"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
          oninput="value=value.replace(/[^\d]/g,'')"
        >-->
      <!--   <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
      <!-- </el-input> -->
      <el-form-item>
        <el-select v-model="listQuery.familyIds" size="small" style="width: 140px" clearable placeholder="请选择用户层级"
          @change="handleSearchFilter" @clear="handleSearchFilter">
          <el-option v-for="item in familyList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <span class="search_info">用户类型</span>
        <!-- 多选家族搜索 -->
        <!-- <el-select size="medium" style="width: 300px;" v-model="listQuery.familyIds" multiple filterable clearable placeholder="请输入或选择家族" @clear="handleSearchFilter">
            <el-option v-for="item in familyList" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select> -->
        <el-select v-model="listQuery.userId" style="width: 100px" size="small" placeholder="请选择用户类型"
          @change="handleSearchFilter" @clear="handleSearchFilter">
          <el-option v-for="item in logstypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <!-- 多选家族搜索 -->
        <!-- <el-select size="medium" style="width: 300px;" v-model="listQuery.familyIds" multiple filterable clearable placeholder="请输入或选择家族" @clear="handleSearchFilter">
            <el-option v-for="item in familyList" :label="item.label" :key="item.value" :value="item.value"></el-option>
          </el-select> -->
        <span class="search_info">上线提醒</span>
        <el-select v-model="listQuery.onlineFlag" style="width: 150px" size="small" placeholder="请选择上线提醒"
          @change="handleSearchFilter" @clear="handleSearchFilter">
          <el-option label="全部" :value="null" />
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <span class="search_info">用户标签</span>
        <el-select v-model="listQuery.userType" style="width: 150px" size="small" placeholder="请选择用户标签"
          @change="handleSearchFilter" @clear="handleSearchFilter">
          <el-option key="00" label="全部" :value="null" />
          <el-option v-for="item in labelOptionList" :key="item.code" :label="item.categoryName" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="refreshData">重置</el-button>
      </el-form-item>
      <el-form-item class="export_btn">
        <el-button :loading="downloadLoading" size="small" type="primary" icon="el-icon-document"
          @click="handleDownload">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" size="mini">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="用户层级">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="渠道链接">
              <span>{{ props.row.channelName }}</span>
            </el-form-item>
            <el-form-item label="上级渠道链接">
              <span>{{ props.row.pChannelUrl }}</span>
            </el-form-item>
            <el-form-item label="所属代理">
              <span>{{ props.row.agentId }}</span>
            </el-form-item>
            <el-form-item label="代理等级">
              <span>{{ props.row.agentLevel }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.typeDetail }}</span>
            </el-form-item>
            <el-form-item label="注册时间">
              <span>{{ formatUnixTime(props.row.createTime) }}</span>
            </el-form-item>
            <el-form-item label="首充时间">
              <span>{{ formatUnixTime(props.row.firstDepositTime) }}</span>
            </el-form-item>
            <el-form-item label="更新时间">
              <span>{{ formatUnixTime(props.row.gmtUpdate) }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column label="用户ID" min-width="130">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column label="上线提醒" min-width="130">
        <template slot-scope="{ row }">
          {{ row.onlineFlag == 1 ? "是" : "否" }}
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="showId"
        label="会员账号"
        min-width="110"

      /> -->
      <el-table-column prop="nickName" label="昵称" min-width="100" />

      <!--  <el-table-column prop="bossName" label="家族名称" min-width="100"  ></el-table-column> -->
      <!--  <el-table-column prop="account" label="电话号码" min-width="90"  ></el-table-column> -->
      <el-table-column prop="goldCoin" label="余额" min-width="120" sortable />
      <!-- <el-table-column prop="anchorLevel" label="主播等级" min-width="80"  ></el-table-column>
      <el-table-column prop="anchorExp" label="主播经验" min-width="80"  ></el-table-column> -->
      <el-table-column prop="userLevel" label="用户等级" min-width="95" sortable />
      <el-table-column prop="userExp" label="用户经验" min-width="120" />
      <el-table-column prop="userType" label="用户标签" min-width="150">
        <template slot-scope="{ row }">
          <el-select v-model="row.userType" style="width: 130px" :class="getLabelName(row.userType).class" size="small"
            @change="(e) => { onselectChange(e, row) }">
            <el-option v-for="item in labelOptionList" :key="item.code" :label="item.categoryName" :value="item.code * 1"
              style="color: #000" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="sendCoin" label="送出金币" sortable min-width="95" />
      <el-table-column prop="gameQuota" label="游戏娱乐后提现额度" min-width="160" sortable />
      <el-table-column prop="drawQuota" label="游戏娱乐已提取额度" min-width="160" sortable />
      <el-table-column prop="need" label="用户当前需要流水" min-width="145" sortable />
      <el-table-column prop="allNow" label="用户当前游戏流水" min-width="145" sortable />
      <el-table-column prop="liveNow" label="用户当前消费" min-width="120" sortable />
      <el-table-column label="操作" width="60" fixed="right">
        <template slot-scope="{ row }">
          <!-- <el-popover trigger="hover" placement="left">
            <div class="operation_btn" style="margin-bottom: 12px" type="danger" @click="showUpdateDialogClick(row)">
              重置密码</div>
            <div class="operation_btn" style="margin-bottom: 12px" type="warning" @click="showChangeDialogClick(row)">
              设置流水</div>
            <div class="operation_btn" style="margin-bottom: 12px" type="success" @click="showUpdateDialogClick1(row)">
              添加备注</div>
            <div class="operation_btn" style="margin-bottom: 12px" type="primary"
              @click="showChangeActivityDialogClick(row)">
              清除活动优惠流水
            </div>
            <div class="operation_btn" style="margin-bottom: 12px" @click="showBindAgentIdClick(row)">
              {{ (row.agentId ? "修改" : "绑定") + "代理ID" }}
            </div>
            <div slot="reference" class="name-wrapper">
              <div class="operation_btn" style="margin-bottom: 12px">操作</div>
            </div>
          </el-popover> -->
          <el-dropdown trigger="hover">
            <span class="el-dropdown-link">
              <span class="operation_btn" type="primary" size="mini"> 操作 </span>
            </span>
            <el-dropdown-menu slot="dropdown">
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
              <el-dropdown-item>
                <div @click="checkOnlineFlag(row)">
                  {{ row.onlineFlag == 1 ? "取消标记" : "上线标记" }}
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
          <!--  <el-form-item prop="n" label="用户呢称:"><el-input v-model="createModel.nickname" clearable placeholder="提现密码" maxlength="10" /></el-form-item> -->
          <el-form-item label="用户昵称" prop="nickName"><el-input v-model="createModel.nickName" :disabled="true" clearable
              placeholder="请输入用户昵称" maxlength="200" /></el-form-item>
          <el-form-item prop="cashPassword" label="提现密码:"><el-input v-model="createModel.cashPassword" clearable
              placeholder="提现密码" maxlength="6" oninput="value=value.replace(/[^\d]/g,'')" /></el-form-item>
          <el-form-item prop="pwd" label="设置登陆密码:"><el-input v-model="createModel.pwd" clearable placeholder="设置登陆密码"
              maxlength="12" /></el-form-item>
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
          <!-- <el-form-item label="用户ID" prop="chinese"><el-input :disabled="true" v-model="createModel.uid" clearable placeholder="请输入用户ID"  /></el-form-item> -->
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
          <!-- <el-form-item prop="uid" label="用户id"><el-input :disabled="true" v-model="createModel.uid" clearable placeholder="用户id" maxlength="20" /></el-form-item> -->
          <el-form-item label="用户昵称" prop="nickName"><el-input v-model="createModel.nickName" :disabled="true" clearable
              placeholder="请输入用户昵称" maxlength="200" /></el-form-item>
          <el-form-item prop="typeDetail" label="备注"><el-input v-model="createModel.typeDetail" type="textarea" clearable
              placeholder="备注" maxlength="50" show-word-limit @input="change($event)" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible1 = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 测试用户 -->
    <el-dialog :title="'修改测试用户'" :visible.sync="dialogCreateVisible2" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading1" style="width: 100%; height: 100%">
        <el-form ref="dataForm2" :model="createModel2" :rules="rules2" label-position="top" label-width="120px"
          size="medium">
          <el-form-item label="用户昵称" prop="nickName"><el-input v-model="createModel2.nickName" :disabled="true" clearable
              placeholder="请输入用户昵称" maxlength="200" /></el-form-item>
          <el-form-item prop="typeDetail" label="是否为测试用户">
            <el-select v-model="createModel2.userType">
              <el-option :label="'是'" :value="88" />
              <el-option :label="'否'" :value="1" />
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
      :destroy-on-close="true">
      <div v-cloading="dialogAgentIdLoading" style="width: 100%; height: 100%">
        <el-form ref="dataAgentIdForm" :model="createAgentIdModel" :rules="agentIdRules" label-position="top"
          label-width="120px" size="medium">
          <el-form-item label="代理ID" prop="agentId"><el-input v-model="createAgentIdModel.agentId" clearable
              oninput="value=value.replace(/[^\d]/g,'')" placeholder="请输入代理ID" /></el-form-item>
          <el-form-item label="备注" prop="remarks"><el-input v-model="createAgentIdModel.remakes" type="textarea"
              maxlength="50" show-word-limit clearable placeholder="请输入备注" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogAgentIdVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataAgentId()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAssetsList,
  updateCashPassword,
  updateUsesRemark,
  getHierarchyList,
  changeUserTurnover,
  changeUserActivityTurnover,
  updateUser,
  updateUserAgentId,
  getUserCategoryList,
  updateOnlineFlag
} from '@/api/center/assets/assets'
import { nullS, formatUnixTime, getDateTime } from '@/utils/tools'
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
    }
  },
  components: {
    UserDrawer
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
      pickerValue: [NOW_TIME_START, NOW_TIME_END],
      formatUnixTime,
      list: [],
      listLoading: true,
      downloadLoading: false,
      flagOptions: [
        { label: '注册时间', value: 0 },
        { label: '更新时间', value: 1 }
      ],
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        nickName: null,
        account: null,
        userId: 4,
        familyIds: null,
        anchorCoin: null,
        goldCoin: null,
        status: null,
        pickerValue: [],
        registerTime: [],
        firstDepositTime: [],
        pChannelUrl: null,
        channelName: null,
        agentId: null,
        agentLevel: null,
        userType: null,
        flagTime: 0,
        onlineFlag: null
      },
      familyList: [],
      rules: {
        uid: [{ required: true, message: '用户id', trigger: 'blur' }],
        turnover: [{ validator: checkWater, trigger: 'blur', required: true }]
        /*  cashPassword: [{ required: true, message: '提现密码不能为空', trigger: 'blur' }] */
      },
      rules2: {
        uid: [{ required: true, message: '用户id', trigger: 'blur' }],
        userType: [
          { required: true, message: '请选择是否为测试用户', trigger: 'blur' }
        ]
      },
      agentIdRules: {
        agentId: [{ required: true, message: '请输入代理ID', trigger: 'blur' }]
      },
      logstypeOptions: [
        { value: 1, label: '会员' },
        { value: 2, label: '主播' },
        { value: 3, label: '家族长' },
        { value: 4, label: '全部' }
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
      dialogCreateVisible2: false,
      dialogCreateLoading2: false,

      dialogStatus: '',
      dialogTitleMap: {
        update: '修改提现密码',
        change: '设置流水',
        changeActivity: '清除活动流水'
      },
      dialogTitleMap1: {
        update: '编辑用户备注',
        change: '设置流水',
        changeActivity: '清除活动优惠流水'
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
      // 表单模型
      createModel: {
        uid: 0,
        cashPassword: null,
        failReason: null
      },
      createAgentIdModel: {},
      // 表单模型1
      createModel2: {
        uid: 0,
        userType: null
      },
      // 表单模型
      changeModel: {
        uid: null,
        turnover: null
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
      labelOptionList: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 刷新
    refreshData() {
      const flagTime = this.listQuery.flagTime
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        nickName: null,
        account: null,
        userId: 4,
        familyIds: null,
        anchorCoin: null,
        goldCoin: null,
        status: null,
        pickerValue: [],
        registerTime: [],
        firstDepositTime: [],
        pChannelUrl: null,
        channelName: null,
        agentId: null,
        agentLevel: null,
        userType: null,
        flagTime,
        onlineFlag: null
      }
      this.pickerValue = [NOW_TIME_START, NOW_TIME_END]
      this.fetchData()
    },
    // 重新设置表单数据
    resetChangeModel() {
      this.changeModel = {
        uid: null,
        turnover: null
      }
    },
    checkOnlineFlag(info) {
      updateOnlineFlag({ uid: info.uid, onlineFlag: info.onlineFlag == 0 ? 1 : 0 }).then(rt => {
        if (rt.code == 200) {
          this.$notify({
            title: '通知',
            message: '修改成功！',
            type: 'success',
            duration: 1500
          })
          this.fetchData()
        } else {
          this.$message.error(rt.msg || '修改失败')
        }
      }).catch(err => {
        this.$message.error(err || '修改失败')
      })

    },
    // 获取列表数据
    async fetchData() {
      const { flagTime } = this.listQuery
      if (flagTime == 1) {
        delete this.listQuery.registerTime
        this.listQuery.pickerValue = this.pickerValue
      } else {
        delete this.listQuery.pickerValue
        this.listQuery.registerTime = this.pickerValue
      }
      this.listLoading = true
      if (!this.labelOptionList.length) {
        const res = await getUserCategoryList({})
        this.labelOptionList = res.data || []
      }
      if (!this.familyList || !this.familyList.length) {
        getHierarchyList()
          .then((res) => {
            this.familyList = (res.data.list || []).map((item) => {
              return {
                value: item.id,
                label: nullS(item.name)
              }
            })
          })
      }
      getAssetsList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      ).then((res) => {
        this.list = res.data.list || []
        this.list.map((item) => {
          item.userLabelString = this.getLabelName(item.userType).name
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
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        uid: 0,
        userId: null,
        cashPassword: null,
        failReason: null,
        userType: null
      }
    },

    change(e) {
      this.$forceUpdate()
    },
    showUpdateDialogClick2(row) {
      this.resetCreateModel()
      this.dialogCreateVisible2 = true
      this.dialogStatus = 'update'
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
            userType: formDic.userType
          }
          updateUser(params)
            .then((res) => {
              this.dialogCreateLoading2 = false
              this.dialogCreateVisible2 = false
              this.$notify({
                title: '用户标签',
                message: '修改成功！',
                type: 'success',
                duration: 1500
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
        turnover: formDic.turnover
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
                  duration: 1500
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
                  duration: 1500
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
            typeDetail: nullS(formDic.typeDetail)
          }
          updateUsesRemark(params)
            .then((res) => {
              this.dialogCreateLoading1 = false
              this.dialogCreateVisible1 = false
              this.$notify({
                title: '提示',
                message: '修改用户备注成功',
                type: 'success',
                duration: 1500
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
    getLabelName(type) {
      const flist = this.labelOptionList.filter((item) => {
        return item.code == type
      })
      const obj = {
        name: '普通',
        class: 'cmkeyi'
      }
      if (flist.length) {
        obj.name = flist[0].categoryName
        if (type == 1) {
          obj.class = 'cmputong'
        }
        if (type == 9) {
          obj.class = 'cmdaili'
        }
        if (type == 10) {
          obj.class = 'cmteyao'
        }
        if (type == 11) {
          obj.class = 'cmyouzhi'
        }
      }
      return obj
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
            remakes: formDic.remakes
          }
          updateUserAgentId(params)
            .then((res) => {
              this.dialogAgentIdLoading = false
              this.dialogAgentIdVisible = false
              this.$notify({
                title: '提示',
                message: '操作成功',
                type: 'success',
                duration: 1500
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
            pwd: formDic.pwd
          }
          updateCashPassword(params)
            .then((res) => {
              this.dialogCreateLoading = false
              this.dialogCreateVisible = false
              this.$notify({
                title: '提示',
                message: '修改成功',
                type: 'success',
                duration: 1500
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
    onselectChange(e, row) {
      const params = {
        uid: row.uid,
        userType: e
      }
      this.$confirm(
        `确认切换该用户标签为[${this.getLabelName(e).name}]?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false
        }
      )
        .then(() => {
          this.listLoading = true
          updateUser(params).then((res) => {
            this.$notify({
              title: '用户标签',
              message: '操作成功！',
              type: 'success',
              duration: 1500
            })
            this.listLoading = false
          })
        })
        .catch(() => {
          this.fetchData()
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j]
        })
      )
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
          '昵称',
          '余额',
          '用户等级',
          '用户经验',
          '用户标签',
          '送出金币',
          '游戏娱乐后提现额度',
          '游戏娱乐已提取额度',
          '用户当前游戏流水',
          '用户当前消费'
        ]
        const filterVal = [
          'uid',
          'nickName',
          'goldCoin',
          'userLevel',
          'userExp',
          'userLabelString',
          'sendCoin',
          'gameQuota',
          'drawQuota',
          'allNow',
          'liveNow'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '用户报表',
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    handleSearchFilter2(arr = [NOW_TIME_START, NOW_TIME_END]) {
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
  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}

.w-330 {
  width: 330px !important;
}

::v-deep .cmputong .el-input__inner {
  background-color: rgb(223, 205, 205);
  color: #403737;
  letter-spacing: 1px;
}

::v-deep .cmdaili .el-input__inner {
  background-color: #7b27c4;
  color: #fff;
  letter-spacing: 1px;
}

::v-deep .cmteyao .el-input__inner {
  background-color: orange;
  letter-spacing: 1px;
}

::v-deep .cmyouzhi .el-input__inner {
  background-color: yellow;
  color: #50504b;
  letter-spacing: 1px;
}

::v-deep .cmkeyi .el-input__inner {
  background-color: #f56c6c;
  color: #f3edd4;
  letter-spacing: 1px;
}

.el-dropdown-menu__item,
.el-menu-item {
  padding: 0;
  width: 120px;
  text-align: center;
}
</style>
