<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <!-- 状态 -->
      <el-select
        size="medium"
        v-model="listQuery.type"
        placeholder="请选择类型"
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
      <el-select
        size="medium"
        v-model="listQuery.status"
        placeholder="请选择状态"
        clearable
        @change="handleSearchFilter"
      >
        <el-option
          v-for="item in statusOptions"
          :label="item.label"
          :key="item.value"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input
        size="medium"
        v-model="listQuery.orderId"
        class="input-with-select"
        placeholder="请输入订单号"
        clearable
        @keyup.enter.native="handleSearchFilter"
        @clear="handleSearchFilter"
      >
      </el-input>
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
        prop="id"
        label="ID"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="uid"
        label="用户id"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="localCoin"
        label="本地金币"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="agCoin"
        label="ag金币(VND)"
        min-width="60"
         
      ></el-table-column>
      <el-table-column label="类别" width="80"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.type | typeFilter">{{
            row.typeString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderId"
        label="订单号"
        min-width="120"
         
      ></el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        min-width="60"
         
      ></el-table-column>
      <el-table-column label="类别" width="80"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.status | statusFilter">{{
            row.statusString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="160"
         
      ></el-table-column>
      <el-table-column
        prop="updateTimeString"
        label="更新时间"
        width="160"
         
      ></el-table-column>
    </el-table>

    <el-table v-cloading="todayListLoading" :data="todayList" size="mini">
      <el-table-column
        type=""
        label=""
        width="60"
         
      ></el-table-column>
      <el-table-column
        prop=""
        label=""
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop=""
        label=""
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop=""
        label=""
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="upCoin"
        label="总代入(金币)"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="downCoin"
        label="总代出(金币)"
        width="80"
         
      ></el-table-column>
      <el-table-column
        prop="allCoin"
        label="总盈亏(金币)"
        min-width="120"
         
      ></el-table-column>
      <el-table-column
        prop=""
        label=""
        min-width="60"
         
      ></el-table-column>
      <el-table-column label="" width="80"  ></el-table-column>
      <el-table-column
        prop=""
        label=""
        width="160"
         
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
import { getTransList, getTransTotal } from "@/api/game/ag/trans";
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
        status: null,
        pickerValue: [],
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      dialogTitleMap: {},

      // 表单模型
      createModel: {
        uid: 0,
      },

      typeOptions: [
        { value: 1, label: "代入" },
        { value: 2, label: "代出" },
      ],
      statusOptions: [
        { value: 0, label: "成功" },
        { value: 2, label: "失败" },
        { value: 3, label: "处理中" },
      ],

      rules: {
        uid: [
          { required: true, message: "请输入用户ID", trigger: "change" },
          { min: 1, max: 200, message: "最多为200个字符", trigger: "change" },
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
      };
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      this.todayListLoading = true;
      getTransTotal(this.listQuery.limit, this.listQuery.page, this.listQuery)
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
          return getTransList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          );
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var statusString = "";
            if (item.status == -1) {
              statusString = "不存在";
            } else if (item.status == 0) {
              statusString = "成功";
            } else if (item.status == 2) {
              statusString = "失败";
            } else if (item.status == 3) {
              statusString = "处理中";
            }
            var typeString = "";
            if (item.type == 1) {
              typeString = "代入";
            } else if (item.type == 2) {
              typeString = "代出";
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
