<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />

    <el-form :inline="true">
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
      <!-- <el-form-item> -->
        <!-- <el-tag type="info">结算:</el-tag> -->
        <!-- <el-date-picker
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
      <el-form-item class="nowrap">
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
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="currency" label="投注币种" min-width="100" />
      <el-table-column prop="gameType" label="游戏类型" min-width="100" />
      <el-table-column prop="betIp" label="投注IP" min-width="120" />
      <el-table-column prop="flag" label="订单状态" width="100">
        <template slot-scope="{ row }">
          {{
            row.flag == 0
              ? "异常(请联系客服)"
              : row.flag == 1
              ? "已派彩"
              : row.flag == -8
              ? "取消指定注单"
              : row.flag == -9
              ? "取消"
              : ""
          }}
        </template>
      </el-table-column>
      <el-table-column prop="productId" label="订单所属产品" min-width="160" />
      <el-table-column prop="deviceType" label="设备" min-width="100">
        <template slot-scope="{ row }">
          {{ row.deviceType == 0 ? "pc" : row.deviceType == 1 ? "MOBILE" : "" }}
        </template>
      </el-table-column>
      <el-table-column prop="slotType" label="游戏类型" width="100">
        <template slot-scope="{ row }">
          {{ row.slotType == 1 ? "普通游戏" : "" }}
        </template>
      </el-table-column>
      <el-table-column prop="accountBase" label="普通投注额度" width="100" />
      <el-table-column
        prop="accountBonus"
        label="红利投注额度"
        min-width="120"
      />
      <el-table-column
        prop="cusAccountBase"
        label="普通游戏派彩"
        min-width="120"
      />
      <el-table-column
        prop="cusAccountBonus"
        label="红利游戏派彩"
        min-width="120"
      />
      <el-table-column prop="srcAmount" label="原额度" min-width="100" />
      <el-table-column prop="dstAmount" label="更新后额度" min-width="120" />
      <el-table-column prop="extTxId" label="副单号" min-width="120" />
      <el-table-column prop="mainBillNo" label="主单号" min-width="130" />
      <el-table-column prop="account" label="投注额度" min-width="90" />
      <el-table-column prop="cusAccount" label="派彩额度" min-width="90" />
      <el-table-column
        prop="validAccount"
        label="有效投注额度"
        min-width="120"
      />
      <el-table-column prop="billTime" label="下注时间" min-width="150" />
      <el-table-column prop="reckonTime" label="结算时间" min-width="150" />
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
              <!-- <el-date-picker
                style="width: 260px"
                v-model="createModel.day"
                type="date"
                format="yyyy-MM-dd HH"
                value-format="yyyyMMddHH"
                placeholder="请选择补偿日期"
              >
              </el-date-picker> -->
              <el-date-picker
                v-model="createModel.day"
                type="datetime"
                placeholder="请选择补偿日期"
                value-format="yyyyMMddHH"
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
import { recordKy } from "@/api/platformGameRecord/agTiger";
import { hourCompensate } from "@/api/platformGameRecord/bgRealPerson";

import { emptyS, nullS, formatUnixTime, getDateTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: "platformGameRecordAgTigerIndex",
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
      this.createModel.gameName = "ag";
      console.log("this.createModel", this.createModel);
      hourCompensate(this.createModel)
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
          this.list = res.data.list
          this.listQuery.total = res.data.total;
          this.listLoading = false;
          this.newestTime = formatUnixTime(res.data.ext.lastTime)
        })
        .catch((err) => {
          this.list = [];
          this.listQuery.total = 0;
          this.listLoading = false;
          this.$message.error(err);
        });
    },
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "主播ID",
          "主播昵称",
          "家族名称",
          "是否金牌主播",
          "总礼物价值",
          "总付费价值",
          "总彩票流水",
          "主播收益",
          "家族长收益",
          "发放收益星币",
          "有效时间",
          "收益归属时间",
          "创建时间",
        ];
        const filterVal = [
          "uid",
          "nickname",
          "familyName",
          "goldMedalString",
          "totalMl",
          "totalFfml",
          "totalCp",
          "anchorProfit",
          "bossProfit",
          "subsidy",
          "activeTime",
          "belong",
          "gmtCreateString",
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
