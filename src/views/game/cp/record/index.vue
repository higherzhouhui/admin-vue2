<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
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
        v-model="listQuery.cpName"
        class="input-with-select"
        placeholder="请输入彩票名称"
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
    <el-button style="margin: 10px" type="primary" @click="changeStart()"
      >开启彩票弹窗</el-button
    >
    <el-button style="margin: 10px" type="primary" @click="changeStop()"
      >关闭彩票弹窗</el-button
    >

    <el-button style="margin: 10px" type="primary" @click="buttonStart()"
      >开启彩票按钮</el-button
    >
    <el-button style="margin: 10px" type="primary" @click="buttonStop()"
      >关闭彩票按钮</el-button
    >

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
      <el-table-column label="用户ID" min-width="60"  >
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column
        prop="balance"
        label="投注金币"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="cpName"
        label="彩票名称"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="expect"
        label="期号"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="playNum"
        label="投注详情"
        min-width="100"
         
      ></el-table-column>
      <el-table-column label="状态" width="80"  >
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
        prop="totalCoin"
        label="总投注金币"
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
        prop=""
        label=""
        min-width="100"
         
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
import {
  getRecordList,
  getTotalList,
  startCp,
  stopCp,
  startCpButton,
  stopCpButton,
} from "@/api/game/cp/record";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";

export default {
  name: "CpRecordController",
  filters: {
    statusFilter(status) {
      const map = { 0: "info", 2: "success", 3: "danger" };
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
        cpName: null,
        uid: null,
        status: null,
        pickerValue: [],
      },

      statusOptions: [
        { value: 1, label: "成功" },
        { value: 2, label: "失败" },
        { value: 3, label: "未知" },
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
      this.todayListLoading = true;
      getTotalList(this.listQuery.limit, this.listQuery.page, this.listQuery)
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
          return getRecordList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          );
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var statusString = "";
            if (item.status == 1) {
              statusString = "成功";
            } else if (item.status == 2) {
              statusString = "失败";
            } else if (item.status == 3) {
              statusString = "未知";
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

    changeStart() {
      this.$confirm("是否开启彩票弹窗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          startCp()
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "开启成功",
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
    },

    changeStop() {
      this.$confirm("是否关闭彩票弹窗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          stopCp()
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "关闭成功",
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
    },

    buttonStart() {
      this.$confirm("是否开启彩票按钮？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          startCpButton()
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "开启成功",
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
    },

    buttonStop() {
      this.$confirm("是否关闭彩票按钮？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          stopCpButton()
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "关闭成功",
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
