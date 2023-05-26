<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="showCreateDialogClick()"
          >新增</el-button
        >
      </el-form-item>

      <el-form-item>
        <el-button
          size="small"
          @click="
            ValidData = true;
            titles = '礼物抽成';
            percentageform();
            getGiftCommissionRatios();
          "
          >礼物抽成</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          @click="
            ValidData = true;
            titles = '有效人数规则设置';
            resetValids();
            getValidPersons();
          "
        >
          有效人数规则设置
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          plain
          @click="
            ValidData = true;
            titles = '平台费设置';
            resetPlatform();
            getSysGameConfigs();
          "
        >
          平台费设置
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          plain
          @click="
            ValidData = true;
            titles = '扶持规则设置';
            supportform();
            getSysSupportPlans();
            getSupportCommissionGives();
          "
        >
          扶持规则设置
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          plain
          @click="
            ValidData = true;
            titles = '直播彩票返利设置';
            initLotteryRateConfig();
          "
        >
          直播彩票返利设置
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
      :cell-style="cellStyle"
      fit
      highlight-current-row
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column
        prop="newValidPerson"
        label="本月新增有效会员"
        min-width="120"
      />
      <el-table-column
        prop="newValidPerson"
        label="净盈利(金币)"
        min-width="120"
      >
        <template slot-scope="{ row }">
          {{ row.startNegativeProfit }} - {{ row.endNegativeProfit }}
        </template>
      </el-table-column>
      <el-table-column prop="commissionRatio" label="佣金比例" min-width="80">
        <template slot-scope="{ row }"> {{ row.commissionRatio }}% </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="100" />
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="{ row }">
          <span
            class="operation_btn"
            type="primary"
            plain
            size="mini"
            @click="showUpdateDialogClick(row)"
            >编辑</span
          >
          <span
            class="operation_btn"
            type="danger"
            plain
            size="mini"
            @click="showDeleteDialogClick(row)"
            >删除</span
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->

    <!-- 新建编辑 弹窗 -->
    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      :visible.sync="dialogCreateVisible"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="createModel"
          :rules="rules"
          label-position="top"
          label-width="125px"
          size="medium"
        >
          <!-- <el-form-item prop="createUserName" label="名称:"
            ><el-input
              v-model="createModel.createUserName"
              clearable
              placeholder="请输入名称"
              maxlength="16"
          /></el-form-item> -->
          <el-form-item prop="newValidPerson" label="月新增有效人数:"
            ><el-input
              v-model="createModel.newValidPerson"
              clearable
              placeholder="请输入月新增有效人数"
              maxlength="20"
          /></el-form-item>

          <el-form-item label="净盈利:">
            <div style="display: flex; align-items: center">
              <el-input
                v-model="createModel.startNegativeProfit"
                clearable
                placeholder="请输入最小净盈利"
                style="width: 200px"
              />
              <div style="margin: 0 10px">~</div>
              <el-input
                v-model="createModel.endNegativeProfit"
                clearable
                placeholder="请输入最大净盈利"
                style="width: 200px"
              />
            </div>
          </el-form-item>

          <el-form-item prop="commissionRatio" label="佣金比例:">
            <el-input
              v-model="createModel.commissionRatio"
              clearable
              placeholder="请输入佣金比例"
              maxlength="4"
            >
              <div
                slot="suffix"
                style="position: absolute; right: 20px; top: 0"
              >
                %
              </div>
            </el-input>
          </el-form-item>
          <el-form-item prop="remark" label="备注:"
            ><el-input
              v-model="createModel.remark"
              type="textarea"
              clearable
              placeholder="请输入备注信息"
              maxlength="100"
          /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          size="medium"
          @click="(dialogCreateVisible = false), (dialogCreateLoading = false)"
          >取消</el-button
        >
        <el-button
          size="medium"
          type="primary"
          :loading="dialogCreateLoading"
          @click="handleDataClick()"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <!-- 有效人、平台费 -->
    <el-dialog
      :title="titles"
      :visible.sync="ValidData"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div
        v-if="titles === '有效人数规则设置'"
        v-cloading="dialogCreateLoading"
        style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <el-form
          ref="dataForm2"
          :model="Valids"
          label-position="top"
          label-width="150px"
          size="medium"
        >
          <el-form-item prop="validPerson" label="投注有效流水累计≥"
            ><el-input
              v-model="Valids.betAmt"
              class="inputs"
              clearable
              placeholder="请输入输赢金额"
              maxlength="20"
              style="width: 250px"
          /></el-form-item>
          <el-form-item prop="validMonth" label="月存款≥"
            ><el-input
              v-model="Valids.monthDeposit"
              class="inputs"
              clearable
              placeholder="请输入月存款"
              maxlength="20"
              style="width: 250px"
          /></el-form-item>
        </el-form>
      </div>
      <div
        v-else-if="titles === '平台费设置'"
        v-cloading="dialogCreateLoading"
        style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <el-form
          ref="dataForm3"
          :model="platform"
          label-position="top"
          label-width="70px"
          size="medium"
        >
          <el-form-item
            v-for="item in getSysGameConfigData"
            :key="item.id"
            :prop="item.typeNameEn"
            :label="item.typeNameZh"
            ><el-input
              v-model="item.platformRatio"
              style="width: 250px"
              class="inputs"
              clearable
              :placeholder="`请输入${item.typeNameZh}`"
              maxlength="4"
            >
              <div
                slot="suffix"
                style="position: absolute; right: 20px; top: 0"
              >
                %
              </div>
            </el-input></el-form-item
          >
          <!-- <el-form-item prop="demo12" label="棋牌"
            ><el-input
              class="inputs"
              v-model="platform.demo12"
              clearable
              placeholder="请输入输赢金额"
              maxlength="10"
          /></el-form-item>
          <el-form-item prop="demo123" label="真人"
            ><el-input
              class="inputs"
              v-model="platform.demo123"
              clearable
              placeholder="请输入输赢金额"
              maxlength="10"
          /></el-form-item>
          <el-form-item prop="demo1234" label="电子"
            ><el-input
              class="inputs"
              v-model="platform.demo1234"
              clearable
              placeholder="请输入输赢金额"
              maxlength="10"
          /></el-form-item>
          <el-form-item prop="demo12345" label="捕鱼"
            ><el-input
              class="inputs"
              v-model="platform.demo12345"
              clearable
              placeholder="请输入输赢金额"
              maxlength="10"
          /></el-form-item>
          <el-form-item prop="demo123456" label="彩票"
            ><el-input
              class="inputs"
              v-model="platform.demo123456"
              clearable
              placeholder="请输入输赢金额"
              maxlength="10"
          /></el-form-item> -->
        </el-form>
      </div>
      <div
        v-else-if="titles === '礼物抽成'"
        v-cloading="dialogCreateLoading"
        style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <el-form
          ref="dataForm4"
          :model="percentages"
          label-position="top"
          label-width="120px"
          size="medium"
        >
          <el-form-item prop="giftCommissionRatio" label="抽成比例:"
            ><el-input
              v-model="percentages.giftCommissionRatio"
              class="inputs"
              clearable
              placeholder="请输入抽成比例"
              maxlength="5"
              style="width: 250px"
            >
              <div
                slot="suffix"
                style="position: absolute; right: 20px; top: 0"
              >
                %
              </div>
            </el-input></el-form-item
          >
        </el-form>
      </div>
      <div
        v-else-if="titles === '扶持规则设置'"
        v-cloading="dialogCreateLoading"
        style="width: 100%; height: 100%"
      >
        <div style="margin-bottom: 10px">
          <!--  v-model="radio" -->
          扶持发放方式:
          <el-radio-group v-model="supportCommissionGive">
            <el-radio label="1">自动发放</el-radio>
            <el-radio label="2">手动发放</el-radio>
          </el-radio-group>
        </div>
        <div
          v-for="item in getSysSupportPlanData"
          :key="item.id"
          class="support"
        >
          <div style="margin-bottom: 6px">
            扶持第（{{ item.supportMonth }}）个月
          </div>
          <div>
            月新增有效:<el-input
              v-model="item.newValidPerson"
              class="support_center"
              clearable
              placeholder="请输入"
              maxlength="10"
              size="small"
            />
          </div>
          <div>
            佣金加送比例:<el-input
              v-model="item.attachRatio"
              class="support_center"
              clearable
              placeholder="请输入"
              maxlength="5"
              size="small"
            >
              <div
                slot="suffix"
                style="position: absolute; right: 20px; top: 8px"
              >
                %
              </div>
            </el-input>
          </div>
          <!-- <el-button
            icon="el-icon-plus"
            size="small"
            @click="newlyAdded()"
          ></el-button>
          <el-button
            icon="el-icon-minus"
            size="small"
            @click="deletes(item)"
          ></el-button> -->
        </div>
        <!-- 减 -->
        <!-- <div class="support" v-for="item in support.demo4" :key="item.id">
          <div>
            扶持周期:<el-input
              class="support_center"
              v-model="item.demo1"
              clearable
              placeholder="请输入"
              maxlength="100"
              size="small"
            />
            个月
          </div>
          <div>
            月新增有效:<el-input
              class="support_center"
              v-model="item.demo2"
              clearable
              placeholder="请输入"
              maxlength="100"
              size="small"
            />
          </div>
          <div>
            佣金加送比例:<el-input
              class="support_center"
              v-model="item.demo3"
              clearable
              placeholder="请输入"
              maxlength="3"
              size="small"
            />
          </div>
          <el-button
            icon="el-icon-minus"
            size="small"
            @click="deletes(item)"
          ></el-button>
        </div> -->
      </div>
      <div
        v-else-if="titles === '直播彩票返利设置'"
        v-cloading="dialogCreateLoading"
      >
        <div
          v-for="(item, index) in lotteryRateList"
          :key="index"
          class="support"
          style="justify-content: space-around"
        >
          <div style="margin-bottom: 6px">
            流水区间{{ index + 1 }}：
            <el-input
              v-model="item.startBetAmt"
              class="support_center"
              placeholder="请输入"
              size="small"
            />
            —
            <el-input
              v-model="item.endBetAmt"
              class="support_center"
              placeholder="请输入"
              size="small"
            />
          </div>
          <div class="disp">
            <div class="disp_font">点位：</div>
            <el-input
              v-model="item.backWaterRate"
              class="support_center"
              placeholder="请输入"
              size="small"
            >
              <div
                slot="suffix"
                style="position: absolute; right: 20px; top: 8px"
              >
                %
              </div>
            </el-input>
            <div class="buts">
              <div class="adds" @click="plusLotteryList(index)" />
              <div
                v-if="lotteryRateList.length > 1"
                class="subtract"
                @click="minusLotteryList(index)"
              />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button
          size="medium"
          @click="
            (ValidData = false),
              (dialogCreateLoading = false),
              (supportCommissionGive = null)
          "
          >取消</el-button
        >
        <el-button
          size="medium"
          type="primary"
          :loading="dialogCreateLoading"
          @click="handleDataClick2()"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  updateGiftCommissionRatio,
  updateValidPerson,
  getSysGameConfig, // 获取游戏平台费
  updateSysGameConfig, // 游戏平台费比例更新
  getSysSupportPlan, // 获取扶持代理
  updateSysSupportPlan, // 代理扶持方案更新
  getCommissionLevelRatio, // 佣金等级比例,
  addOrUpdateCommissionLevelRatio,
  deleteCommissionLevelRatio, // 删除
  getGiftCommissionRatio, // 礼物抽成比例
  getValidPerson, // 有效人数设置
  getSupportCommissionGive, // 扶持佣金发放方式
  updateSupportCommissionGive, // 扶持佣金发放方式 更新
  getLotteryRateConfig, // 获取彩票返水比例
  updateLotteryRateConfig, // 更新彩票返水比例
} from "@/api/agentManagement/tabledetail";

export default {
  name: "AgentManagementCommission",
  data() {
    return {
      list: [],
      todayList: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
      },
      // 状态选择
      statusOptions: [
        { label: "未支付", value: 0 },
        { label: "已支付", value: 1 },
      ],
      // 验证表单
      rules: {
        createUserName: [
          { required: true, message: "请输入名称", trigger: "change" },
        ],
        newValidPerson: [
          {
            required: true,
            message: "请输入月新增有效人数",
            trigger: "change",
          },
        ],
        commissionRatio: [
          { required: true, message: "请输入佣金比例", trigger: "change" },
        ],
      },
      // 礼物抽成
      rules2: {
        giftCommissionRatio: [
          { required: true, message: "请输入抽成比例", trigger: "change" },
        ],
      },
      // 有效人规则设置
      rules3: {
        validPerson: [
          {
            required: true,
            message: "请输入投注有效流水累计",
            trigger: "change",
          },
        ],
        validMonth: [
          { required: true, message: "请输入月存款", trigger: "change" },
        ],
      },
      // 表单模型
      createModel: {},

      resetCreateModel() {
        this.createModel = {};
      },

      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogChangeVisible: false,
      dialogChangeLoading: false,
      lotteryRateList: [],
      dialogStatus: "",
      dialogTitleMap: {
        update: "编辑",
        create: "新增等级",
      },
      // 有效人、平台费
      titles: "",
      ValidData: false,
      Valids: {
        betAmt: null,
        monthDeposit: null,
      },
      resetValids() {
        this.Valids = {
          betAmt: null,
          monthDeposit: null,
        };
      },

      platform: {
        id: null,
        demo1: null,
        demo12: null,
        demo123: null,
        demo1234: null,
        demo12345: null,
        demo123456: null,
      },
      resetPlatform() {
        this.platform = {
          id: null,
          demo1: null,
          demo12: null,
          demo123: null,
          demo1234: null,
          demo12345: null,
          demo123456: null,
        };
      },

      percentages: {
        giftCommissionRatio: null,
      },
      percentageform() {
        this.percentages = {
          giftCommissionRatio: null,
        };
      },

      support: {
        id: null,
        demo1: null,
        demo2: null,
        demo3: null,
        demo4: [],
      },
      supportform() {
        this.support = {
          id: null,
          demo1: null,
          demo2: null,
          demo3: null,
          demo4: [],
        };
      },
      operator: this.$store.state.user.name,
      getSysGameConfigData: [], // 平台费
      getSysSupportPlanData: [], // 扶持规则
      supportCommissionGive: null,
    };
  },
  created() {
    this.fetchData();
    // 获取登录用户名
    // getInfo().then((item) => {
    //   if (item.code === 200) {
    //     this.operator = item.data.name;
    //   }
    // });
  },

  methods: {
    initLotteryRateConfig() {
      getLotteryRateConfig().then((res) => {
        this.lotteryRateList = res.data.records || [];
      });
    },
    cellStyle(row, column, rowIndex, columnIndex) {
      // 根据报警级别显示颜色
      // console.log(row);
      // console.log(row.column);
      if (row.column.label === "商户名称") {
        return "color:#42b983";
      }
    },
    getSysGameConfigs() {
      // 获取游戏平台费
      getSysGameConfig()
        .then((item) => {
          if (item.code === 200) {
            console.log(item);
            this.getSysGameConfigData = item.data.records;
          }
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: error,
          });
        });
    },
    // 获取礼物抽成
    getGiftCommissionRatios() {
      getGiftCommissionRatio()
        .then((item) => {
          console.log(item);
          this.percentages.giftCommissionRatio = item.data;
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: error,
          });
        });
    },
    // 有效人数设置
    getValidPersons() {
      getValidPerson()
        .then((item) => {
          console.log(item);
          this.Valids = item.data;
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: error,
          });
        });
    },
    getSysSupportPlans() {
      getSysSupportPlan()
        .then((item) => {
          this.getSysSupportPlanData = item.data.records;
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: error,
          });
        });
    },
    // 获取扶持发放方式
    getSupportCommissionGives() {
      this.dialogChangeLoading = true;
      getSupportCommissionGive()
        .then((item) => {
          this.dialogChangeLoading = false;
          this.supportCommissionGive = item.data;
        })
        .catch(() => {
          this.dialogChangeLoading = false;
        });
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      this.todayListLoading = true;
      getCommissionLevelRatio()
        .then((res) => {
          this.todayListLoading = false;
          this.listLoading = false;
          if (res.code === 200) {
            this.list = res.data.records;
            // this.listQuery.total = res.total;
          }
        })
        .catch((err) => {
          this.list = null;
          this.listQuery.total = 0;
          this.listLoading = false;
          this.$message.error(err);
        });
    },
    plusLotteryList(index) {
      this.lotteryRateList.splice(index + 1, 0, {
        startBetAmt: "",
        endBetAmt: "",
        backWaterRate: "",
      });
    },
    minusLotteryList(index) {
      this.lotteryRateList.splice(index, 1);
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
    // 显示封禁弹窗
    showDeleteDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error("参数错误");
        return;
      }
      this.$confirm("是否删除该用户层级？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          deleteCommissionLevelRatio({ ...row, operator: this.operator })
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "删除成功",
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
        })
        .catch(() => {});
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          // 请求服务器
          this.dialogCreateLoading = true;
          const params = {
            createUserName: this.createModel.createUserName,
            newValidPerson: this.createModel.newValidPerson,
            commissionRatio: this.createModel.commissionRatio,
            startNegativeProfit: this.createModel.startNegativeProfit,
            endNegativeProfit: this.createModel.endNegativeProfit,
            remark: this.createModel.remark,
          };
          if (this.dialogStatus === "create") {
            addOrUpdateCommissionLevelRatio(params)
              .then((item) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "新增成功",
                  type: "success",
                  duration: 1500,
                });
                setTimeout((_) => {
                  this.fetchData();
                }, 200);
              })
              .catch((err) => {
                this.dialogCreateLoading = false;
                this.$message.error(err);
              });
          } else {
            addOrUpdateCommissionLevelRatio({
              ...this.createModel,
              operator: this.operator,
            })
              .then((item) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "编辑成功",
                  type: "success",
                  duration: 1500,
                });
                setTimeout((_) => {
                  this.fetchData();
                }, 200);
              })
              .catch((err) => {
                this.dialogCreateLoading = false;
                this.$message.error(err);
              });
          }
        }
      });
    },

    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      this.resetCreateModel();
      this.dialogCreateVisible = true;
      this.dialogStatus = "update";
      this.createModel = Object.assign({}, row);
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 显示新建弹出窗
    showCreateDialogClick() {
      this.resetCreateModel();
      this.dialogCreateVisible = true;
      this.dialogStatus = "create";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // // 新增
    // newlyAdded() {
    //   this.getSysSupportPlanData = [
    //     ...this.getSysSupportPlanData,
    //     { id: this.support.demo4.length + 1 },
    //   ];
    // },
    // // 删除
    // deletes(item) {
    //   this.support.demo4.forEach((value, index) => {
    //     if (value.id === item.id) {
    //       this.support.demo4.splice(index, 1);
    //     }
    //   });
    // 有效人
    handleDataClick2() {
      if (this.titles === "有效人数规则设置") {
        this.$refs["dataForm2"].validate((valid) => {
          if (valid) {
            // 请求服务器
            this.dialogCreateLoading = true;
            const params = {
              betAmt: this.Valids.betAmt,
              monthDeposit: this.Valids.monthDeposit,
              operator: this.operator,
            };

            updateValidPerson(params)
              .then((item) => {
                this.dialogCreateLoading = false;
                if (item.code === 200) {
                  this.ValidData = false;
                  this.fetchData();
                  this.$message({
                    type: "success",
                    message: "有效人规则设置成功",
                  });
                }
              })
              .catch((error) => {
                this.dialogCreateLoading = false;
                this.$message({
                  type: "error",
                  message: error,
                });
              });
          }
        });
      }
      if (this.titles === "平台费设置") {
        // 平台费
        this.$refs["dataForm3"].validate((valid) => {
          if (valid) {
            // 请求服务器
            this.dialogCreateLoading = true;
            updateSysGameConfig({
              records: this.getSysGameConfigData,
              operator: this.operator,
            })
              .then((item) => {
                this.dialogCreateLoading = false;
                if (item.code === 200) {
                  this.ValidData = false;
                  this.fetchData();
                  this.$message({
                    type: "success",
                    message: "平台费设置成功",
                  });
                }
              })
              .catch((error) => {
                this.dialogCreateLoading = false;
                this.$message({
                  type: "error",
                  message: error,
                });
              });
          }
        });
      }
      if (this.titles === "礼物抽成") {
        // 礼物抽成
        this.$refs["dataForm4"].validate((valid) => {
          if (valid) {
            // 请求服务器
            this.dialogCreateLoading = true;
            const params = {
              giftCommissionRatio: this.percentages.giftCommissionRatio,
              operator: this.operator,
            };
            updateGiftCommissionRatio(params)
              .then((item) => {
                this.dialogCreateLoading = false;
                if (item.code === 200) {
                  this.ValidData = false;
                  this.fetchData();
                  this.$message({
                    type: "success",
                    message: "礼物抽成设置成功",
                  });
                }
              })
              .catch((error) => {
                this.dialogCreateLoading = false;
                this.$message({
                  type: "error",
                  message: error,
                });
              });
          }
        });
      }
      if (this.titles === "扶持规则设置") {
        // 扶持规则设置
        // 请求服务器
        this.dialogCreateLoading = true;
        updateSupportCommissionGive({
          supportCommissionGive: this.supportCommissionGive,
          operator: this.operator,
        })
          .then((item) => {
            if (item.code === 200) {
            }
          })
          .catch((error) => {
            this.dialogCreateLoading = false;
            this.$message({
              type: "error",
              message: error,
            });
          });
        updateSysSupportPlan({
          records: this.getSysSupportPlanData,
          operator: this.operator,
        })
          .then((item) => {
            this.dialogCreateLoading = false;
            if (item.code === 200) {
              this.ValidData = false;
              this.fetchData();
              this.$message({
                type: "success",
                message: "扶持规则设置成功",
              });
            }
          })
          .catch((error) => {
            this.dialogCreateLoading = false;
            this.$message({
              type: "error",
              message: error,
            });
          });
      }
      if (this.titles === "直播彩票返利设置") {
        let emptyFlag = false;
        this.lotteryRateList.map((item) => {
          Object.keys(item).map((ckey) => {
            if (item[ckey] === "") {
              emptyFlag = true;
            }
          });
        });
        if (emptyFlag) {
          this.$message({
            type: "warning",
            message: "设置区间或点位不能为空",
          });
          emptyFlag = false;
          return;
        }
        this.dialogCreateLoading = true;
        updateLotteryRateConfig({
          lotteryRateConfigList: this.lotteryRateList,
          operator: this.operator,
        })
          .then((res) => {
            this.dialogCreateLoading = false;
            this.ValidData = false;
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "修改成功！",
              });
            }
          })
          .catch(() => {
            this.dialogCreateLoading = false;
          });
      }
    },
  },
};
</script>
<style scoped>
.span_primary {
  margin-right: 10px;
  color: #fc708b;
  cursor: pointer;
}
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

.support {
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
}
.support_center {
  width: 120px;
  height: 42px;
}
.inputs {
  width: 400px;
}
.disp_font {
  margin-top: 7px;
}
.disp {
  display: flex;
  align-items: flex-start;
}
.buts {
  display: flex;
  align-items: center;
}
.adds {
  width: 32px;
  height: 32px;
  background: url("../../assets/imgs/Line/plus-square.svg") no-repeat;
  background-size: 100% 100%;
}
.adds:hover {
  /* fill: #fa0; */

  filter: drop-shadow(#f90435 0 0);
}
.subtract {
  width: 32px;
  height: 32px;
  background: url("../../assets/imgs/Line/Minus-Square.svg") no-repeat;
  background-size: 100% 100%;
}
.subtract:hover {
  /* fill: #fa0; */
  filter: drop-shadow(#f90435 0 0);
}
</style>
