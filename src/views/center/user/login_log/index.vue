<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
        <span class="search_info">登录时间:</span>
        <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
          :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm" value-format="timestamp" :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter" />
      </el-form-item> -->
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" style="width: 200px" placeholder="请输入用户ID" clearable maxlength="20"
          oninput="value=value.replace(/[^\d]/g,'')" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.ip" size="small" style="width: 200px" placeholder="请输入登陆IP" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.udid" size="small" style="width: 200px" placeholder="请输入UDID" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" plain icon="el-icon-refresh" @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="用户ID" min-width="125">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column label="手机类型" width="110">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.os | osFilter">{{
            row.osString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="model" label="手机型号" min-width="120" />
      <el-table-column prop="softVersion" label="软件版本" min-width="80" />
      <el-table-column prop="version" label="系统版本" min-width="80" />
      <el-table-column prop="udid" label="手机唯一标识" min-width="200" />
      <el-table-column prop="ip" label="IP" min-width="110" />
      <el-table-column prop="province" label="省" min-width="60" />
      <el-table-column prop="city" label="市" min-width="60" />
      <el-table-column prop="address" label="位置信息" min-width="100" />
      <el-table-column label="经纬度" min-width="120">
        <template slot-scope="{ row }">
          <span>{{ row.x + "." + row.y }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreateString" label="登录时间" width="160" />
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 10000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import { getUserLoginLogList } from "@/api/center/user/login_log";
import { emptyS, nullS, formatUnixTime, getDateTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";
let { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: "CenterUserLoginLogPage",
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
        uid: null,
        ip: null,
        udid: null,
        pickerValue: [NOW_TIME_START, NOW_TIME_END],
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
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        pickerValue: [NOW_TIME_START, NOW_TIME_END]
      }
      this.fetchData()
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getUserLoginLogList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      )
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var osString = "";
            switch (item.os) {
              case 0:
                osString = "未知";
                break;
              case 1:
                osString = "安卓用户端";
                break;
              case 2:
                osString = "苹果用户端";
                break;
              case 3:
                osString = "安卓主播端";
                break;
              case 4:
                osString = "苹果主播端";
                break;
              case 5:
                osString = "h5用户端";
                break;
              case 6:
                osString = "web用户端";
                break;
              default:
                break;
            }
            this.$set(item, "osString", osString);
            this.$set(item, "gmtCreateString", formatUnixTime(item.gmtCreate));
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
