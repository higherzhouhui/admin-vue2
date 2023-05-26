<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
        <span class="search_info">创建时间</span>
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
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
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
          icon="el-icon-s-promotion"
          @click="switchChangeFlag()"
          >一键派送</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
     >
      <el-table-column prop="id" label="序号" width="60"   />
      <el-table-column
        prop="uid"
        label="用户ID"
        min-width="60"
         
      />
      <el-table-column
        prop="goldCoin"
        label="彩金"
        min-width="200"
         
      />
      <el-table-column
        prop="theme"
        label="活动主题"
        min-width="80"
         
      />
      <el-table-column label="状态" width="120"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.status | statusFilter">{{
            row.statusString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="msg" label="备注" min-width="80"   />
      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="150"
         
      />
      <el-table-column
        prop="updateTimeString"
        label="更新时间"
        width="150"
         
      />
      <!--  <el-table-column label="操作" width="160"  >
        <template slot-scope="{ row }">
          <el-button plain type="primary" size="mini" @click="switchChangeFlag(row)">更改状态</el-button>
        </template>
      </el-table-column> -->
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
  </div>
</template>

<script>
import { getMysteriousList, updateStatus } from "@/api/center/user/mysterious";
import { formatUnixTime, getDateTime } from "@/utils/tools";
const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: "CenterUserMysteriousActivityController",
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
        uid: null,
        pickerValue: [],
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

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      dialogTitleMap: {
        create: "添加过滤用户ID",
        update: "编辑过滤用户ID",
      },

      // 表单模型
      createModel: {
        id: null,
        uid: null,
        details: null,
      },
      // 验证规则
      rules: {
        uid: [{ required: true, message: "请输入用户ID", trigger: "change" }],
      },
    };
  },
  computed: {
    initTimer() {
      return this.$store.getters.timerDate
    }
  },
  created() {
    this.listQuery.pickerValue = this.initTimer
    this.fetchData();
  },
  methods: {
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        pickerValue: this.initTimer,
      }
      this.fetchData()
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: null,
        uid: null,
        details: null,
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
        pickerValue: [],
      };
      this.fetchData();
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getMysteriousList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      )
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var statusString = "";
            if (item.status == 0) {
              statusString = "待派送";
            } else if (item.status == 1) {
              statusString = "已派送";
            }
            this.$set(item, "statusString", statusString);
            this.$set(item, "createTimeString", formatUnixTime(item.gmtCreate));
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

    // 更改状态
    switchChangeFlag() {
      this.$confirm("是否一键派送配置？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          updateStatus()
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "一键派送成功",
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

      // // 请求网络
      // updateStatus()
      //   .then(res => {
      //     this.listLoading = false
      //     this.$notify({
      //       title: '提示',
      //       message: '一键派送成功',
      //       type: 'success',
      //       duration: 1000
      //     })
      //   })
      //   .catch(err => {
      //     // 错误的情况下，修改内存属性
      //     this.listLoading = false
      //     this.$message.error(err)
      //   })
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
