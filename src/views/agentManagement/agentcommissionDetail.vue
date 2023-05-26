<template>
  <div class="app-container">
    <div v-if="$route.query.agentAcccount" class="titles">
      <span class="title">
        <span>{{ $route.query.agentAcccount }}</span>
        的直属代理
      </span>
      <span>
        <el-button size="small" icon="el-icon-refresh" @click="fetchData">
          刷新
        </el-button>
        <el-button size="small" type="primary" @click="backToLastPage">
          返回上一页
        </el-button>
      </span>
    </div>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
      :cell-style="cellStyle"
      fit
      highlight-current-row
      sum-text="当前页汇总"
      show-summary
    >
      <!-- <el-table-column type="index" label="序号" width="60"   /> -->
      <!-- <el-table-column
        prop="month"
        label="日期"
        min-width="100"
         
      /> -->
      <el-table-column prop="agentIdX" label="代理ID" min-width="120">
        <template slot-scope="{ row }">
          <span>{{ row.agentId }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="agentAccount" label="代理账号" />
      <el-table-column prop="" label="提成比例" min-width="140">
        <template slot-scope="{ row }">
          {{ row.parentAgentRatio + "%" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="parentAgentCommission"
        label="提成金额"
        min-width="80"
        sortable
      />
      <!-- <el-table-column fixed="right" label="状态" width="130"  >
        <template slot-scope="{ row }">
          <el-tag> {{ '未结算' }} </el-tag>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 分页 -->
    <!-- <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->
  </div>
</template>

<script>
import {
  getChildAgentCommission,
  teamCommissionStatisExport,
} from "@/api/agentManagement/tabledetail";

export default {
  name: "AgentcommissionDetail",
  data() {
    return {
      list: [],
      todayList: null,
      downloadLoading: false,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
      },
      listQueryData() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 20,
          total: 0,
        };
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label === "商户名称") {
        return "color:#42b983";
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      this.todayListLoading = true;
      getChildAgentCommission({ id: this.$route.query.id || 23 })
        .then((res) => {
          this.todayListLoading = false;
          this.listLoading = false;
          if (res.code === 200) {
            this.list = res.data.records;
            // this.listQuery.total = res.total
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
    // 过滤
    handleSearchFilter() {
      this.listQuery.pageNum = 1;
      this.fetchData();
    },
    // 导出
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      this.downloadLoading = true;
      teamCommissionStatisExport(this.listQuery) // 导出的接口
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
          link.download = "团队佣金统计报表";
          document.body.appendChild(link);
          // 模拟点击事件
          link.click(); // 设置点击事件
        })
        .catch((err) => {
          this.downloadLoading = false;
          console.log(err);
        });
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

    backToLastPage() {
      this.$router.push({
        path: "/agentManagement/agentManagement/settlement",
      });
    },
  },
};
</script>
<style scoped lang="scss">
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
.color1 {
  color: #008000;
}
.color2 {
  color: red;
}
.titles {
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  padding: 6px 0 16px 0;
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .return {
    padding: 5px 10px;
    background: var(--background);
    color: #fff;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    min-width: fit-content;
  }
  .myAgent {
    min-width: fit-content;
    padding: 5px 10px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 15px;
  }
}
/* ::v-deep .el-table th.gutter {
    display: table-cell !important;
  } */
</style>
