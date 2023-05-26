<template>
  <div class="app-container">
    <div
      style="
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      "
    >
      <div style="display: flex; align-items: center">
        <el-select
          size="small"
          v-model="listQuery.type"
          placeholder="请选择兑换类型"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in typeOptions"
            :label="item.label"
            :key="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
        <span style="margin: 5px"></span>
        <el-input
          size="small"
          style="width: 240px"
          v-model="listQuery.uid"
          class="input-with-select"
          placeholder="请输入用户ID"
          clearable
          maxlength="10"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
          oninput="value=value.replace(/[^\d]/g,'')"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleSearchFilter"
          ></el-button>
        </el-input>
        <span style="margin: 5px"></span>
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
      <el-button
        size="small"
        plain
        icon="el-icon-refresh"
        @click="refreshData()"
      ></el-button>
    </div>

    <el-table v-cloading="listLoading" :data="list" size="mini">
      <el-table-column
        type="index"
        label="序号"
        width="337"
         
      ></el-table-column>
      <el-table-column label="用户ID" min-width="80"  >
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column label="兑换类型" min-width="80"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.type | typeFilter">{{
            row.type == 1 ? "代出" : "代入"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="coin"
        label="金币数量"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="gmtCreateString"
        label="创建时间"
        min-width="80"
         
      ></el-table-column>
    </el-table>

    <el-table
      v-cloading="todayListLoading"
      :data="todayList"
      highlight-current-row
      size="mini"
    >
      <el-table-column
        prop="exchangeCoin"
        label="总代入金币"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="exchangeOutCoin"
        label="总代出金币"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="allCoin"
        label="总盈利金币"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="exchangeHallCoin"
        label="第三方游戏总代入金币"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="exchangeOutHallCoin"
        label="第三方游戏总代入金币"
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
import {
  getUserAssetsGameList,
  assetsGame,
} from "@/api/center/user/assets_game";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";

export default {
  name: "CenterUserAssetsGameController",
  filters: {
    typeFilter(status) {
      const map = { 0: "success", 1: "warning" };
      return map[status];
    },
  },
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
        uid: null,
        type: null,
        pickerValue: [],
      },
      // 道具选择
      typeOptions: [
        { label: "代入", value: 0 },
        { label: "代出", value: 1 },
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
    // 刷新
    refreshData() {
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        type: null,
        pickerValue: [],
      };
      this.fetchData();
    },

    // 获取列表数据
    fetchData() {
      this.todayListLoading = true;
      this.listLoading = true;
      assetsGame(this.listQuery.limit, this.listQuery.page, this.listQuery)
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
          // 读取收礼记录表
          return getUserAssetsGameList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          );
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            this.$set(item, "gmtCreateString", formatUnixTime(item.gmtCreate));
            return item;
          });
          this.listQuery.total = res.data.total;
          this.listLoading = false;
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
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
</style>
