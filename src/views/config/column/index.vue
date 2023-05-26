<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="showCreateDialogClick()"
          >添加栏目</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-refresh" @click="reset"
          >刷新</el-button
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
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column prop="name" label="栏目名称" min-width="80" />
      <el-table-column prop="jumpUrl" label="跳转内链" min-width="120" />
      <el-table-column prop="remake" label="备注" min-width="80" />
      <el-table-column prop="createTimeString" label="创建时间" width="160" />
      <el-table-column prop="updateTimeString" label="修改时间" width="160" />
      <el-table-column prop="type" label="栏目类型" width="80" />
      <el-table-column label="打开方式" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.openWay | openWayFilter">{{
            row.openWay == 1 ? "站外URL" : "站内栏目"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="160">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            :width="30"
            active-text="启用"
            :active-value="1"
            inactive-text="停用"
            :inactive-value="0"
            @change="changeSwitchClick(row)"
          />
        </template>
      </el-table-column>
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
      :page-sizes="[10, 20, 50]"
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
      top="5vh"
      width="35%"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="createModel"
          :rules="rules"
          label-width="80px"
          label-position="top"
          size="medium"
        >
          <el-form-item label="排序" prop="sort"
            ><el-input
              v-model.number="createModel.sort"
              clearable
              placeholder="请输入排序号"
              maxlength="4"
          /></el-form-item>
          <el-form-item label="名称" prop="name"
            ><el-input
              v-model="createModel.name"
              clearable
              placeholder="请输入栏目名称"
              maxlength="20"
              show-word-limit
          /></el-form-item>
          <el-form-item label="类型" prop="type"
            ><el-input
              v-model.number="createModel.type"
              clearable
              placeholder="请输入栏目类型"
              maxlength="20"
          /></el-form-item>
          <el-form-item label="跳转URL"
            ><el-input
              v-model="createModel.jumpUrl"
              clearable
              placeholder="请输入跳转URL"
              maxlength="100"
          /></el-form-item>

          <el-form-item label="打开方式">
            <el-select
              v-model="createModel.openWay"
              placeholder="请选择打开方式"
            >
              <el-option
                v-for="item in openWayOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="createModel.remake"
              type="textarea"
              placeholder="请输入备注说明"
              maxlength="200"
              :autosize="{ minRows: 2, maxRows: 4 }"
              show-word-limit
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
import {
  getColumnList,
  createColumn,
  updateColumn,
  deleteColumn,
} from "@/api/config/column";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";

export default {
  name: "ConfigColumnPage",
  filters: {
    openWayFilter(status) {
      const map = { 0: "", 1: "warning" };
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
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      dialogTitleMap: {
        create: "添加栏目",
        update: "编辑栏目",
      },

      // 表单模型
      createModel: {
        id: 0,
        sort: 0,
        type: 0,
        openWay: 0,
        jumpUrl: null,
        name: null,
        remake: null,
      },
      openWayOptions: [
        { label: "站内栏目", value: 0 },
        { label: "站外URL", value: 1 },
      ],

      // 验证规则
      rules: {
        name: [
          { required: true, message: "请输入栏目名称", trigger: "change" },
          { min: 1, max: 20, message: "最多为20个字符", trigger: "change" },
        ],
        sort: [
          { required: true, message: "请输入排序号" },
          { type: "number", message: "请输入正确的排序号" },
        ],
        type: [
          { required: true, message: "请输入栏目类型" },
          { type: "number", message: "请输入正确的栏目类型" },
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
        id: 0,
        sort: 0,
        type: 0,
        openWay: 0,
        jumpUrl: null,
        name: null,
        remake: null,
      };
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getColumnList(this.listQuery.limit, this.listQuery.page)
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
      this.$confirm("是否删除该栏目？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          deleteColumn([row.id])
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "删除栏目成功",
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
          const params = {
            sort: formDic.sort || 0,
            openWay: formDic.openWay || 0,
            type: formDic.type || 0,
            name: nullS(formDic.name),
            remake: nullS(formDic.remake),
            jumpUrl: nullS(formDic.jumpUrl),
          };
          if (this.dialogStatus === "create") {
            createColumn(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "创建栏目成功",
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
            updateColumn(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "修改栏目成功",
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

    changeSwitchClick(row) {
      this.listLoading = true;
      const rowDic = Object.assign({}, row);
      // 请求网络
      updateColumn({
        id: rowDic.id,
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
  margin: 20px 0px;
  padding: 0px;
}
</style>
