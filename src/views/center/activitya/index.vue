<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-select size="medium" v-model="listQuery.type" placeholder="请选择类型" clearable @change="handleSearchFilter">
        <el-option v-for="item in statusOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
      </el-select> -->

      <!--   <el-input
        v-model="listQuery.uid"
        size="medium"
        class="input-with-select"
        placeholder="请输入uid"
        clearable
        @keyup.enter.native="handleSearchFilter"
        @clear="handleSearchFilter"
      /> -->
      <!-- <el-date-picker
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
        @change="handleSearchFilter"
      />
 -->
      <!-- <el-form-item> -->
        <!-- <el-tag type="primary">统计范围:</el-tag> -->
        <!-- <el-date-picker
          v-model="listQuery.pickerValue"
          size="small"
          clearable
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <!-- <el-form-item>
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
          @click="reset"
        >重置</el-button>
      </el-form-item> -->
    </el-form>
    <el-badge style="width: 100%" value="以下所有单位为金币" class="item">
      <el-table
        v-cloading="todayListLoading"
        :data="todayList"
        highlight-current-row
        size="mini"
      >
        <!-- <el-table-column type="index" label="序号" width="50"   />
        <el-table-column prop="bankDiscounts" label="公司入款优惠" min-width="60"   />
        <el-table-column prop="initialWater" label="首充彩金" min-width="60"   />
        <el-table-column prop="initialWithdrawWater" label="首提彩金" min-width="60"   />
        <el-table-column prop="userLossWater" label="用户亏损彩金" min-width="60"   />
        <el-table-column prop="userGift" label="用户贡献彩金" min-width="60"   />
        <el-table-column prop="lotteryWater" label="彩票得意流水彩金" min-width="60"   />
        <el-table-column prop="bep" label="彩票每日盈亏彩金" min-width="60"   />
        <el-table-column prop="vipGrade" label="VIP周工资彩金" min-width="60"   />
        <el-table-column prop="thisMingSend" label="今存明送彩金" min-width="60"   />
        <el-table-column prop="userFeedBack" label="用户回馈彩金" min-width="75"   />
        <el-table-column prop="mysteriousActivities" label="神秘彩金" min-width="60"   /> -->
        <!--   <el-table-column prop="userRedPack" label="红包雨彩金" min-width="60"   /> -->
        <el-table-column
          prop="signCoin"
          label="签到彩金"
          min-width="60"
           
          sortable
        />
        <el-table-column
          prop="winLossCoin"
          label="亏损补贴彩金"
          min-width="60"
           
          sortable
        />
        <el-table-column
          prop="initialCoin"
          label="首存彩金"
          min-width="60"
           
          sortable
        />
        <el-table-column
          prop="thisMingSendCoin"
          label="今存明送彩金"
          min-width="60"
           
          sortable
        />
        <el-table-column
          prop="registerCoin"
          label="注册体验彩金"
          min-width="60"
           
          sortable
        />
        <el-table-column
          prop="promotionCoin"
          label="分享彩金"
          min-width="60"
           
          sortable
        />
        <el-table-column
          prop="weekActivityCoin"
          label="周存款彩金"
          min-width="70"
          sortable
        />
        <el-table-column
          prop="total"
          label="活动总派送彩金"
          min-width="70"
          sortable
        />
      </el-table>
    </el-badge>
    <!-- 分页 -->
    <!-- <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->
  </div>
</template>

<script>
import {
  getRecordList1,
  getLotteryCode,
} from "@/api/center/user/handsel";
import { getDateTime } from '@/utils/tools'
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()
export default {
  name: "CenterHandselController",
  filters: {
    statusFilter(status) {
      const map = { 0: "info", 2: "success", 3: "danger" };
      return map[status];
    },
  },
  computed: {
    initTimer() {
      return this.$store.getters.timerDate
    }
  },
  data() {
    return {
      value3: true,
      value4: true,
      message: null,
      lotteryCode: null,
      list: null,
      todayList: null,
      todayListLoading: false,
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
      statusOptions: [
        { value: 40, label: "今存明送" },
        { value: 41, label: "工资存放" },
      ],
    };
  },
  created() {
    this.listQuery.pickerValue = this.initTimer
    this.fetchData();
  },
  methods: {
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.fetchData()
    },
    // 获取列表数据
    fetchData() {
      // this.listLoading = true
      this.todayListLoading = true;
      this.message = null;

      getRecordList1(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          /* this.list = (res.data.list || []).map(item => {
            return item
          }) */
          // this.list = (res.data.list || [])
          var totallist = [];
          if (
            res.data != null &&
            res.data != undefined &&
            JSON.stringify(res.data) != "{}"
          ) {
            res.data.weekActivityCoin = res.data.weekActivityCoin || 0
            totallist.push(res.data);
          }

          this.todayList = totallist;
          this.todayListLoading = false;
          // this.listLoading = false
          this.listQuery.total = totallist.length;
        })
        /*  console(this.list) */
        .catch((err) => {
          this.list = null;
          this.listQuery.total = 0;
          this.todayListLoading = false;
          this.$message.error(err);
        });
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
::v-deep .el-badge__content.is-fixed {
  top: -8px;
  right: 120px;
}
</style>
