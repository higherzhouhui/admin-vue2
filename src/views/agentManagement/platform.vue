<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <!-- <el-tag type="info">域名:</el-tag> -->
        <el-input
          v-model="listQuery.domainName"
          size="small"
          class="input-with-select"
          placeholder="请输入域名"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <!-- <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
      <el-form-item>
        <!-- <el-tag type="info">分组:</el-tag> -->
        <el-input
          v-model="listQuery.groupName"
          size="small"
          class="input-with-select"
          placeholder="请输入分组"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <!-- <el-select
          size="small"
          clearable
          v-model="listQuery.categoryName"
          placeholder="请选择站点类别"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        >
          <el-option label="PC" value="0"> </el-option>
          <el-option label="H5" value="1"> </el-option>
          <el-option label="后台" value="2"> </el-option>
          <el-option label="落地页" value="3"> </el-option>
          <el-option label="API域名" value="4"> </el-option>
        </el-select> -->
        <!-- <el-tag type="info">站点类别:</el-tag> -->
        <el-input
          v-model="listQuery.categoryName"
          size="small"
          class="input-with-select"
          placeholder="请输入站点类别"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <!-- <el-tag type="info">状态:</el-tag> -->
        <el-select
          v-model="listQuery.domainStatus"
          size="small"
          clearable
          placeholder="请选择状态"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        >
          <el-option label="未分配" value="1" />
          <el-option label="启用" value="2" />
          <el-option label="废弃" value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-search"
          type="primary"
          @click="handleSearchFilter"
          >搜索</el-button
        >
        <!-- 重置 -->
        <el-button size="small" icon="el-icon-refresh" @click="resets">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item label="">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="showCreateDialogClick()"
          >新增</el-button
        >
      </el-form-item>
      <el-form-item label="">
        <el-button size="small" @click="batchOperation(1)">批量禁用</el-button>
        <el-button size="small" @click="batchOperation(2)">批量启用</el-button>
        <el-button size="small" @click="batchOperation(3)">批量分组</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
      :cell-style="cellStyle"
      fit
      highlight-current-row
      @selection-change="selectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="domainName" label="域名" min-width="80" />

      <!-- <el-table-column prop="outerNo" label="第三方订单号" min-width="80"  ></el-table-column> -->
      <el-table-column prop="categoryName" label="站点类别" min-width="120">
        <template slot-scope="{ row }">
          <div>
            {{
              row.categoryName == "website"
                ? "官网"
                : row.categoryName == "download"
                ? "下载"
                : row.categoryName
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="{ row }">
          <el-tag
            size="medium"
            :type="
              row.domainStatus == 1
                ? 'info'
                : row.domainStatus == 2
                ? 'success'
                : 'danger'
            "
            >{{
              row.domainStatus == 1
                ? "未分配"
                : row.domainStatus == 2
                ? "启用"
                : row.domainStatus == 3
                ? "废弃"
                : ""
            }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="domainType" label="类别" min-width="140">
        <template slot-scope="{ row }">
          {{ row.domainType == 1 ? "通用域名" : "网关ip/cname域名" }}
        </template>
      </el-table-column>
      <el-table-column prop="groupName" label="已分组" min-width="140" />
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
            v-if="row.domainStatus == 1 || row.domainStatus == 3"
            class="operation_btn"
            type="success"
            plain
            size="mini"
            @click="showDeleteDialogClick(row, 2)"
            >启用</span
          >
          <span
            v-if="row.domainStatus == 2"
            class="operation_btn"
            type="danger"
            plain
            size="mini"
            @click="showDeleteDialogClick(row, 3)"
            >废弃</span
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

    <!-- 新建编辑 弹窗 -->
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
          label-width="120px"
          size="medium"
        >
          <el-form-item prop="domainName" label="域名"
            ><el-input
              v-model="createModel.domainName"
              clearable
              placeholder="请输入域名"
              maxlength="50"
          /></el-form-item>
          <el-form-item prop="categoryName" label="站点类别">
            <el-select v-model="createModel.categoryName" style="width: 100%">
              <el-option label="官网" value="website" />
              <el-option label="下载" value="download" />
            </el-select>
          </el-form-item>
          <el-form-item prop="domainType" label="通用推广域名">
            <el-select
              v-model="createModel.domainType"
              placeholder="请选择域名分组"
              clearable
              style="width: 100%"
            >
              <el-option label="通用域名" value="1" />
              <el-option label="网关ip/cname域名" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item prop="domainStatus" label="是否启用">
            <el-radio-group v-model="createModel.domainStatus">
              <el-radio :label="1">未分配</el-radio>
              <el-radio :label="2">启用</el-radio>
              <el-radio :label="3">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          size="medium"
          @click="
            (dialogCreateVisible = false), (this.dialogCreateLoading = false)
          "
          >取消</el-button
        >
        <el-button size="medium" type="primary" @click="handleDataClick()"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 批量分组 弹窗 -->
    <el-dialog
      title="批量分组"
      :visible.sync="extension"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm2"
          :model="extensionData"
          :rules="rules2"
          label-position="top"
          label-width="130px"
          size="medium"
        >
          <el-form-item prop="groupId" label="选择分组">
            <el-select
              v-model="extensionData.groupId"
              clearable
              placeholder="请选择分组"
              style="width: 100%"
            >
              <el-option
                v-for="item in getDoMainGroupListInfoData"
                :key="item.groupId"
                :label="item.groupName"
                :value="item.groupId"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          size="medium"
          @click="(extension = false), (this.dialogCreateLoading = false)"
          >取消</el-button
        >
        <el-button size="medium" type="primary" @click="handleDataClick2()"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  platformDomainList,
  update,
  batchUpdate,
  getDoMainGroupListInfo,
} from "@/api/agentManagement/platform";
import { getInfo } from "@/api/ums/admin";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";

export default {
  name: "AgentManagementPlatform",
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
      listQueryData() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 20,
          total: 0,
        };
      },
      // 状态选择
      statusOptions: [
        { label: "未支付", value: 0 },
        { label: "已支付", value: 1 },
      ],
      // 验证表单
      rules: {
        domainName: [
          { required: true, message: "请输入域名", trigger: "change" },
        ],
        categoryName: [
          { required: true, message: "请输入站点类别", trigger: "change" },
        ],
        domainType: [
          { required: true, message: "请输入通用推广域名", trigger: "change" },
        ],
        domainStatus: [
          { required: true, message: "请选择状态", trigger: "change" },
        ],
      },
      // 验证表单
      rules2: {
        groupId: [{ required: true, message: "请选择分组", trigger: "change" }],
      },
      // 表单模型
      createModel: {
        id: null,
        name: null,
        demo: null,
        demo2: null,
      },

      resetCreateModel() {
        this.createModel = {
          id: null,
          name: null,
          demo: null,
          demo2: null,
        };
      },

      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogChangeVisible: false,
      dialogChangeLoading: false,

      dialogStatus: "",
      dialogTitleMap: {
        update: "编辑域名",
        create: "新增域名",
      },

      // 推广域名
      extension: false,
      extensionData: {
        id: null,
        groupId: null,
      },
      resetExtensionData() {
        this.extensionData = {
          id: null,
          groupId: null,
        };
      },

      // 选中数据
      selectionChangeData: [],

      // 编辑数据
      editData: {},

      relationIdsData: "",
      domainIdsData: "",
      getDoMainGroupListInfoData: [],
      operator: this.$store.state.user.name,
    };
  },
  created() {
    this.fetchData();
    // getInfo().then((item) => {
    //   if (item.code === 200) {
    //     this.operator = item.data.name
    //   }
    // })
  },
  methods: {
    // 获取选中数据
    selectionChange(data) {
      console.log("这是什么数据", data);
      this.selectionChangeData = data;
    },

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
      this.listLoading = true;
      this.todayListLoading = true;
      // this.listQuery.limit, this.listQuery.page, this.listQuery
      platformDomainList({ ...this.listQuery })
        .then((res) => {
          if (res.code === 200) {
            this.todayListLoading = false;
            this.listLoading = false;
            this.list = res.rows;
            this.listQuery.total = res.total;
          }
        })
        .catch((err) => {
          this.list = null;
          this.listQuery.total = 0;
          this.listLoading = false;
          this.$message.error(err);
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
    // 显示封禁弹窗
    showDeleteDialogClick(row, indexData) {
      if (row.domainId == null || row.domainId < 0) {
        this.$message.error("参数错误");
        return;
      }
      if (indexData == 3) {
        this.$confirm("是否废弃该域名？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          showClose: false,
        })
          .then(() => {
            // 请求网络
            this.listLoading = true;
            update({ ...row, domainStatus: 3, operator: this.operator })
              .then((item) => {
                if (item.code === 200) {
                  this.dialogCreateLoading = false;
                  this.dialogCreateVisible = false;
                  this.$notify({
                    title: "提示",
                    message: "废弃成功",
                    type: "success",
                    duration: 1500,
                  });
                  setTimeout((_) => {
                    this.fetchData();
                  }, 200);
                } else {
                  this.listLoading = false;
                  this.$message({
                    type: "error",
                    message: item.msg,
                  });
                }
              })
              .catch((err) => {
                this.listLoading = false;
                this.$message.error(err);
              });
          })
          .catch(() => {});
      } else {
        update({ ...row, domainStatus: 2, operator: this.operator })
          .then((item) => {
            if (item.code === 200) {
              this.dialogCreateLoading = false;
              this.dialogCreateVisible = false;
              this.$notify({
                title: "提示",
                message: "启用成功",
                type: "success",
                duration: 1500,
              });
              setTimeout((_) => {
                this.fetchData();
              }, 200);
            } else {
              this.listLoading = false;
              this.$message({
                type: "error",
                message: item.msg,
              });
            }
          })
          .catch((err) => {
            this.listLoading = false;
            this.$message.error(err);
          });
      }
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel);
          // 请求服务器
          this.dialogCreateLoading = true;
          const params = {
            categoryName: formDic.categoryName,
            domainName: formDic.domainName,
            domainStatus: formDic.domainStatus,
            domainType: formDic.domainType,
            operator: this.operator,
          };

          const params2 = {
            domainId: this.editData.domainId,
            categoryName: formDic.categoryName,
            domainName: formDic.domainName,
            domainStatus: formDic.domainStatus,
            domainType: formDic.domainType,
            operator: this.operator,
          };

          if (this.dialogStatus === "create") {
            update(params)
              .then((item) => {
                this.dialogCreateLoading = false;
                if (item.code === 200) {
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
                } else {
                  this.dialogCreateLoading = false;
                  this.$message({
                    type: "error",
                    message: item.msg,
                  });
                }
              })
              .catch((err) => {
                this.dialogCreateLoading = false;
                this.$message.error(err);
              });
          } else {
            update(params2)
              .then((item) => {
                this.dialogCreateLoading = false;
                if (item.code === 200) {
                  this.dialogCreateVisible = false;
                  this.$notify({
                    title: "提示",
                    message: "修改成功",
                    type: "success",
                    duration: 1500,
                  });
                  setTimeout((_) => {
                    this.fetchData();
                  }, 200);
                } else {
                  this.dialogCreateLoading = false;
                  this.$message({
                    type: "error",
                    message: item.msg,
                  });
                }
              })
              .catch((err) => {
                this.dialogCreateLoading = false;
                this.$message.error(err);
              });
          }
        }
      });
    },
    // 批量分组
    handleDataClick2() {
      this.$refs["dataForm2"].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.extensionData);
          // 请求服务器
          this.dialogCreateLoading = true;
          console.log(formDic, this.domainIds, this.relationIds);
          batchUpdate({
            groupId: this.extensionData.groupId,
            domainIds: this.domainIdsData,
            relationIds: this.relationIdsData,
            operator: this.operator,
          }).then((item) => {
            this.dialogCreateLoading = false;
            if (item.code === 200) {
              this.$message({
                type: "success",
                message: "批量分组成功",
              });
              this.extension = false;
              this.fetchData();
            } else {
              this.dialogCreateLoading = false;
              this.$message({
                type: "error",
                message: "批量分组失败",
              });
            }
          });
        }
      });
    },

    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      this.editData = row;

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

    // 批量操作
    batchOperation(i) {
      if (this.selectionChangeData[0] !== undefined) {
        let relationIds = "";
        let domainIds = "";
        this.selectionChangeData.forEach((value, index, array) => {
          if (value.relationIds !== null && value.relationIds !== undefined) {
            relationIds += `${value.relationIds},`;
          }
          if (value.domainId !== null && value.domainId !== undefined) {
            domainIds += `${value.domainId},`;
          }
        });

        var reg = /,$/gi;
        relationIds = relationIds.replace(reg, "");
        domainIds = domainIds.replace(reg, "");

        this.relationIdsData = relationIds;
        this.domainIdsData = domainIds;
        console.log(relationIds, domainIds);
        if (i === 1) {
          batchUpdate({
            domainIds: domainIds,
            relationIds: relationIds,
            domainStatus: 3,
            operator: this.operator,
          }).then((item) => {
            if (item.code === 200) {
              this.$message({
                type: "success",
                message: "批量禁用成功",
              });
              this.fetchData();
            } else {
              this.$message({
                type: "error",
                message: "批量禁用失败",
              });
            }
          });
        }
        if (i === 2) {
          batchUpdate({
            domainIds: domainIds,
            relationIds: relationIds,
            domainStatus: 2,
            operator: this.operator,
          }).then((item) => {
            if (item.code === 200) {
              this.$message({
                type: "success",
                message: "批量启用成功",
              });
              this.fetchData();
            } else {
              this.$message({
                type: "error",
                message: "批量启用失败",
              });
            }
          });
        }
        if (i === 3) {
          this.extension = true;
          this.resetExtensionData();
          getDoMainGroupListInfo().then((item) => {
            if (item.code === 200) {
              this.getDoMainGroupListInfoData = item.data;
            }
          });
        }
        return;
      }
      this.$message({
        type: "warning",
        message: "请先选取数据",
      });
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
  width: auto;
  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
</style>
