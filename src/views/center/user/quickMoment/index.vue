<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-input
          v-model="listQuery.comment"
          size="small"
          style="width: 220px"
          placeholder="请输入评论内容"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.status"
          filterable
          size="small"
          placeholder="请选择状态"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in statusOption"
            :key="item.key"
            :label="item.label"
            :value="item.key"
          />
        </el-select>
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
    <el-form>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="showAddCommentDialgo()"
          >添加快捷评论</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="comment" label="评论内容" min-width="300" />
      <el-table-column label="状态" width="140">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            :width="30"
            active-text="启用"
            :active-value="1"
            inactive-text="禁用"
            :inactive-value="0"
            @change="updateComment(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间" min-width="160" />
      <el-table-column prop="gmtUpdate" label="更新时间" min-width="160" />
      <el-table-column prop="createUserName" label="创建人" min-width="100" />
      <el-table-column prop="updateUserName" label="更新人" min-width="100" />
      <el-table-column label="操作" width="120" fixed="right">
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
            type="primary"
            size="mini"
            @click="deleteMoment(row)"
            >删除</span
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新建弹窗 -->
    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="createModel"
          :rules="rules"
          label-position="top"
          label-width="150px"
          size="medium"
        >
          <el-form-item label="评论内容" prop="name">
            <el-input
              v-model="createModel.comment"
              clearable
              placeholder="请输入评论内容"
              maxlength="160"
              :row="5"
              type="textarea"
              @keydown.enter.native="textareaKeydown"
              show-word-limit
          /></el-form-item>
          <el-form-item label="状态" prop="name">
            <el-radio-group v-model="createModel.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="handleHideDialogo">取消</el-button>
        <el-button size="medium" type="primary" @click="savehandleDataClick()"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCenterUusrVipLevelList,
  updateCenterUserVipLevel,
  updateUserVipLevel,
  saveUserVipLevel,
} from "@/api/vip/vip";

import {
  getQucik,
  addQuickComment,
  delQuickComment,
  updateQuickComment,
} from "@/api/center/quickMoment/quick";
import { getBadgeBase } from "@/api/config/vip";
import { nullS, formatUnixTime } from "@/utils/tools";

export default {
  name: "CenterUserQucikMoment",
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
      },
      statusOption: [
        { key: "1", label: "启用" },
        { key: "0", label: "禁用" },
      ],
      // 弹窗数值
      dialogVisible: false,
      dialogLoading: false,

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      dialogTitleMap: {
        addNew: "添加快捷评论",
        update: "修改快捷评论",
      },

      familyList: null,

      // 表单模型
      createModel: {},

      rules: {
        trueName: [
          { required: true, message: "请输入昵称", trigger: "change" },
          { min: 1, max: 20, message: "最多为20个字符", trigger: "change" },
        ],
      },
      manageOptions: [
        { label: "否", value: 0 },
        { label: "是", value: 1 },
      ],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    textareaKeydown() {
      let e = window.event || arguments[0];
      // console.log(e,e.keyCode)
      if (e.key == "Enter" || e.code == "Enter" || e.keyCode == 13) {
        e.returnValue = false;
        return false;
      }
    },

    reset() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 20,
      };
      this.fetchData();
    },
    handleHideDialogo() {
      this.dialogVisible = false;
      this.dialogStatus = "";
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getQucik(this.listQuery)
        .then((res) => {
          this.listLoading = false;
          if (res.code === 200) {
            const list = res.data.list || [];
            list.forEach((item) => {
              item.gmtCreate = formatUnixTime(item.createTime);
              item.gmtUpdate = formatUnixTime(item.updateTime);
            });
            this.list = list;
            this.listQuery.total = res.data.total;
          }
        })
        .catch((err) => {
          this.list = [];
          this.$message.error(err);
        });
    },

    // 显示创建弹出窗
    showAddCommentDialgo() {
      this.resetCreateModel();
      this.dialogVisible = true;
      this.dialogStatus = "addNew";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // 创建数据
    savehandleDataClick() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          // 请求服务器
          this.dialogLoading = true;
          if (this.dialogStatus === "addNew") {
            addQuickComment(this.createModel)
              .then((res) => {
                this.dialogLoading = false;
                this.dialogVisible = false;
                if (res.code === 200) {
                  this.$notify({
                    title: "提示",
                    message: "操作成功！",
                    type: "success",
                  });
                  setTimeout((_) => {
                    this.fetchData();
                  }, 200);
                }
              })
              .catch((err) => {
                this.dialogLoading = false;
                this.$message.error(err);
              });
          } else if (this.dialogStatus === "update") {
            updateQuickComment(this.createModel).then((res) => {
              this.dialogLoading = false;
              this.dialogVisible = false;
              if (res.code === 200) {
                this.$notify({
                  title: "提示",
                  message: "操作成功！",
                  type: "success",
                });
                setTimeout((_) => {
                  this.fetchData();
                }, 200);
              }
            });
          }
        }
      });
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

    // 修改配置状态
    updateComment(row) {
      this.listLoading = true;
      // 请求网络
      updateQuickComment(row)
        .then((res) => {
          this.listLoading = false;
          if (res.code === 200) {
            this.$notify({
              title: "提示",
              message: "操作成功",
              type: "success",
            });
          }
        })
        .catch((err) => {
          row.status = !status;
          this.listLoading = false;
          this.$message.error(err);
        });
    },

    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        comment: "",
        status: 1,
      };
    },

    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      this.createModel = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    deleteMoment(row) {
      this.$confirm(`确认删除？`, "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          this.listLoading = true;
          delQuickComment(row)
            .then((res) => {
              this.listLoading = false;
              if (res.code === 200) {
                this.$notify({
                  title: "提示",
                  message: "操作成功！",
                  type: "success",
                });
                setTimeout((_) => {
                  this.fetchData();
                }, 200);
              } else {
                this.$message.error(res.message);
              }
            })
            .catch((err) => {
              this.listLoading = false;
              this.$message.error(err);
            });
        })
        .catch(() => {});
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
