<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" :dateType="3" />
    <!-- {{ listQuery.pickerValue }} -->
    <el-form :inline="true" class="searchFormWrapper">
      <!-- 状态 -->
      <!-- <el-form-item>
        <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
          :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm" value-format="yyyyMMddHHmmss" :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item> -->
      <el-form-item class="export_btn">
        <!-- 导出 -->
        <el-button size="small" :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">
          导出Excel
        </el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <div style="margin-right: 20px">
          用户人数：<span>{{ peopleData }}</span>
        </div>
      </el-form-item>
      <el-form-item>
        <div>
          总贡献值：<span>{{ rankValueData }}</span>
        </div>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="用户ID" min-width="180">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="用户昵称" min-width="120" />
      <el-table-column label="用户头像" width="80">
        <template slot-scope="{ row }">
          <el-image class="vue-img-preview" :src="row.avatar" fit="contain" lazy @click="reloadAvatar(row)">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="rankValue" label="贡献值" min-width="120" />
    </el-table>
  </div>
</template>

<script>
import { getRankList, userDaySearchExport } from "@/api/live/user_rank";
import { emptyS, nullS, formatUnixTime, getNowFormatDay } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";
// const NOW_DAY = getNowFormatDay()
export default {
  name: "LiveDayRankController",
  filters: {},
  components: {
    UserDrawer,
  },
  data() {
    return {
      list: [],
      downloadLoading: false,
      listLoading: true,
      listQuery: {
        status: 1,
        pickerValue: [],
      },

      statusOptions: [
        { value: 1, label: "日榜" },
        { value: 2, label: "周榜" },
        { value: 3, label: "月榜" },
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
      peopleData: 0,
      rankValueData: 0,
    };
  },
  computed: {
    getMonth() {
      let noTime = this.$store.getters.timerDate[0]
      return getNowFormatDay('', true, noTime)
    }
  },
  created() {
    this.listQuery.pickerValue = [`${this.getMonth}000000`, `${this.getMonth}235959`]
    this.fetchData();
  },
  methods: {
    // 刷新
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20
      };
      setTimeout(() => {
        this.fetchData();
      }, 80);
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      this.familyList = null;
      getRankList(this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            return item;
          });
          this.listQuery.total = res.data.total;
          this.listLoading = false;
          let datas = 0;
          (res.data.list || []).forEach((value) => {
            datas += value.rankValue;
          });
          this.peopleData = res.data.total;
          this.rankValueData = datas;
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
    // 导出
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      let data = {
        ...this.listQuery,
        endTime:
          this.listQuery.pickerValue[0] !== undefined
            ? this.listQuery.pickerValue[1]
            : "",
        startTime:
          this.listQuery.pickerValue[0] !== undefined
            ? this.listQuery.pickerValue[0]
            : "",
      };
      this.downloadLoading = true;
      userDaySearchExport(data) //导出的接口
        .then((result) => {
          this.downloadLoading = false;
          console.log(result);
          const link = document.createElement("a"); //创建a标签
          const blob = new Blob([result], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }); //设置文件流
          link.style.display = "none";
          // 设置连接
          link.href = URL.createObjectURL(blob); //将文件流转化为blob地址
          link.download = "用户贡献报表";
          document.body.appendChild(link);
          // 模拟点击事件
          link.click(); //设置点击事件
        })
        .catch((err) => {
          this.downloadLoading = false;
          console.log(err);
        });
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
</style>
