<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
        <span class="search_info">创建时间</span>
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
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <el-select
          v-model="listQuery.status"
          size="small"
          placeholder="请选择状态"
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
        <el-select
          v-model="listQuery.gid"
          filterable
          size="small"
          placeholder="请选择座驾名称"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in carOptions"
            :key="item.gid"
            :label="item.gname"
            :value="item.gid"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.from"
          filterable
          size="small"
          placeholder="请选择获得途径"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in formOptions"
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
          style="width: 220px"
          placeholder="请输入用户ID"
          clearable
          oninput="value=value.replace(/[^\d]/g,'')"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.trn"
          size="small"
          style="width: 220px"
          placeholder="请输入订单号"
          clearable
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
      <el-table-column label="用户ID" min-width="100"  >
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column
        prop="trn"
        label="订单号"
        min-width="160"
         
      />
      <el-table-column
        prop="gname"
        label="座驾名称"
        min-width="100"
         
      />
      <el-table-column
        prop="hours"
        label="时长(小时)"
        min-width="120"
         
        sortable
      />
      <el-table-column
        prop="goldCoin"
        label="消耗的金币"
        min-width="110"
         
        sortable
      />
      <el-table-column
        prop="statusString"
        label="获得途径"
        min-width="100"
         
      />
      <el-table-column
        prop="operator"
        label="操作人"
        min-width="100"
         
      />
      <el-table-column
        prop="gmtCreateString"
        label="创建时间"
        width="160"
         
      />
      <el-table-column
        prop="gmtendTimeString"
        label="结束时间"
        width="160"
         
      />
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getPropPlusList } from "@/api/center/prop/plus";
import { getPropList } from "@/api/config/prop";
import { emptyS, nullS, formatUnixTime, getDateTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";
const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: "CenterUserPropPlusPage",
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
        status: null,
        uid: null,
        gid: null,
        trn: null,
        pickerValue: [],
        from: null,
      },
      statusOptions: [
        { label: "使用中", value: 0 },
        { label: "已过期", value: 1 },
      ],
      carOptions: [],
      formOptions: [
        { label: "金币购买", value: 0 },
        { label: "充值赠送", value: 1 },
        { label: "后台添加", value: 2 },
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
        limit: 20,
        pickerValue: this.initTimer
      }
      this.fetchData()
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      var cars = [];
      // 获取所有座驾配置列表
      getPropList({ type: 1 })
        .then((res) => {
          for (const item of res.data.list || []) {
            if (item.type == 1) {
              cars.push({
                gid: item.gid || 0,
                gname: nullS(item.gname),
              });
            }
          }
          this.carOptions = cars;
          // 获取座驾明细列表
          return getPropPlusList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          );
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var gname = "";
            for (const car of cars) {
              if (car.gid == item.gid) {
                gname = car.gname;
              }
            }
            var statusString = "";
            switch (item.status) {
              case 0:
                statusString = "金币购买";
                break;
              case 1:
                statusString = "充值赠送";
                break;
              case 2:
                statusString = "后台添加";
                break;
              default:
                break;
            }
            this.$set(item, "gname", gname);
            this.$set(item, "statusString", statusString);
            this.$set(item, "gmtCreateString", formatUnixTime(item.gmtCreate));
            this.$set(item, "gmtendTimeString", formatUnixTime(item.endTime));
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
