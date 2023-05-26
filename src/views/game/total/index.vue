<template>
  <div class="app-container">
    <el-form :inline="true">
      <!-- 状态 -->
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-edit-outline"
          @click="showCreateDialogClick()"
          >设置流水门槛</el-button
        >
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
      size="mini"
     >
      <el-table-column
        prop="totalCount"
        label="开元游戏人数"
        min-width="80"
         
        sortable
      />
      <el-table-column
        prop="upCoin"
        label="开元总代入(VND)"
        min-width="80"
         
        sortable
      />
      <el-table-column
        prop="downCoin"
        label="开元总代出(VND)"
        min-width="80"
         
        sortable
      />
      <el-table-column
        prop="allCoin"
        label="开元总盈亏(VND)"
        min-width="80"
         
        sortable
      />
    </el-table>

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
          <el-form-item label="用户ID" prop="uid"
            ><el-input
              v-model="createModel.uid"
              clearable
              placeholder="请输入用户ID"
              maxlength="200"
          /></el-form-item>
          <el-form-item label="流水值" prop="statement"
            ><el-input
              v-model="createModel.statement"
              clearable
              placeholder="请输入流水值"
              maxlength="100"
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
import { getTransAll, setStatement } from "@/api/game/trans";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";

export default {
  name: "KyGameController",
  filters: {
    typeFilter(type) {
      const map = { 0: "info", 1: "success", 2: "danger" };
      return map[type];
    },
    statusFilter(status) {
      const map = { 0: "info", 2: "success", 3: "danger" };
      return map[status];
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        orderId: null,
        type: null,
        uid: null,
        pickerValue: [],
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      dialogTitleMap: {
        create: "设置流水",
        update: "编辑流水",
      },

      // 表单模型
      createModel: {
        uid: 0,
        statement: null,
      },

      rules: {
        uid: [
          { required: true, message: "请输入用户ID", trigger: "change" },
          { min: 1, max: 200, message: "最多为200个字符", trigger: "change" },
        ],
        statement: [
          { required: true, message: "请输入设置的流水", trigger: "change" },
          { min: 1, max: 100, message: "最多为100个字符", trigger: "change" },
        ],
      },

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
    resetCreateModel() {
      this.createModel = {
        uid: 0,
        statement: null,
      };
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getTransAll(this.listQuery)
        .then((res) => {
          var totallist = [];
          if (
            res.data != null &&
            res.data != undefined &&
            JSON.stringify(res.data) != "{}"
          ) {
            totallist.push(res.data);
          }
          this.list = totallist;
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

    // 创建/更新 数据
    handleDataClick() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel);
          if (formDic.uid == null || formDic.uid < 0) {
            this.$message.error("参数错误");
            return;
          }
          if (formDic.statement == null || formDic.statement < 0) {
            this.$message.error("参数错误");
            return;
          }
          const params = {
            uid: nullS(formDic.uid),
            statement: nullS(formDic.statement),
          };
          this.$confirm("是否设置该流水？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            showClose: false,
          }).then(() => {
            // 请求网络
            this.listLoading = true;
            setStatement(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "设置流水成功",
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
          });
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
