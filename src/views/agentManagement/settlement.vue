<template>
  <div class="app-container">
    <div class="flex-top-center">
      <el-form :inline="true">
        <el-form-item>
          <!-- <el-tag type="info">查询时间:</el-tag> -->
          <el-date-picker
            v-model="listQuery.month"
            clearable
            size="small"
            type="month"
            placeholder="选择月"
            value-format="yyyy-MM"
            @change="handleSearchFilter"
          />
        </el-form-item>
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
          <!-- <el-tag type="info">代理账号:</el-tag> -->
          <el-input
            v-model="listQuery.agentAccount"
            size="small"
            class="input-with-select"
            placeholder="请输入代理账号"
            clearable
            maxlength="16"
            @keyup.enter.native="handleSearchFilter"
            @clear="handleSearchFilter"
          />
        </el-form-item>
        <el-form-item>
          <!-- <el-tag type="info">上级账号:</el-tag> -->
          <el-input
            v-model="listQuery.parentAgent"
            size="small"
            class="input-with-select"
            placeholder="请输入上级账号"
            clearable
            maxlength="16"
            @keyup.enter.native="handleSearchFilter"
            @clear="handleSearchFilter"
          />
        </el-form-item>
        <!-- <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
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
          <!-- 导出 -->
        </el-form-item>
      </el-form>
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
    <el-form>
      <el-form-item>
        <el-button
          :loading="listLoading"
          size="small"
          type="primary"
          icon="el-icon-refresh-right"
          @click="reCalcuLate"
        >
          重新核算上月
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
      :cell-style="cellStyle"
      fit
      highlight-current-row
      show-summary
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="agentIdX" label="代理ID" min-width="120">
        <template slot-scope="{ row }">
          <span>{{ row.agentId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="month" label="日期" min-width="100" />
      <el-table-column prop="agentAccount" label="代理账号" min-width="120" />

      <!-- <el-table-column prop="outerNo" label="第三方订单号" min-width="80"  ></el-table-column> -->
      <el-table-column prop="pagentAccountX" label="上级代理" min-width="120">
        <template slot-scope="{ row }">
          {{
            row.pagentAccount == null || row.pagentAccount == undefined
              ? "总代"
              : row.pagentAccount
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="agentLevelX"
        label="代理级别"
        :formatter="formatterType"
      />
      <!-- <el-table-column
        prop="name"
        label="本月佣金"
        min-width="80"
         
        :key="Math.random()"
      /> -->

      <el-table-column
        prop="directMemberAmt"
        label="直属佣金"
        width="120"
        sortable
      />
      <el-table-column
        prop="directAgentAmt"
        label="代理抽成"
        width="120"
        sortable
      >
        <template slot-scope="{ row }">
          <!-- {{ row.totalAmt }} -->
          <div class="link" @click="routeToAgentCommissionDetail(row)">
            {{ row.directAgentAmt }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalLotteryRebate"
        label="直播彩票返水"
        width="120"
        sortable
      />
      <el-table-column
        prop="supportAmt"
        label="扶持佣金"
        width="120"
        sortable
      />
      <el-table-column prop="giftAmt" label="打赏抽成" width="140" sortable />
      <el-table-column
        prop="modifyAmt"
        label="调整佣金"
        sortable
        min-width="140"
      />
      <el-table-column
        prop="reversalAmt"
        label="上月冲正金额"
        width="140"
        sortable
      />
      <el-table-column prop="totalAmt" label="实际佣金" width="140" sortable />
      <el-table-column label="状态" width="80">
        <template slot-scope="{ row }">
          <el-tag
            v-if="row.status"
            size="medium"
            :type="
              row.status == 1
                ? 'info'
                : row.status == 2
                ? 'primary'
                : row.status == 3
                ? 'success'
                : 'default'
            "
            >{{
              row.status == 1
                ? "未结算"
                : row.status == 2
                ? "待发放"
                : row.status == 3
                ? "已发放"
                : row.status === 4
                ? "已冲正"
                : ""
            }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="105">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.status === 2"
            :key="row.id"
            type="primary"
            plain
            size="mini"
            @click="showUpdateDialogClick(row)"
            >佣金发放</el-button
          >
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
  agentCommissionStatis,
  giveAgentCommission,
  agentCommissionStatisExport,
  recalculateAgentCommission,
} from "@/api/agentManagement/tabledetail";
import { getNowFormatDay } from '@/utils/tools'
// const NOW_MONTH = getNowFormatDay('-', false)
export default {
  name: "AgentManagementSettlement",
  data() {
    return {
      list: [],
      todayList: null,
      listLoading: true,
      downloadLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        month: ''
      },
      listQueryData() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 20,
          total: 0,
          month: this.getMonth
        };
      },
      operator: this.$store.state.user.name,
    };
  },
  computed: {
    getMonth() {
      let noTime = this.$store.getters.timerDate[0]
      return getNowFormatDay('-', false, noTime)
    }
  },
  created() {
    this.listQuery.month = this.getMonth
    this.fetchData();
    // getInfo().then((item) => {
    //   if (item.code === 200) {
    //     this.operator = item.data.name;
    //   }
    // });
  },
  methods: {
    cellStyle(row, column, rowIndex, columnIndex) {
      // 根据报警级别显示颜色
      // console.log(row);
      // console.log(row.column);
      if (row.column.label === "商户名称") {
        return "color:#42b983";
      }
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      this.todayListLoading = true;
      agentCommissionStatis(this.listQuery)
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
    // 重置刷新
    resets() {
      this.listQueryData();
      this.fetchData();
    },

    // 导出
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      this.downloadLoading = true;
      agentCommissionStatisExport(this.listQuery) // 导出的接口
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
          link.download = "代理佣金结算报表";
          document.body.appendChild(link);
          // 模拟点击事件
          link.click(); // 设置点击事件
        })
        .catch((err) => {
          this.downloadLoading = false;
          console.log(err);
        });
    },
    reCalcuLate() {
      this.listLoading = true;
      recalculateAgentCommission()
        .then((res) => {
          this.listLoading = false;
          if (res.code === 200) {
            this.fetchData();
            this.$message({
              type: "success",
              message: "重新核算成功",
            });
          }
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: error,
          });
          this.listLoading = false;
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
    showUpdateDialogClick(row) {
      this.listLoading = true;
      giveAgentCommission({ id: row.id, operator: this.operator })
        .then((item) => {
          this.listLoading = false;
          if (item.code === 200) {
            this.fetchData();
            this.$message({
              type: "success",
              message: "佣金发放成功",
            });
          } else {
            this.$message({
              type: "error",
              message: item.msg,
            });
          }
        })
        .catch((err) => {
          this.listLoading = false;
          this.$message({
            type: "error",
            message: err,
          });
        });
    },
    formatterType(row) {
      if (row.agentLevel === 1) {
        return "总代";
      } else if (row.agentLevel === 2) {
        return "一级代理";
      } else if (row.agentLevel === 3) {
        return "二级代理";
      } else if (row.agentLevel === 4) {
        return "三级代理";
      } else if (row.agentLevel === 5) {
        return "四级代理";
      }
    },
    routeToAgentCommissionDetail(row) {
      const id = row.id;
      const name = row.agentAccount;
      this.$router.push({
        path: "/agentManagement/agentManagement/agentcommissionDetail",
        query: {
          id: id,
          agentAcccount: name,
        },
      });
    },
  },
};
</script>
<style scoped>
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

.link {
  color: blue;
  text-decoration: underline;
  padding: 3px 5px;
  cursor: pointer;
}
</style>
