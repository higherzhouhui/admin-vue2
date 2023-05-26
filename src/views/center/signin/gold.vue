<template>
  <div class="app-container">
    <div class="flex-top-center">
      <el-form :inline="true">
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          :placeholder="'用户ID搜索'"
          clearable
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.creditedFlag"
          size="small"
          placeholder="是否到账"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in bindTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
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
          format="yyyy-MM-dd HH:mm:ss"
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          plain
          icon="el-icon-search"
          @click="handleSearchFilter"
        >搜索</el-button>
      </el-form-item>
    </el-form>
    <el-button
          :disabled="list.length == 0 ? true : false"
          size="small"
          :loading="downloadLoading"
          type="primary"
          icon="el-icon-document"
          @click="handleDownload"
        >
          导出
        </el-button>
    </div>
   

    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
     >
      <el-table-column prop="uid" :label="'用户ID'"   />
      <el-table-column prop="nickname" :label="'用户昵称'"   />
      <el-table-column
        prop="title"
        :label="'活动名称'"
         
      ></el-table-column>
      <el-table-column
        prop="signDay"
        :label="'签到天数'"
         
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="gainCoin"
        :label="'获取金币'"
         
        sortable
      />
      <el-table-column prop="creditedFlag" label="到账状态"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" v-if="row.creditedFlag == 1">已到账</el-tag>
          <el-tag size="medium" type="info" v-else>未到账</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="到账时间"  >
        <template slot-scope="{ row }">
          {{
            row.creditedTime
              ? $moment(row.creditedTime).format("YYYY-MM-DD HH:mm:ss")
              : ""
          }}
        </template>
      </el-table-column>
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
import { listRecord } from "@/api/center/signin";
import { formatUnixTime } from "@/utils/tools";

export default {
  name: "PromotionUserBaseController",
  components: {},
  data() {
    return {
      list: [],
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        uid: "",
        creditedFlag: undefined,
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
      downloadLoading: false,
      bindTypeOptions: [
        { label: "已到账", value: 1 },
        { label: "未到账", value: 0 },
      ],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 刷新数据
    reloadData() {
      // 重置数据
      this.list = null;
      this.listLoading = true;
      this.listQuery = {
        page: 1,
        limit: 20,
        uid: "",
        creditedFlag: undefined,
        pickerValue: [],
      };
      setTimeout(() => {
        this.fetchData();
      }, 80);
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      // 请求服务器
      listRecord(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.list = res.data.list || [];
          this.listQuery.total = res.data.total || 0;
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
    handleDownload() {
      if (this.list.length > 10000) {
        //   this.$message.error(this.$t("menu.title286"));
        return;
      }
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "用户ID",
          "用户昵称",
          "活动名称",
          "签到天数",
          "获取金币",
          "到账状态",
          "到账时间",
        ];
        const filterVal = [
          "uid",
          "nickname",
          "title",
          "signDay",
          "gainCoin",
          "creditedFlag",
          "creditedTime",
        ];
        const list = this.list;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "领取金币列表",
          autoWidth: this.true,
          bookType: "xlsx",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "creditedTime" && v[j] != null) {
            return formatUnixTime(v[j]);
          }
          if (j === "creditedFlag" && v[j] != null) {
            if (v[j] == 1) return "已到账";
            else if (v[j] == 0) return "未到账";
          } else {
            return v[j];
          }
        })
      );
    },
  },
};
</script>
<style scoped>
.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
</style>
