<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <span style="margin-right: 10px"></span>
      <el-input
        size="medium"
        v-model="listQuery.aid"
        class="input-with-select"
        placeholder="请输入代理商id"
        clearable
        @keyup.enter.native="handleSearchFilter"
        @clear="handleSearchFilter"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleSearchFilter"
        ></el-button>
      </el-input>
      <span style="margin-right: 10px"></span>
      <el-input
        size="medium"
        v-model="listQuery.uid"
        class="input-with-select"
        placeholder="请输入用户id"
        clearable
        @keyup.enter.native="handleSearchFilter"
        @clear="handleSearchFilter"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleSearchFilter"
        ></el-button>
      </el-input>
      <span style="margin-right: 10px"></span>
      <el-date-picker
        size="small"
        clearable
        v-model="listQuery.pickerValue"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        format="yyyy-MM-dd HH:mm:ss"
        :default-time="['00:00:00', '23:59:59']"
        value-format="timestamp"
        @change="handleSearchFilter"
      ></el-date-picker>
    </div>

    <el-table
      v-cloading="listLoading"
      :data="list"
      border
      highlight-current-row
      size="mini"
    >
      <el-table-column
        type="index"
        label="序号"
        width="60"
         
      ></el-table-column>
      <el-table-column
        prop="aid"
        label="代理商ID"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="username"
        label="代理商名称"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="uid"
        label="充值用户ID"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="rechargeCoin"
        label="充值金币量"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="agentBalance"
        label="充值后代理商金币余额"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="userBalance"
        label="充值前用户余额"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="160"
         
      ></el-table-column>
    </el-table>

    <el-table v-cloading="todayListLoading" :data="todayList" border size="mini">
      <el-table-column
        type=""
        label=""
        width="60"
         
      ></el-table-column>
      <el-table-column
        prop=""
        label=""
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop=""
        label=""
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop=""
        label=""
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="totalCoin"
        label="总充值金币量"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop=""
        label=""
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop=""
        label=""
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop=""
        label=""
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop=""
        label=""
        width="160"
         
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
import { agentRechargeList, agentTotalList } from "@/api/agent/recharge";
import { nullS, formatUnixTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";

export default {
  name: "AgentUserController",
  filters: {},
  components: {
    UserDrawer,
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        aid: null,
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
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      this.todayListLoading = true;
      agentTotalList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          var totallist = [];
          if (
            res.data != null &&
            res.data != undefined &&
            JSON.stringify(res.data) != "{}"
          ) {
            totallist.push(res.data);
          }
          this.todayList = totallist;
          this.todayListLoading = false;
          this.listLoading = false;
          return agentRechargeList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          );
        })
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
  margin: 20px 0px 20px 0px;
  padding: 0px;
}
</style>
