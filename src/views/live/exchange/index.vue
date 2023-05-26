<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
        <span class="search_info">兑换时间</span>
        <el-date-picker
          v-model="listQuery.pickerValue"
          size="small"
          clearable
          type="datetimerange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          class="input-with-select"
          placeholder="请输入主播ID"
          clearable
          maxlength="16"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <!-- <el-form-item>
        <el-tag type="info">主播昵称:</el-tag>
        <el-input
          v-model="listQuery.nickName"
          size="small"
          class="input-with-select"
          placeholder="请输入主播昵称"
          clearable
          maxlength="16"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item> -->

      <!-- <el-form-item>
        <el-select
          v-model="listQuery.state"
          size="small"
          placeholder="请选择状态"
          clearable
          @change="handleSearchFilter"
        >
          <el-option label="关闭" :value="0" />
          <el-option label="开启" :value="1" />
          <el-option label="过期" :value="-1" />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-search"
          type="primary"
          @click="handleSearchFilter"
        >搜索</el-button>
        <!-- 重置 -->
        <el-button size="small" icon="el-icon-refresh" @click="resets">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
      fit
      highlight-current-row
    >
      <el-table-column type="index" label="序号" width="60"   />
      <el-table-column
        prop="uid"
        label="主播ID"
        min-width="120"
         
      />
      <el-table-column
        prop="nickName"
        label="主播昵称"
        min-width="100"
         
      />
      <!-- <el-table-column
        prop="anchorCoin"
        label="魅力值余额"
        min-width="100"
         
        sortable
      /> -->
      <el-table-column
        prop="goldCoin"
        label="兑换魅力值数量"
        min-width="100"
         
        sortable
      />
      <el-table-column
        label="金币兑换百分比"
        min-width="100"
         
        sortable
      >
        <template slot-scope="{ row }">
          {{ (Number(row.resultCoin) / Number(row.goldCoin)).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="resultCoin"
        label="兑换金币"
        min-width="100"
         
        sortable
      />
      <!-- <el-table-column prop="state" label="状态" min-width="80"  >
        <template slot-scope="{ row }">
          <div>
            {{ row.state == 0 ? "关闭" : row.state == 1 ? "开启" : "过期" }}
          </div>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="updateTime"
        label="兑换时间"
        min-width="180"
         
      >
        <template slot-scope="{ row }">
          {{ dateToSrting(row.updateTime) }}
        </template>
      </el-table-column>
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
import { centerAssetsChange } from "@/api/live/exchange";
import { formatUnixTime, getDateTime } from "@/utils/tools";
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: "centerDepositIndex",
  data() {
    return {
      list: [],
      list2: [],
      listLoading: true,
      listLoading2: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        pickerValue: [],
        uid: "",
      },
      listQuery2: {
        id: "",
        uid: "",
      },
      // 弹窗数值
      // 弹窗数值

      dialogCreateVisible: false,
      dialogCreateLoading: false,

      dialogCreateLoading2: false,
      dialogCreateVisible2: false,

      dialogStatus: "",
      dialogTitleMap: {
        create: "新增",
        update: "编辑",
      },
      // 表单模型
      createModel: {
        id: 0,
        month: "",
        title: "",
        startTime: "",
        endTime: "",
        anchorId: "",
        activityRoulettePrizeReqs: [
          {
            id: 1,
            typeName: "",
            rouletteName: "",
            size: "",
            rate: "",
            roulettePic: "",
          },
        ],
        monthEpositAmt: null,
        totalEpositAmt: null,
        checkList: false,
        checkList2: false,
        winnersReqs: [{ id: "1", typeName: "", uid: "" }],
      },
      // 重新设置表单数据
      resetCreateModel() {
        this.createModel = {
          id: 0,
          month: "",
          title: "",
          startTime: "",
          endTime: "",
          anchorId: "",
          activityRoulettePrizeReqs: [
            {
              id: 1,
              typeName: "",
              rouletteName: "",
              size: "",
              rate: "",
              roulettePic: "",
            },
          ],
          checkList: false,
          checkList2: false,
          winnersReqs: [{ id: "1", typeName: "", uid: "" }],
        };
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
    this.listQuery.uid = this.$route.query.uid;
    this.fetchData();
  },
  methods: {
    dateToSrting(da) {
      return formatUnixTime(da);
      // let str = "";
      // if (da != undefined) {
      //   let date = new Date(da.toString().length == 10 ? da * 1000 : da);
      //   let y = date.getFullYear();
      //   let m = date.getMonth() + 1;
      //   let d = date.getDate();
      //   let h = date.getHours();
      //   let min = date.getMinutes();
      //   let s = date.getSeconds();
      //   y = y < 10 ? "0" + y : y;
      //   m = m < 10 ? "0" + m : m;
      //   d = d < 10 ? "0" + d : d;
      //   h = h < 10 ? "0" + h : h;
      //   min = min < 10 ? "0" + min : min;
      //   s = s < 10 ? "0" + s : s;
      //   str = `${y}-${m}-${d}  ${h}:${min}:${s}`;
      //   // console.log(date, y);
      // }
      // return str;
    },
    // 重置
    resets() {
      this.reloadData();
      this.resetCreateModel();
    },
    // 刷新数据
    reloadData() {
      // 重置数据
      this.list = [];
      this.listLoading = true;
      this.listQuery = {
        pageSize: 20,
        pageNum: 1,
        pickerValue: this.initTimer
      };
      setTimeout(() => {
        this.fetchData();
      }, 80);
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      // 请求服务器
      centerAssetsChange(this.listQuery)
        .then((res) => {
          console.log("兑换记录", res);
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
      console.log(this.listQuery);
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
  width: 260px;
  margin-right: 10px;

  /* .el-input-group__prepend {
        background-color: #fff;
      } */
}

.vue-img-preview {
  width: 30px;
  height: 30px;
  margin: 0px;
  padding: 0px;
  border-radius: 3px;
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
/deep/ .el-input--suffix .el-input__inner {
  padding-right: 15px;
}
</style>
