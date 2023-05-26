<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <!-- <el-select size="medium" v-model="listQuery.type" placeholder="请选择类型" clearable @change="handleSearchFilter">
        <el-option v-for="item in statusOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
      </el-select> -->

      <el-input
        v-model="listQuery.uid"
        size="medium"
        class="input-with-select"
        placeholder="请输入用户ID"
        clearable
        @keyup.enter.native="handleSearchFilter"
        @clear="handleSearchFilter"
      />
      <el-date-picker
        v-model="listQuery.pickerValue"
        size="medium"
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

      <el-button
        slot="append"
        icon="el-icon-search"
        @click="handleSearchFilter"
      />
    </div>

    <!-- <el-switch
         v-model="value3"
         active-text="今存明送开启"
         inactive-text="今存明送关闭">
       </el-switch> -->

    <el-button style="margin: 10px" type="primary" @click="handselStart()"
      >开启金牛报春活动</el-button
    >
    <el-button style="margin: 10px" type="primary" @click="handselStop()"
      >关闭金牛报春活动</el-button
    >
    <span style="margin-right: 10px" />
    <span style="color: #f00; font-size: 25px">金牛报春活动:{{ message }}</span>

    <!--  <el-button style="margin: 10px" type="primary" @click="buttonStart()">开启彩票按钮</el-button>
    <el-button style="margin: 10px" type="primary" @click="buttonStop()">关闭彩票按钮</el-button> -->

    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" label="序号" width="50"   />
      <!-- <el-table-column prop="id" label="ID" min-width="60"  ></el-table-column> -->
      <el-table-column
        prop="uid"
        label="用户id"
        min-width="50"
         
      />
      <el-table-column
        prop="sendUid"
        label="官方号"
        min-width="50"
         
      />
      <el-table-column
        prop="goldCoin"
        label="存款金额"
        min-width="50"
         
      />
      <!-- <el-table-column prop="userLevel" label="用户等级" min-width="50"   /> -->
      <!-- <el-table-column prop="cpCode" label="当日彩票流水" min-width="50"   /> -->
      <el-table-column
        prop="agCode"
        label="AG流水"
        min-width="50"
         
      />
      <el-table-column
        prop="kyCode"
        label="开元流水"
        min-width="50"
         
      />
      <el-table-column
        prop="fwCode"
        label="富翁流水"
        min-width="50"
         
      />

      <el-table-column
        prop="typeString"
        label="活动类型"
        min-width="50"
         
      />

      <el-table-column
        prop="handsel"
        label="派送彩金"
        min-width="50"
         
      />
      <el-table-column prop="msg" label="消息" min-width="200"   />
      <!-- <el-table-column prop="result" label="开奖号码" min-width="200"  ></el-table-column> -->

      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="150"
         
      />
    </el-table>

    <el-table v-cloading="todayListLoading" :data="todayList" border size="mini">
      <el-table-column type="" label="" width="60"   />
      <el-table-column prop="" label="" min-width="60"   />
      <el-table-column prop="" label="" min-width="60"   />
      <el-table-column
        prop="totalCoin"
        label="总派彩金"
        min-width="60"
         
      />
      <el-table-column prop="" label="" min-width="60"   />
      <el-table-column prop="" label="" min-width="60"   />
      <el-table-column prop="" label="" min-width="100"   />
      <el-table-column label="" width="80"   />
      <el-table-column prop="" label="" width="160"   />
      <el-table-column prop="" label="" width="160"   />
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

    <!-- <el-popover
    ref="popover4"
    placement="right"
    width="400"
    trigger="click">
    <el-table :data="gridData">
      <el-table-column width="150" property="date" label="日期"></el-table-column>
      <el-table-column width="100" property="name" label="姓名"></el-table-column>
      <el-table-column width="300" property="address" label="地址"></el-table-column>
    </el-table>
  </el-popover> -->
  </div>
</template>

<script>
import {
  getRecordList,
  getTotalList,
  stopCash_feedback1,
  startHandsel,
  cash_feedback1,
  stopHandsel,
  getCash_feedback,
  stopWage_scale,
  startWage_scale,
  getWage_scale,
  startCpButton,
  stopCpButton,
  getLotteryCode,
  getStatus,
} from "@/api/center/user/handsel";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";

export default {
  name: "CenterHandselController",
  filters: {
    statusFilter(status) {
      const map = { 0: "info", 2: "success", 3: "danger" };
      return map[status];
    },
  },
  data() {
    return {
      value3: true,
      value4: true,
      message: null,
      lotteryCode: null,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        cpName: null,
        uid: null,
        status: null,
        type: null,
        pickerValue: [],
      },

      statusOptions: [
        { value: 40, label: "今存明送" },
        { value: 41, label: "工资存放" },
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
      this.message = null;
      getCash_feedback1().then((res) => {
        if (
          res.data != null &&
          res.data != undefined &&
          JSON.stringify(res.data) != "{}"
        ) {
          var status = null;
          status = res.data;
          if (status === "0") {
            this.message = "已开启";
          } else {
            this.message = "已关闭";
          }
          console.log(this.message);
        }
      });
      getTotalList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery,
        43
      )
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
            this.listQuery,
            51
          );
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var typeString = "";
            if (item.type == 40) {
              typeString = "今存明送";
            } else if (item.type == 41) {
              typeString = "工资存放";
            } else if (item.type == 43) {
              typeString = "现金回馈";
            } else if (item.type == 44) {
              typeString = "彩票得意";
            } else if (item.type == 45) {
              typeString = "红包彩金";
            } else if (item.type == 51) {
              typeString = "金牛报春";
            }
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

    handselStart() {
      this.$confirm("是否开启金牛报春活动？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          cash_feedback1()
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

    handselStop() {
      this.$confirm("是否关闭金牛报春活动？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          stopCash_feedback1()
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
    lotteryResultCode(lotteryName, expect) {
      this.lotteryCode = null;
      getLotteryCode(lotteryName, expect).then((res) => {
        if (
          res.data != null &&
          res.data != undefined &&
          JSON.stringify(res.data) != "{}"
        ) {
          this.lotteryCode = res.data;
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
  width: 300px;
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
