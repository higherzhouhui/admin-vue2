<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-input
        size="medium"
        v-model="listQuery.uid"
        class="input-with-select"
        placeholder="请输入用户ID"
        clearable
        @keyup.enter.native="handleSearchFilter"
        @clear="handleSearchFilter"
      >
      </el-input>
      <span style="margin-right: 10px"></span>
      <el-date-picker
        size="medium"
        clearable
        v-model="listQuery.pickerValue"
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
      ></el-date-picker>
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="handleSearchFilter"
      ></el-button>
    </div>

    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <el-table-column
        type="index"
        label="序号"
        width="60"
         
      ></el-table-column>
      <el-table-column
        prop="uid"
        label="用户id"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="gameRecord"
        label="有效投注"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="betAmount"
        label="投注额"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="payment"
        label="派彩金额"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="typeString"
        label="游戏类型"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="gameTypeString"
        label="游戏详情"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="140"
         
      ></el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
    ></el-pagination>
  </div>
</template>

<script>
import { getAccountList } from "@/api/game/record/game_record";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";

export default {
  name: "GameRecordController",
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
        type: null,
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
      dialogTitleMap: {},

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
      };
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getAccountList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var typeString = "";
            if (item.type == 1) {
              typeString = "开元";
            } else if (item.type == 5) {
              typeString = "BG";
            }

            var gameTypeString = "";
            if (item.status == 0) {
              statusString = "BG视讯";
            } else if (item.status == 1) {
              statusString = "BG捕鱼";
            } else if (item.status == 2) {
              statusString = "开元";
            }
            this.$set(item, "gameTypeString", gameTypeString);
            this.$set(item, "typeString", typeString);
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
