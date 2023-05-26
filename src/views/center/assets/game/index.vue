<template>
  <div class="app-container">
    <div
      style="
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      "
    >
      <div style="display: flex; align-items: center">
        <span style="margin: 5px"></span>
        <el-input
          size="small"
          style="width: 240px"
          v-model="listQuery.uid"
          class="input-with-select"
          placeholder="请输入用户ID"
          clearable
          maxlength="10"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
          oninput="value=value.replace(/[^\d]/g,'')"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleSearchFilter"
          ></el-button>
        </el-input>
        <span style="margin: 5px"></span>
        <el-date-picker
          size="small"
          clearable
          v-model="listQuery.pickerValue"
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
        ></el-date-picker>
      </div>
      <el-button
        plain
        size="small"
        slot="suffix"
        icon="el-icon-search"
        @click="getGameList()"
      ></el-button>
    </div>

    <el-table v-cloading="listLoading" :data="list" border size="mini">
      <el-table-column
        type="index"
        label="序号"
        width="60"
         
      ></el-table-column>
      <el-table-column label="用户ID" min-width="80"  >
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column
        prop="before_chip"
        label="初始筹码"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="left_chip"
        label="投注结束后剩余筹码"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="user_chip"
        label="投注结果"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="win"
        label="获利额"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="gameid"
        label="游戏ID"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="game_name"
        label="游戏名称"
        min-width="120"
         
      ></el-table-column>
      <el-table-column
        prop="note"
        label="结束原因"
        min-width="80"
         
      ></el-table-column>
      <el-table-column
        prop="uuid"
        label="用户唯一ID(大厅)"
        width="140"
         
      ></el-table-column>
      <el-table-column
        prop="roundbegin"
        label="本局开始时间"
        width="140"
         
      ></el-table-column>
      <el-table-column
        prop="roundend"
        label="本局结束时间"
        width="140"
         
      ></el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
    ></el-pagination>
  </div>
</template>

<script>
import { getGameDetail } from "@/api/center/assets/game";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";

export default {
  name: "GameBaseController",
  filters: {},
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
        status: null,
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
    // 刷新
    refreshData() {
      this.list = null;
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        status: null,
        pickerValue: [],
      };
      this.fetchData();
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = false;
    },

    getGameList() {
      if (this.listQuery.uid == null || this.listQuery.uid < 0) {
        this.$message.error("用户id必传");
        return;
      }
      this.listLoading = true;
      getGameDetail(this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            return item;
          });
          this.listLoading = false;
        })
        .catch((err) => {
          this.list = null;
          this.listLoading = false;
          this.$message.error(err);
        });
    },

    // 过滤
    handleSearchFilter() {},

    // 每页的条数改变
    handleSizeChange(val) {
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
