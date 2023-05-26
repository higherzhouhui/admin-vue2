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
          v-model="listQuery.smsName"
          size="small"
          placeholder="请输入短信名称"
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
      </el-form-item>
      <el-form-item>
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
          >添加短信渠道</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <el-table-column
        prop="smsName"
        label="短信名称"
        min-width="35"
         
      />
      <el-table-column
        prop="merchantCode"
        label="商户编码"
        min-width="35"
         
      />
      <el-table-column label="状态" width="170"  >
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            :width="30"
            active-text="开启"
            :active-value="0"
            inactive-text="关闭"
            :inactive-value="1"
            @change="updateStatus(row)"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="160"
         
      />
      <el-table-column label="操作" width="100"  >
        <template slot-scope="{ row }">
          <span
            class="operation_btn"
            plain
            type="primary"
            size="mini"
            @click="showUpdateDialogClick(row)"
            >编辑</span>
          <span
            class="operation_btn"
            plain
            type="danger"
            size="mini"
            @click="showDeleteDialogClick(row)"
            >删除</span>
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
          <!--   <el-form-item label="用户ID" prop="uid"><el-input v-model="createModel.uid" clearable placeholder="请输入用户ID" maxlength="200" /></el-form-item> -->
          <el-form-item label="短信名称" prop="smsName"
            ><el-input
              v-model="createModel.smsName"
              clearable
              placeholder="请输入短信名称"
              maxlength="200"
          /></el-form-item>
          <el-form-item label="短信编号" prop="merchantCode"
            ><el-input
              v-model="createModel.merchantCode"
              clearable
              placeholder="请输入短信编号"
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
  getSmsList,
  createSms,
  updateSms,
  deleteSms,
  updateStatus1,
} from "@/api/config/sms_config";
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
        smsName: null,
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
        uid: [{ required: true, message: "请输入用户ID", trigger: "change" }],
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
        smsName: null,
        filterType: null,
      };
      this.fetchData();
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getSmsList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            this.$set(
              item,
              "createTimeString",
              formatUnixTime(item.createTime)
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
      this.$confirm("是否删除该渠道商户？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          deleteSms([row.id])
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "删除渠道成功",
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
      const merchantCode = row.merchantCode;
      // 请求网络
      updateStatus1(id, status, merchantCode)
        .then((res) => {
          this.listLoading = false;
          this.$notify({
            title: "提示",
            message: "开启短信渠道成功",
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
            merchantCode: nullS(formDic.merchantCode),
            smsName: nullS(formDic.smsName),
          };
          if (this.dialogStatus === "create") {
            createSms(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "创建短信渠道成功",
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
            updateSms(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "修改信息成功",
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
.span_primary {
  margin-right: 10px;
  color: #FC708B;
  cursor: pointer;
}
</style>
