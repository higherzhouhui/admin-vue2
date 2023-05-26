<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          style="width: 240px"
          class="input-with-select"
          placeholder="请输入用户ID"
          clearable
          maxlength="10"
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.pChannel"
          size="small"
          style="width: 240px"
          class="input-with-select"
          placeholder="请输入渠道名称"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchFilter"
        >搜索</el-button>
        <el-button
          size="small"
          plain
          icon="el-icon-refresh"
          @click="refreshData()"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="list" border size="mini">
      <el-table-column type="index" label="序号" width="60"   />
      <el-table-column label="用户ID" min-width="80"  >
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="层级"
        min-width="120"
         
      />
      <el-table-column
        prop="cash"
        label="总充值"
        min-width="120"
         
      />
      <el-table-column
        prop="withdraw"
        label="总出款"
        min-width="120"
         
      />
      <el-table-column
        prop="channel"
        label="上级渠道"
        min-width="80"
         
      />
      <el-table-column
        prop="channelName"
        label="存款渠道"
        min-width="80"
         
      />
      <el-table-column prop="ip" label="IP" min-width="60"   />
      <el-table-column
        prop="model"
        label="手机型号"
        min-width="60"
         
      />
      <el-table-column
        prop="os"
        label="手机注册系统"
        min-width="120"
         
      />
      <el-table-column
        prop="goldCoin"
        label="余额"
        min-width="80"
         
      />
      <el-table-column
        prop="userLevel"
        label="等级"
        min-width="80"
         
      />
      <el-table-column
        prop="createTime"
        label="注册时间"
        min-width="80"
         
      />
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
import { getUserList } from "@/api/center/user/new_user";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";

export default {
  name: "CenterUserAccountController",
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
        pickerValue: [],

        pChannel: null,
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
        pChannel: null,
        pickerValue: [],
      };
      this.fetchData();
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      var channel = this.$route.query.tt;
      console.log(channel);

      var type = this.$route.query.ss;
      console.log(type);

      var date = this.$route.query.dd;
      console.log(date);

      getUserList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery,
        channel,
        type,
        date
      )
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            if (item.channel == null && item.puid == 0) {
              this.$set(item, "channel", "自然增长");
            } else if (item.channel == null && item.puid != 0) {
              this.$set(item, "channel", "用户推广:" + item.puid);
            }

            if (item.os == 1) {
              this.$set(item, "os", "安卓用户端");
            } else if (item.os == 2) {
              this.$set(item, "os", "苹果用户端");
            } else if (item.os == 3) {
              this.$set(item, "os", "安卓主播端");
            } else if (item.os == 4) {
              this.$set(item, "os", "苹果主播端");
            }

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
