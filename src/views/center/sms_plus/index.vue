<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
        <span class="search_info">发送时间</span>
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
          v-model="listQuery.type"
          size="small"
          placeholder="请选择验证码类型"
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
          v-model="listQuery.phone"
          size="small"
          style="width: 240px"
          placeholder="请输入手机号"
          clearable
          maxlength="20"
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.smsType"
          size="small"
          placeholder="请选择发送平台"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in smsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="nowrap">
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
        prop="phone"
        label="手机号"
        min-width="100"
         
      />
      <el-table-column
        prop="code"
        label="验证码"
        min-width="60"
         
      />
      <el-table-column
        prop="data"
        label="状态码"
        min-width="60"
         
      />
      <el-table-column
        prop="smsTypeString"
        label="发送平台"
        min-width="60"
         
      />
      <el-table-column label="验证码类型" width="160"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.type | codeTypeFilter">{{
            row.codeTypeString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="startTimeString"
        label="发送开始时间"
        width="160"
         
      />
      <el-table-column
        prop="endTimeString"
        label="发送结束时间"
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
import { getSmsPlusList } from "@/api/center/sms/plus";
import { formatUnixTime, getDateTime } from "@/utils/tools";
const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: "CenterSmsPlusPage",
  filters: {
    codeTypeFilter(status) {
      const map = { 1: "success", 3: "info", 4: "" };
      return map[status];
    },
  },
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        phone: null,
        type: null,
        pickerValue: [],
        smsType: null,
      },
      typeOptions: [
        { label: "注册", value: 1 },
        { label: "重置密码", value: 3 },
        { label: "提现密码", value: 5 },
      ],
      smsOptions: [
        { label: "MTC语音平台", value: 1 },
        { label: "buka普通短信", value: 2 },
        { label: "ABENLA VOICE OTP", value: 3 },
        { label: "天一泓 普通短信", value: 4 },
        { label: "fibo语音短信", value: 5 },
        { label: "888 SMS OTP", value: 6 },
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
      getSmsPlusList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var smsTypeString = "";
            switch (item.smsType) {
              case 1:
                smsTypeString = "MTC语音平台";
                break;
              case 2:
                smsTypeString = "buka普通短信";
                break;
              case 3:
                smsTypeString = "ABENLA VOICE OTP";
                break;
              case 4:
                smsTypeString = "YN_普通短信";
                break;
              case 5:
                smsTypeString = "fibo语音短信";
                break;
              case 6:
                smsTypeString = "888 SMS OTP";
                break;
              default:
                smsTypeString = "其他平台";
                break;
            }
            var codeTypeString = "";
            switch (item.type) {
              case 1:
                codeTypeString = "用户注册";
                break;

              case 3:
                codeTypeString = "重置密码";
                break;
              case 5:
                codeTypeString = "提现密码";
                break;
              default:
                break;
            }
            this.$set(item, "smsTypeString", smsTypeString);
            this.$set(item, "codeTypeString", codeTypeString);
            this.$set(item, "startTimeString", formatUnixTime(item.startTime));
            this.$set(item, "endTimeString", formatUnixTime(item.endTime));
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
