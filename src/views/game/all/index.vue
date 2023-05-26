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
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-search"
          @click="handleSearchFilter"
        />
      </el-form-item>
    </el-form>
    <div style="margin: 40px 0px">
      <el-divider content-position="left"><h2>开元统计</h2></el-divider>
    </div>

    <el-table v-cloading="listLoading" :data="list">
      <el-table-column
        prop="kyTotalCount"
        label="开源在线总人数"
        min-width="60"
         
      />
      <el-table-column
        prop="kyUpCoin"
        label="开元总代入金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="kyDownCoin"
        label="开元总代出金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="kyAllCoin"
        label="开元总盈利金额(VND)"
        min-width="60"
         
      />
    </el-table>

    <!--
    <div style="margin: 40px 0px;">
      <el-divider content-position="left"><h2>至尊统计</h2></el-divider>
    </div>

    <el-table v-cloading="listLoading" :data="list" border>
      <el-table-column prop="zzTotalCount" label="至尊游戏人数" min-width="60"  ></el-table-column>
      <el-table-column prop="zzExchangeCoin" label="至尊总代入金额(VND)" min-width="60"  ></el-table-column>
      <el-table-column prop="zzExchangeOutCoin" label="至尊总代出金额(VND)" min-width="60"  ></el-table-column>
      <el-table-column prop="zzAllCoin" label="至尊总盈利金额(VND)" min-width="60"  ></el-table-column>
    </el-table> -->

    <!-- <div style="margin: 40px 0px;">
      <el-divider content-position="left"><h2>AG统计</h2></el-divider>
    </div>

    <el-table v-cloading="listLoading" :data="list" border>
      <el-table-column prop="agTotalCount" label="AG在线总人数" min-width="60"  ></el-table-column>
      <el-table-column prop="agUpCoin" label="AG总代入金额(VND)" min-width="60"  ></el-table-column>
      <el-table-column prop="agDownCoin" label="AG总代出金额(VND)" min-width="60"  ></el-table-column>
      <el-table-column prop="agAllCoin" label="AG总盈利金额(VND)" min-width="60"  ></el-table-column>
    </el-table>

    <div style="margin: 40px 0px;">
      <el-divider content-position="left"><h2>富翁统计</h2></el-divider>
    </div>

    <el-table v-cloading="listLoading" :data="list" border>
      <el-table-column prop="fwTotalCount" label="富翁在线总人数" min-width="60"  ></el-table-column>
      <el-table-column prop="fwUpCoin" label="富翁总代入金额(VND)" min-width="60"  ></el-table-column>
      <el-table-column prop="fwDownCoin" label="富翁总代出金额(VND)" min-width="60"  ></el-table-column>
      <el-table-column prop="fwAllCoin" label="富翁总盈利金额(VND)" min-width="60"  ></el-table-column>
    </el-table>
 -->
    <div style="margin: 40px 0px">
      <el-divider content-position="left"><h2>BG游戏统计</h2></el-divider>
    </div>

    <el-table v-cloading="listLoading" :data="list">
      <el-table-column
        prop="bgTotalCount"
        label="BG游戏在线总人数"
        min-width="60"
         
      />
      <el-table-column
        prop="bgUpCoin"
        label="BG游戏总代入金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="bgDownCoin"
        label="BG游戏总代出金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="bgAllCoin"
        label="BG游戏总盈利金额(VND)"
        min-width="60"
         
      />
    </el-table>
    <div style="margin: 40px 0px">
      <el-divider content-position="left"><h2>CMD体育统计</h2></el-divider>
    </div>

    <el-table v-cloading="listLoading" :data="list">
      <el-table-column
        prop="cmdTotalCount"
        label="CMD在线总人数"
        min-width="60"
         
      />
      <el-table-column
        prop="cmdUpCoin"
        label="CMD总代入金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="cmdDownCoin"
        label="CMD总代出金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="cmdAllCoin"
        label="CMD总盈利金额(VND)"
        min-width="60"
         
      />
    </el-table>

    <div style="margin: 40px 0px">
      <el-divider content-position="left"><h2>沙巴体育统计</h2></el-divider>
    </div>

    <el-table v-cloading="listLoading" :data="list">
      <el-table-column
        prop="sabaTotalCount"
        label="沙巴在线总人数"
        min-width="60"
         
      />
      <el-table-column
        prop="sabaUpCoin"
        label="沙巴总代入金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="sabaDownCoin"
        label="沙巴总代出金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="sabaAllCoin"
        label="沙巴总盈利金额(VND)"
        min-width="60"
         
      />
    </el-table>

    <el-table v-cloading="listLoading" :data="list">
      <el-table-column
        prop="awcTotalCount"
        label="AWC在线总人数"
        min-width="60"
         
      />
      <el-table-column
        prop="awcUpCoin"
        label="AWC总代入金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="awcDownCoin"
        label="AWC总代出金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="awcAllCoin"
        label="AWC总盈利金额(VND)"
        min-width="60"
         
      />
    </el-table>
    <el-table v-cloading="listLoading" :data="list">
      <el-table-column
        prop="btiTotalCount"
        label="BTI在线总人数"
        min-width="60"
         
      />
      <el-table-column
        prop="btiUpCoin"
        label="ATI总代入金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="btiDownCoin"
        label="BTI总代出金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="btiAllCoin"
        label="BTI总盈利金额(VND)"
        min-width="60"
         
      />
    </el-table>

    <el-table v-cloading="listLoading" :data="list">
      <el-table-column
        prop="obTotalCount"
        label="OB在线总人数"
        min-width="60"
         
      />
      <el-table-column
        prop="obUpCoin"
        label="OB总代入金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="obDownCoin"
        label="OB总代出金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="obAllCoin"
        label="OB总盈利金额(VND)"
        min-width="60"
         
      />
    </el-table>

    <el-table v-cloading="listLoading" :data="list">
      <el-table-column
        prop="xgTotalCount"
        label="XG在线总人数"
        min-width="60"
         
      />
      <el-table-column
        prop="xgUpCoin"
        label="XG总代入金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="xgDownCoin"
        label="XG总代出金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="xgAllCoin"
        label="XG总盈利金额(VND)"
        min-width="60"
         
      />
    </el-table>

    <div style="margin: 40px 0px">
      <el-divider content-position="left"><h2>彩票统计</h2></el-divider>
    </div>

    <el-table v-cloading="listLoading" :data="list">
      <el-table-column
        prop="cpTotalPay"
        label="彩票总投注金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="cpTotalAmout"
        label="彩票总派彩金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="cpTotalGet"
        label="彩票总盈利金额(VND)"
        min-width="60"
         
      />
    </el-table>

    <div style="margin: 40px 0px">
      <el-divider content-position="left"><h2>FB游戏统计</h2></el-divider>
    </div>

    <el-table v-cloading="listLoading" :data="list">
      <el-table-column
        prop="fbDownCoin"
        label="FB总投注金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="fbUpCoin"
        label="FB总派彩金额(VND)"
        min-width="60"
         
      />
      <el-table-column
        prop="fbAllCoin"
        label="FB总盈利金额(VND)"
        min-width="60"
         
      />
    </el-table>
  </div>
</template>

<script>
import { getAllGame } from "@/api/game/trans";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";

export default {
  name: "KyGameCoinTransController",
  filters: {
    osFilter(status) {
      const map = { 0: "info", 1: "", 2: "success" };
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
        orderId: null,
        type: null,
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
      getAllGame(this.listQuery)
        .then((res) => {
          var countData = [];
          if (
            res.data != null &&
            res.data != undefined &&
            JSON.stringify(res.data) != "{}"
          ) {
            countData.push(res.data);
          }
          this.list = countData;
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
          this.$message.error(err);
        });
    },

    // 过滤
    handleSearchFilter() {
      this.fetchData();
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.fetchData();
    },

    // 当前页改变
    handleCurrentChange(val) {
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
