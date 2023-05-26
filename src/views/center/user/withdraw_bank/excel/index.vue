<template>
  <div class="app-container">

    <DatePicker v-model="pickerValue" @change="handleSearchFilter">
      <el-form-item>
        <el-select v-model="listQuery.timeType" style="width: 100px" size="small" @change="handleSearchFilter"
          placeholder="请选择查询时间">
          <el-option v-for="item in timeTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </DatePicker>


    <el-form :inline="true" class="searchFormWrapper">
      <!-- <el-form-item>
        <span class="search_info">创建时间</span>
        <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
          :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" value-format="timestamp"
          @change="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <span class="search_info">审核时间</span>
        <el-date-picker v-model="listQuery.withdrawValue" size="small" clearable type="datetimerange"
          :picker-options="withdrawOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" value-format="timestamp"
          @change="handleSearchFilter" />
      </el-form-item> -->
      <el-form-item>
        <!-- 多选家族搜索 -->
        <el-select v-model="listQuery.familyIds" size="small" style="width: 300px" multiple filterable clearable
          placeholder="请输入或选择家族" @clear="handleSearchFilter">
          <el-option v-for="item in familyList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="refreshData">重置</el-button>
      </el-form-item>
      <el-form-item class="export_btn">
        <el-button size="small" type="primary" icon="el-icon-document" @click="handleDownload">
          导出Excel
        </el-button>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="list" size="mini">
      <!-- 展开 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="开户省">
              <span>{{ props.row.bankProvince }}</span>
            </el-form-item>
            <el-form-item label="开户市">
              <span>{{ props.row.bankCity }}</span>
            </el-form-item>
            <el-form-item label="开户行支行">
              <span>{{ props.row.bankSub }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column type="index" label="序号" width="70" />
      <el-table-column label="家族长ID" min-width="125">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="主播名称" min-width="100" />
      <el-table-column prop="familyName" label="家族名称" min-width="100" />
      <el-table-column prop="cardNo" label="银行卡号或支付宝帐号" min-width="150" />
      <el-table-column prop="trueName" label="真实姓名" min-width="110" />
      <el-table-column prop="bankName" label="开户银行" min-width="110" />
      <el-table-column prop="bankSub" label="开户支行" min-width="110" />
      <el-table-column prop="totalCach" label="实际提现金额" min-width="120" sortable />
      <el-table-column prop="anchorCoid" label="花费魅力" min-width="120" sortable />
      <el-table-column prop="gmtCreateString" label="创建时间" width="140" />
      <el-table-column prop="gmtCompleteString" label="审核时间" width="140" />
    </el-table>

    <el-table v-cloading="todayListLoading" :data="todayList" size="mini">
      <!-- 展开 -->
      <el-table-column prop="" label="" min-width="100" />
      <el-table-column prop="" label="" min-width="100" />
      <el-table-column prop="" label="" min-width="120" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column prop="totalCachTotal" label="实际提现总金额" min-width="120" />
      <el-table-column prop="anchorCoidTotal" label="花费总魅力" min-width="120" />
      <el-table-column prop="" label="" width="140" />
      <el-table-column prop="" label="" width="140" />
    </el-table>
    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page" :page-sizes="[10, 20, 50, 100, 1000]"
      :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import {
  getExcelList,
  getExcelTotalList,
  getUserFamilyList,
} from "@/api/center/user/withdraw_bank";
import { emptyS, nullS, formatUnixTime, getDateTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";
import { parseTime } from "@/utils";
import FilenameOption from "./components/FilenameOption";
import AutoWidthOption from "./components/AutoWidthOption";
import BookTypeOption from "./components/BookTypeOption";
const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: "CenterBankWithdrawController",
  filters: {
    statusFilter(status) {
      const map = { 0: "info", 1: "success", 2: "danger" };
      return map[status];
    },
    wayFilter(status) {
      const map = { 1: "success", 2: "" };
      return map[status];
    },
  },
  components: {
    UserDrawer,
    FilenameOption,
    AutoWidthOption,
    BookTypeOption,
  },
  data() {
    return {
      list: null,
      todayListLoading: false,
      todayList: null,
      listLoading: true,
      timeTypeOptions: [{
        label: '创建时间',
        value: 1
      },
      {
        label: '审核时间',
        value: 2
      }
      ],
      pickerValue: [NOW_TIME_START, NOW_TIME_END],
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        status: null,
        familyIds: null,
        pickerValue: [],
        withdrawValue: [],
        downloadLoading: false,
        filename: "",
        autoWidth: true,
        bookType: "xlsx",
        timeType: 1
      },
      familyList: null,
      // 状态选择
      statusOptions: [
        { label: "待审核", value: 0 },
        { label: "已发", value: 1 },
        { label: "驳回", value: 2 },
      ],

      // 家族
      dialogFamilyVisible: false,
      dialogFamilyLoading: false,
      dialogFamilyValue: null,
      dialogFamilyOptions: [],

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
      let { timeType } = this.listQuery
      this.listQuery = {
        page: 1,
        limit: 20,
        timeType
      };
      this.pickerValue = [NOW_TIME_START, NOW_TIME_END]
      this.fetchData();
    },

    // 获取列表数据
    fetchData() {
      let { timeType } = this.listQuery
      if (timeType == 1) {
        delete this.listQuery.withdrawValue
        this.listQuery.pickerValue = this.pickerValue
      } else {
        delete this.listQuery.pickerValue
        this.listQuery.withdrawValue = this.pickerValue
      }

      this.listLoading = true;
      this.familyList = null;
      this.downloadLoading = false;
      // 获取家族列表
      getUserFamilyList()
        .then((res) => {
          this.familyList = (res.data.list || []).map((item) => {
            return {
              value: item.bossId || 0,
              label: nullS(item.familyName),
            };
          });
          this.todayListLoading = true;
          return getExcelTotalList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          );
        })
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
          return getExcelList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          );
        })
        .then((res) => {
          if (res.data != null) {
            this.list = (res.data.list || []).map((item) => {
              var familyName = "暂无家族";
              for (const family of this.familyList) {
                if (family.value == item.familyId) {
                  familyName = family.label;
                  break;
                }
              }
              this.$set(item, "familyName", familyName);
              this.$set(
                item,
                "gmtCreateString",
                formatUnixTime(item.gmtCreate)
              );
              this.$set(
                item,
                "gmtCompleteString",
                formatUnixTime(item.gmtComplete)
              );
              return item;
            });
            this.listQuery.total = res.data.total;
          }
          this.listLoading = false;
          this.downloadLoading = false;
        })
        .catch((err) => {
          this.list = null;
          this.listQuery.total = 0;
          this.listLoading = false;
          this.familyList = null;
          this.$message.error(err);
        });
    },

    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "家族长ID",
          "主播名称",
          "家族名称",
          "银行卡号或支付宝账号",
          "真实姓名",
          "开户银行",
          "开户行支行",
          "实际提现金额",
          "花费魅力",
          "创建时间",
          "审核时间",
        ];
        const filterVal = [
          "uid",
          "nickName",
          "familyName",
          "cardNo",
          "trueName",
          "bankName",
          "bankSub",
          "totalCach",
          "anchorCoid",
          "gmtCreate",
          "gmtComplete",
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
          if (j === "gmtCreate") {
            return new Date(v[j]);
          }
          if (j === "gmtComplete" && v[j] != null) {
            return new Date(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },

    // 过滤
    handleSearchFilter() {
      this.listQuery.page = 1;
      setTimeout(()=>{ this.fetchData();}, 80)
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.listQuery.page = 1;
      setTimeout(()=>{this.fetchData();}, 80)
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.page = val;
      setTimeout(()=>{this.fetchData();}, 80)
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
