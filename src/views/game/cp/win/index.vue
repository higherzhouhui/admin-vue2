<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-input
        size="medium"
        v-model="listQuery.liveId"
        class="input-with-select"
        placeholder="请输入直播间ID"
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
      <el-input
        size="medium"
        v-model="listQuery.expect"
        class="input-with-select"
        placeholder="请输入期号"
        clearable
        @keyup.enter.native="handleSearchFilter"
        @clear="handleSearchFilter"
      >
      </el-input>
      <el-input
        size="medium"
        v-model="listQuery.type"
        class="input-with-select"
        placeholder="请输入彩票类型"
        clearable
        @keyup.enter.native="handleSearchFilter"
        @clear="handleSearchFilter"
      >
      </el-input>
      <span style="margin-right: 10px"></span>
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
        prop="liveName"
        label="主播昵称"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="liveId"
        label="直播间ID"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="expect"
        label="期数"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="bouns"
        label="用户中奖金额"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="type"
        label="彩票类型"
        min-width="60"
         
      ></el-table-column>
      <el-table-column label="状态" width="100"  >
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
import { getWinRecordList } from "@/api/game/cp/win";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";

export default {
  name: "CpRecordController",
  filters: {
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
        liveId: null,
        uid: null,
        expect: null,
        type: null,
        status: null,
        pickerValue: [],
      },

      // 状态选择
      statusOptions: [
        { label: "成功", value: 1 },
        { label: "失败", value: 2 },
      ],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getWinRecordList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      )
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var statusString = "";
            if (item.status == 1) {
              statusString = "成功";
            } else if (item.status == 2) {
              statusString = "失败";
            }
            this.$set(item, "statusString", statusString);
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
