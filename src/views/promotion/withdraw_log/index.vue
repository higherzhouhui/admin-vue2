<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-tag type="primary">创建时间:</el-tag>
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
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          @change="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-tag type="primary">审核时间:</el-tag>
        <el-date-picker
          v-model="listQuery.withdrawValue"
          size="small"
          clearable
          type="datetimerange"
          :picker-options="withdrawOptions"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          @change="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.status"
          size="small"
          placeholder="请选择提现状态"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          style="width: 240px"
          placeholder="请输入用户ID"
          clearable
          maxlength="20"
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.orderNo"
          size="small"
          placeholder="请输入订单号"
          clearable
          maxlength="20"
          oninput="value=value.replace(/[^\d]/g,'')"
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
          @click="refreshData()"
        >重置</el-button>
      </el-form-item>
      <el-table
        v-cloading="listLoading"
        :data="list"
        highlight-current-row
        size="mini"
         >
        <!-- 展开 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" class="demo-table-expand">
              <el-form-item label="开户银行">
                <span>{{ props.row.bankName }}</span>
              </el-form-item>
              <el-form-item label="开户省">
                <span>{{ props.row.bankProvince }}</span>
              </el-form-item>
              <el-form-item label="支行名称">
                <span>{{ props.row.bankSub }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column type="index" label="序号" width="60"   />
        <el-table-column label="用户ID" min-width="80"  >
          <template slot-scope="{ row }">
            <user-drawer :uid="row.uid" />
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="提现金额(VND)"
          min-width="140"
           
          sortable
        />
        <el-table-column
          prop="fee"
          label="手续费比率"
          min-width="120"
           
        />
        <el-table-column
          prop="trueBalance"
          label="消耗的金额(VND)"
          min-width="140"
           
          sortable
        />
        <el-table-column
          prop="orderNo"
          label="订单号"
          min-width="140"
           
        />
        <el-table-column
          prop="bankName"
          label="开户银行"
          min-width="80"
           
        />
        <el-table-column
          prop="cardNo"
          label="银行卡号"
          min-width="80"
           
        />
        <el-table-column
          prop="bankCity"
          label="开户市"
          min-width="80"
           
        />
        <el-table-column
          prop="trueName"
          label="真实姓名"
          min-width="80"
           
        />
        <el-table-column label="提现状态" width="100"  >
          <template slot-scope="{ row }">
            <el-tag size="medium" :type="row.status | statusFilter">{{
              row.statusString
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="operator"
          label="操作人"
          min-width="60"
           
        />
        <el-table-column
          prop="createTimeString"
          label="创建时间"
          width="160"
           
        />
        <el-table-column
          prop="updateTimeString"
          label="审核时间"
          width="160"
           
        />
        <el-table-column
          label="操作"
          width="220"
           
          v-if="$store.getters.buttonPermission.includes('分享出款审核操作')"
        >
          <template slot-scope="{ row }">
            <el-button
              v-if="true"
              plain
              type="success"
              size="mini"
              @click="checkUserShareAgentClick(row)"
              >代付</el-button
            >
            <el-button
              plain
              type="info"
              size="mini"
              @click="checkPassClick(row)"
              >人工</el-button
            >
            <!-- <el-button plain type="success" size="mini" @click="checkAgentClick(row)">代付</el-button> -->
            <el-button
              plain
              type="danger"
              size="mini"
              @click="checkRefuseClick(row)"
              >驳回</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-table
        v-cloading="todayListLoading"
        :data="todayList"
        highlight-current-row
        size="mini"
      >
        <!-- 展开 -->
        <el-table-column type="index" label="" width="60"   />
        <el-table-column label="" min-width="80"   />
        <el-table-column
          prop="totalAmount"
          label="提现总金额"
          min-width="80"
           
        />
        <el-table-column prop="" label="" min-width="80"   />
        <el-table-column
          prop="totalTrueBalance"
          label="消耗的总金额(VND)"
          min-width="80"
           
        />
        <el-table-column prop="" label="" min-width="80"   />
        <el-table-column prop="" label="" min-width="80"   />
        <el-table-column prop="" label="" min-width="80"   />
        <el-table-column label="" width="100"   />
        <el-table-column prop="" label="" min-width="60"   />
        <el-table-column prop="" label="" width="160"   />
        <el-table-column prop="" label="" width="160"   />
        <el-table-column label="" width="160"   />
      </el-table>

      <!-- 分页 -->
      <el-pagination
        class="vue-pagination"
        background
        :current-page="listQuery.page"
        :page-sizes="[10, 20, 50, 100, 1000]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listQuery.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-form>
  </div>
</template>

<script>
import {
  getPromotionWithdrawLogList,
  checkShareAgentStatus,
  checkStatus,
  checkAgentStatus,
  getPromotionWithdrawLog,
} from "@/api/promotion/withdraw_log";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";

export default {
  name: "PromotionWithdrawLogPage",
  filters: {
    statusFilter(status) {
      const map = { 0: "info", 1: "success", 2: "danger" };
      return map[status];
    },
  },
  components: {
    UserDrawer,
  },
  data() {
    return {
      list: null,
      todayList: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        status: null,
        uid: null,
        pickerValue: [],
        withdrawValue: [],
      },

      // 状态选择
      statusOptions: [
        { label: "待审核", value: 0 },
        { label: "已通过", value: 1 },
        { label: "驳回", value: 2 },
        { label: "代付成功", value: 5 },
        { label: "代付中", value: 7 },
        { label: "代付失败", value: 6 },
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

      withdrawOptions: {
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
      this.list = null;
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        status: null,
        pickerValue: [],
      };
      this.fetchData();
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      this.todayListLoading = true;
      getPromotionWithdrawLog(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
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
          return getPromotionWithdrawLogList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          );
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var statusString = "";
            switch (item.status) {
              case 0:
                statusString = "待审核";
                break;
              case 1:
                statusString = "已通过";
                break;
              case 2:
                statusString = "驳回";
                break;
              case 5:
                statusString = "代付成功";
                break;
              case 6:
                statusString = "代付失败";
                break;
              case 7:
                statusString = "代付中";
                break;
              default:
                break;
            }

            this.$set(item, "amount", item.amount.toLocaleString());
            this.$set(item, "trueBalance", item.trueBalance.toLocaleString());
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

    checkPassClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error("参数错误");
        return;
      }
      if (row.status > 0) {
        this.$message.error("已审核，请勿重复操作");
        return;
      }
      const rowDic = Object.assign({}, row);

      this.$confirm("是否通过？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          checkStatus(rowDic.id, rowDic.uid, 1)
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "审核成功",
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

    checkUserShareAgentClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error("参数错误");
        return;
      }
      if (
        row.status == 1 ||
        row.status == 2 ||
        row.status == 5 ||
        row.status == 7 ||
        row.status == 6
      ) {
        this.$message.error("已审核，请勿重复操作");
        return;
      }

      const rowDic = Object.assign({}, row);

      this.$confirm("是否使用代付处理？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          checkShareAgentStatus(rowDic.id, rowDic.uid, row.status, 3)
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "审核成功",
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

    checkAgentClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error("参数错误");
        return;
      }
      if (row.status > 0) {
        this.$message.error("已审核，请勿重复操作");
        return;
      }
      const rowDic = Object.assign({}, row);

      this.$confirm("是否代付处理？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          checkAgentStatus(rowDic.id, rowDic.uid, 1)
            .then((res) => {
              this.listLoading = false;
              if (res.code === 200) {
                this.$notify({
                  title: "提示",
                  message: res.message || '提交代付成功',
                  type: "success",
                });
                setTimeout((_) => {
                  this.fetchData();
                }, 200);
              }
            })
            .catch((err) => {
              this.listLoading = false;
              this.$message.error(err);
            });
        })
        .catch(() => {});
    },

    checkRefuseClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error("参数错误");
        return;
      }

      if (
        row.status == 1 ||
        row.status == 2 ||
        row.status == 5 ||
        row.status == 6
      ) {
        this.$message.error("已审核，请勿重复操作");
        return;
      }
      const rowDic = Object.assign({}, row);

      this.$confirm("是否驳回？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          checkStatus(rowDic.id, rowDic.uid, 2)
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "驳回成功",
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
