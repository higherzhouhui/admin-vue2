<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
        <span class="search_info">付费时间</span>
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
      </el-form-item> -->
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          style="width: 200px"
          placeholder="请输入用户ID"
          clearable
          maxlength="20"
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.anchorId"
          size="small"
          style="width: 200px"
          placeholder="请输入主播ID"
          clearable
          maxlength="20"
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.orderId"
          size="small"
          placeholder="请输入订单号"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.liveId"
          size="small"
          style="width: 200px"
          placeholder="请输入房间ID"
          clearable
          maxlength="20"
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.type"
          size="small"
          style="width: 150px"
          placeholder="请选择付费类型"
        >
          <el-option
            v-for="item in logstypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
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
          icon="el-icon-refresh"
          @click="reset"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60"   />
      <el-table-column
        prop="recordId"
        label="房间ID"
        min-width="60"
         
      />
      <el-table-column label="用户ID" min-width="125"  >
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column label="主播ID" min-width="125"  >
        <template slot-scope="{ row }">
          <user-drawer :uid="row.anchorId" />
        </template>
      </el-table-column>
      <el-table-column
        prop="trn"
        label="订单号"
        min-width="120"
         
      />
      <el-table-column
        prop="anchorCoin"
        label="主播获得收益"
        min-width="125"
         
        sortable
      />
      <el-table-column
        prop="bossCoin"
        label="家族长获得收益"
        min-width="140"
         
        sortable
      />
      <el-table-column
        prop="price"
        label="付费价格"
        min-width="125"
         
        sortable
      />
      <el-table-column
        prop="gmtCreateString"
        label="付费时间"
        width="160"
         
      />
      <el-table-column label="付费类型" width="80"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.type | typeFilter">{{
            row.typeString
          }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-cloading="todayListLoading"
      :data="todayList"
      highlight-current-row
      size="mini"
    >
      <el-table-column type="" label="" width="60"   />
      <el-table-column prop="" label="" min-width="60"   />
      <el-table-column label="" min-width="80"   />
      <el-table-column label="" min-width="80"   />
      <el-table-column
        prop="totalAnchorCoin"
        label="总付费收益"
        min-width="80"
         
      />
      <el-table-column
        prop="totalBossCoin"
        label="总家族长收益"
        min-width="80"
         
      />
      <el-table-column prop="" label="" min-width="80"   />
      <el-table-column prop="" label="" width="160"   />
      <el-table-column label="" width="80"   />
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 1000]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import {
  getLiveChargeRoomLogList,
  getLiveChargeRoomLog,
} from "@/api/live/charge_room";
import { emptyS, nullS, formatUnixTime, getDateTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: "LiveUserChargeRoomDetailController",
  filters: {
    typeFilter(status) {
      const map = { 1: "warning", 2: "success" };
      return map[status];
    },
  },
  components: {
    UserDrawer,
  },
  data() {
    return {
      list: null,
      todayList: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        type: null,
        uid: null,
        anchorId: null,
        liveId: null,
        orderId: null,
        pickerValue: [],
      },
      logstypeOptions: [
        { value: 1, label: "计时" },
        { value: 2, label: "按次" },
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
  computed: {
    initTimer() {
      return this.$store.getters.timerDate
    }
  },
  created() {
    this.listQuery.pickerValue = this.initTimer
    this.fetchData();
  },
  methods: {
    reset() {
      this.listQuery = {
        page: 1,
        pickerValue: this.initTimer,
        limit: 20
      }
      this.fetchData()
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      this.todayListLoading = true;
      getLiveChargeRoomLog(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      )
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
          return getLiveChargeRoomLogList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          );
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var typeString = "";
            if (item.type == 1) {
              typeString = "计时";
            } else if (item.type == 2) {
              typeString = "按次";
            }
            this.$set(item, "typeString", typeString);
            this.$set(item, "gmtCreateString", formatUnixTime(item.gmtCreate));
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
