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
        oninput="value=value.replace(/[^\d]/g,'')"
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
        value-format="timestamp"
        :default-time="['00:00:00', '23:59:59']"
        @change="handleSearchFilter"
      ></el-date-picker>
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="handleSearchFilter"
      ></el-button>
    </div>
    <el-table v-cloading="listLoading" :data="list" size="mini">
      <!--  <el-table-column type="index" label="序号" width="60"  ></el-table-column> -->
      <el-table-column label="用户ID" min-width="80"  >
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column
        prop="level"
        label="等级"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="balance"
        label="余额(金币)"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="gameTotalCoin"
        label="游戏总盈亏(VND)"
        min-width="60"
         
      ></el-table-column>
      <!--   <el-table-column prop="zzTotalAmount" label="至尊游戏盈亏(VND)" min-width="60"  ></el-table-column> -->
      <el-table-column
        prop="kyTotalCoin"
        label="开元游戏盈亏(VND)"
        min-width="80"
         
      ></el-table-column>
      <!--    <el-table-column prop="fwTotalCoin" label="富翁游戏盈亏(VND)" min-width="80"  ></el-table-column> -->
      <el-table-column
        prop="cpTotalCoin"
        label="彩票盈亏(VND)"
        min-width="120"
         
      ></el-table-column>
      <!-- <el-table-column prop="agTotalCoin" label="AG游戏盈亏(VND)" min-width="80"  ></el-table-column> -->
      <el-table-column
        prop="payAmountAll"
        label="总充值金额(VND)"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="withdraw"
        label="总提现金额(VND)"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="review"
        label="待审核金额(VND)"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="activityTotalCoin"
        label="活动优惠总金额(VND)"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="payAmount"
        label="渠道充值金额(VND)"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="agentAmount"
        label="代理充值金额(VND)"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="bankAmount"
        label="银行卡充值金额(VND)"
        min-width="60"
         
      ></el-table-column>
      <el-table-column
        prop="timeIp"
        label="最近登录IP"
        min-width="120"
         
      ></el-table-column>
      <el-table-column
        prop="attribution"
        label="最近登录归属地"
        min-width="120"
         
      ></el-table-column>
      <el-table-column
        prop="lastLoginTime"
        label="最近登录时间"
        width="140"
         
      ></el-table-column>
      <!-- <el-table-column prop="ip" label="常用IP" width="140"  ></el-table-column> -->
      <!-- <el-table-column label="操作" width="100"  >
      <template slot-scope="{ row }">
        <el-button plain type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</el-button>
      </template> -->
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
import { getStatHistoryList } from "@/api/center/user/stat_user";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";

export default {
  name: "StatUserProfitController",
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
      console.log(this.listQuery);
      getStatHistoryList(this.listQuery)
        .then((res) => {
          var list = [];
          if (
            res.data != null &&
            res.data != undefined &&
            JSON.stringify(res.data) != "{}"
          ) {
            var lastLoginTimeString = res.data.lastLoginTime;
            list.push(res.data);
          }
          this.list = list;
          this.listLoading = false;
        })

        //   this.list = (res.data.list || []).map(item => {
        //     this.$set(item, 'lastLoginTimeString', formatUnixTime(item.lastLoginTime));
        //     return item;
        //   });
        //   console.log(this.list);
        //   this.listLoading = false;
        //   this.listQuery.total = res.data.total;
        // })
        .catch((err) => {
          this.list = null;
          this.listQuery.total = 0;
          this.listLoading = false;
          this.$message.error(err);
        });
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        uid: 0,
        cashPassword: null,
      };
    },
    // 创建/更新 数据
    handleChangeDataClick(uid, turnover) {
      const params = {
        uid: uid,
        turnover: turnover,
      };
      // 请求服务器
      this.dialogChangeVisible = true;
      if (this.dialogStatus === "change") {
        changeUserTurnover(params)
          .then((res) => {
            this.dialogChangeLoading = false;
            this.dialogChangeVisible = false;
            this.$notify({
              title: "提示",
              message: "修改用户流水成功",
              type: "success",
              duration: 1500,
            });
            setTimeout((_) => {
              this.fetchData();
            }, 200);
          })
          .catch((err) => {
            this.dialogChangeLoading = false;
            this.$message.error(err);
          });
      }
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
    // 显示编辑弹出窗
    showChangeDialogClick() {
      this.resetChangeModel();
      this.dialogChangeVisible = true;
      this.dialogStatus = "change";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    //更新提现密码
    updateCashPasswordClick() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel);

          // 请求服务器
          this.dialogCreateLoading = true;
          const params = {
            uid: formDic.uid,
            cashPassword: formDic.cashPassword,
          };
          updateCashPassword(params)
            .then((res) => {
              this.dialogCreateLoading = false;
              this.dialogCreateVisible = false;
              this.$notify({
                title: "提示",
                message: "修改成功",
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
