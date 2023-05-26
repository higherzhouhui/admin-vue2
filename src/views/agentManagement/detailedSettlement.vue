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
        </el-form-item>
      </el-form>
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
      <el-table-column prop="month" label="日期" min-width="100" />
      <el-table-column prop="agentIdX" label="代理ID" min-width="120">
        <template slot-scope="{ row }">
          <span>{{ row.agentId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="agentAccount" label="代理账号" min-width="100" />

      <!-- <el-table-column prop="outerNo" label="第三方订单号" min-width="80"  ></el-table-column> -->
      <el-table-column prop="pagentAccount" label="上级代理" min-width="100">
        <template slot-scope="{ row }">
          {{
            row.pagentAccount == null || row.pagentAccount == undefined
              ? "总代"
              : row.pagentAccount
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="agentLevel"
        label="代理级别"
        min-width="100"
        :formatter="formatterType"
      />
      <el-table-column
        prop="netProfitAmt"
        label="本月净盈利"
        min-width="120"
        sortable
      />

      <el-table-column
        prop="attachRatio"
        label="当前扶持比例"
        min-width="120"
        sortable
      >
        <template slot-scope="{ row }">
          <div v-if="row.attachRatio !== null">
            {{ row.attachRatio + "%" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="attachAmt" label="扶持佣金" width="110" sortable />
      <el-table-column prop="supportMonth" label="当前扶持期" min-width="140">
        <template slot-scope="{ row }">
          <div v-if="row.supportMonth !== null">
            {{ "第" + row.supportMonth + "个月" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="startDate" label="开始时间" width="140" />
      <el-table-column prop="endDate" label="结束时间" min-width="140" />
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
                : ''
            "
            >{{
              row.status == 1
                ? "未结算"
                : row.status == 2
                ? "待发放"
                : row.status == 3
                ? "已发放"
                : ""
            }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="{ row }">
          <!-- v-if="getSupportCommissionGiveData == '2' && row.status === 2" -->
          <el-button
            v-if="row.status === 2"
            type="primary"
            plain
            size="mini"
            @click="showUpdateDialogClick(row)"
            >扶持发放</el-button
          >
          <div v-else />
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
  supportCommissionStatisTable,
  giveSupportCommission,
  // getSupportCommissionGive, // 扶持佣金发放方式
  supportCommissionStatisExport,
} from "@/api/agentManagement/tabledetail";
import { getNowFormatDay } from '@/utils/tools'
// const NOW_MONTH = getNowFormatDay('-', false)
export default {
  name: "AgentManagementDetailedSettlement",
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
      getSupportCommissionGiveData: null,
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
    this.getSupportCommissionGives();
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
    // 重置刷新
    resets() {
      this.listQueryData();
      this.fetchData();
    },

    // 获取当前扶持佣金发放类似
    getSupportCommissionGives() {
      // getSupportCommissionGive().then((item) => {
      //   //  当前为自动发放
      //   if (item.code === 200) {
      //     this.getSupportCommissionGiveData = item.data;
      //   }
      // });
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      this.todayListLoading = true;
      supportCommissionStatisTable(this.listQuery)
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
      this.downloadLoading = true;
      supportCommissionStatisExport(this.listQuery) // 导出的接口
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
          link.download = "扶持明细结算表";
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

    // 扶持发放
    showUpdateDialogClick(row) {
      giveSupportCommission({ id: row.id, operator: this.operator })
        .then((item) => {
          if (item.code === 200) {
            this.fetchData();
            this.$message({
              type: "success",
              message: "扶持发放成功",
            });
          }
        })
        .catch((err) => {
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
</style>
