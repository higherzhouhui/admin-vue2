<template>
  <div class="app-container">
    <div class="topContainer">

      <div class="item">
        <div class="title"><span>统计</span><el-button size="mini" plain icon="el-icon-refresh" class="refresh" @click="fetchData()" /></div>
        <div v-cloading="listLoading" class="content">
          <div class="left">
            <div class="desc">房间总人数</div>
            <div class="number">{{ list[0].roomTotalNum }}</div>
          </div>
          <div class="left">
            <div class="desc">总开播</div>
            <div class="number">{{ list[0].anchorTotalNum }}</div>
          </div>
          <div class="left">
            <div class="desc">当前开播人数</div>
            <div class="number">{{ list[0].curAnchorTotalNum }}</div>
          </div>
        </div>
      </div>


      <!-- <div class="item">
        <div class="title">房间总人数</div>
        <div class="num">{{ list[0].roomTotalNum }}</div>
      </div>
      <div class="box">
        <div class="title">总开播</div>
        <div class="num">{{ list[0].anchorTotalNum }}</div>
      </div>
      <div class="box">
        <div class="title">当前开播人数</div>
        <div class="num">{{ list[0].curAnchorTotalNum }}</div>
      </div> -->
    </div>

    <!-- <div style="margin: 40px 0px">
      <el-button size="small" icon="el-icon-refresh" @click="fetchData">刷新</el-button>
      <el-divider content-position="center">
        <h2>用户统计</h2>
      </el-divider>
    </div> -->

    <!-- <el-table v-cloading="listLoading" :data="list">
      <el-table-column prop="roomTotalNum" label="房间总人数" min-width="60" />
    </el-table>

    <div style="margin: 40px 0px">
      <el-divider content-position="center">
        <h2>主播统计</h2>
      </el-divider>
    </div> -->

    <!-- <el-table v-cloading="listLoading" :data="list">
      <el-table-column prop="anchorTotalNum" label="总开播" min-width="60" />
      <el-table-column prop="curAnchorTotalNum" label="当前开播人数" min-width="60" />
    </el-table> -->

    <div style="margin: 40px 0px">
      <el-table-column prop="anchorTotalNum" label="总开播" min-width="60" />
      <el-table-column prop="curAnchorTotalNum" label="当前开播人数" min-width="60" />
      <!-- <div style="margin: 40px 0px">
        <el-divider content-position="center">
          <h2>历史统计</h2>
        </el-divider>
      </div> -->
      <!-- <el-form :inline="true">
        <el-form-item>
          <el-tag type="primary">日期:</el-tag>
          <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
            :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
            align="right" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="handleSearchFilter" />
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="fetchHistoryData">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="small" icon="el-icon-refresh" @click="resets">重置</el-button>
        </el-form-item>
      </el-form> -->
      <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" :dateType="1" />
      <el-table v-cloading="historyLoading" :data="historyList">
        <el-table-column type="index" label="序号" width="70" />
        <el-table-column prop="dayLabel" label="日期（天）" min-width="60" />
        <el-table-column prop="roomTotalNum" label="房间总人数" min-width="60" />
        <el-table-column prop="liveBooNum" label="开播人数" min-width="60" />
      </el-table>
      <!-- 分页 -->
      <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
        :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import {getNowFormatDay } from '@/utils/tools'

import { getOntimeUser, getHistoryOntimeUser } from "@/api/promotion/ontime";
// const NOW_TIME_START = getNowFormatDay('-')

export default {
  name: "StatUserController",
  filters: {
    osFilter(status) {
      const map = { 0: "info", 1: "", 2: "success" };
      return map[status];
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        pickerValue: []
      },
      historyList: [],
      historyLoading: false,
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
    getMonth() {
      let noTime = this.$store.getters.timerDate[0]
      return getNowFormatDay('-', true, noTime)
    }
  },
  created() {
    this.listQuery.pickerValue = [this.getMonth, this.getMonth]
    this.fetchData();
    this.fetchHistoryData();
  },
  methods: {
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getOntimeUser()
        .then((res) => {
          if (res.code === 200) {
            this.list = [
              {
                anchorTotalNum: res.data.anchorTotalNum,
                curAnchorTotalNum: res.data.curAnchorTotalNum,
                roomTotalNum: res.data.roomTotalNum,
              },
            ];
          } else {
            this.$message.error(res.message);
          }
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
          this.$message.error(err);
        });
    },
    // 获取历史统计数据
    fetchHistoryData() {
      this.historyLoading = true;
      let startTime, endTime;
      if (this.listQuery.pickerValue) {
        startTime = this.listQuery.pickerValue[0];
        endTime = this.listQuery.pickerValue[1];
      }
      getHistoryOntimeUser({
        pageNum: this.listQuery.pageNum,
        pageSize: this.listQuery.pageSize,
        startTime,
        endTime,
      })
        .then((res) => {
          if (res.code === 200) {
            this.historyList = res.data.list;
            this.listQuery.total = res.data.total;
          } else {
            this.$message.error(res.message);
          }
          this.historyLoading = false;
        })
        .catch((err) => {
          this.historyLoading = false;
          this.$message.error(err);
        })
        .catch((err) => {
          this.historyLoading = false;
          this.$message.error(err);
        });
    },
    resets() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        pickerValue: [this.getMonth, this.getMonth]
      };
      this.fetchHistoryData();
    },
    // 过滤
    handleSearchFilter() {
      this.fetchHistoryData();
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.fetchHistoryData();
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.fetchHistoryData();
    },
  },
};
</script>
<style lang="scss" scoped>
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

.flex {
  display: flex;


}

.box {
  padding: 10px;
  margin-right: 20px;
  box-sizing: border-box;
  width: 223px;
  height: 92px;
  background: #F8F9FB;
  border-radius: 8px;
  text-align: center;
}

.box .title {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
}

.box .num {
  margin-top: 15px;
  font-size: 30px;
  font-family: HelveticaNeue;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
}
.topContainer {
    display: grid;
    grid-template-columns: 1fr 1fr 1.4fr;
    column-gap: 30px;
    margin-bottom: 15px;
    @media screen and (max-width: 1440px) {
      column-gap: 15px;
    }
  }
  .item {
      border-radius: 6px;
      border: 1px solid #f5f5f5;
      width: 100%;
      padding: 10px;
      min-width: 180px;
      .title {
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        align-items: center;
        .activeTitle {
          min-width: 120px;
        }
        .refresh {
          color: var(--theme);
          cursor: pointer;
        }
      }
      .btns {
        display: flex;
        button {
          margin-left: 6px;
        }
      }
      .content {
        display: flex;
        align-items: center;
        height: 190px;
      }
      .left {
        flex: 1;
        text-align: center;
        .number {
          font-size: 18px;
          color: var(--theme);
          margin-top: 12px;
          font-weight: bold;
        }
        .desc {
          font-size: 14px;
          opacity: 0.8;
        }
      }
    }
</style>
