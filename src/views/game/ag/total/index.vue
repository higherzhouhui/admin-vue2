<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
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

    <el-table v-cloading="listLoading" :data="list" size="mini">
      <el-table-column
        prop="totalCount"
        label="AG游戏人数"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="upCoin"
        label="总代入(VND)"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="downCoin"
        label="总代出(VND)"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="allCoin"
        label="总盈亏(VND)"
        min-width="80"
         
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
import { getTransAll } from "@/api/game/ag/trans";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";

export default {
  name: "AgGameTransController",
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
        page: 1,
        limit: 20,
        total: 0,
        orderId: null,
        type: null,
        uid: null,
        pickerValue: [],
      },

      typeOptions: [
        { value: 1, label: "代入" },
        { value: 2, label: "代出" },
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
