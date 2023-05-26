<template>
  <div class="app-container">
    <el-form :inline="true">
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
        min-width="60"
         
      />
      <el-table-column
        prop="btiAccountId"
        label="BTI用户ID"
        min-width="60"
         
      />
      <el-table-column
        prop="btiNickName"
        label="BTI账号昵称"
        min-width="60"
         
      />
      <el-table-column
        prop="statusString"
        label="状态"
        min-width="60"
         
      />
      <!--  <el-table-column prop="autoUpBalanceString" label="是否自动上分" min-width="60"  ></el-table-column> -->
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
          <!--  <el-button plain type="primary" size="mini" @click="showUpdateDialogClick(row)">上分</el-button> -->
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
          <!-- <el-form-item label="金额" prop="amount">
            <el-input v-model.number="createModel.amount" clearable placeholder="请输入操作的金额" maxlength="20" />
          </el-form-item> -->
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
import { getAccountList, autoUp } from "@/api/game/bti/account";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";

export default {
  name: "BtiGameAccountController",
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
        uid: null,
        pickerValue: [],
      },

      // 表单模型
      createModel: {
        uid: 0,
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
            var autoUpBalanceString = "";
            if (item.autoUpBalance == 1) {
              autoUpBalanceString = "手动";
            } else if (item.autoUpBalance == 2) {
              autoUpBalanceString = "自动";
            }

            var statusString = "";
            if (item.status == 1) {
              statusString = "启动";
            } else if (item.status == 2) {
              statusString = "禁用";
            }
            this.$set(item, "statusString", statusString);
            this.$set(item, "autoUpBalanceString", autoUpBalanceString);
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
          // if (formDic.amount == null || formDic.amount < 0) {
          //   this.$message.error('金额不能为空');
          //   return;
          // }
          const params = {
            uid: formDic.uid,
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
