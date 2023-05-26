<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <!-- 状态 -->
        <el-select
          v-model="listQuery.status"
          size="small"
          placeholder="请选择状态"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.cardNo"
          size="small"
          style="width: 240px"
          placeholder="请输入对应银行卡"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.trueName"
          size="small"
          style="width: 240px"
          placeholder="请输入真实姓名"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchFilter"
        >搜索</el-button>
        <el-button
          size="small"
          icon="el-icon-refresh"
          @click="reset"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="showCreateDialogClick()"
          >添加充值银行卡</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
     >
      <!--   <el-table-column type="index" label="序号" width="60"  ></el-table-column>
      <el-table-column prop="bankId" label="卡号ID" min-width="60"  ></el-table-column> -->
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column prop="sort" label="排序" min-width="60"   />
      <el-table-column
        prop="typeString"
        label="账户类型"
        min-width="140"
         
      />
      <el-table-column
        prop="trueName"
        label="真实姓名"
        min-width="150"
         
      />
      <el-table-column
        prop="cardNo"
        label="银行卡号"
        min-width="120"
         
      />
      <el-table-column
        prop="bankName"
        label="开户银行"
        min-width="120"
         
      />
      <el-table-column
        prop="bankProvince"
        label="开户省"
        min-width="100"
         
      />
      <el-table-column
        prop="bankCity"
        label="开户市"
        min-width="100"
         
      />

      <el-table-column
        prop="bankSub"
        label="支行名称"
        min-width="100"
         
      />
      <el-table-column
        prop="onThatDayString"
        label="今日充值额度"
        min-width="120"
         
        sortable
      />
      <el-table-column
        prop="yesterDayRechargeMoneyString"
        label="昨日充值额度"
        min-width="120"
         
        sortable
      />
      <el-table-column
        prop="theSameMonthRechargeMoneyString"
        label="本月充值额度"
        min-width="120"
         
        sortable
      />
      <el-table-column
        prop="nowLimitString"
        label="总充值额度"
        min-width="120"
         
        sortable
      />
      <el-table-column
        prop="maxLimitString"
        label="最大充值额度"
        min-width="120"
         
        sortable
      />
      <!-- <el-table-column prop="reward" label="奖励百分比%" min-width="60"  ></el-table-column> -->
      <el-table-column
        prop="hierarchyId"
        label="用户层级"
        min-width="300"
         
      />
      <el-table-column prop="remark" label="备注" width="400"   />
      <el-table-column label="状态" width="150"  >
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            :width="30"
            active-text="启用"
            :active-value="1"
            inactive-text="禁用"
            :inactive-value="2"
            @change="switchStatusChange(row)"
          />
        </template>
      </el-table-column>

      <!-- <el-table-column label="vip" width="160"  >
          <template slot-scope="{ row }">
            <el-switch v-model="row.vip" :width="30" active-text="开启" :active-value="'1'" inactive-text="关闭" :inactive-value="'2'" @change="switchStatusChangevip(row)"></el-switch>
          </template>
        </el-table-column> -->

      <el-table-column
        prop="updateTimeString"
        label="更新时间"
        width="140"
         
      />
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="{ row }">
          <span
            class="operation_btn"
            type="primary"
            size="mini"
            @click="showUpdateDialogClick(row)"
            >编辑</span
          >
          <span
            class="operation_btn"
            type="danger"
            size="mini"
            @click="showDeleteDialogClick(row)"
            >删除</span
          >
        </template>
      </el-table-column>
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

    <!-- 新建/编辑 消息公告   等等-->
    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      :visible.sync="dialogCreateVisible"
       
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="35%"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="createModel"
          :rules="rules"
          label-position="top"
          size="medium"
        >
          <el-form-item label="排序" prop="sort"
            ><el-input
              v-model="createModel.sort"
              clearable
              placeholder="请输入排序"
              maxlength="200"
          /></el-form-item>
          <el-form-item label="账户类型">
            <el-select v-model="createModel.type" placeholder="请选择账户类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="真实姓名" prop="trueName"
            ><el-input
              v-model="createModel.trueName"
              clearable
              placeholder="请输入真实姓名"
              maxlength="200"
          /></el-form-item>
          <el-form-item label="银行卡号" prop="cardNo"
            ><el-input
              v-model="createModel.cardNo"
              clearable
              placeholder="请输入银行卡号"
              maxlength="200"
          /></el-form-item>
          <el-form-item label="开户银行" prop="bankName"
            ><el-input
              v-model="createModel.bankName"
              clearable
              placeholder="请输入开户银行"
              maxlength="200"
          /></el-form-item>
          <el-form-item label="开户省" prop="bankProvince"
            ><el-input
              v-model="createModel.bankProvince"
              clearable
              placeholder="请输入开户省"
              maxlength="200"
          /></el-form-item>
          <el-form-item label="开户市" prop="bankCity"
            ><el-input
              v-model="createModel.bankCity"
              clearable
              placeholder="请输入开户市"
              maxlength="200"
          /></el-form-item>
          <el-form-item label="支行名称" prop="bankSub"
            ><el-input
              v-model="createModel.bankSub"
              clearable
              placeholder="请输入支行名称"
              maxlength="200"
          /></el-form-item>
          <!--  <el-form-item label="充值奖励百分比%" prop="reward"><el-input v-model="createModel.reward" clearable placeholder="请输入充值奖励百分比" maxlength="200" /></el-form-item> -->
          <el-form-item label="银行卡最大充值额度" prop="maxLimit"
            ><el-input
              v-model="createModel.maxLimit"
              clearable
              placeholder="请输入银行卡最大充值额度"
              maxlength="200"
          /></el-form-item>
          <el-form-item label="备注" prop="remark"
            ><el-input
              v-model="createModel.remark"
              type="textarea"
              clearable
              placeholder="请输入支行名称"
              maxlength="200"
          /></el-form-item>

          <el-form-item label="1启用 2禁用">
            <el-switch
              v-model="createModel.status"
              active-text="启用"
              :active-value="1"
              inactive-text="禁用"
              :inactive-value="2"
            />
          </el-form-item>

          <el-form-item label="用户层级">
            <div
              style="
                margin-bottom: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <!-- 多选家族搜索 -->
              <el-select
                v-model="listQuery.UserHierarchyListId"
                size="medium"
                style="width: 300px"
                multiple
                filterable
                clearable
                placeholder="请选择用户层级"
                @clear="handleSearchFilter"
              >
                <el-option
                  v-for="item in UserHierarchyList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <!-- <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button> -->
        <el-button size="medium" @click="closePage()">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBankList,
  createBank,
  updateBank,
  updateStatus,
  deleteBank,
} from "@/api/config/bank";
import { getHierarchyList } from "@/api/config/pay";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";

export default {
  name: "ConfigBankBaseController",
  filters: {
    statusFilter(status) {
      const map = { 1: "info", 0: "success", 2: "danger" };
      return map[status];
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        status: null,
        cardNo: null,
        trueName: null,
        UserHierarchyListId: null,
        type: 7,
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      dialogTitleMap: {
        create: "添加充值银行卡",
        update: "编辑充值银行卡",
      },
      UserHierarchyList: null,
      // 表单模型
      createModel: {
        trueName: null,
        cardNo: null,
        bankName: null,
        bankProvince: null,
        bankCity: null,
        reward: null,
        bankSub: null,
        status: 1,
        sort: 1,
        maxLimit: null,
        remark: null,
        type: 7,
      },
      statusOptions: [
        { value: 1, label: "启用" },
        { value: 2, label: "禁用" },
      ],
      typeOptions: [{ value: 7, label: "银行卡" }],
      // 验证规则
      rules: {
        trueName: [
          { required: false, message: "请输入真实姓名", trigger: "change" },
          { min: 1, max: 200, message: "最多为200个字符", trigger: "change" },
        ],
        cardNo: [
          { required: true, message: "请输入银行卡号", trigger: "change" },
          { min: 1, max: 200, message: "最多为200个字符", trigger: "change" },
        ],
        /* maxLimit: [{ required: true, message: '请输入最大充值额度', trigger: 'change' }, { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }],
        bankName: [{ required: true, message: '请输入开户银行', trigger: 'change' }, { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }],
        bankProvince: [{ required: true, message: '请输入开户省', trigger: 'change' }, { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }],
        bankCity: [{ required: true, message: '请输入开户市', trigger: 'change' }, { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }],
        bankSub: [{ required: true, message: '请输入支行名称', trigger: 'change' }, { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }] */
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.fetchData()
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        trueName: null,
        cardNo: null,
        bankName: null,
        bankProvince: null,
        bankCity: null,
        reward: null,
        bankSub: null,
        status: 1,
        sort: 1,
        maxLimit: null,
        type: 7,
      };
    },

    // 刷新
    refreshData() {
      this.list = null;
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        status: null,
        cardNo: null,
      };
      this.fetchData();
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      (this.UserHierarchyList = null),
        (this.listQuery.UserHierarchyListId = null);
      getHierarchyList()
        .then((res) => {
          this.UserHierarchyList = (res.data.list || []).map((item) => {
            return {
              value: item.id,
              label: nullS(item.name),
            };
          });
          this.todayListLoading = true;
          //     return getPayProductList({})
          return getBankList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          );
        })
        // getBankList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var nowLimitString = (item.nowLimit || "不限").toLocaleString();
            var maxLimitString = (item.maxLimit || "不限").toLocaleString();
            var yesterDayRechargeMoneyString =
              item.yesterDayRechargeMoney.toLocaleString();
            var theSameMonthRechargeMoneyString =
              item.theSameMonthRechargeMoney.toLocaleString();
            var onThatDayString = item.onThatDay.toLocaleString();
            var statusString = "";
            if (item.status == 0) {
              statusString = "启用";
            } else if (item.status == 1) {
              statusString = "禁用";
            }
            var typeString = "";
            if (item.type == 7) {
              typeString = "银行卡";
            } else if (item.type == 29) {
              typeString = "USDT";
            }
            this.$set(
              item,
              "yesterDayRechargeMoneyString",
              yesterDayRechargeMoneyString
            );
            this.$set(
              item,
              "theSameMonthRechargeMoneyString",
              theSameMonthRechargeMoneyString
            );
            this.$set(item, "onThatDayString", onThatDayString);
            this.$set(item, "statusString", statusString);
            this.$set(item, "maxLimitString", maxLimitString);
            this.$set(item, "nowLimitString", nowLimitString);
            this.$set(
              item,
              "createTimeString",
              formatUnixTime(item.createTime)
            );
            this.$set(
              item,
              "updateTimeString",
              formatUnixTime(item.updateTime)
            );
            this.$set(item, "typeString", typeString);
            return item;
          });
          this.listLoading = false;
          this.listQuery.total = res.data.total;
        })
        .catch((err) => {
          this.list = null;
          this.listQuery.total = 0;
          (this.UserHierarchyList = null), (this.listLoading = false);
          this.$message.error(err);
        });
    },

    // 滑块状态改变
    switchStatusChange(row) {
      const rowDic = Object.assign({}, row);
      this.listLoading = true;
      // 请求网络
      const params = {
        bankId: rowDic.bankId || 0,
        status: rowDic.status,
      };
      updateStatus(params)
        .then((res) => {
          this.listLoading = false;
          this.$notify({
            title: "提示",
            message: "修改成功",
            type: "success",
            duration: 1000,
          });
        })
        .catch((err) => {
          // 错误的情况下，修改内存属性
          row.status = !row.status;
          this.listLoading = false;
          this.$message.error(err);
        });
    },

    // 滑块状态改变
    switchStatusChangevip(row) {
      const rowDic = Object.assign({}, row);
      this.listLoading = true;
      // 请求网络
      const params = {
        bankId: rowDic.bankId || 0,
        vip: rowDic.vip,
        status: rowDic.status,
      };
      updateStatus(params)
        .then((res) => {
          this.listLoading = false;
          this.$notify({
            title: "提示",
            message: "修改成功",
            type: "success",
            duration: 1000,
          });
        })
        .catch((err) => {
          // 错误的情况下，修改内存属性
          row.status = !row.status;
          this.listLoading = false;
          this.$message.error(err);
        });
    },

    // 显示创建弹出窗
    showCreateDialogClick() {
      this.resetCreateModel();
      this.dialogCreateVisible = true;
      this.dialogStatus = "create";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      this.resetCreateModel();
      this.dialogCreateVisible = true;
      this.dialogStatus = "update";
      this.createModel = Object.assign({}, row);
      this.listQuery.UserHierarchyListId = this.createModel.hierarchyIdList;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.bankId == null || row.bankId < 0) {
        this.$message.error("参数错误");
        return;
      }
      this.$confirm("是否删除该银行卡？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          deleteBank([row.bankId])
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "删除银行卡",
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
          const formDic = Object.assign({}, this.createModel);
          // 请求服务器
          this.dialogCreateLoading = true;
          var abb = this.listQuery.UserHierarchyListId;
          const params = {
            bankId: formDic.bankId || 0,
            trueName: nullS(formDic.trueName),
            hierarchyIdList: abb,
            cardNo: nullS(formDic.cardNo),
            bankName: nullS(formDic.bankName),
            remark: nullS(formDic.remark),
            bankProvince: nullS(formDic.bankProvince),
            bankCity: nullS(formDic.bankCity),
            bankSub: nullS(formDic.bankSub),
            reward: formDic.reward || 0,
            status: formDic.status || 1,
            sort: formDic.sort || 1,
            maxLimit: nullS(formDic.maxLimit),
            type: formDic.type || 7,
          };
          if (this.dialogStatus === "create") {
            createBank(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.UserHierarchyListId = null;
                this.$notify({
                  title: "提示",
                  message: "创建银行卡",
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
            params["bankId"] = formDic.bankId || 0;
            updateBank(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.UserHierarchyListId = null;
                this.$notify({
                  title: "提示",
                  message: "修改银行卡",
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

    closePage() {
      (this.dialogCreateVisible = false),
        (this.listQuery.UserHierarchyListId = null);
    },

    // 过滤
    handleSearchFilter() {
      this.listQuery.page = 1;
      this.fetchData();
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.listQuery.page = 1;
      this.fetchData();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.fetchData();
    },
  },
};
</script>
<style scoped>

.vue-pagination {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0px;
  padding: 0px;
}
</style>
