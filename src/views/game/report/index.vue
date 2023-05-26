<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
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
        <el-button
          size="small"
          plain
          icon="el-icon-search"
          @click="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="downloadLoading"
          size="small"
          type="success"
          icon="el-icon-document"
          @click="handleDownload"
        >
          导出Excel
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
     >
      <el-table-column type="index" label="序号" width="60"   />
      <!--   <el-table-column prop="id" label="ID" min-width="60"  ></el-table-column> -->
      <el-table-column
        prop="kyTotalCount"
        label="V8游戏人数"
        min-width="60"
         
      />
      <el-table-column
        prop="kyUpCoin"
        label="V8游戏带入(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="kyDownCoin"
        label="V8游戏带出(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="kyProfitCoin"
        label="V8游戏盈利(VND)"
        min-width="100"
         
      />

      <el-table-column
        prop="bgTotalCount"
        label="BG游戏人数"
        min-width="60"
         
      />
      <el-table-column
        prop="bgUpCoin"
        label="BG游戏带入(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="bgDownCoin"
        label="BG游戏带出(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="bgProfitCoin"
        label="BG游戏盈利(VND)"
        min-width="100"
         
      />

      <el-table-column
        prop="cmdTotalCount"
        label="CMD游戏人数"
        min-width="60"
         
      />
      <el-table-column
        prop="cmdUpCoin"
        label="CMD游戏带入(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="cmdDownCoin"
        label="CMD游戏带出(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="cmdProfitCoin"
        label="CMD游戏盈利(VND)"
        min-width="100"
         
      />

      <el-table-column
        prop="sabaTotalCount"
        label="沙巴游戏人数"
        min-width="60"
         
      />
      <el-table-column
        prop="sabaUpCoin"
        label="沙巴游戏投注(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="sabaDownCoin"
        label="沙巴游戏派彩(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="sabaProfitCoin"
        label="沙巴游戏盈利(VND)"
        min-width="100"
         
      />

      <el-table-column
        prop="cpTotalCount"
        label="彩票游戏人数"
        min-width="60"
         
      />
      <el-table-column
        prop="cpUpCoin"
        label="彩票游戏投注(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="cpDownCoin"
        label="彩票游戏派彩(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="cpProfitCoin"
        label="彩票游戏盈利(VND)"
        min-width="100"
         
      />

      <el-table-column
        prop="date"
        label="报表日期"
        width="160"
         
      />
      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="160"
         
      />
    </el-table>

    <el-table v-cloading="todayListLoading" :data="todayList" size="mini">
      <el-table-column type="" label="" width="60"   />
      <el-table-column
        prop="kyUp"
        label="MP总带入(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="kyDown"
        label="MP总带出(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="kyProfit"
        label="MP总盈利(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="bgUp"
        label="BG总带入(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="bgDown"
        label="BG总带出(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="bgProfit"
        label="BG总盈利(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="cmdUp"
        label="CMD总带入(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="cmdDown"
        label="CMD总带出(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="cmdProfit"
        label="CMD总盈利(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="sabaUp"
        label="沙巴总带入(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="sabaDown"
        label="沙巴总带出(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="sabaProfit"
        label="沙巴总盈利(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="btiUp"
        label="BTI总带入(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="btiDown"
        label="BTI总带出(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="btiProfit"
        label="BTI总盈利(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="awcUp"
        label="AWC总带入(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="awcDown"
        label="AWC总带出(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="awcProfit"
        label="AWC总盈利(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="cpUp"
        label="彩票总投注(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="cpDown"
        label="彩票总派彩(VND)"
        min-width="100"
         
      />
      <el-table-column
        prop="cpProfit"
        label="彩票总盈利(VND)"
        min-width="100"
         
      />
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
  </div>
</template>

<script>
import { getReportList, getTotalList } from "@/api/game/report/game_report";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";

export default {
  name: "GameReportHistoryController",

  data() {
    return {
      list: null,
      todayList: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        pickerValue: [],
      },
      downloadLoading: false,
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
    const start =
      new Date(new Date().toLocaleDateString()).getTime() - 3600 * 1000 * 24;
    const end = start + (24 * 3600 - 1) * 1000;
    this.listQuery.pickerValue = [start, end];
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
          return getReportList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          );
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            this.$set(
              item,
              "createTimeString",
              formatUnixTime(item.createTime)
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
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error("导出限制10000条范围内");
        return;
      }

      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "V8游戏人数",
          "V8游戏带入(VND)",
          "V8游戏带出(VND)",
          "V8游戏盈利(VND)",
          "BG游戏人数",
          "BG游戏带入(VND)",
          "BG游戏带出(VND)",
          "BG游戏盈利(VND)",
          "CMD游戏人数",
          "CMD游戏带入(VND)",
          "CMD游戏带出(VND)",
          "CMD游戏盈利(VND)",
          "沙巴游戏人数",
          "沙巴游戏投注(VND)",
          "沙巴游戏派彩(VND)",
          "沙巴游戏盈利(VND)",
          "BTI游戏人数",
          "BTI游戏投注(VND)",
          "BTI游戏派彩(VND)",
          "BTI游戏盈利(VND)",
          "AWC游戏人数",
          "AWC游戏投注(VND)",
          "AWC游戏派彩(VND)",
          "AWC游戏盈利(VND)",
          "彩票游戏人数",
          "彩票游戏投注(VND)",
          "彩票游戏派彩(VND)",
          "彩票游戏盈利(VND)",
          "报表日期",
          "创建时间",
        ];
        const filterVal = [
          "kyTotalCount",
          "kyUpCoin",
          "kyDownCoin",
          "kyProfitCoin",
          "bgTotalCount",
          "bgUpCoin",
          "bgDownCoin",
          "bgProfitCoin",
          "cmdTotalCount",
          "cmdUpCoin",
          "cmdDownCoin",
          "cmdProfitCoin",
          "sabaTotalCount",
          "sabaUpCoin",
          "sabaDownCoin",
          "sabaProfitCoin",
          "btiTotalCount",
          "btiUpCoin",
          "btiDownCoin",
          "btiProfitCoin",
          "awcTotalCount",
          "awcUpCoin",
          "awcDownCoin",
          "awcProfitCoin",
          "cpTotalCount",
          "cpUpCoin",
          "cpDownCoin",
          "cpProfitCoin",
          "date",
          "createTimeString",
        ];
        const list = this.list;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType,
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
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
