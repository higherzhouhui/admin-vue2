<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
        <el-tag type="info">结算:</el-tag>
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
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-search"
          type="primary"
          @click="handleSearchFilter"
          >搜索</el-button
        >
        <!-- 重置 -->
        <el-button size="small" icon="el-icon-refresh" @click="refreshData"
          >重置</el-button
        >
      </el-form-item>
      <!-- <el-form-item>
              <el-button
                size="small"
                :loading="downloadLoading"
                type="success"
                icon="el-icon-document"
                @click="handleDownload"
              >
                导出Excel
              </el-button>
            </el-form-item> -->
      <br />
      <el-form-item>
        <el-button
          type="primary"
          size="small"
          @click="(dialogCreateVisible = true), resetCreateModel()"
          >补偿</el-button
        >
      </el-form-item>
      <el-form-item v-if="newestTime">
        <span>
          最新拉取时间：{{ newestTime }}
        </span>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="list" size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="用户ID" min-width="120">
        <template slot-scope="{ row }">
          <user-drawer :uid="Number(row.uid)" />
        </template>
      </el-table-column>
      <el-table-column prop="loginId" label="用户登录ID" min-width="100" />
      <el-table-column prop="orderId" label="订单ID" min-width="100" />
      <!-- sortable -->
      <!-- <el-table-column
        prop="tranId"
        label="订单ID"
        min-width="100"
         
      /> -->
      <el-table-column prop="sn" label="厅代码" width="100" />
      <!-- <el-table-column prop="moduleId" label="模块ID" min-width="160" /> -->
      <el-table-column prop="moduleName" label="模块名称" min-width="120" />
      <!-- <el-table-column prop="gameId" label="游戏ID" width="170" /> -->
      <el-table-column prop="gameName" label="游戏名称" width="100" />
      <!--    sortable -->
      <el-table-column prop="orderStatusString" label="注单状态" min-width="100" />
      <el-table-column prop="bamount" label="下注额" min-width="100" />
      <el-table-column prop="aamount" label="结算额" min-width="100" />
      <el-table-column prop="orderFromString" label="终端类别" min-width="100" />
      <el-table-column prop="orderTime" label="下注时间" min-width="100" />
      <el-table-column
        prop="lastUpdateTime"
        label="最后修改时间"
        min-width="100"
      />
      <el-table-column prop="fromIp" label="下注来源IP" min-width="100" />
      <!-- <el-table-column
        prop="fromIpAddr"
        label="下注来源IP归属地"
        min-width="100"
      /> -->
      <el-table-column prop="issueId" label="下注期数" min-width="100" />
      <el-table-column prop="playId" label="玩法ID" min-width="100" />
      <el-table-column prop="playName" label="玩法名称" min-width="100" />
      <el-table-column
        prop="validBet"
        label="打码量(有效投注)"
        min-width="150"
      />
      <el-table-column prop="payment" label="派彩(输赢)" min-width="100" />
      <el-table-column prop="startTime2" label="开始时间" min-width="140" />
      <el-table-column prop="endTime2" label="结束时间" min-width="140" />
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
    <!-- 游戏数据手动补偿 -->
    <el-dialog
      title="游戏数据补偿"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :inline="true"
          :model="createModel"
          label-position="top"
          label-width="100px"
          size="medium"
          style="display: flex; flex-direction: column; align-items: center"
        >
          <div
            style="
              display: flex;
              flex-direction: column;
              align-items: flex-start;
            "
          >
            <el-form-item label="补偿日期">
              <el-date-picker
                style="width: 260px"
                v-model="createModel.day"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyyMMdd"
                placeholder="请选择补偿日期"
              >
              </el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="游戏类型">
            <el-select
              v-model="createModel.gameType"
              placeholder="请选择游戏类型"
              style="width: 260px"
            >
              <el-option label="BG捕鱼大师" value="105"></el-option>
              <el-option label="西游捕鱼" value="411"></el-option>
              <el-option label="大仙捕鱼大师" value="484"></el-option>
            </el-select>
          </el-form-item> -->
            <el-form-item label="添加流水">
              <el-radio-group v-model="createModel.addFlow">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
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
import { recordKy, dayCompensate } from "@/api/platformGameRecord/bgRealPerson";

import { emptyS, nullS, formatUnixTime, getDateTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: "platformGameRecordBgCatchFishIndex",
  components: {
    UserDrawer,
  },
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        type: null,
        pickerValue: [],
      },
      newestTime: '',
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      // 表单模型
      createModel: {
        day: null,
        gameName: "",
        gameType: "",
        addFlow: false,
      },
      // 重新设置表单数据
      resetCreateModel() {
        this.createModel = {
          day: null,
          gameName: "",
          gameType: "",
          addFlow: false,
        };
      },

      downloadLoading: false,
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
    // 获取uid
    console.log("接收uid", this.$route.query.uid);
    this.listQuery.uid = this.$route.query.uid;
    this.fetchData();
  },
  methods: {
    // 刷新
    refreshData() {
      this.list = null;
      this.listLoading = true;
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        type: null,
        pickerValue: this.initTimer
      };
      setTimeout(() => {
        this.fetchData();
      }, 80);
    },
    handleDataClick() {
      // this.createModel
      // this.dialogCreateVisible = false;
      if (
        this.createModel.day == null ||
        this.createModel.day == undefined ||
        this.createModel.day.length == 0
      ) {
        this.$message({
          message: "请选择补偿时间",
          type: "warning",
        });
        return;
      }
      this.dialogCreateLoading = true;
      dayCompensate(this.createModel)
        .then((item) => {
          this.$notify({
            title: "提示",
            message: "游戏数据补偿成功",
            type: "success",
            duration: 1500,
          });
          this.dialogCreateVisible = false;
          this.dialogCreateLoading = false;
        })
        .catch((err) => {
          this.dialogCreateLoading = false;
          this.$message.error(err);
        });
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      this.familyList = [];
      recordKy(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.newestTime = formatUnixTime(res.data.ext.lastTime)
          this.list = (res.data.list || []).map((item) => {
            // var goldMedalString = "否";
            // if (item.goldMedal == 0) {
            //   goldMedalString = "否";
            // } else if (item.goldMedal == 1) {
            //   goldMedalString = "是";
            // } else if (item.goldMedal == 2) {
            //   goldMedalString = "纯提成";
            // }
            // var familyName = "暂无家族";
            // for (const family of this.familyList) {
            //   if (family.value == item.bossId) {
            //     familyName = family.label;
            //     break;
            //   }
            // }
            // this.$set(item, "goldMedalString", goldMedalString);
            // this.$set(item, "familyName", familyName);
            // this.$set(item, "gmtCreateString", formatUnixTime(item.gmtCreate));
            // this.$set(
            //   item,
            //   "gmtCompleteString",
            //   formatUnixTime(item.gmtComplete)
            // );
            item.startTime2 = formatUnixTime(item.startTime);
            item.endTime2 = formatUnixTime(item.endTime);
            let orderStatusString = '注单不存在'
            if (item.orderStatus == 0) {
              orderStatusString = '注单不存在'
            } else if (item.orderStatus == 1) {
              orderStatusString = '未结算'
            } else if (item.orderStatus == 2) {
              orderStatusString = '结算赢'
            } else if (item.orderStatus == 3) {
              orderStatusString = '结算和'
            } else if (item.orderStatus == 4) {
              orderStatusString = '结算输'
            } else if (item.orderStatus == 5) {
              orderStatusString = '取消'
            } else if (item.orderStatus == 6) {
              orderStatusString = '过期'
            }
            item.orderStatusString = orderStatusString


            let orderFromString = 'PC-WEB'
            if (item.orderFrom == 1) {
              orderFromString = 'PC-WEB'
            } else if (item.orderFrom == 2) {
              orderFromString = 'PC客户端'
            } else if (item.orderFrom == 3) {
              orderFromString = '安卓APP'
            } else if (item.orderFrom == 5) {
              orderFromString = '安卓平板APP'
            } else if (item.orderFrom == 6) {
              orderFromString = 'Apple Pad App'
            } else if (item.orderFrom == 7) {
              orderFromString = '系统后台'
            } else if (item.orderFrom == 8) {
              orderFromString = 'H5'
            } else if (item.orderFrom == 9) {
              orderFromString = '微信'
            }
            item.orderFromString = orderFromString
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
    // handleDownload() {
    //   this.downloadLoading = true;
    //   import("@/vendor/Export2Excel").then((excel) => {
    //     const tHeader = [
    //       "主播ID",
    //       "主播昵称",
    //       "家族名称",
    //       "是否金牌主播",
    //       "总礼物价值",
    //       "总付费价值",
    //       "总彩票流水",
    //       "主播收益",
    //       "家族长收益",
    //       "发放收益星币",
    //       "有效时间",
    //       "收益归属时间",
    //       "创建时间",
    //     ];
    //     const filterVal = [
    //       "uid",
    //       "nickname",
    //       "familyName",
    //       "goldMedalString",
    //       "totalMl",
    //       "totalFfml",
    //       "totalCp",
    //       "anchorProfit",
    //       "bossProfit",
    //       "subsidy",
    //       "activeTime",
    //       "belong",
    //       "gmtCreateString",
    //     ];
    //     const list = this.list;
    //     const data = this.formatJson(filterVal, list);
    //     excel.export_json_to_excel({
    //       header: tHeader,
    //       data,
    //       filename: this.filename,
    //       autoWidth: this.autoWidth,
    //       bookType: this.bookType,
    //     });
    //     this.downloadLoading = false;
    //   });
    // },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j];
        })
      );
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
