<template>
  <div class="app-container">
    <div class="flex-top-center">
      <div>
        <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" :dateType="1" />
        <el-form :inline="true">
          <!-- <el-form-item>
            <el-tag type="info">查询时间:</el-tag>
            <el-date-picker
              v-model="listQuery.pickerValue"
              size="small"
              clearable
              type="daterange"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleSearchFilter"
            />
          </el-form-item> -->
          <el-form-item>
            <!-- <el-tag type="info">代理ID:</el-tag> -->
            <el-input
              v-model="listQuery.agentId"
              size="small"
              class="input-with-select"
              placeholder="请输入代理ID"
              clearable
              maxlength="16"
              @keyup.enter.native="handleSearchFilter"
              @clear="handleSearchFilter"
            />
          </el-form-item>
          <el-form-item>
            <!-- <el-tag type="info">登录名:</el-tag> -->
            <el-input
              v-model="listQuery.account"
              size="small"
              class="input-with-select"
              placeholder="请输入登录名"
              clearable
              maxlength="16"
              @keyup.enter.native="handleSearchFilter"
              @clear="handleSearchFilter"
            />
          </el-form-item>
          <!-- <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
          <el-form-item>
            <!-- <el-tag type="info">订单号:</el-tag> -->
            <el-input
              v-model="listQuery.orderId"
              size="small"
              class="input-with-select"
              placeholder="请输入订单号"
              clearable
              maxlength="50"
              @keyup.enter.native="handleSearchFilter"
              @clear="handleSearchFilter"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              size="small"
              icon="el-icon-search"
              type="primary"
              @click="handleSearchFilter"
              >搜索</el-button
            >
            <!-- 重置 -->
            <el-button size="small" icon="el-icon-refresh" @click="resets">
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 导出 -->
      <el-button
        size="small"
        :loading="downloadLoading"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >
        导出Excel
      </el-button>
    </div>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
      :cell-style="cellStyle"
      fit
      highlight-current-row
    >
      <!-- <el-table-column type="index" label="序号" width="60"   /> -->
      <!-- <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="订单时间">
              <span>{{ handleTimeZoneShow(props.row.createTime) }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column> -->
      <el-table-column prop="agentIdX" label="代理ID">
        <template slot-scope="{ row }">
          <span>{{ row.agentId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="orderId" label="订单号" min-width="200" />
      <el-table-column prop="agentAccount" label="登录名" min-width="100" />

      <!-- <el-table-column prop="outerNo" label="第三方订单号" min-width="80"  ></el-table-column> -->
      <el-table-column prop="amount" label="取款金额" min-width="100" />
      <el-table-column
        prop="beforeAmount"
        label="申请前账户余额"
        min-width="120"
      />
      <el-table-column label="网链协议" min-width="180">
        <template slot-scope="{ row }">
          <!-- {{ `${row.bankName}${row.cardNo}${row.trueName}` }} -->
          {{ row.walletProtocol }}
        </template>
      </el-table-column>

      <el-table-column prop="walletAddress" label="收款地址" min-width="270" />
      <el-table-column prop="confirmUserOne" label="审核人" />
      <el-table-column prop="confirmUserTwo" label="审核确认" />
      <el-table-column label="状态" width="80">
        <template slot-scope="{ row }">
          <el-tag
            size="medium"
            :type="
              row.status == '-1'
                ? 'danger'
                : row.status == '0'
                ? 'danger'
                : row.status == '1'
                ? 'warning'
                : row.status == '3'
                ? 'warning'
                : row.status == '4'
                ? 'success'
                : ''
            "
          >
            {{
              row.status == "-1"
                ? "出款失败"
                : row.status == "0"
                ? "已拒绝"
                : row.status == "1"
                ? "待审核"
                : row.status == "3"
                ? "出款中"
                : row.status == "4"
                ? "已完成"
                : ""
            }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="订单时间" min-width="140">
        <template slot-scope="{ row }">
          {{ handleTimeZoneShow(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="完成时间" min-width="140">
        <template slot-scope="{ row }">
          {{ row.status == 1 ? "" : handleTimeZoneShow(row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="{ row }">
          <!-- <div v-if="row.status == 2">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="showUpdateDialogClick(row, 1)"
              >审核通过</el-button
            >
            <el-button
              type="danger"
              plain
              size="mini"
              @click="showUpdateDialogClick(row, 3)"
              >审核拒绝</el-button
            >
          </div> -->
          <div v-if="row.status == 1">
            <span
              class="operation_btn"
              type="primary"
              plain
              size="mini"
              @click="showUpdateDialogClick(row, 2)"
              >代付</span
            >
            <span
              class="operation_btn"
              type="danger"
              plain
              size="mini"
              @click="showUpdateDialogClick(row, 3)"
              >拒绝</span
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import {
  getWithdrawInfoExport,
  getWithdrawInfo,
  checkConfirm,
} from "@/api/agentManagement/withdrawMoney";
import { goldAgent } from "@/api/agentManagement/withdrawMoney2";
import { formatUnixTime, getNowFormatDay } from "@/utils/tools";
// const NOW_TIME_START = getNowFormatDay('-')
export default {
  name: "VirtualagentManagementWithdrawMoney",
  data() {
    return {
      list: [],
      todayList: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        pickerValue: [],
        account: null,
        orderId: null,
      },
      listQueryData() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 20,
          total: 0,
          pickerValue: [this.getMonth, this.getMonth],
        };
      },
      operator: this.$store.state.user.name,
      downloadLoading: false,
      currencyRateVO: {},
    };
  },
  computed: {
    getMonth() {
      let noTime = this.$store.getters.timerDate[0]
      return getNowFormatDay('-', true, noTime)
    }
  },
  created() {
    this.listQuery.pickerValue = [this.getMonth, this.getMonth]
    this.fetchData();
    // 获取登录用户名
    // getInfo().then((item) => {
    //   if (item.code === 200) {
    //     this.operator = item.data.name
    //   }
    // })
  },
  methods: {
    handleTimeZoneShow(time) {
      return formatUnixTime(time);
    },
    cellStyle(row, column, rowIndex, columnIndex) {
      // 根据报警级别显示颜色
      // console.log(row);
      // console.log(row.column);
      if (row.column.label === "商户名称") {
        return "color:#42b983";
      }
    },
    // 重置刷新
    resets() {
      this.listQueryData();
      this.fetchData();
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      this.todayListLoading = true;
      // .limit, this.listQuery.page, this.listQuery
      const datas = {
        ...this.listQuery,
        startDate:
          this.listQuery.pickerValue !== null
            ? this.listQuery.pickerValue[0]
            : null,
        endDate:
          this.listQuery.pickerValue !== null
            ? this.listQuery.pickerValue[1]
            : null,
        withdrawType: 2,
      };
      // console.log(this.listQuery.pickerValue, this.listQuery, datas);
      getWithdrawInfo(datas)
        .then((res) => {
          this.todayListLoading = false;
          this.listLoading = false;
          if (res.code === 200) {
            this.list = res.rows;
            this.listQuery.total = res.total;
          }
        })
        .catch((err) => {
          this.list = null;
          this.listQuery.total = 0;
          this.listLoading = false;
          this.$message.error(err);
        });
    },

    // 导出
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      const data = {
        ...this.listQuery,
        withdrawType: 2,
        endDate:
          this.listQuery.pickerValue[0] !== undefined
            ? this.listQuery.pickerValue[1]
            : "",
        orderId: this.listQuery.orderId,
        startDate:
          this.listQuery.pickerValue[0] !== undefined
            ? this.listQuery.pickerValue[0]
            : "",
      };
      this.downloadLoading = true;
      getWithdrawInfoExport(data) // 导出的接口
        .then((result) => {
          this.downloadLoading = false;
          console.log(result);
          const link = document.createElement("a"); // 创建a标签
          const blob = new Blob([result], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }); // 设置文件流
          link.style.display = "none";
          // 设置连接
          link.href = URL.createObjectURL(blob); // 将文件流转化为blob地址
          link.download = "虚拟币取款审核报表";
          document.body.appendChild(link);
          // 模拟点击事件
          link.click(); // 设置点击事件
        })
        .catch((err) => {
          this.downloadLoading = false;
          console.log(err);
        });
    },

    // 过滤
    handleSearchFilter() {
      this.listQuery.pageNum = 1;
      this.fetchData();
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.listQuery.pageNum = 1;
      this.fetchData();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.fetchData();
    },

    // 佣金发放
    showUpdateDialogClick(row, indexData) {
      console.log("佣金发放", row);
      // let operator
      // 待审核
      // if (indexData === 1) {
      //   this.$prompt("操作备注", "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //   })
      //     .then(({ value }) => {
      //       checkConfirm({
      //         ...row,
      //         status: 2,
      //         operator: this.operator,
      //         remark: value,
      //       }).then((item) => {
      //         if (item.code === 200) {
      //           this.$message({
      //             type: "success",
      //             message: "审核成功",
      //           });
      //           this.fetchData();
      //         }
      //       });
      //     })
      //     .catch(() => {
      //       this.$message({
      //         type: "info",
      //         message: "取消了该操作",
      //       });
      //     });
      // }
      // 拒绝
      if (indexData === 3) {
        this.$prompt("操作备注", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(({ value }) => {
            checkConfirm({
              ...row,
              status: 0,
              operator: this.operator,
              remark: value,
            }).then((item) => {
              if (item.code === 200) {
                this.$message({
                  type: "success",
                  message: "拒绝成功",
                });
                this.fetchData();
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消了该操作",
            });
          });
      }
      // 人工出款
      if (indexData === 2) {
        this.$confirm("确认出款", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(() => {
            const data = {
              id: row.id,
              uid: row.agentId,
              status: 1,
              withdrawType: 3,
              bankSub: row.walletProtocol,
              cardNo: row.walletAddress,
              orderNo: row.orderId,
              trueName: row.trueName,
              // gmtCreate: row.createTime,
              cash: row.rateAmount,
              withdrawWay: 2,
            };
            console.log(data);
            goldAgent(data)
              .then((item) => {
                if (item.code === 200) {
                  this.$message({
                    type: "success",
                    message: "审核成功",
                  });
                  this.fetchData();
                }
              })
              .catch((err) => {
                this.$message({
                  type: "error",
                  message: err,
                });
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消了该操作",
            });
          });
      }
    },
  },
};
</script>
<style scoped>
.span_primary {
  margin-right: 10px;
  color: #fc708b;
  cursor: pointer;
}
.input-with-select {
  background-color: #fff;
  width: auto;
  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
</style>
