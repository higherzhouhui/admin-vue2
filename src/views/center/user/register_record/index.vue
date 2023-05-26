<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
        <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
          :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm" value-format="timestamp" :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter" />
      </el-form-item> -->
      <el-form-item>
        <el-input v-model="listQuery.phone" size="small" style="width: 180px" class="input-with-select"
          placeholder="请输入手机" clearable @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" size="mini">
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="udid" label="UDID" width="130" />
      <el-table-column prop="phone" label="手机号">
        <template slot-scope="{ row }">
          {{ row.phone }}
        </template>
      </el-table-column>
      <el-table-column prop="agentId" label="代理ID" />
      <el-table-column prop="puid" label="推广人ID" />
      <el-table-column prop="ip" label="IP" />
      <el-table-column prop="registerIp" label="注册IP" />
      <el-table-column prop="os" label="设备类型">
        <template slot-scope="{ row }">
          {{
            row.os == 1
            ? "安卓"
            : row.os == 2
              ? "苹果"
              : row.os == 3 || row.os == 5
                ? "web"
                : row.os == 4 || row.os == 6
                  ? "h5"
                  : "other"
          }}
        </template>
      </el-table-column>
      <el-table-column prop="errorReason" label="失败原因" min-width="200" />
      <el-table-column prop="registerTime" label="注册时间">
        <template slot-scope="{ row }">
          {{ formatUnixTime(row.registerTime) }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="gmtCreate" label="创建时间"  >
        <template slot-scope="{ row }">
          {{ formatUnixTime(row.gmtCreate) }}
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import { getErrorRegisterList } from "@/api/center/user/log";
import { formatUnixTime, getDateTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";
const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: "RegisterRecordIndex",
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
  },
  data() {
    var checkWater = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户流水不能为0"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value < 1) {
            callback(new Error("用户流水不可小于1"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      formatUnixTime,
      list: [],
      listLoading: true,
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
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        phone: null,
        pickerValue: [NOW_TIME_START, NOW_TIME_END],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 刷新
    reset() {
      this.list = null;
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        phone: null,
        pickerValue: [NOW_TIME_START, NOW_TIME_END],
      };
      this.fetchData();
    },
    // 获取列表数据
    async fetchData() {
      this.listLoading = true;
      getErrorRegisterList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      )
        .then((res) => {
          this.list = (res.data.list || res.data || []).map((item) => {
            this.$set(item, "gmtCreateString", formatUnixTime(item.gmtUpdate));
            item.categoryName = "正式用户";
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
    handleSearchFilter(type) {
      this.listQuery.page = 1;
      if (type === "reset") {
        this.listQuery = {
          page: 1,
          limit: this.listQuery.limit,
        };
      }
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
.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
</style>
