<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true" class="searchFormWrapper">
      <!-- <el-form-item>
        <span class="search_info">完成时间</span>
        <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
          :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm:ss" value-format="timestamp" :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter" />
      </el-form-item> -->
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" class="input-with-select" placeholder="请输入用户ID" clearable
          maxlength="10" style="width: 130px" oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <!-- <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
      <el-form-item>
        <el-input v-model="listQuery.orderNo" size="small" class="input-with-select" placeholder="请输入订单号" clearable
          maxlength="50" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.status" style="width: 145px" size="small" placeholder="请选择支付状态" @change="handleSearchFilter" @clear="handleSearchFilter" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <!-- <el-select v-model="listQuery.channelName" size="small" placeholder="请选择支付渠道名称" clearable>
          <el-option v-for="item in statusOptions1" :key="item.value1" :label="item.label1" :value="item.value1" />
        </el-select> -->
        <el-input v-model="listQuery.channelName" size="small" class="input-with-select" style="width: 165px"
          placeholder="请输入支付渠道名称" clearable @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <!-- <el-form-item>
        <el-select v-model="listQuery.remark" size="small" placeholder="请选择充值卡运营商" clearable>
          <el-option v-for="item in statusOptions2" :key="item.value2" :label="item.label2" :value="item.value2" />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item>
        <el-select
          v-model="listQuery.anchorFlag"
          size="small"
          placeholder="请选择账号类型"
          clearable
        >
          <el-option label="主播" :value="1" />
          <el-option label="用户" :value="0" />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" plain icon="el-icon-refresh" @click="refreshData()">重置</el-button>
      </el-form-item>
      <el-form-item class="export_btn">
        <el-button size="small" :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">
          导出Excel
        </el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" size="mini" :cell-style="cellStyle" fit highlight-current-row>
      <el-table-column type="index" label="序号" width="60" fixed="left" />
      <el-table-column label="用户ID" min-width="120" fixed="left">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="anchorFlag" label="主播标识" min-width="100">
        <template slot-scope="{ row }">
          <div>{{ row.anchorFlag == 1 ? "主播" : "用户" }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="订单号" min-width="180" />

      <!-- <el-table-column prop="outerNo" label="第三方订单号" min-width="80"  ></el-table-column> -->
      <el-table-column prop="goldCoin" label="金币" min-width="80" sortable />
      <el-table-column prop="trueRmbString" label="充值金额(VND)" min-width="140" sortable />
      <el-table-column label="状态" width="80">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.status | statusFilter">{{
            row.statusString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="用户层级" min-width="80" />
      <el-table-column prop="remark" label="商品描述" min-width="80" />
      <el-table-column prop="channelName" label="商户名称" min-width="150" />
      <el-table-column prop="gmtCreateString" label="订单创建时间" width="140" />
      <el-table-column prop="gmtCompleteString" label="订单完成时间" width="140" />
      <el-table-column prop="operator" label="操作人" min-width="60" />
    </el-table>

    <el-table v-cloading="todayListLoading" :data="todayList" border size="mini">
      <el-table-column type="" label="" width="60" />
      <el-table-column label="" min-width="80" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column prop="totalGoldCoin" label="总金币" min-width="120" />
      <el-table-column prop="totalTrueRmb" label="总充值金额-VND" min-width="150" />
      <el-table-column label="" width="80" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column prop="" label="" width="140" />
      <el-table-column prop="" label="" width="140" />
      <el-table-column prop="" label="" min-width="60" />
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import { getOrderList, getOrder } from "@/api/center/assets/order";
import { formatUnixTime, getDateTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";
// const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: "PayOrderController",
  filters: {
    statusFilter(status) {
      const map = { 0: "info", 1: "success", 5: "danger", 6: "warning" };
      return map[status];
    },
    wayFilter(status) {
      const map = { 1: "success", 2: "" };
      return map[status];
    },
  },
  computed: {
    initTimer() {
      return this.$store.getters.timerDate
    }
  },
  components: {
    UserDrawer,
  },
  data() {
    return {
      list: null,
      todayList: null,
      listLoading: true,
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        status: null,
        status1: null,
        channelName: null,
        remark: null,
        pickerValue: [],
      },
      filename: "",
      autoWidth: true,
      bookType: "xlsx",

      // 状态选择
      statusOptions: [
        { label: "全部", value: '' },
        { label: "未支付", value: 0 },
        { label: "已支付", value: 1 },
        { label: "失败", value: 5 },
        { label: "处理中", value: 6 },
      ],
      statusOptions1: [
        // { label1: '公司入款', value1: 16 },
        { label1: "RP-momo", value1: "VNMOMO" },
        { label1: "RP-ZALO", value1: "VNZALO" },
        { label1: "RP-銀行轉卡", value1: "VNBANK" },
        { label1: "RP-網銀直連", value1: "VNDIRECT" },
        { label1: "RP-網銀掃碼", value1: "VNBANKQR" },
        { label1: "RP-ViettelPay", value1: "VNVTPAY" },
        { label1: "壹支付-扫码支付", value1: "QRPay" },
      ],

      /* statusOptions2: [{ label2: 'VIETTEL', value2: VIETTEL },
                       { label2: 'VINAPHONE', value2: VINAPHONE },
                       { label2: 'MOBIFONE', value2: MOBIFONE }],
        */
      statusOptions2: [
        { label2: "VIETTEL", value2: "VIETTEL" },
        { label2: "VINAPHONE", value2: "VINAPHONE" },
        { label2: "MOBIFONE", value2: "MOBIFONE" },
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
    };
  },
  created() {
    this.listQuery.pickerValue = this.initTimer
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
        status1: null,
        channelName: null,
        remark: null,
        pickerValue: this.initTimer
      };
      this.fetchData();
    },

    cellStyle(row, column, rowIndex, columnIndex) {
      // 根据报警级别显示颜色
      // console.log(row);
      // console.log(row.column);
      // if (row.column.label === "商户名称") {
      //   return "color:#42b983";
      // }
    },

    // 导出excel
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "用户ID",
          "主播标识",
          "订单号",
          "金币",
          "充值金额(VND)",
          "状态",
          "用户层级",
          "商品描述",
          "商户名称",
          "订单创建时间",
          "订单完成时间",
          "操作人",
        ];
        const filterVal = [
          "uid",
          "anchorFlag",
          "orderNo",
          "goldCoin",
          "trueRmbString",
          "statusString",
          "name",
          "remark",
          "channelName1",
          "gmtCreateString",
          "gmtCompleteString",
          "operator",
        ];
        const list = this.list;
        // const list = [];
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "线上支付报表",
          autoWidth: this.autoWidth,
          bookType: this.bookType,
        });
        this.downloadLoading = false;
      });
    },
    // 替换对应文字
    formatJson(filterVal, jsonData) {
      console.log(filterVal, jsonData);
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j == "anchorFlag") {
            return v[j] == 1 ? "主播" : "用户";
          } else {
            return v[j];
          }
          // if (j === "gmtComplete" && v[j] != null) {
          //   return formatUnixTime(v[j]);
          // }
          // if (j === "status" && v[j] != null) {
          //   if ((v[j] = 0)) {
          //     return "待审核";
          //   } else if ((v[j] = 1)) {
          //     return "已通过";
          //   } else if ((v[j] = 2)) {
          //     return "已驳回";
          //   }
          //   return v[j];
          // } else {
          //   return v[j];
          // }
          // return v[j];
        })
      );
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      this.todayListLoading = true;
      getOrder(this.listQuery.limit, this.listQuery.page, this.listQuery).then(
        (res) => {
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
        }
      );
      getOrderList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var statusString = "";
            var trueRmbString = item.trueRmb.toLocaleString();
            this.statusOptions.map((sitem) => {
              if (sitem.value == item.status) {
                statusString = sitem.label;
              }
            });

            var channelName1 = "";
            if (item.channelName == "VNBANK") {
              channelName1 = "RP-銀行轉卡";
            } else if (item.channelName == "VNDIRECT") {
              channelName1 = "RP-網銀直連";
            } else if (item.channelName == "VNBANKQR") {
              channelName1 = "RP-银行扫码";
            } else if (item.channelName == "VNZALO") {
              channelName1 = "RP-ZALO";
            } else if (item.channelName == "VNMOMO") {
              channelName1 = "RP包-MOMO";
            } else if (item.channelName == "106") {
              channelName1 = "USDT";
            } else if (item.channelName == "VNVTPAY") {
              channelName1 = "RP-ViettelPay";
            } else if (item.channelName == "QRPay") {
              channelName1 = "壹支付-扫码支付";
            }

            this.$set(item, "channelName1", channelName1);
            this.$set(item, "trueRmbString", trueRmbString);
            this.$set(item, "statusString", statusString);
            this.$set(item, "gmtCreateString", formatUnixTime(item.gmtCreate));
            this.$set(
              item,
              "gmtCompleteString",
              formatUnixTime(item.gmtComplete)
            );
            return item;
          });
          this.listQuery.total = res.data.total;
          this.listLoading = false;
        })
        .catch((err) => {
          this.list = null;
          this.listQuery.total = 0;
          this.listLoading = false;
          this.$message.error(err);
        });
    },

    // 过滤
    handleSearchFilter() {
      this.listQuery.page = 1;
      console.log('this.listQuery====>', this.listQuery)
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

  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
</style>
