<template>
  <div class="app-container">
    <div v-if="searchAccount" class="subTitle">
      <span class="desc">{{ searchAccount }}的下级代理</span>
      <span class="operation">
        <el-button size="small" type="primary" class="allAgent" @click="getAllAgent">所有代理</el-button>
        <el-button size="small" type="info" class="backToLast" @click="backToLastLevel">返回上一级</el-button>
      </span>
    </div>
    <div class="flex-top-center">
      <div>
        <!-- <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" :dateType="1" /> -->
        <el-form :inline="true">
          <!-- <el-form-item>
            <el-tag type="info">注册时间:</el-tag>
            <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="daterange" range-separator="~"
              start-placeholder="开始日期" end-placeholder="结束日期" align="right" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              @change="handleSearchFilter" />
          </el-form-item> -->
          <el-form-item>
            <!-- <el-tag type="info">代理ID:</el-tag> -->
            <el-input v-model="listQuery.agentId" size="small" class="input-with-select" placeholder="请输入代理ID" clearable
              maxlength="16" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
          </el-form-item>
          <el-form-item>
            <!-- <el-tag type="info">账号:</el-tag> -->
            <el-input v-model="listQuery.agentAccount" size="small" class="input-with-select" placeholder="请输入代理账号"
              clearable maxlength="16" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
          </el-form-item>
          <!-- <el-form-item>
          <el-tag type="info">代理ID:</el-tag>
          <el-input
            v-model="listQuery.agentId"
            size="small"
            class="input-with-select"
            placeholder="请输入代理ID"
            clearable
            @keyup.enter.native="handleSearchFilter"
            @clear="handleSearchFilter"
          />
        </el-form-item> -->
          <!-- <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
          <el-form-item>
            <!-- <el-tag type="info">上级代理:</el-tag> -->
            <el-input v-model="listQuery.parentAgent" size="small" class="input-with-select" placeholder="请输入上级代理" clearable
              maxlength="16" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
          </el-form-item>
          <el-form-item>
            <!-- <el-tag type="info">代理类型:</el-tag> -->
            <el-select v-model="listQuery.agentType" size="small" clearable placeholder="请选择代理类型"
              @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
              <el-option label="普通代理" value="1" />
              <el-option label="扶持代理" value="2" />
              <el-option label="无条件扶持代理" value="3" />
              <el-option label="团队代理" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <!-- <el-tag type="info">状态:</el-tag> -->
            <el-select v-model="listQuery.agentStatus" size="small" clearable placeholder="请选择代理状态"
              @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
              <el-option label="未认证" :value="0" />
              <el-option label="正常" :value="1" />
              <el-option label="禁用" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
            <!-- 重置 -->
            <el-button size="small" icon="el-icon-refresh" @click="resets">
              重置
            </el-button>
            <!-- 导出 -->
          </el-form-item>
        </el-form>
      </div>
      <el-button size="small" :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">
        导出Excel
      </el-button>
    </div>
    <el-form>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">
          新增</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" size="mini" :cell-style="cellStyle" fit highlight-current-row>
      <!-- <el-table-column type="index" label="序号" width="60"   /> -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="联系方式">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="上级代理">
              <span>
                {{
                  props.row.pagentAccount == null ||
                  props.row.pagentAccount == undefined
                  ? "总代"
                  : props.row.pagentAccount
                }}</span>
            </el-form-item>
            <el-form-item label="代理类型">
              <div v-if="props.row.agentType == 1">普通代理</div>
              <div v-else-if="props.row.agentType == 2">扶持代理</div>
              <div v-else-if="props.row.agentType == 3">无条件扶持代理</div>
              <div v-else-if="props.row.agentType == 4">团队代理</div>
            </el-form-item>
            <el-form-item label="上级渠道链接">
              <span>{{ props.row.pChannelUrl }}</span>
            </el-form-item>
            <el-form-item label="登录IP">
              <span>{{ props.row.lastLoginIp }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
            <el-form-item label="注册时间">
              <span>{{ handleTimeZoneShow(props.row.registerTime) }}</span>
            </el-form-item>
            <el-form-item label="最近上线时间">
              <span>{{ handleTimeZoneShow(props.row.lastLoginTime) }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column prop="agentIdX" label="代理ID" width="80">
        <template slot-scope="{ row }">
          <span>{{ row.agentId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="agentAccount" label="代理账号" min-width="100" />
      <!-- <el-table-column
        prop="agentName"
        label="昵称"
        min-width="80"

      /> -->
      <!-- <el-table-column prop="outerNo" label="第三方订单号" min-width="80"  ></el-table-column> -->
      <el-table-column :key="Math.random()" prop="agentLevel" label="代理级别" :formatter="formatterType" />
      <el-table-column prop="directAgentNum" label="直属代理数" min-width="125" sortable>
        <template slot-scope="{ row }">
          <div class="link" @click="routeToAgentIdList(row)">
            {{ row.directAgentNum }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="directUserNum" label=" 直属会员总数" min-width="125" sortable>
        <template slot-scope="{ row }">
          <div class="link" @click="handleClickdirectUserNum(row)">
            {{ row.directUserNum }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="thisMonthDepositUserNum" label="本月充值会员数" width="145" sortable />
      <el-table-column prop="thisMonthDirectAgentNum" label="本月新增直属代理数量" width="150" />
      <el-table-column prop="thisMonthDirectUserNum" label="本月新增直属会员数量" width="150" />
      <el-table-column prop="thisMonthValidUserNum" label="本月有效会员数量" width="150" />
      <el-table-column label="状态" width="80" prop="agentStatus">
        <template slot-scope="{ row }">
          <!-- <el-tag size="medium" :type="row.agentStatus | statusFilter">{{
            row.statusString
          }}</el-tag> -->
          <el-tag size="medium" :type="
            row.agentStatus === 1
              ? 'success'
              : row.agentStatus === 2
                ? 'danger'
                : 'info'
          ">{{
  row.agentStatus === 1
  ? "正常"
  : row.agentStatus === 2
    ? "禁用"
    : "未认证"
}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template slot-scope="{ row }">

          <el-dropdown trigger="hover">
            <span class="el-dropdown-link">
              <span class="operation_btn" type="primary" size="mini"> 操作 </span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="row.agentStatus !== 0">
                <div @click="detaileds(row)">详情</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="showUpdateDialogClick(row)">编辑</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div v-if="row.agentStatus === 1" @click="showDeleteDialogClick(row, 1)">封禁</div>
                <div v-else @click="showDeleteDialogClick(row, 2)">启用</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="resetPassword(row)">重置密码</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <!-- 新建编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="
          dialogStatus == 'create' || dialogStatus == 'update2' ? rules : {}
        " label-position="top" label-width="100px" size="medium">
          <el-form-item prop="agentAccount" label="代理账号"><el-input v-model="createModel.agentAccount" clearable
              placeholder="请输入代理账号,6-16位英文和数字" maxlength="16" :disabled="
                dialogStatus === 'update' ||
                dialogStatus === 'update2' ||
                dialogStatus === 'details'
              " /></el-form-item>
          <!-- <el-form-item prop="agentName" label="昵称"
            ><el-input
              v-model="createModel.agentName"
              :disabled="dialogStatus === 'details'"
              clearable
              placeholder="请输入昵称,6-16位英文、数字"
              maxlength="16"
          /></el-form-item> -->
          <el-form-item prop="groupId" label="域名分组">
            <el-select v-model="createModel.groupId" placeholder="请选择域名分组" clearable style="width: 100%" :disabled="
              dialogStatus === 'update' || dialogStatus === 'details'
            ">
              <el-option v-for="itmes in groupListData" :key="itmes.recordId" :label="itmes.groupName"
                :value="itmes.groupId" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="dialogStatus === 'create'" prop="loginPwd" label="密码"><el-input
              v-model="createModel.loginPwd" clearable placeholder="请输入密码,6-16位英文和数字" maxlength="16" /></el-form-item>
          <el-form-item v-if="dialogStatus === 'create'" prop="remark2" label="确认密码"><el-input
              v-model="createModel.remark2" clearable placeholder="请再次输入密码,6-16位英文和数字" maxlength="16" /></el-form-item>
          <el-form-item prop="agentType" label="代理类型">
            <el-radio-group v-model="createModel.agentType" :disabled="dialogStatus === 'details'">
              <el-radio :label="1">普通代理</el-radio>
              <el-radio :label="2">扶持代理</el-radio>
              <el-radio :label="3">无条件扶持代理</el-radio>
              <el-radio :label="4">团队代理</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="提示">
            <div class="form_item_font">
              当月15号之前加入，当月算第一个月，15号之后加入，当月剩余天数+次月算第一个月
            </div>
          </el-form-item>

          <el-form-item v-if="createModel.agentType === 2" label="扶持比例设置">
            <div class="fuchiWrapper">
              <el-radio-group v-model="createModel.supportRatioConfig" :disabled="dialogStatus === 'details'">
                <el-radio :label="1">按全局配置</el-radio>
                <el-radio :label="2">自定义配置</el-radio>
              </el-radio-group>
              <div v-for="item in createModel.supportRatioConfig === 1
                ? supportPlanList
                : createModel.supportPlanList" :key="item.id" class="support">
                <div style="margin-bottom: 6px">
                  扶持第（{{ item.supportMonth }}）个月
                </div>
                <div>
                  月新增有效:<el-input v-model="item.newValidPerson" class="support_center" placeholder="请输入" maxlength="10"
                    size="small" :disabled="
                      createModel.supportRatioConfig === 1 ||
                      dialogStatus === 'details'
                    " />
                </div>
                <div>
                  佣金加送比例:<el-input v-model="item.attachRatio" class="support_center" placeholder="请输入" maxlength="5"
                    size="small" :disabled="
                      createModel.supportRatioConfig === 1 ||
                      dialogStatus === 'details'
                    ">
                    <div slot="suffix" style="position: absolute; right: 20px; top: 8px">
                      %
                    </div>
                  </el-input>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item v-if="dialogStatus !== 'create'" prop="remark" label="备注">
            <el-input v-model="createModel.remark" type="textarea" :disabled="dialogStatus === 'details'" maxlength="200"
              show-word-limit />
          </el-form-item>
          <!-- 无条件扶持 -->
          <el-form-item v-if="createModel.agentType === 3 || createModel.agentType === 4" prop="commissionRatio"
            label="返佣比例"><el-input v-model="createModel.commissionRatio" :disabled="dialogStatus === 'details'" clearable
              placeholder="请输入返佣比例" maxlength="4">
              <div slot="suffix" style="position: absolute; right: 20px; top: 0">
                %
              </div>
            </el-input></el-form-item>
          <!-- 平台费 -->
          <el-form-item label="平台费">
            <div class="PlatformFee">
              <div v-for="item in createModel.gameRateConfigList" :key="item.id" class="PlatformFee_div">
                <span class="title">{{ item.typeNameZh }}：</span><el-input v-model="item.platformRatio" disabled clearable
                  :placeholder="`请输入${item.typeNameZh}`" maxlength="4">
                  <div slot="suffix" style="position: absolute; right: 20px; top: 0">
                    %
                  </div>
                </el-input>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button v-if="dialogStatus === 'details'" size="medium"
          @click="(dialogCreateVisible = false), (dialogCreateLoading = false)">关闭</el-button>
        <el-button v-if="dialogStatus !== 'details'" size="medium"
          @click="(dialogCreateVisible = false), (dialogCreateLoading = false)">取消</el-button>
        <el-button v-if="dialogStatus !== 'details'" size="medium" type="primary"
          @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="重置密码" :visible.sync="dialogResetVisible" :close-on-click-modal="false" :destroy-on-close="true"
      top="5vh" width="600px">
      <el-form ref="rulesPwdForm" :model="resetPwdForm" :rules="rulesPwd" label-position="top" label-width="80px"
        size="medium">
        <el-form-item label="代理账号"><el-input v-model="resetPwdForm.agentAccount" disabled />
        </el-form-item>
        <el-form-item prop="password" label="密码"><el-input v-model="resetPwdForm.password" clearable
            placeholder="请输入密码" />
        </el-form-item>
        <el-form-item prop="password" label="确认密码"><el-input v-model="resetPwdForm.repassowrd" clearable
            placeholder="再次输入密码" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="medium" @click="hidePwdDialog">取消</el-button>
        <el-button size="medium" type="primary" @click="methodResetAgent">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  pageList,
  updateAgentStatus,
  getDoMainGroupListInfo,
  addTopAgent,
  getAgentDetail,
  getSysGameConfig,
  updateAgent,
  resetAgentPwd,
  agentExport,
} from "@/api/agentManagement/agentManagement";
import {
  getSysSupportPlan, // 获取扶持代理计划/全局
} from "@/api/agentManagement/tabledetail";
import { formatUnixTime, getNowFormatDay } from "@/utils/tools";
// const NOW_TIME_START = getNowFormatDay('-')

export default {
  name: "AgentManagementList",
  data() {
    return {
      list: [],
      todayList: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        pickerValue: [],
      },
      listQueryData() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 20,
          total: 0,
          pickerValue: [],
          // pickerValue: [this.getMonth, this.getMonth],
        };
      },
      // 验证表单
      rules: {
        agentAccount: [
          {
            required: true,
            message: "请输入代理账号,6-16位英文和数字",
            trigger: "change",
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
          },
        ],
        // agentName: [
        //   {
        //     required: true,
        //     message: "请输入昵称,6-16位英文、数字",
        //     trigger: "change",
        //     pattern: /.{6,16}$/,
        //   },
        // ],
        groupId: [
          { required: true, message: "请选择域名分组", trigger: "change" },
        ],
        loginPwd: [
          {
            required: true,
            message: "请输入密码,6-16位英文和数字",
            trigger: "change",
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
          },
        ],
        remark2: [
          {
            required: true,
            message: "请输入密码,6-16位英文和数字",
            trigger: "change",
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
          },
        ],
      },
      rulesPwd: {
        password: [
          {
            required: true,
            message: "请输入密码,6-16位英文和数字",
            trigger: "change",
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
          },
        ],
        repassowrd: [
          {
            required: true,
            message: "请输入密码,6-16位英文和数字",
            trigger: "change",
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
          },
        ],
      },
      resetPwdForm: {
        agentId: "",
        password: "",
        repassowrd: "",
        agentAccount: "",
      },
      // 表单模型
      createModel: {
        id: null,
        name: null,
        inComeTime: null,
        groupId: null,
        userNumber: null,
        type: null,
        remark: null,
        remark2: null,
        remark3: null,
        remark4: null,
        demo1: null,
        demo2: null,
        demo3: null,
        support: [],
        gameRateConfigList: [],
        supportRatioConfig: 1,
        supportPlanList: [],
      },

      resetCreateModel() {
        this.createModel = {
          id: null,
          name: null,
          inComeTime: null,
          groupId: null,
          userNumber: null,
          type: null,
          remark: null,
          remark2: null,
          remark3: null,
          remark4: null,
          demo1: null,
          demo2: null,
          demo3: null,
          support: [],
          gameRateConfigList: [],
          supportRatioConfig: 1,
          supportPlanList: [],
        };
      },

      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogChangeVisible: false,
      dialogChangeLoading: false,
      dialogResetVisible: false,
      groupListData: [], // 获取域名
      supportPlanList: [], // 扶持列表
      // getSysGameConfigsData:[] //获取游戏

      dialogStatus: "",
      dialogTitleMap: {
        update: "编辑代理",
        create: "新增代理",
        details: "代理详情",
        update2: "编辑代理-未认证",
      },
      downloadLoading: false,
      createModelAgent(a) {
        switch (a) {
          case 1:
            return "普通代理";
          case 2:
            return "扶持代理";
          case 3:
            return "无条件扶持代理";
          case 4:
            return "团队代理";
        }
      },
      operator: this.$store.state.user.name,
      agentId: "",
      searchAccount: "",
    };
  },

  computed: {
    getMonth() {
      let noTime = this.$store.getters.timerDate[0]
      return getNowFormatDay('-', true, noTime)
    }
  },
  created() {
    // this.listQuery.pickerValue = [this.getMonth, this.getMonth]
    this.agentId = this.$route.query.agentId;
    this.searchAccount = this.$route.query.agentAcccount;
    this.fetchData();
    // getInfo().then((item) => {
    //   if (item.code === 200) {
    //     this.operator = item.data.name
    //   }
    // })
  },
  methods: {
    cellStyle(row, column, rowIndex, columnIndex) {
      // 根据报警级别显示颜色
      // console.log(row);
      // console.log(row.column);
      if (row.column.label === "商户名称") {
        return "color:#42b983";
      }
    },

    // 获取列表数据
    fetchData() {
      // {
      //   ...this.listQuery,
      //   startDate:
      //     this.listQuery.pickerValue !== null
      //       ? this.listQuery.pickerValue[0]
      //       : null,
      //   endDate:
      //     this.listQuery.pickerValue !== null
      //       ? this.listQuery.pickerValue[1]
      //       : null,
      // }
      let agentPid;
      if (this.agentId) {
        const idsArray = String(this.agentId).split(",");
        agentPid = idsArray.pop() * 1;
        if (isNaN(agentPid)) {
          agentPid = undefined;
        }
      }
      this.listLoading = true;
      pageList({
        agentPid,
        ...this.listQuery,
        startDate:
          this.listQuery.pickerValue !== null
            ? this.listQuery.pickerValue[0]
            : null,
        endDate:
          this.listQuery.pickerValue !== null
            ? this.listQuery.pickerValue[1]
            : null,
      }).then((item) => {
        this.list = item.rows || [];
        this.listQuery.total = item.total;
        this.listLoading = false;
        this.todayListLoading = false;
      });
      if (!this.supportPlanList.length) {
        getSysSupportPlan()
          .then((item) => {
            this.supportPlanList = item.data.records;
          })
          .catch((error) => {
            this.$message({
              type: "error",
              message: error,
            });
          });
      }
    },

    // 导出
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      let agentPid;
      if (this.agentId) {
        const idsArray = String(this.agentId).split(",");
        agentPid = idsArray.pop() * 1;
        if (isNaN(agentPid)) {
          agentPid = undefined;
        }
      }
      const data = {
        ...this.listQuery,
        agentPid: agentPid,
        endDate:
          this.listQuery.pickerValue !== null
            ? this.listQuery.pickerValue[1]
            : "",
        startDate:
          this.listQuery.pickerValue !== null
            ? this.listQuery.pickerValue[0]
            : "",
      };
      this.downloadLoading = true;
      agentExport(data) // 导出的接口
        .then((result) => {
          this.downloadLoading = false;
          console.log(result);
          const link = document.createElement("a"); // 创建a标签
          const blob = new Blob([result], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }); // 设置文件流
          link.style.display = "none";
          // 设置连接
          link.href = URL.createObjectURL(blob); // 将文件流转化为blob地址
          link.download = "代理列表报表";
          document.body.appendChild(link);
          // 模拟点击事件
          link.click(); // 设置点击事件
        })
        .catch((err) => {
          this.downloadLoading = false;
          console.log(err);
        });
    },

    // 重置刷新
    resets() {
      this.listQueryData();
      this.fetchData();
    },

    // 过滤
    handleSearchFilter() {
      this.listQuery.pageNum = 1;
      this.fetchData();
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.listQuery.pageNum = 1;
      this.fetchData();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.fetchData();
    },
    // 扶持代理
    // 新增
    newlyAdded() {
      this.createModel.support = [
        ...this.createModel.support,
        { id: this.createModel.support.length + 1 },
      ];
    },
    // 删除
    deletes(item) {
      this.createModel.support.forEach((value, index) => {
        if (value.id === item.id) {
          this.createModel.support.splice(index, 1);
        }
      });
    },

    // 状态改变
    updateAgentStatusD(row, indexData) {
      updateAgentStatus({
        agentId: row.agentId,
        agentStatus: indexData,
        operator: this.operator,
      })
        .then((res) => {
          this.listLoading = false;
          this.$notify({
            title: "提示",
            message: `${indexData === 1 ? "启用用户成功" : "禁用用户成功"}`,
            type: "success",
            duration: 1500,
          });
          setTimeout((_) => {
            this.fetchData();
          }, 200);
        })
        .catch((err) => {
          this.listLoading = false;
          this.$message.error(err);
        });
    },
    // 显示封禁弹窗
    showDeleteDialogClick(row, indexData) {
      if (row.agentId == null || row.agentId < 0) {
        this.$message.error("参数错误");
        return;
      }
      if (indexData === 1) {
        this.$confirm("是否禁用该用户层级？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          showClose: false,
        })
          .then(() => {
            // 请求网络
            this.listLoading = true;
            this.updateAgentStatusD(row, 2);
          })
          .catch(() => { });
      } else {
        if (row.agentStatus === 0) {
          this.$confirm("该用户为未认证用户，请先编辑后再启用？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            showClose: false,
          })
            .then(() => {
              this.showUpdateDialogClick(row);
            })
            .catch(() => { });
        } else {
          this.updateAgentStatusD(row, 1);
        }
      }
    },
    hidePwdDialog() {
      this.dialogResetVisible = false;
    },
    methodResetAgent() {
      this.$refs["rulesPwdForm"].validate((valid) => {
        if (valid) {
          if (this.resetPwdForm.password !== this.resetPwdForm.repassowrd) {
            this.$message({
              type: "warning",
              message: "两次密码请保持一致",
            });
            return;
          }
          resetAgentPwd({
            agentId: this.resetPwdForm.agentId,
            loginPwd: this.resetPwdForm.password,
            operator: this.operator,
          }).then((res) => {
            this.$message({
              type: "success",
              message: "重置成功！",
            });
            this.hidePwdDialog();
          });
        }
      });
    },
    resetPassword(row) {
      if (row.agentId == null || row.agentId < 0) {
        this.$message.error("参数错误");
        return;
      }
      this.resetPwdForm = {
        agentId: row.agentId,
        password: "",
        repassowrd: "",
        agentAccount: row.agentAccount,
      };
      this.dialogResetVisible = true;
      this.$nextTick(() => {
        this.$refs["rulesPwdForm"].clearValidate();
      });
    },
    // 创建/更新 数据
    handleDataClick() {
      console.log(this.createModel);
      if (this.createModel.loginPwd !== this.createModel.remark2) {
        this.$message({
          type: "warning",
          message: "两次密码请保持一致",
        });
        return;
      }

      this.$confirm(
        `${this.createModelAgent(this.createModel.agentType) === undefined
          ? "您还未选择扶持"
          : `您选择的是：${this.createModelAgent(this.createModel.agentType)}`
        },是否确认?`,
        `${this.dialogStatus === "update" || this.dialogStatus === "update2"
          ? "编辑"
          : "新增"
        }域名分组`,
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          //  新增
          if (this.dialogStatus === "create") {
            this.$refs["dataForm"].validate((valid) => {
              if (valid) {
                const formDic = Object.assign({}, this.createModel);
                // 请求服务器
                this.dialogCreateLoading = true;
                const params = {
                  agentAccount: formDic.agentAccount,
                  // agentName: formDic.agentName,
                  agentType: formDic.agentType,
                  commissionRatio: formDic.commissionRatio,
                  groupId: formDic.groupId,
                  loginPwd: formDic.loginPwd,
                  gameRateConfigList: formDic.gameRateConfigList,
                  supportPlanList: formDic.supportPlanList,
                  supportRatioConfig: formDic.supportRatioConfig,
                  operator: this.operator,
                };
                addTopAgent(params)
                  .then((value) => {
                    this.dialogCreateLoading = false;
                    if (value.code === 200) {
                      this.dialogCreateVisible = false; // 关闭
                      this.$message({
                        type: "success",
                        message: "新增成功",
                      });
                      this.fetchData();
                    }
                  })
                  // eslint-disable-next-line handle-callback-err
                  .catch((err) => {
                    this.dialogCreateLoading = false;
                    this.$message({
                      type: "error",
                      message: "添加出错了",
                    });
                  });
              }
            });
          }
          // 编辑
          if (
            this.dialogStatus === "update" ||
            this.dialogStatus === "update2"
          ) {
            this.$refs["dataForm"].validate((valid) => {
              if (valid) {
                const formDic = Object.assign({}, this.createModel);
                // 请求服务器
                this.dialogCreateLoading = true;
                const params = {
                  agentAccount: formDic.agentAccount,
                  // agentName: formDic.agentName,
                  commissionRatio: formDic.commissionRatio,
                  agentType: formDic.agentType,
                  gameRateConfigList: formDic.gameRateConfigList,
                  operator: this.operator,
                  remark: formDic.remark,
                  groupId: formDic.groupId,
                };
                updateAgent(params)
                  .then((value) => {
                    this.dialogCreateLoading = false;
                    if (value.code === 200) {
                      this.dialogCreateVisible = false; // 关闭
                      this.$message({
                        type: "success",
                        message: "修改成功",
                      });
                      // if (this.dialogStatus === 'update2') {
                      //   this.updateAgentStatusD(row, 1)
                      // }
                      this.fetchData();
                    }
                  })
                  // eslint-disable-next-line handle-callback-err
                  .catch((err) => {
                    this.dialogCreateLoading = false;
                    this.$message({
                      type: "error",
                      message: err,
                    });
                  });
              }
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 详细接口
    getAgentDetails(row) {
      this.dialogCreateLoading = true;
      getAgentDetail({ id: row.agentId }).then((item) => {
        console.log("详细", item);
        this.dialogCreateLoading = false;
        this.createModel = Object.assign({}, item.data);
        // 如果使用系统系统配置1
        if (item.data.supportRatioConfig === 1) {
          this.createModel.supportPlanList = this.deepClone2(
            this.supportPlanList
          );
        }
        // 未认证用户重置游戏类别
        if (row.agentStatus === 0) {
          this.getSysGameConfigs();
        }
      });
    },
    deepClone2(obj) {
      const _obj = JSON.stringify(obj);
      return JSON.parse(_obj);
    },
    // 详细
    detaileds(row) {
      this.getAgentDetails(row);
      this.dialogCreateVisible = true;
      this.dialogStatus = "details"; // 设置详情
    },
    // 获取平台费
    getSysGameConfigs() {
      getSysGameConfig().then((item) => {
        this.createModel.gameRateConfigList = item.data.records;
      });
    },
    // 获取域名分组
    getDoMainGroupListInfoS() {
      getDoMainGroupListInfo().then((item) => {
        if (item.code === 200) {
          console.log(item);
          this.groupListData = [...item.data];
        }
      });
    },
    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      if (row.agentStatus === 0) {
        this.dialogStatus = "update2";
      } else {
        this.dialogStatus = "update";
      }
      this.getAgentDetails(row); // 详情
      this.getDoMainGroupListInfoS();
      this.resetCreateModel();
      this.dialogCreateVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 显示新建弹出窗
    showCreateDialogClick() {
      this.getSysGameConfigs();
      this.getDoMainGroupListInfoS();
      this.resetCreateModel();
      // 给默认配置
      this.createModel.supportPlanList = this.deepClone2(this.supportPlanList);
      this.dialogCreateVisible = true;
      this.dialogStatus = "create";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    formatterType(row) {
      if (row.agentLevel === 1) {
        return "总代";
      } else if (row.agentLevel === 2) {
        return "一级代理";
      } else if (row.agentLevel === 3) {
        return "二级代理";
      } else if (row.agentLevel === 4) {
        return "三级代理";
      } else if (row.agentLevel === 5) {
        return "四级代理";
      }
    },
    handleTimeZoneShow(time) {
      return formatUnixTime(time);
    },
    routeToAgentIdList(row) {
      if (row.directAgentNum > 0) {
        const id = row.agentId;
        const name = row.agentAccount;
        this.$router.push({
          path: "/agentManagement/agentManagement/list",
          query: {
            agentId: `${this.$route.query.agentId ? `${this.$route.query.agentId},` : ""
              }${id}`,
            agentAcccount: `${this.$route.query.agentAcccount
                ? `${this.$route.query.agentAcccount}->`
                : ""
              }${name}`,
          },
        });
      }
    },
    getAllAgent() {
      this.$router.push({
        path: "/agentManagement/agentManagement/list",
      });
    },
    backToLastLevel() {
      const idsArray = String(this.$route.query.agentId).split(",");
      const namesArray = String(this.$route.query.agentAcccount).split("->");
      idsArray.pop();
      namesArray.pop();
      const ids = idsArray.join(",");
      const names = namesArray.join("->");
      if (ids) {
        this.$router.push({
          path: "/agentManagement/agentManagement/list",
          query: { agentId: ids, agentAcccount: names },
        });
      } else {
        this.$router.push({ path: "/agentManagement/agentManagement/list" });
      }
    },
    handleClickdirectUserNum(row) {
      if (row.directUserNum > 0) {
        const id = row.agentId;
        const name = row.agentAccount;
        this.$router.push({
          path: "/agentManagement/agentManagement/memberList",
          query: {
            agentId: `${this.$route.query.agentId ? `${this.$route.query.agentId},` : ""
              }${id}`,
            agentAcccount: `${this.$route.query.agentAcccount
                ? `${this.$route.query.agentAcccount}->`
                : ""
              }${name}`,
          },
        });
      }
    },
  },
};
</script>
<style scoped lang="scss">
.input-with-select {
  background-color: #fff;
  width: auto;
  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}

.span_primary {
  margin-right: 10px;
  color: #fc708b;
  cursor: pointer;
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}

.form_item_font {
  color: red;
}

.support {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  white-space: nowrap;
}

.support_center {
  width: 100px;
  height: 36px;
  margin-left: 10px;
}

.PlatformFee {
  border: 1px solid #eee;
  padding: 8px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  grid-template-areas: 1fr 1fr;
  white-space: nowrap;
}

.PlatformFee_div {
  display: flex;
  align-items: center;

  .title {
    width: 120px;
  }
}

.table-remark {
  max-height: 100px;
  overflow-y: auto;
}

.link {
  color: blue;
  text-decoration: underline;
  padding: 3px 5px;
  cursor: pointer;
}

.subTitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 5px;

  .desc {
    font-weight: bold;
  }
}

.el-form-item {
  margin-bottom: 18px;
}

.fuchiWrapper {
  // width: 90%;
  // margin: 10px auto;
  border: 1px solid #eee;
  padding: 5px 10px 10px 10px;

  .support {
    display: flex;
    align-items: center;
    justify-content: space-between;
    white-space: nowrap;
  }

  .support_center {
    width: 100px;
    height: 36px;
  }
}
</style>
