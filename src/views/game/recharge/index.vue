<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-select
          v-model="listQuery.type"
          size="small"
          placeholder="请选择游戏类型"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
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
          format="yyyy-MM-dd HH:mm"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          @change="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="small"
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
      <el-table-column prop="id" label="ID" min-width="60"   />
      <el-table-column label="用户ID" min-width="60"  >
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column
        prop="gameRecord"
        label="游戏流水"
        min-width="120"
         
      />

      <el-table-column label="游戏类型" width="80"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.type | statusFilter">{{
            row.typeString
          }}</el-tag>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="typeString" label="游戏类型" width="160"  ></el-table-column> -->

      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="160"
         
      />
    </el-table>

    <el-table v-cloading="todayListLoading" :data="todayList" size="mini">
      <el-table-column type="" label="" width="60"   />
      <el-table-column prop="" label="" min-width="60"   />
      <el-table-column prop="" label="" min-width="60"   />
      <el-table-column
        prop="totalCoin"
        label="总游戏流水"
        min-width="60"
         
      />
      <el-table-column prop="" label="" min-width="60"   />
      <el-table-column prop="" label="" min-width="60"   />
      <el-table-column prop="" label="" min-width="100"   />
      <el-table-column label="" width="80"   />
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
import { getRecordList, getTotalList } from "@/api/game/game_recharge";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";

export default {
  name: "GameRechargeController",
  filters: {
    statusFilter(status) {
      const map = { 0: "info", 2: "success", 3: "danger" };
      return map[status];
    },
  },
  components: {
    UserDrawer,
  },
  data() {
    return {
      lotteryCode: null,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        type: null,
        pickerValue: [],
      },
      typeOptions: [
        { value: 1, label: "开元游戏" },
        { value: 7, label: "CMD体育" },
        { value: 5, label: "BG游戏" },
        { value: 6, label: "沙巴体育" },
      ],
      downloadLoading: false,
    };
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
  created() {
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
          return getRecordList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          );
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var typeString = "";
            if (item.type == 1) {
              typeString = "开元游戏";
            } else if (item.type == 2) {
              typeString = "AG游戏";
            } else if (item.type == 3) {
              typeString = "至尊游戏";
            } else if (item.type == 4) {
              typeString = "富翁游戏";
            } else if (item.type == 6) {
              typeString = "沙巴体育";
            } else if (item.type == 7) {
              typeString = "CMD体育";
            } else if (item.type == 5) {
              typeString = "BG游戏";
            }

            this.$set(item, "typeString", typeString);
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
        const tHeader = ["ID", "用户ID", "游戏流水", "游戏类型", "创建时间"];
        const filterVal = [
          "id",
          "uid",
          "gameRecord",
          "typeString",
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
</style>
