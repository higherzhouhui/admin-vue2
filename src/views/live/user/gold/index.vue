<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true" class="searchFormWrapper">
      <!-- <el-form-item>
        <span class="search_info">创建时间</span>
        <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
          :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm" :default-time="['00:00:00', '23:59:59']" value-format="timestamp"
          @change="handleSearchFilter" />
      </el-form-item> -->
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" style="width: 200px" placeholder="请输入用户ID" clearable maxlength="20"
          oninput="value=value.replace(/[^\d]/g,'')" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.nickname" size="small" style="width: 240px" placeholder="请输入主播昵称" clearable
          maxlength="10" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <!-- 多选家族搜索 -->
      <el-form-item>
        <el-select v-model="listQuery.familyIds" size="small" style="width: 200px" multiple filterable clearable
          placeholder="请输入或选择家族" @clear="handleSearchFilter">
          <el-option v-for="item in familyList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <!-- 状态 -->
      <el-form-item>
        <el-select v-model="listQuery.status" style="width: 150px" size="small" placeholder="请选择状态" clearable
          @change="handleSearchFilter">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <!-- 状态 -->
      <el-form-item>
        <el-select v-model="listQuery.goldMedal" style="width: 180px" size="small" placeholder="请选择是否金牌主播" clearable
          @change="handleSearchFilter">
          <el-option v-for="item in goldMedalOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="refreshData">重置</el-button>
      </el-form-item>
      <el-form-item class="export_btn">
        <el-button size="small" :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">
          导出Excel
        </el-button>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="list" size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="主播ID" min-width="120">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="主播昵称" min-width="110" />
      <el-table-column prop="familyName" label="家族名称" min-width="110" />
      <el-table-column label="主播类型" width="120">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.goldMedal | goldMedalFilter">{{
            row.goldMedalString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="totalMl" label="总礼物价值" min-width="120" sortable />
      <el-table-column prop="totalFfml" label="总付费价值" min-width="120" sortable />
      <el-table-column prop="totalCp" label="总彩票流水" min-width="120" sortable />
      <el-table-column prop="anchorProfit" label="主播收益" min-width="100" sortable />
      <el-table-column prop="bossProfit" label="家族长收益" min-width="120" sortable />
      <el-table-column prop="subsidy" label="发放收益星币" min-width="120" />
      <el-table-column prop="activeTime" label="有效时间" min-width="80" />
      <el-table-column prop="belong" label="收益归属时间" min-width="120" />
      <el-table-column prop="subsidyReason" label="补贴发放备注" min-width="200" />
      <el-table-column prop="gmtCreateString" label="创建时间" width="140" />
    </el-table>

    <el-table v-cloading="todayListLoading" :data="todayList" size="mini">
      <el-table-column type="" label="" width="60" />
      <el-table-column label="" min-width="80" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column label="" width="80" />
      <el-table-column prop="totalCoin" label="主播总收益" min-width="120" />
      <el-table-column prop="totalFamilyCoin" label="家族长总收益" min-width="120" />
      <el-table-column prop="totalSubsidy" label="总发放收益星币" min-width="120" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column prop="" label="" width="140" />
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import {
  getGoldSubsidyList,
  getGoldSubsidy,
  getUserFamilyList,
} from "@/api/live/gold";
import { emptyS, nullS, formatUnixTime, getDateTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";
const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: "LiveGoldSubsidyController",
  filters: {
    goldMedalFilter(status) {
      const map = { 0: "info", 1: "success", 2: "danger" };
      return map[status];
    },
  },
  components: {
    UserDrawer,
  },
  data() {
    return {
      todayList: null,
      todayListLoading: false,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        goldMedal: null,
        familyIds: null,
        status: 1,
        pickerValue: [NOW_TIME_START, NOW_TIME_END],
      },

      statusOptions: [
        { value: 0, label: "大于三小时" },
        { value: 1, label: "全部" },
      ],
      goldMedalOptions: [
        { value: 0, label: "非金牌主播" },
        { value: 1, label: "金牌主播" },
        { value: 2, label: "纯提成" },
      ],
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
    // 获取uid
    console.log("接收uid", this.$route.query.uid);
    this.listQuery.uid = this.$route.query.uid;
    this.fetchData();
  },
  methods: {
    // 刷新
    refreshData() {
      this.list = null;
      this.listLoading = true;
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        status: 1,
        familyIds: null,
        pickerValue: [NOW_TIME_START, NOW_TIME_END],
      };
      setTimeout(() => {
        this.fetchData();
      }, 80);
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      this.familyList = [];
      this.todayListLoading = true;
      getGoldSubsidy(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      ).then((res) => {
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
      });
      // 获取家族列表
      getUserFamilyList()
        .then((res) => {
          this.familyList = (res.data.list || []).map((item) => {
            return {
              value: item.bossId || 0,
              label: nullS(item.familyName),
            };
          });
          // 获取已认证的主播列表
          return getGoldSubsidyList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          );
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            console.log(item.goldMedal);
            var goldMedalString = "非金牌";
            if (item.goldMedal == 0) {
              goldMedalString = "非金牌";
            } else if (item.goldMedal == 1) {
              goldMedalString = "金牌";
            } else if (item.goldMedal == 2) {
              goldMedalString = "纯提成";
            }
            var familyName = "暂无家族";
            for (const family of this.familyList) {
              if (family.value == item.bossId) {
                familyName = family.label;
                break;
              }
            }
            this.$set(item, "goldMedalString", goldMedalString);
            this.$set(item, "familyName", familyName);
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
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "主播ID",
          "主播昵称",
          "家族名称",
          "是否金牌主播",
          "总礼物价值",
          "总付费价值",
          "总彩票流水",
          "主播收益",
          "家族长收益",
          "发放收益星币",
          "有效时间",
          "收益归属时间",
          "创建时间",
        ];
        const filterVal = [
          "uid",
          "nickname",
          "familyName",
          "goldMedalString",
          "totalMl",
          "totalFfml",
          "totalCp",
          "anchorProfit",
          "bossProfit",
          "subsidy",
          "activeTime",
          "belong",
          "gmtCreateString",
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
  margin: 20px 0px;
  padding: 0px;
}
</style>
