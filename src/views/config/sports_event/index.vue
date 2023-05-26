<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
        <el-button
          size="small"
          type="success"
          icon="el-icon-plus"
          @click="showCreateDialogClick()"
          >添加视频</el-button
        >
      </el-form-item> -->
      <!-- <el-form-item>
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
          v-model="listQuery.videoName"
          size="small"
          placeholder="请输入联赛名称"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.state"
          size="small"
          placeholder="请选择比赛状态"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in typeOptions1"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.sportId"
          size="small"
          placeholder="请选择体育类型"
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
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchFilter"
          >搜索</el-button
        >
        <el-button size="small" icon="el-icon-refresh" @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <!-- <el-tag type="info">页面刷新时间：</el-tag> -->
        <span class="search_info">页面刷新时间</span>
        <el-select
          v-model="timerType"
          style="width: 100px"
          size="small"
          placeholder="请选择刷新方式"
          @change="refresh"
        >
          <el-option
            v-for="item in timerList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="timerType !== -1">
        <span style="font-size: 14px"
          >将在 <span style="color: red">{{ num }}</span> 秒后刷新数据</span
        >
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <!-- <el-table-column prop="playTypeString" label="视频类型" min-width="80"   /> -->
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column prop="vid" label="比赛ID" min-width="110" />
      <el-table-column prop="liga" label="联赛名称" min-width="120" />
      <el-table-column
        prop="opp1String"
        label="对阵双方"
        show-overflow-tooltip
        min-width="200"
      />
      <el-table-column prop="time" label="比赛开始时间" min-width="120" />
      <el-table-column
        prop="streamName"
        label="视频流地址"
        min-width="200"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="{ row }">
          <div class="wrapper">
            <i class="el-icon-copy-document" @click="handleCopy(row.streamName, $event)"></i>
            <span style="margin-left: 10px; display: inline-block">{{ row.streamName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="stateString" label="比赛状态" min-width="80" />
      <el-table-column prop="sport" label="体育类型" min-width="80" />
      <el-table-column label="直播匹配状态" width="170">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.matchingState"
            :width="30"
            active-text="已匹配"
            :active-value="1"
            inactive-text="未匹配"
            :inactive-value="0"
            @change="updateStatus(row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作人" min-width="80" />
      <el-table-column prop="createTimeString" label="创建时间" width="150" />
      <el-table-column label="操作" width="70" fixed="right">
        <template slot-scope="{ row }">
          <!-- <el-button
            plain
            type="primary"
            size="mini"
            @click="showUpdateDialogClick(row)"
            >编辑</el-button
          > -->
          <span
            class="operation_btn"
            type="danger"
            size="mini"
            @click="showDeleteDialogClick(row)"
            >删除</span
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新建/编辑 消息公告 -->
    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="35%"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="createModel"
          :rules="rules"
          label-position="top"
          size="medium"
        >
          <!--   <el-form-item label="用户ID" prop="uid"><el-input v-model="createModel.uid" clearable placeholder="请输入用户ID" maxlength="200" /></el-form-item> -->
          <el-form-item label="联赛名称" prop="videoName"
            ><el-input
              v-model="createModel.videoName"
              clearable
              placeholder="请输入联赛名称"
              maxlength="200"
          /></el-form-item>
          <el-form-item label="视频类型">
            <el-select v-model="createModel.type" placeholder="请选择视频类型">
              <el-option
                v-for="item in typeOString"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="视频地址" prop="videoPath"
            ><el-input
              v-model="createModel.videoPath"
              clearable
              placeholder="请输入视频地址"
              maxlength="300"
          /></el-form-item>
          <el-form-item label="排序" prop="sort"
            ><el-input
              v-model="createModel.sort"
              clearable
              placeholder="请输入排序"
              maxlength="200"
          /></el-form-item>
          <el-form-item label="备注" prop="remark"
            ><el-input
              v-model="createModel.remark"
              clearable
              placeholder="请输入备注"
              maxlength="200"
          /></el-form-item>
          <!-- <el-form-item label="视频状态">
         <el-switch v-model="createModel.videoStatus" active-text="开启" :active-value="'1'" inactive-text="关闭" :inactive-value="'0'"></el-switch>
       </el-form-item> -->
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false"
          >取消</el-button
        >
        <el-button size="medium" type="primary" @click="handleDataClick()"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getVideoList,
  createVideo,
  updateVideo,
  deleteVideo,
  updateVideoStatus,
} from "@/api/config/sportsEvent";
import { emptyS, nullS, formatUnixTime, getDateTime } from "@/utils/tools";
import clip from "@/utils/clipboard"; // use clipboard directly
const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: "LiveVideoController",
  filters: {
    statusFilter(status) {
      const map = { 1: "info", 0: "success", 2: "danger" };
      return map[status];
    },
    typeFilter(status) {
      const map = { 0: "info", 1: "warning", 2: "danger" };
      return map[status];
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        videoName: null,
        type: null,
        sportId: null,
        state: null,
        pickerValue: [],
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      dialogTitleMap: {
        create: "添加视频",
        update: "编辑视频",
      },

      // 表单模型
      createModel: {
        id: null,
        uid: null,
        videoName: null,
        remark: null,
        videoStatus: 1,
        sort: 1,
      },
      //  typeOptions: [{ label: '开启', value: 1 }, { label: '关闭', value: 0 }],
      typeOptions: [
        { label: "足球", value: 1 },
        { label: "篮球", value: 3 },
        { label: "网球", value: 4 },
        { label: "棒球", value: 5 },
        { label: "排球", value: 6 },
        { label: "橄榄球", value: 7 },
        { label: "乒乓球", value: 10 },
        { label: "台球/斯诺克", value: 12 },
        { label: "羽毛球", value: 16 },
      ],

      typeOptions1: [
        { label: "未开始", value: 0 },
        { label: "比赛中", value: 1 },
        { label: "比赛结束", value: 2 },
      ],

      typeOString: [
        { label: "足球", value: 2 },
        { label: "篮球", value: 3 },
      ],
      // 验证规则
      rules: {
        videoName: [
          { required: true, message: "请输入联赛名称", trigger: "change" },
          { min: 1, max: 200, message: "最多为200个字符", trigger: "change" },
        ],
        videoPath: [
          { required: true, message: "请输入视频地址", trigger: "change" },
          { min: 1, max: 500, message: "最多为500个字符", trigger: "change" },
        ],
        sort: [{ required: true, message: "请输入排序", trigger: "change" }],
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
      timerList: [
        { label: "5秒", value: 5 },
        { label: "10秒", value: 10 },
        { label: "30秒", value: 30 },
        { label: "1分钟", value: 60 },
        { label: "3分钟", value: 180 },
        { label: "5分钟", value: 300 },
        { label: "10分钟", value: 600 },
        { label: "不刷新", value: -1 },
      ],
      timerType: -1,
      num: 0,
      timer: null,
    };
  },
  activated() {
    this.refresh();
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
  mounted() {
    clearInterval(this.timer);
    this.refresh();
  },
  methods: {
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        pickerValue: this.initTimer
      };
      this.fetchData();
    },
    handleCopy(text, event) {
      clip(text, event);
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: null,
        uid: null,
        videoName: null,
        videoPath: null,
        videoStatus: null,
        sort: 1,
      };
    },

    // 刷新
    refreshData() {
      this.list = null;
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        videoName: null,
        sportId: null,
      };
      this.fetchData();
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getVideoList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            this.$set(
              item,
              "createTimeString",
              formatUnixTime(item.createTime)
            );
            var playTypeStr = "";
            var stateString = "";
            var opp1String = "";
            opp1String = item.opp1 + " VS " + item.opp2;
            /* if (item.sportId == 0) {
              playTypeStr = '连送'
            } else if (item.sportId == 1) {
              playTypeStr = '足球'
            } else if (item.sportId == 2) {
              playTypeStr = '足球视频'
            }else if (item.sportId == 3) {
              playTypeStr = '篮球'
            }else if (item.sportId == 4) {
              playTypeStr = '网球'
            }else if (item.sportId == 5) {
              playTypeStr = '棒球'
            }else if (item.sportId == 6) {
              playTypeStr = '排球'
            }else if (item.sportId == 7) {
              playTypeStr = '橄榄球'
            }else if (item.sportId == 8) {
              playTypeStr = '台球视频'
            }else if (item.sportId == 9) {
              playTypeStr = '台球视频'
            }else if (item.sportId == 10) {
              playTypeStr = '乒乓球'
            }else if (item.sportId == 11) {
              playTypeStr = '台球视频'
            }else if (item.sportId == 12) {
              playTypeStr = '台球/斯诺克'
            }else if (item.sportId == 13) {
              playTypeStr = '美式足球'
            }else if (item.sportId == 16) {
              playTypeStr = '羽毛球'
            }
            this.$set(item, 'playTypeString', playTypeStr) */

            if (item.state == 0) {
              stateString = "未开始";
            } else if (item.state == 1) {
              stateString = "比赛中";
            } else if (item.state == 2) {
              stateString = "比赛结束";
            }

            var streamInfoString = "";
            if (item.streamInfo == "true") {
              streamInfoString = "正常";
            } else if (item.streamInfo == "false") {
              streamInfoString = "未确认";
            }

            this.$set(item, "streamInfoString", streamInfoString);
            this.$set(item, "stateString", stateString);
            this.$set(item, "opp1String", opp1String);

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
    // 刷新
    refresh() {
      this.num = this.timerType;
      clearInterval(this.timer);
      if (this.num == -1) return;
      const _this = this;
      this.timer = setInterval((num) => {
        _this.num = this.num - 1;
        if (this.num === 0) {
          this.num = this.timerType;
          this.fetchData();
        }
      }, 1016);
    },

    // 显示创建弹出窗
    showCreateDialogClick() {
      this.resetCreateModel();
      this.dialogCreateVisible = true;
      this.dialogStatus = "create";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      this.resetCreateModel();
      this.dialogCreateVisible = true;
      this.dialogStatus = "update";
      this.createModel = Object.assign({}, row);
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error("参数错误");
        return;
      }
      this.$confirm("是否删除视频？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          deleteVideo([row.id])
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "删除视频成功",
                type: "success",
                duration: 1500,
              });
              setTimeout((_) => {
                this.fetchData();
              }, 200);
            })
            .catch((err) => {
              this.listLoading = false;
              this.$message.error(err);
            });
        })
        .catch(() => {});
    },

    // 更改用户超管状态
    updateStatus(row) {
      if (row.state == 2) {
        this.$message.error("比赛已结束");
        return;
      }

      this.listLoading = true;
      const id = row.id;
      const videoStatus = row.videoStatus;
      // 请求网络
      updateVideoStatus(id, videoStatus)
        .then((res) => {
          console.log("res", res);
          this.listLoading = false;
          this.$notify({
            title: "提示",
            message: "更新视频状态成功",
            type: "success",
            duration: 1000,
          });
          setTimeout((_) => {
            this.fetchData();
          }, 200);
        })
        .catch((err) => {
          console.log("err", err);
          this.listLoading = false;
          this.$message.error(err);
          this.fetchData();
          // 错误的情况下，修改内存属性
          row.manage = !mgr;
        });
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel);
          // 请求服务器
          this.dialogCreateLoading = true;
          const params = {
            videoName: formDic.videoName,
            videoPath: formDic.videoPath,
            remark: formDic.remark,
            videoStatus: formDic.videoStatus,
            sort: formDic.sort,
          };
          if (this.dialogStatus === "create") {
            createVideo(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "创建视频成功",
                  type: "success",
                  duration: 1500,
                });
                setTimeout((_) => {
                  this.fetchData();
                }, 200);
              })
              .catch((err) => {
                this.dialogCreateLoading = false;
                this.$message.error(err);
              });
          } else {
            params["id"] = formDic.id || 0;
            updateVideo(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "修改视频成功",
                  type: "success",
                  duration: 1500,
                });
                setTimeout((_) => {
                  this.fetchData();
                }, 200);
              })
              .catch((err) => {
                this.dialogCreateLoading = false;
                this.$message.error(err);
              });
          }
        }
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
<style scoped lang="scss">
.input-with-select {
  background-color: #fff;
  width: 360px;
  margin-right: 10px;
  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}
.wrapper {
  i {
    cursor: pointer;
  }
}
.vue-pagination {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0px;
  padding: 0px;
}
</style>
