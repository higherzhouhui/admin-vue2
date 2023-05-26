<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" :dateType="1" />
    <el-form :inline="true">
      <!-- <el-form-item> -->
      <!-- <el-tag type="primary">返利日期:</el-tag> -->
      <!-- <el-date-picker
          v-model="listQuery.pickerValue"
          size="small"
          clearable
          type="datetimerange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" style="width: 140px" class="input-with-select"
          placeholder="请输入用户ID" clearable @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <!-- <el-form-item>
      <el-tag type="info">用户昵称:</el-tag>
      <el-input
        v-model="listQuery.anchorName"
        size="small"
        style="width: 140px"
        class="input-with-select"
        placeholder="请输入用户昵称"
        clearable
        @keyup.enter.native="handleSearchFilter"
        @clear="handleSearchFilter"
      />
    </el-form-item> -->
      <el-form-item>
        <el-select v-model="listQuery.giveMode" size="small" style="width: 140px" placeholder="请选择发放方式" clearable
          @change="handleSearchFilter">
          <el-option label="系统发放" :value="1" />
          <el-option label="手动发放" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.giveStatus" size="small" style="width: 130px" placeholder="请选择状态" clearable
          @change="handleSearchFilter">
          <el-option label="全部" value="" />
          <el-option label="待发放" :value="1" />
          <el-option label="已发放" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="resets">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-edit" @click="showCreateDialogClick()">
          活动配置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-s-promotion" @click="oneClickRelease()">一键发放</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" size="mini" fit highlight-current-row>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="waterDate" label="返利日期" min-width="100" />
      <el-table-column prop="uid" label="用户ID" min-width="120">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>

      <el-table-column prop="waterAmt" label="打赏流水" min-width="100" />
      <el-table-column prop="giveAmt" label="赠送金币" min-width="100" />
      <el-table-column prop="bonusMultiple" label="红利倍数" min-width="100" />

      <el-table-column prop="giveMode" label="发放方式" min-width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.giveMode === 1 ? 'success' : 'primary'">{{ row.giveMode == 1 ? "系统发放" : "手动发放"
          }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="giveStatus" label="发放状态" min-width="120">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.giveStatus === 1 ? 'info' : 'success'">{{ row.giveStatus == 1 ? "待发放" : "已发放"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="giveTime" label="发放时间" min-width="140">
        <template slot-scope="{ row }">
          {{ formatUnixTime(row.giveTime) }}
        </template>
      </el-table-column>

      <el-table-column prop="giveUserName" label="发放人" min-width="120" />
      <el-table-column prop="createTime" label="创建时间" min-width="140">
        <template slot-scope="{ row }">
          {{ formatUnixTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column :label="'操作'" width="120" fixed="right">
        <template slot-scope="{ row }">
          <span v-if="row.giveStatus == 1" class="operation_btn" plain type="primary" size="mini"
            @click="oneClickRelease(row.id)">彩金发放</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <!-- 新建/编辑  -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true" top="5vh" width="800px">
      <el-form ref="dataForm" v-cloading="dialogCreateLoading" :model="createModel" :rules="rules" label-position="top"
        label-width="150px" size="medium" class="form">
        <el-form-item label="活动名称：" prop="activityName">
          <el-input v-model="createModel.activityName" />
        </el-form-item>
        <el-form-item label="活动时间：" prop="time">
          <el-date-picker v-model="createModel.pickerValue" size="small" clearable type="datetimerange"
            :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
            style="width: 100%" align="right" format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"
            value-format="timestamp" />
        </el-form-item>
        <el-form-item label="红利倍数：" prop="bonusMultiple">
          <el-input v-model="createModel.bonusMultiple" placeholder="请输入活动彩金提现倍数" />
        </el-form-item>
        <el-form-item v-for="(item, index) in createModel.conditions" :key="index" :label="`日打赏金额${index + 1}：`">
          <div class="liushui">
            <el-input v-model="item.waterAmt" placeholder="请输入日打赏金额" />
            <div class="mtitle">
              <span>奖励金币：</span>
              <el-input v-model="item.giveAmt" placeholder="请输入奖励金币" />
            </div>
            <div>
              <!-- <el-button type="primary" icon="el-icon-plus" size="mini" @click="plusCondition" />
              <el-button v-if="createModel.conditions.length > 1" type="danger" icon="el-icon-minus" size="mini"
                @click="minusCondition(index)" /> -->

              <div class="buts">
                <div class="adds" @click="plusCondition" />
                <div v-if="createModel.conditions.length > 1" class="subtract" @click="minusCondition(index)" />
              </div>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item label="活动规则：" prop="activityDesc">
          <el-input
            v-model="createModel.activityDesc"
            placeholder="请输入活动规则说明"
            type="textarea"
            :rows="6"
          />
        </el-form-item> -->
        <el-form-item label="发放方式：" prop="giveMode">
          <el-radio-group v-model="createModel.giveMode">
            <el-radio :label="1">系统发放</el-radio>
            <el-radio :label="2">手动发放</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动状态：" prop="status">
          <el-radio-group v-model="createModel.status">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="2">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" :loading="dialogCreateLoading" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRewardAnchorConfig,
  giveAllRecord,
  giveRecord,
  getLotteryList,
  updateRewardAnchorConfig,
} from "@/api/center/reward/index";

import { formatUnixTime, getNowFormatDay } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";
// const NOW_TIME_START = getNowFormatDay('-')

export default {
  name: "UserLotteryRebateActivity",
  components: {
    UserDrawer,
  },
  data() {
    return {
      formatUnixTime: formatUnixTime,
      list: [],
      list2: [],
      listLoading: true,
      listLoading2: true,
      loadingZb: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        pickerValue: []
      },
      rules: {
        bonusMultiple: [
          {
            required: true,
            message: "请输入红利彩金提现倍数",
            trigger: "change",
          },
        ],
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
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      dialogTitleMap: {
        create: "活动配置",
        update: "编辑",
      },
      // 表单模型
      createModel: {
        activityName: "打赏赢奖励",
        activityDesc: "",
        activityType: "",
        bonusMultiple: "",
        conditions: [{ giveAmt: "", waterAmt: "" }],
        giveMode: 1,
        status: 1,
        pickerValue: [],
      },
      // 重新设置表单数据
      resetCreateModel() {
        this.createModel = {
          activityName: "打赏赢奖励",
          activityDesc: "",
          activityType: "",
          bonusMultiple: "",
          conditions: [{ giveAmt: "", waterAmt: "" }],
          giveMode: 1,
          status: 1,
          pickerValue: [],
        };
      },

      //   配置
      giftGgetJoinTypeConfigD: {
        agreement: "",
        averageNums: [],
        countdowns: [],
        joinTypes: [],
        numbers: [],
        peopleNums: [],
      },
      //   正在直播中的主播
      giftListInAnchorD: [],
      liveRecordIdChangeD: [],
    };
  },
  computed: {
    getMonth() {
      let noTime = this.$store.getters.timerDate[0] - 60 * 60 * 1000 * 24
      return getNowFormatDay('-', true, noTime)
    }
  },
  created() {
    this.listQuery.pickerValue = [this.getMonth, this.getMonth]
    this.fetchData();
  },
  methods: {
    // 重置
    resets() {
      this.reloadData();
    },
    oneClickRelease(id) {
      this.$confirm(`确认${id ? "" : "一键"}发放彩金？`, "彩金发放", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(async () => {
          let res;
          if (id) {
            res = await giveRecord({ id });
          } else {
            res = await giveAllRecord();
          }
          if (res.code === 200) {
            this.fetchData();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消彩金发放",
          });
        });
    },
    // 显示创建弹出窗
    showCreateDialogClick() {
      this.resetCreateModel();
      this.dialogCreateVisible = true;
      this.dialogStatus = "create";
      this.dialogCreateLoading = true;
      getRewardAnchorConfig().then((res) => {
        if (res.data) {
          this.createModel = {
            ...res.data,
            pickerValue: [res.data.startDate, res.data.endDate],
          };
        }
        this.dialogCreateLoading = false;
      });
    },
    // 创建/更新 数据
    handleDataClick() {
      // this.$refs['dataForm'].validate((valid) => {
      //   if (valid) {
      //   }
      // })
      if (this.validateValues()) {
        this.dialogCreateLoading = true;
        updateRewardAnchorConfig({
          ...this.createModel,
          startDate: this.createModel.pickerValue[0],
          endDate: this.createModel.pickerValue[1],
        }).then((res) => {
          if (res.code === 200) {
            this.dialogCreateLoading = false;
            this.dialogCreateVisible = false;
          }
        });
      }
    },
    validateValues() {
      if (!this.createModel.activityName) {
        this.$message({
          type: "warning",
          message: "请输入活动名称",
        });
        return false;
      }
      if (!this.createModel.bonusMultiple) {
        this.$message({
          type: "warning",
          message: "请输入红利倍数",
        });
        return false;
      }
      if (
        !this.createModel.pickerValue ||
        !this.createModel.pickerValue.length
      ) {
        this.$message({
          type: "warning",
          message: "请选择活动时间",
        });
        return false;
      }
      let emptyFlag = false;
      this.createModel.conditions.map((item) => {
        Object.keys(item).map((ckey) => {
          if (!item[ckey]) {
            emptyFlag = true;
          }
        });
      });
      if (emptyFlag) {
        this.$message({
          type: "warning",
          message: "日打赏金额/奖励金币不可为空",
        });
        return;
      }
      // if (!this.createModel.activityDesc) {
      //   this.$message({
      //     type: "warning",
      //     message: "请输入活动规则",
      //   });
      //   return;
      // }
      return true;
    },

    // 刷新数据
    reloadData() {
      // 重置数据
      this.list = [];
      this.listLoading = true;
      this.listQuery = {
        pageSize: 20,
        pageNum: 1,
        pickerValue: [this.getMonth, this.getMonth]
      };
      setTimeout(() => {
        this.fetchData();
      }, 80);
    },
    // 获取列表数据
    fetchData() {
      this.listQuery.startDate =
        this.listQuery.pickerValue != null &&
          this.listQuery.pickerValue[0] != undefined
          ? this.listQuery.pickerValue[0]
          : null;
      this.listQuery.endDate =
        this.listQuery.pickerValue != null &&
          this.listQuery.pickerValue[0] != undefined
          ? this.listQuery.pickerValue[1]
          : null;
      // 请求服务器
      this.listLoading = true;
      getLotteryList(this.listQuery)
        .then((res) => {
          this.list = res.data.list || [];
          this.listQuery.total = res.data.total || 0;
          this.listLoading = false;
        })
        .catch((err) => {
          this.list = [];
          this.listQuery.total = 0;
          this.listLoading = false;
          this.$message.error(err);
        });
    },
    plusCondition() {
      this.createModel.conditions.push({ giveAmt: "", waterAmt: "" });
    },
    minusCondition(index) {
      this.createModel.conditions = this.createModel.conditions.filter(
        (_, cindex) => {
          return cindex !== index;
        }
      );
    },
    // 过滤
    handleSearchFilter() {
      this.listQuery.pageNum = 1;
      this.listQuery.startDate =
        this.listQuery.pickerValue != null &&
          this.listQuery.pickerValue[0] != undefined
          ? this.listQuery.pickerValue[0]
          : null;
      this.listQuery.endDate =
        this.listQuery.pickerValue != null &&
          this.listQuery.pickerValue[0] != undefined
          ? this.listQuery.pickerValue[1]
          : null;

      this.fetchData();
    },
    // 过滤2
    handleSearchFilter2() {
      this.fetchData2();
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
<style scoped lang="scss">
.input-with-select {
  background-color: #fff;
  width: 260px;
  margin-right: 10px;
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

.form {
  width: 100%;

  .liushui {
    display: grid;
    grid-template-columns: 3fr 4fr 110px;
    column-gap: 20px;

    .mtitle {
      display: flex;

      span {
        min-width: 80px;
      }
    }
  }
}

.span_primary {
  margin-right: 10px;
  color: #fc708b;
  cursor: pointer;
}

.buts {
  display: flex;
  align-items: center;
}

.adds {
  width: 32px;
  height: 32px;
  background: url("../../../assets/imgs/Line/plus-square.svg") no-repeat;
  background-size: 100% 100%;
}

.adds:hover {
  /* fill: #fa0; */

  filter: drop-shadow(#f90435 0 0);
}

.subtract {
  width: 32px;
  height: 32px;
  background: url("../../../assets/imgs/Line/Minus-Square.svg") no-repeat;
  background-size: 100% 100%;
}

.subtract:hover {
  /* fill: #fa0; */
  filter: drop-shadow(#f90435 0 0);
}
</style>
