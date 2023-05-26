<template>
  <div class="app-container">
    <div style="display: flex; justify-content: space-between">
      <el-form :inline="true">
        <el-form-item>
          <el-button
            size="small"
            type="success"
            icon="el-icon-plus"
            @click="showCreateDialogClick()"
            >新增</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-tag type="info">日期:</el-tag>
          <el-date-picker
            v-model="listQuery.pickerValue"
            size="small"
            clearable
            type="datetimerange"
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
          <el-tag type="info">直播间ID:</el-tag>
          <el-input
            v-model="listQuery.agentId"
            size="small"
            class="input-with-select"
            placeholder="请输入直播间ID"
            clearable
            maxlength="16"
            @keyup.enter.native="handleSearchFilter"
            @clear="handleSearchFilter"
          />
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="listQuery.type"
            size="small"
            placeholder="请选择状态"
            clearable
            @change="handleSearchFilter"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            icon="el-icon-search"
            type="primary"
            @click="handleSearchFilter"
          >搜索</el-button>
          <!-- 重置 -->
          <el-button size="small" icon="el-icon-refresh" @click="resets" >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
      fit
      highlight-current-row
      show-summary
     >
      <el-table-column type="index" label="序号" width="60"   />
      <el-table-column
        prop="agentIdX"
        label="活动月份"
        min-width="120"
         
      />
      <el-table-column
        prop="typeName"
        label="活动名称"
        min-width="100"
         
      />
      <el-table-column
        prop="typeDetail"
        label="参与人数"
        min-width="100"
         
      />

      <el-table-column prop="profit" label="状态" min-width="80"  >
        <template slot-scope="{ row }">
          <div>
            {{ row.profit }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalProfit"
        label="输赢总和"
        min-width="100"
         
      />
      <el-table-column
        prop="betValidAmt"
        label="流水"
        min-width="80"
         
      >
        <template slot-scope="{ row }">
          <div
            style="height: 36px; line-height: 36px"
            v-for="items in row.profitStatisDetailVOS"
            :key="`${items.typeName}-${items.typeDetail}`"
          >
            {{ items.betValidAmt }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalBetValidAmt"
        label="流水总和"
        min-width="80"
         
      />
      <!-- <el-table-column
          prop="totalBetValidAmt"
          label="投注有效流水"
          min-width="100"
           
        />
        <el-table-column
          prop="totalProfit"
          label="输赢金额"
          min-width="80"
           
        >
          <template slot-scope="{ row }">
            <div
              :class="
                Number(row.totalProfit) > 0
                  ? 'color2'
                  : Number(row.totalProfit) < 0
                  ? 'color1'
                  : ''
              "
            >
              {{ row.totalProfit }}
            </div>
          </template>
        </el-table-column> -->
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
  platformProfitStatis,
  platformProfitStatisExport,
} from "@/api/agentManagement/tabledetail";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";

export default {
  name: "AgentManagementGame",
  data() {
    return {
      list: [],
      todayList: [],
      listLoading: true,
      downloadLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        pickerValue: [],
      },
      listQueryData() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 20,
          total: 0,
          pickerValue: [],
        };
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 重置刷新
    resets() {
      this.listQueryData();
      this.fetchData();
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      this.todayListLoading = true;
      platformProfitStatis({
        startDate:
          this.listQuery.pickerValue[0] !== undefined
            ? this.listQuery.pickerValue[0]
            : null,
        endDate:
          this.listQuery.pickerValue[0] !== undefined
            ? this.listQuery.pickerValue[1]
            : null,
      })
        .then((res) => {
          console.log(res.data);
          this.listLoading = false;
          this.list = res.data.platformProfitStatisVOS;
          // this.listQuery.total = res.total;
        })
        .catch((err) => {
          this.list = [];
          this.listQuery.total = 0;
          this.listLoading = false;
          this.$message.error(err);
        });
    },

    // 过滤
    handleSearchFilter() {
      console.log(this.listQuery);

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
  },
};
</script>
<style lang="scss" scoped>
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
</style>
