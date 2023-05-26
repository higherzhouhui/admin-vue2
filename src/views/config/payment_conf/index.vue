<template>
  <div class="app-container">
    <el-form :inline="true" @submit.native.prevent>
      <!-- 状态 -->
      <!-- <el-select size="medium" v-model="listQuery.filterType" placeholder="请选择处理类型" clearable @change="handleSearchFilter">
       <el-option v-for="item in typeOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
     </el-select> -->
      <!--  <span style="margin-right: 10px;"></span>
      <span style="margin-right: 10px;"></span> -->
      <el-form-item>
        <el-input
          v-model="listQuery.name"
          size="small"
          placeholder="请输入商户名称"
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
          >搜索</el-button
        >
        <el-button size="small" icon="el-icon-refresh" @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="showCreateDialogClick()"
          >添加商户信息</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" width="60" label="序号" />
      <el-table-column prop="name" label="商户名称" min-width="100" />
      <el-table-column prop="merchantNo" label="商户号" min-width="100" />
      <el-table-column prop="payUrl" label="请求URL" min-width="240" />
      <el-table-column prop="notifyUrl" label="回调URL" min-width="140" />
      <el-table-column prop="merchantKey" label="key" min-width="140" />
      <el-table-column prop="typeStirng" label="渠道类型" min-width="100" />
      <el-table-column label="状态" width="170">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            :width="30"
            active-text="开启"
            :active-value="1"
            inactive-text="关闭"
            :inactive-value="2"
            @change="updateStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTimeString" label="创建时间" width="150" />
      <el-table-column prop="updateTimeString" label="更新时间" width="150" />
      <el-table-column prop="operator" label="操作人" min-width="100" />
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

    <!-- 新建/编辑 消息公告 -->
    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="createModel"
          :rules="rules"
          label-position="top"
          size="medium"
        >
          <!--   <el-form-item label="用户ID" prop="uid"><el-input v-model="createModel.uid" clearable placeholder="请输入用户ID" maxlength="200" /></el-form-item> -->
          <el-form-item label="商户名称" prop="name"
            ><el-input
              v-model="createModel.name"
              clearable
              placeholder="请输入商户名称"
              maxlength="200"
          /></el-form-item>
          <el-form-item label="商户号" prop="merchantNo"
            ><el-input
              v-model="createModel.merchantNo"
              clearable
              placeholder="请输入商户号"
              maxlength="200"
          /></el-form-item>
          <el-form-item label="请求URL" prop="payUrl"
            ><el-input
              v-model="createModel.payUrl"
              clearable
              placeholder="请输入请求URL"
              maxlength="200"
          /></el-form-item>
          <el-form-item label="回调URL" prop="notifyUrl"
            ><el-input
              v-model="createModel.notifyUrl"
              clearable
              placeholder="请输入回调URL"
              maxlength="200"
          /></el-form-item>
          <el-form-item label="Key" prop="merchantKey"
            ><el-input
              v-model="createModel.merchantKey"
              clearable
              placeholder="请输入key"
              maxlength="200"
          /></el-form-item>
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
import {
  getPaymentList,
  createPayment,
  updatePayment,
  updateStatus1,
  deletePayment,
} from "@/api/config/config_payment";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";

export default {
  name: "ConfigFilterUserController",
  filters: {
    statusFilter(status) {
      const map = { 1: "info", 0: "success", 2: "danger" };
      return map[status];
    },
    typeFilter(status) {
      const map = { 0: "info", 1: "warning", 2: "danger" };
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
        name: null,
        filterType: null,
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      dialogTitleMap: {
        create: "添加过滤用户",
        update: "编辑过滤用户",
      },

      // 表单模型
      createModel: {
        id: null,
        uid: null,
        smsName: null,
        merchantCode: null,
        status: null,
      },
      typeOptions: [
        { label: "统计过滤", value: 0 },
        { label: "发言过滤", value: 1 },
      ],
      // 验证规则
      rules: {
        name: [
          { required: true, message: "请输入商户名称", trigger: "change" },
        ],
        merchantNo: [
          { required: true, message: "请输入商户号", trigger: "change" },
        ],
        payUrl: [
          { required: true, message: "请输入请求URL", trigger: "change" },
        ],
        notifyUrl: [
          { required: true, message: "请输入回调URL", trigger: "change" },
        ],
        merchantKey: [
          { required: true, message: "请输入用户ID", trigger: "change" },
        ],
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
        limit: 20,
      };
      this.fetchData();
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: null,
        uid: null,
        smsName: null,
        merchantCode: null,
        status: null,
      };
    },

    // 刷新
    refreshData() {
      this.list = null;
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        filterType: null,
      };
      this.fetchData();
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getPaymentList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var typeStirng = "";
            if (item.type === 1) {
              typeStirng = "代付";
            } else if (item.type === 2) {
              typeStirng = "支付";
            }

            this.$set(item, "typeStirng", typeStirng);
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
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error("参数错误");
        return;
      }
      this.$confirm("是否删除该商户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          deletePayment([row.id])
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "删除商户成功",
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

    // 更改用户超管状态
    updateStatus(row) {
      this.listLoading = true;
      const id = row.id;
      const status = row.status;
      const name = row.name;
      // 请求网络
      updateStatus1(id, status, name)
        .then((res) => {
          this.listLoading = false;
          this.$notify({
            title: "提示",
            message: "开启商户成功",
            type: "success",
            duration: 1000,
          });
          setTimeout((_) => {
            this.fetchData();
          }, 200);
        })
        .catch((err) => {
          // 错误的情况下，修改内存属性
          row.manage = !mgr;
          this.listLoading = false;
          this.$message.error(err);
        });
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel);
          // 请求服务器
          this.dialogCreateLoading = true;
          const params = {
            id: nullS(formDic.id),
            merchantNo: nullS(formDic.merchantNo),
            payUrl: nullS(formDic.payUrl),
            notifyUrl: nullS(formDic.notifyUrl),
            merchantKey: nullS(formDic.merchantKey),
            name: nullS(formDic.name),
          };
          if (this.dialogStatus === "create") {
            createPayment(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "创建商户成功",
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
            params["id"] = formDic.id || 0;
            updatePayment(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "修改商户成功",
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
