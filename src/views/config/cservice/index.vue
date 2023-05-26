<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="showCreateDialogClick()"
          >添加客服配置</el-button
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
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column prop="nickname" label="客服昵称" min-width="100" />
      <el-table-column prop="customId" label="客服ID" width="80" />
      <el-table-column label="是否跳转" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.status | statusFilter">{{
            row.statusString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="跳转类型" width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.type == 2 ? 'primary' : 'success'" size="medium">{{
            row.typeString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="跳转地址" min-width="140" />
      <el-table-column prop="phone" label="联系方式" min-width="120" />
      <el-table-column prop="icon" label="图标" min-width="120">
        <template slot-scope="{ row }">
          <el-image :src="row.icon" /> <br />
          {{ row.icon }}
        </template>
      </el-table-column>
      <el-table-column prop="createTimeString" label="创建时间" width="160" />
      <el-table-column prop="updateTimeString" label="修改时间" width="160" />
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
              v-model.number="createModel.sort"
              clearable
              placeholder="请输入排序号"
              maxlength="5"
          /></el-form-item>
          <el-form-item label="客服ID" prop="customId"
            ><el-input
              v-model.number="createModel.customId"
              clearable
              placeholder="请输入客服ID"
              maxlength="100"
          /></el-form-item>
          <el-form-item label="客服昵称" prop="nickname">
            <el-input
              v-model="createModel.nickname"
              clearable
              placeholder="请输入客服昵称"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="是否跳转" prop="status">
            <el-select v-model="createModel.status" placeholder="请选择类型">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="跳转类型 1qq 2美洽 3合营 4Zalo" prop="type">
            <el-select v-model="createModel.type" placeholder="请选择跳转类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="跳转地址" prop="url"
            ><el-input
              v-model="createModel.url"
              clearable
              placeholder="请输入跳转地址"
              maxlength="500"
          /></el-form-item>
          <el-form-item label="联系方式"
            ><el-input
              v-model="createModel.phone"
              clearable
              placeholder="请输入联系方式"
              maxlength="500"
          /></el-form-item>
          <el-form-item label="图标">
            <div style="width: 100%">
              <el-upload
                class="avatar-uploader"
                action=""
                :show-file-list="false"
                :before-upload="beforeImgUpload"
                :http-request="(params) => uploadImgRequest(params)"
              >
                <img
                  v-if="createModel.icon"
                  :src="createModel.icon"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <div
                class="uploadFileDesc"
                v-html="getImageLibary('customer', true)"
              />
              <el-input
                v-model="createModel.icon"
                type="textarea"
                placeholder="上传图片之后自动生成资源地址"
                :autosize="{ minRows: 3, maxRows: 4 }"
              />
            </div>
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
  getCustomerServiceList,
  createCustomerService,
  updateCustomerService,
  deleteCustomerService,
} from "@/api/config/cservice";
import {
  getImageLibary,
  nullS,
  formatUnixTime,
  beforeUploadImage,
  uploadResourceFiles,
} from "@/utils/tools";

export default {
  name: "ConfigCServicePage",
  filters: {
    statusFilter(status) {
      const map = { 1: "success", 2: "warning" };
      return map[status];
    },
    typeFilter(type) {
      const map = { 1: "success", 2: "warning" };
      return map[type];
    },
  },
  data() {
    return {
      list: [],
      listLoading: true,
      getImageLibary: getImageLibary,
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
        create: "添加客服配置",
        update: "编辑客服配置",
      },

      // 表单模型
      createModel: {
        id: 0,
        sort: 0,
        customId: 0,
        nickname: null,
        type: null,
        phone: null,
      },

      statusOptions: [
        { label: "跳转", value: 1 },
        { label: "不跳转", value: 2 },
      ],
      typeOptions: [
        { label: "qq", value: 1 },
        { label: "美洽", value: 2 },
        { label: "合营", value: 3 },
        { label: "Zalo", value: 4 },
      ],

      // 验证规则
      rules: {
        nickname: [
          { required: true, message: "请输入栏目名称", trigger: "change" },
          { min: 1, max: 500, message: "最多为500个字符", trigger: "change" },
        ],
        customId: [
          { required: true, message: "请输入客服ID" },
          { type: "number", message: "请输入正确的客服ID" },
        ],
        sort: [
          { required: true, message: "请输入排序号" },
          { type: "number", message: "请输入正确的排序号" },
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
        customId: 0,
        nickname: null,
        type: null,
        phone: null,
      };
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getCustomerServiceList(this.listQuery.limit, this.listQuery.page)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var statusString = "";
            if (item.status == 1) {
              statusString = "跳转";
            } else if (item.status == 2) {
              statusString = "不跳转";
            }
            var typeString = "";
            if (item.type == 1) {
              typeString = "qq";
            } else if (item.type == 2) {
              typeString = "美洽";
            } else if (item.type == 3) {
              typeString = "合营";
            }
            this.$set(item, "statusString", statusString);
            this.$set(item, "typeString", typeString);
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
    // 上传图片

    beforeImgUpload(file) {
      console.log("-----------上传之前------------");
      const { can, msg } = beforeUploadImage(file.type, file.size);
      if (!can) {
        this.$message.error(msg);
      } else {
        this.dialogCreateLoading = true;
      }
      return can;
    },

    uploadImgRequest(option) {
      console.log("-----------自定义上传方法------------");
      this.$store
        .dispatch("oss/getOSSInfos")
        .then((res) => {
          return uploadResourceFiles({
            ossParams: res,
            fileName: option.file.name,
            file: option.file,
            dir: "customer",
          });
        })
        .then((url) => {
          this.createModel.icon = url;
          this.dialogCreateLoading = false;
        })
        .catch((err) => {
          console.error("oss失败" + JSON.stringify(err));
          this.dialogCreateLoading = false;
          this.$message.error("上传失败，请重试");
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
      this.$confirm("是否删除该客服配置？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          deleteCustomerService([row.id])
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "删除客服配置成功",
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
            customId: formDic.customId || 0,
            sort: formDic.sort || 0,
            nickname: nullS(formDic.nickname),
            url: formDic.url,
            icon: formDic.icon,
            phone: formDic.phone,
            type: formDic.type || 1,
            status: formDic.status || 0,
          };
          if (this.dialogStatus === "create") {
            createCustomerService(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "创建客服配置成功",
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
            updateCustomerService(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "修改客服配置成功",
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
