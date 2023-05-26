<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true" class="searchFormWrapper">
      <!-- <el-form-item>
        <span class="search_info">开播时间:</span>
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
      </el-form-item> -->
      <!-- 直播状态 -->
      <el-form-item>
        <el-select v-model="listQuery.status" size="small" placeholder="请选择直播状态" clearable @change="handleSearchFilter">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <!-- 多选家族搜索 -->
      <el-form-item>
        <el-select v-model="listQuery.familyIds" size="small" style="width: 300px" multiple filterable clearable
          placeholder="请输入或选择家族" @clear="handleSearchFilter">
          <el-option v-for="item in familyList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" style="width: 200px" placeholder="请输入用户ID" clearable maxlength="20"
          oninput="value=value.replace(/[^\d]/g,'')" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter" />
      </el-form-item>
      <!-- <el-button style="margin: 10px" type="primary" @click="cancelPkStream()">取消主播混流</el-button> -->
      <el-form-item>
        <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
      <el-form-item class="export_btn">
        <el-button size="small" type="primary" icon="el-icon-document" @click="handleDownload">
          导出Excel
        </el-button>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="list" size="mini">
      <el-table-column type="expand">
        <template slot-scope="{ row }">
          <el-form label-position="left" inline class="demo-table-expand">
            <div v-for="(item, index) in row.roomType" :key="index">
              <el-form-item label="时间">
                <span>{{ item.time }}</span>
                <!-- <span>{{ item.roomType }}</span> -->
              </el-form-item>
              <el-form-item label="房间状态">
                <span>{{ item.roomType }}</span>
              </el-form-item>
            </div>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="主播ID" min-width="120">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="anchorName" label="主播昵称" min-width="140" />
      <el-table-column prop="id" label="房间ID" min-width="60" />
      <el-table-column prop="familyName" label="家族名称" min-width="100" />
      <el-table-column label="直播状态" width="90">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.status | statusFilter">{{
            row.statusText
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="房间类型" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium">{{
            row.roomType | getStatus
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="totalMl" label="总礼物价值" min-width="120" sortable />
      <el-table-column prop="ml" label="礼物收益/魅力" min-width="140" sortable />
      <el-table-column prop="totalFfml" label="总付费价值" min-width="110" sortable />
      <el-table-column prop="ffml" label="付费收益" min-width="100" sortable />
      <el-table-column prop="totalCp" label="总彩票流水" min-width="110" sortable />
      <el-table-column prop="cpStatement" label="彩票分成" min-width="100" sortable />
      <el-table-column prop="startTimeString" label="开播时间" min-width="140" />
      <el-table-column prop="interRoomNum" label="观众人数" min-width="140" sortable />
      <el-table-column prop="endTimeString" label="下播时间" min-width="140" />
      <el-table-column prop="lsatTimeString" label="持续时间" min-width="100" />
      <el-table-column label="操作" width="140" fixed="right">
        <template slot-scope="{ row }">
          <span v-if="row.status === 1" class="operation_btn" type="danger" size="mini"
            @click="finish_click(row)">手动下播</span>
          <span class="operation_btn" @click="showSmoothLine(row)">
            推流质量
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-cloading="todayListLoading" :data="todayList" size="mini">
      <el-table-column prop="" label="" width="60" />
      <el-table-column prop="" label="" min-width="100" />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column prop="totalFfml" label="总付费收益" min-width="100" />
      <el-table-column prop="totalAnchorCoin" label="总魅力收益" min-width="100" />
      <el-table-column prop="totalCpStatement" label="总彩票流水" min-width="100" />
      <el-table-column prop="totalTime" label="总开播时间" min-width="100" />
      <el-table-column label="总观众人数" min-width="100">{{
        totalPeople
      }}</el-table-column>
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column prop="" label="" width="120" />
    </el-table>

    <!-- 新建/编辑 消息公告  -->
    <el-dialog title="上行推流质量" :class="fullscreen && 'all'" class="sxtxzl-box" :width="fullscreen ? '100%' : '50%'"
      :visible.sync="dialogCreateVisible" :close-on-click-modal="false">
      <el-date-picker v-model="dialogQuery.pickerValue" size="small" clearable type="datetimerange" range-separator="~"
        start-placeholder="开始日期" end-placeholder="结束日期" align="right" format="yyyy-MM-dd HH:mm:ss"
        :default-time="['00:00:00', '23:59:59']" value-format="timestamp" @change="handleSearchDialog" />
      <div style="position: absolute; right: 45px; top: 20px; cursor: pointer" @click="fullscreen = !fullscreen">
        <img style="width: 16px" src="../../../../assets/imgs/check.png" alt="" />
      </div>
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <div style="margin-top: 12px">
          手机类型：{{ phoneInfo.os == 3 ? "安卓" : "苹果" }} 手机型号:
          {{ phoneInfo.model }} 软件版本: {{ phoneInfo.softVersion }} 系统版本:
          {{ phoneInfo.version }}
        </div>
        <div id="audioFPS" />
        <div id="videoFPS" />
        <div id="audioRate" />
        <div id="videoRate" />
        <div id="bandWidth" />
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import {
  getUserLiveRecordList,
  getUserLiveRecord,
  finishClick,
  getUserFamilyList,
  getStreamPushInfo,
} from "@/api/live/live_record";
import * as echarts from "echarts";
import { nullS, formatUnixTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";

export default {
  name: "LiveUserLiveRecordController",
  filters: {
    statusFilter(status) {
      const map = { 0: "info", 1: "success" };
      return map[status];
    },
    getStatus(list) {
      try {
        let { roomType } = list[list.length - 1]
        return roomType || '免费房间'
      } catch (error) {
        return '免费房间'
      }
    }
  },
  components: {
    UserDrawer,
  },
  data() {
    return {
      fullscreen: false,
      list: null,
      todayList: null,
      todayListLoading: true,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        status: null,
        uid: null,
        familyIds: null,
        pickerValue: [],
      },
      familyList: [],
      statusOptions: [
        { label: "直播中", value: 1 },
        { label: "已下播", value: 0 },
      ],

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      createModel: {},
      dialogQuery: {},
      phoneInfo: {},
    };
  },
  computed: {
    initTimer() {
      return this.$store.getters.timerDate;
    },
    totalPeople() {
      if (this.list && this.list.length > 0) {
        return this.list.reduce((sum, item) => {
          sum += item.interRoomNum;
          return sum;
        }, 0);
      } else return 0;
    },
  },
  watch: {
    dialogCreateVisible() {
      if (!this.fullscreen) return;
      setTimeout(() => {
        this.fullscreen = false;
      }, 200);
    },
  },
  created() {
    this.listQuery.pickerValue = this.initTimer;
    this.fetchData();
  },
  methods: {
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        pickerValue: this.initTimer,
      };
      this.fetchData();
    },
    showSmoothLine(row) {
      this.dialogCreateVisible = true;
      const startTime = new Date().getTime() - 6 * 60 * 60 * 1000;
      const endTime = new Date().getTime();
      this.dialogQuery = {
        liveId: row.id,
        pickerValue: [startTime, endTime],
      };
      this.handleSearchDialog();
    },
    handleSearchDialog() {
      if (this.dialogQuery.pickerValue && this.dialogQuery.pickerValue.length) {
        this.dialogQuery.startTime = this.dialogQuery.pickerValue[0];
        this.dialogQuery.endTime = this.dialogQuery.pickerValue[1];
        if (
          this.dialogQuery.endTime - this.dialogQuery.startTime >
          21600 * 1000
        ) {
          this.$message.warning("筛选时间范围不能超过6个小时！");
          return;
        }
      }
      this.dialogCreateLoading = true;
      getStreamPushInfo(this.dialogQuery).then((res) => {
        if (res.code === 200) {
          this.phoneInfo = res.data;
          const resultArray = res.data.getStreamPushInfoResults || [];
          const xAxis = [];
          const audioFpsyAxis = [];
          const videoFpsyAxis = [];
          const audioRateyAxis = [];
          const videoRateyAxis = [];
          const bandyAxis = [];
          let ip = "";
          resultArray.forEach((item) => {
            xAxis.push(item.time.slice(0, item.time.lastIndexOf(".")));
            audioFpsyAxis.push(item.audioFps);
            audioRateyAxis.push(Math.round(item.videoRate / 10.24) / 100);
            videoFpsyAxis.push(item.videoFps);
            videoRateyAxis.push(Math.round(item.videoRate / 10.24) / 100);
            bandyAxis.push(item.bandwidth);
            ip = item.clientIp;
          });
          let osName = "安卓";
          const softVersion = res.data.softVersion;
          const version = res.data.version;
          if (res.data.os === 4) {
            osName = "苹果";
          }
          const initChartLine = (xAixs, yAxis, domId, title) => {
            const chartDom = document.getElementById(domId);
            if (xAixs.length > 30) {
              chartDom.style.width = "3500px";
            } else {
              chartDom.style.width = "100%";
            }
            const myLineChart = echarts.init(chartDom);
            // 配置图表
            const option = {
              grid: {
                top: "60px",
                left: "80px",
                right: "80px",
                bottom: "40px",
              },
              tooltip: {
                trigger: "axis",
                formatter: function (params) {
                  var result =
                    '<p style="margin: 0">' + params[0].name + "</p>";
                  result +=
                    '<p style="margin: 0">' +
                    "设备:" +
                    osName +
                    " 软件版本:" +
                    softVersion +
                    " 系统版本:" +
                    version +
                    "</p>";
                  result +=
                    '<p style="margin: 0">' +
                    "IP:" +
                    ip +
                    " " +
                    title +
                    ":" +
                    params[0].value +
                    "</p>";
                  return result;
                },
              },
              xAxis: {
                type: "category",
                data: xAxis,
              },
              yAxis: {
                type: "value",
                name: title,
              },
              series: [
                {
                  data: yAxis,
                  type: "line",
                  smooth: true,
                },
              ],
            };
            myLineChart.setOption(option);
          };
          this.dialogCreateLoading = false;
          initChartLine(xAxis, audioFpsyAxis, "audioFPS", "音频FPS(HZ)");
          initChartLine(xAxis, videoFpsyAxis, "videoFPS", "视频FPS(HZ)");
          initChartLine(xAxis, audioRateyAxis, "audioRate", "音频Rate（KB/s）");
          initChartLine(xAxis, videoRateyAxis, "videoRate", "视频Rate(KB/s)");
          initChartLine(xAxis, bandyAxis, "bandWidth", "带宽(M/S)");
        }
      });
    },
    // 获取列表数据
    async fetchData() {
      this.listLoading = true;
      this.todayListLoading = true;
      // 获取家族列表
      if (!this.familyList.length) {
        const res = await getUserFamilyList();
        if (res.code === 200) {
          this.familyList = (res.data.list || []).map((item) => {
            return {
              value: item.bossId || 0,
              label: nullS(item.familyName),
            };
          });
        }
      }
      getUserLiveRecord(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      ).then((res) => {
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
      });
      // 获取主播列表
      getUserLiveRecordList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      )
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var familyName = "暂无家族";
            for (const family of this.familyList) {
              if (family.value == item.familyId) {
                familyName = family.label;
                break;
              }
            }
            const milli = item.lsatTime || 0;
            const days = Math.floor(milli / 1000 / 60 / 60 / 24);
            const hour = Math.floor((milli / 1000 / 60 / 60) % 24);
            const minute = Math.floor((milli / 1000 / 60) % 60);
            const second = Math.floor((milli / 1000) % 60);
            var lsatTimeString = "";
            if (days > 0) {
              lsatTimeString = `${days}天${hour}时${minute}分${second}秒`;
            } else if (hour > 0) {
              lsatTimeString = `${hour}时${minute}分${second}秒`;
            } else if (minute > 0) {
              lsatTimeString = `${minute}分${second}秒`;
            } else if (second > 0) {
              lsatTimeString = `${second}秒`;
            }
            let statusText = "已下播";
            if (item.status === 1) {
              statusText = "直播中";
            }
            if (
              item.roomType == "0" ||
              item.roomType == "1" ||
              item.roomType == "2" ||
              item.roomType == "3" ||
              item.roomType == "null"
            ) {
              item.roomType = [];
            } else if (item.roomType != undefined) {
              item.roomType = JSON.parse(item.roomType);
              item.roomType.forEach((value, index) => {
                value.time = formatUnixTime(value.time);
                value.roomType = this.roomTypes(value.roomType);
              });
            }

            this.$set(item, "familyName", familyName);
            this.$set(item, "startTimeString", formatUnixTime(item.startTime));
            this.$set(item, "endTimeString", formatUnixTime(item.endTime));
            this.$set(item, "lsatTimeString", lsatTimeString);
            this.$set(item, "statusText", statusText);
            return item;
          });
          this.listQuery.total = res.data.total;
          this.listLoading = false;
        })
        .catch((err) => {
          console.log("debugger", err);

          this.list = null;
          this.listQuery.total = 0;
          this.listLoading = false;
          this.familyList = [];
          debugger;
          this.$message.error(err);
        });
    },

    roomTypes(e) {
      switch (e) {
        case 0:
          return "免费房间";
        case 1:
          return "计时收费";
        case 2:
          return "按次收费";
        case 3:
          return "密码房间";
      }
    },

    handleDataClick() {
      this.dialogCreateVisible = false;
    },

    finish_click(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error("参数错误");
        return;
      }
      if (row.status == 0) {
        this.$message.error("已下播，请勿重复操作");
        return;
      }

      const rowDic = Object.assign({}, row);
      // 将房间类型置空
      rowDic.roomType = ''

      this.$confirm("是否将该主播下播？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          finishClick(rowDic)
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "下播成功",
                type: "success",
                duration: 1500,
              });
              setTimeout((_) => {
                this.fetchData();
              }, 200);
            })
            .catch((err) => {
              debugger;
              this.listLoading = false;
              this.$message.error(err);
            });
        })
        .catch(() => { });
    },

    cancelPkStream() {
      this.dialogCreateVisible = true;
      this.dialogStatus = "update";
      this.createModel = Object.assign({}, row);
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
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
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error("导出限制10000条范围内");
        return;
      }

      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "主播ID",
          "主播昵称",
          "房间ID",
          "家族名称",
          "总礼物价值",
          "礼物收益/魅力",
          "总付费价值",
          "付费收益",
          "总彩票流水",
          "彩票分成",
          "开播时间",
          "下播时间",
          "持续时间",
          "直播状态",
        ];
        const filterVal = [
          "uid",
          "anchorName",
          "id",
          "familyName",
          "totalMl",
          "ml",
          "totalFfml",
          "ffml",
          "totalCp",
          "cpStatement",
          "startTimeString",
          "endTimeString",
          "lsatTimeString",
          "statusText",
        ];
        const list = this.list;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType,
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
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

#audioFPS {
  width: 100%;
  height: 300px;
}

#videoFPS {
  width: 100%;
  height: 300px;
}

#audioRate {
  width: 100%;
  height: 300px;
}

#videoRate {
  width: 100%;
  height: 300px;
}

#bandWidth {
  width: 100%;
  height: 300px;
}
</style>
<style>
.sxtxzl-box .el-dialog {
  max-width: 100%;
  max-height: 100%;
}

.sxtxzl-box.all .el-dialog {
  margin-top: 0 !important;
  height: 100%;
}

.sxtxzl-box.all .el-dialog__body {
  max-height: 88vh;
}
</style>
