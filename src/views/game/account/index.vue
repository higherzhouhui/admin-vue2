<template>
  <div class="app-container">
    <el-form :inline="true">
      <!-- 状态 -->
      <el-form-item>
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
          v-model="listQuery.uid"
          size="small"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.kyAccountId"
          size="small"
          class="mt5"
          placeholder="请输入游戏内用户id"
          clearable
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleSearchFilter"
          />
        </el-input>
      </el-form-item>
      <el-form-item>
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
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-search"
          @click="handleSearchFilter"
        />
      </el-form-item>
    </el-form>

    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
     >
      <el-table-column type="index" label="序号" width="60"   />
      <el-table-column
        prop="uid"
        label="用户id"
        min-width="150"
         
      />
      <el-table-column
        prop="kyAccountId"
        label="游戏内用户id"
        min-width="140"
         
      />
      <el-table-column
        prop="kyBalance"
        label="游戏余额(VND)"
        min-width="150"
         
        sortable
      />
      <el-table-column
        prop="freezeCoin"
        label="冻结金额(VND)"
        min-width="150"
         
        sortable
      />
      <el-table-column
        prop="needStatement"
        label="需要流水(VND)"
        min-width="150"
         
        sortable
      />
      <el-table-column
        prop="totalStatement"
        label="总流水(VND)"
        min-width="150"
         
        sortable
      />
      <el-table-column label="状态" width="140"  >
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
      <el-table-column label="是否自动上分" width="140"  >
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.autoUpBalance"
            :width="30"
            active-text="自动"
            :active-value="2"
            inactive-text="手动"
            :inactive-value="1"
            @change="switchAutoChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="140"
         
      />
      <el-table-column
        prop="updateTimeString"
        label="更新时间"
        width="140"
         
      />
      <el-table-column label="操作" width="160"  >
        <template slot-scope="{ row }">
          <el-button
            plain
            type="primary"
            size="mini"
            @click="showUpdateDialogClick(row)"
            >上分</el-button
          >
          <el-button
            plain
            type="primary"
            size="mini"
            @click="showDownDialogClick(row)"
            >下分</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新建/编辑 弹窗 -->
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
          label-position="top"
          size="medium"
        >
          <el-form-item label="用户id" prop="uid"
            ><el-input
              v-model.number="createModel.uid"
              clearable
              placeholder="请输入用户id"
              maxlength="4"
          /></el-form-item>
          <el-form-item label="游戏内用户id" prop="kyAccountId"
            ><el-input
              v-model="createModel.kyAccountId"
              clearable
              placeholder="请输入游戏内用户id"
              maxlength="20"
              show-word-limit
          /></el-form-item>
          <el-form-item label="金额" prop="amount">
            <el-input
              v-model.number="createModel.amount"
              clearable
              placeholder="请输入操作的金额"
              maxlength="20"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false"
          >取消</el-button
        >
        <el-button size="medium" type="primary" @click="handleDataClick()"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAccountList, updateAccount, autoUp } from "@/api/game/account";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";

export default {
  name: "KyGameAccountController",
  filters: {
    statusFilter(status) {
      const map = { 1: "info", 0: "success", 2: "danger" };
      return map[status];
    },
    typeFilter(type) {
      const map = { 0: "info", 1: "success", 2: "danger" };
      return map[type];
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
        uid: null,
        kyAccountId: null,
        kyNickName: null,
        pickerValue: [],
      },

      // 表单模型
      createModel: {
        uid: 0,
        kyAccountId: 0,
        type: 0,
        amount: 0,
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      dialogTitleMap: {
        update: "后台手动上分补偿",
        down: "后台手动下分补偿",
      },

      statusOptions: [
        { value: 1, label: "启用" },
        { value: 2, label: "禁用" },
      ],

      // 验证规则
      // rules: {
      //   gameId: [{ required: true, message: '请输入对应游戏id', trigger: 'change' }, { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }],
      //   icon: [{ required: true, message: '请输入图标', trigger: 'change' }, { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }],
      //   name: [{ required: true, message: '请输入游戏名', trigger: 'change' }, { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }]
      // },

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        uid: 0,
        kyAccountId: 0,
        type: 0,
        amount: 0,
      };
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getAccountList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
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
            return item;
          });
          this.listLoading = false;
          this.listQuery.total = res.data.total;
        })
        .catch((err) => {
          this.list = null;
          this.listQuery.total = 0;
          this.listLoading = false;
          this.$message.error(err);
        });
    },

    // 滑块状态改变
    switchStatusChange(row) {
      const rowDic = Object.assign({}, row);
      this.listLoading = true;
      // 请求网络
      updateAccount({
        uid: rowDic.uid || 0,
        status: rowDic.status,
      })
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
    switchAutoChange(row) {
      const rowDic = Object.assign({}, row);
      this.listLoading = true;
      // 请求网络
      updateAccount({
        uid: rowDic.uid || 0,
        autoUpBalance: rowDic.autoUpBalance,
      })
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

    // 创建 数据
    handleDataClick() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel);
          // 请求服务器
          this.dialogCreateLoading = true;
          if (formDic.uid == null || formDic.uid < 0) {
            this.$message.error("uid不能为空");
            return;
          }
          if (formDic.kyAccountId == null || formDic.kyAccountId < 0) {
            this.$message.error("游戏账号不能为空");
            return;
          }
          if (formDic.amount == null || formDic.amount < 0) {
            this.$message.error("金额不能为空");
            return;
          }
          const params = {
            uid: formDic.uid,
            kyAccountId: formDic.kyAccountId,
            amount: formDic.amount,
            type: 1,
          };
          if (this.dialogStatus === "update") {
            autoUp(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "手动上分成功",
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
            params["type"] = 2;
            autoUp(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "手动下分成功",
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

    // 显示编辑弹出窗
    showDownDialogClick(row) {
      this.resetCreateModel();
      this.dialogCreateVisible = true;
      this.dialogStatus = "down";
      this.createModel = Object.assign({}, row);
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
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
.input-with-select {
  background-color: #fff;
  width: 360px;
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
</style>
