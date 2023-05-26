<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          placeholder="请输入用户ID"
          clearable
          maxlength="10"
          style="width: 130px"
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.redPacketName"
          size="small"
          placeholder="请输入红包名称"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.type"
          size="small"
          placeholder="请选择中奖状态"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-search"
          type="primary"
          @click="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          plain
          icon="el-icon-refresh"
          @click="refreshData()"
        />
      </el-form-item>
      <el-form-item>
        <el-tag type="info">创建时间:</el-tag>
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
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          @change="handleSearchFilter"
        />
      </el-form-item>
    </el-form>

    <!--    <el-divider  style="margin-top: 20px;"  content-position="left"><h2>用户统计</h2></el-divider>-->
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
      fit
      highlight-current-row
     >
      <el-table-column label="用户ID" min-width="80"  >
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column
        prop="userHierarchyName"
        label="用户层级"
        min-width="80"
         
      />
      <el-table-column
        prop="deposit"
        label="昨日存款金额"
        min-width="80"
         
      />
      <el-table-column
        prop="lottery"
        label="昨日彩票流水"
        min-width="80"
         
      />
      <el-table-column
        prop="gift"
        label="昨日送礼金额"
        min-width="80"
         
      />
      <el-table-column
        prop="redPacketName"
        label="红包名称"
        min-width="80"
         
      />
      <el-table-column
        prop="type"
        label="是否中奖"
        min-width="80"
         
      >
        <template slot-scope="{ row }">
          <el-tag v-if="row.type === 1" type="success">已中奖</el-tag>
          <el-tag v-if="row.type === 0" type="info">未中奖</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="redType"
        label="红包类型"
        min-width="80"
         
      >
        <template slot-scope="{ row }">
          <span v-if="row.redType === 1" type="success">现金红包</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="money"
        label="中奖金额"
        width="140"
         
      />
      <el-table-column
        prop="createTimeString"
        label="领取时间"
        width="140"
         
      />
    </el-table>
    <!--    <el-divider content-position="left"><h2>总统计</h2></el-divider>-->
    <el-table :data="todayList" size="mini">
      <el-table-column type="" label="" min-width="80"   />
      <el-table-column prop="" label="" min-width="80"   />
      <el-table-column prop="" label="" min-width="80"   />
      <el-table-column
        prop="awardCoin"
        label="已中奖金额"
        min-width="80"
         
      />
      <el-table-column
        prop="receiveNumber"
        label="已领红包个数"
        min-width="80"
         
      />
      <el-table-column
        prop="awardNumber"
        label="中奖红包个数"
        min-width="80"
         
      />
      <el-table-column prop="" label="" min-width="80"   />
      <el-table-column label="" width="80"   />
      <el-table-column prop="" label="" width="140"   />
      <el-table-column prop="" label="" width="140"   />
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";
import {
  getRedPacketAwardList,
  getRedPacketAwardListTotal,
} from "@/api/config/redPacketAward";

export default {
  name: "RedPacketAward",
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
    return {
      list: [],
      todayList: [],
      listLoading: false,
      totalListLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        uid: null,
        type: null,
        redPacketName: "",
        pickerValue: [],
      },
      // 状态选择
      statusOptions: [
        { label: "未中奖", value: 0 },
        { label: "已中奖", value: 1 },
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
    this.fetchData();
  },
  methods: {
    // 刷新
    refreshData() {
      this.list = null;
      this.listQuery = {
        pageNum: 1,
        pageSize: 20,
        uid: null,
        type: null,
        redPacketName: "",
        pickerValue: [],
      };
      this.fetchData();
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      this.totalListLoading = true;
      getRedPacketAwardListTotal({
        uid: this.listQuery.uid,
        redPacketName: this.listQuery.redPacketName,
        type: this.listQuery.type,
        startTime: this.listQuery.pickerValue[0],
        endTime: this.listQuery.pickerValue[1],
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
          this.totalListLoading = false;
          this.listLoading = false;
          return getRedPacketAwardList({
            pageSize: this.listQuery.pageSize,
            pageNum: this.listQuery.pageNum,
            uid: this.listQuery.uid,
            redPacketName: this.listQuery.redPacketName,
            type: this.listQuery.type,
            startTime: this.listQuery.pickerValue[0],
            endTime: this.listQuery.pickerValue[1],
          });
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            this.$set(
              item,
              "createTimeString",
              formatUnixTime(item.createTime)
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
          this.totalListLoading = false;
          this.$message.error(err);
        });
    },

    // 过滤
    handleSearchFilter() {
      this.listQuery.pageNum = 1;
      this.fetchData();
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.listQuery.pageNum = 1;
      this.fetchData();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
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
