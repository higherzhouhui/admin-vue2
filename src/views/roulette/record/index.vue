<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          :placeholder="'用户ID/中奖码搜索'"
          clearable
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        >
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.status"
          size="small"
          placeholder="是否兑奖"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in bindTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="listQuery.pickerValue"
          size="small"
          clearable
          type="datetimerange"
          :picker-options="pickerOptions"
          :range-separator="$t('menu.title958')"
          :start-placeholder="$t('menu.title956')"
          :end-placeholder="$t('menu.title957')"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          @change="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          plain
          icon="el-icon-search"
          @click="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          :loading="downloadLoading"
          type="success"
          icon="el-icon-document"
          @click="handleDownload"
        >
          批量导出
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
     >
      <el-table-column prop="id" :label="$t('menu.title141')"   />
      <el-table-column prop="uid" :label="$t('用户ID')"   />
      <el-table-column
        prop="rouletteName"
        :label="$t('活动名称')"
        width="120"
         
      ></el-table-column>
      <el-table-column prop="prizeLevel" :label="$t('中奖等级')"  >
        <template slot-scope="{ row }">
          {{
            row.prizeLevel == 0
              ? "-"
              : `${numberToUpperCase(row.prizeLevel)}等奖`
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="rouletteMsg"
        :label="$t('中奖码')"
         
      />
      <el-table-column
        prop="prizeName"
        :label="$t('奖品')"
         
        width="400"
      >
        <template slot-scope="{ row }">
          <span class="prizeInfo" v-if="row.prizeIcon">
            <el-image
              style="width: 100px"
              :lazy="true"
              :src="row.prizeIcon"
              :preview-src-list="[row.prizeIcon]"
            ></el-image>
            <span>{{ row.prizeName }} </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="兑换状态"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" v-if="row.status == 0">未兑奖</el-tag>
          <el-tag size="medium" type="info" v-else-if="row.status == 1"
            >已兑奖</el-tag
          >
          <el-tag size="medium" type="info" v-else>已派发完毕</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('抽奖时间')" min-width="80"  >
        <template slot-scope="{ row }">
          {{ $moment(row.createTime).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" :label="$t('备注')"   />
      <el-table-column
        width="220"
        prop="updateTimeString"
        :label="$t('操作')"
         
      >
        <template slot-scope="{ row }">
          <el-button
            v-if="row.status == 0"
            plain
            type="primary"
            size="mini"
            @click="showDialogClick(row, 1)"
            >{{ $t("审核") }}</el-button
          >
          <el-button
            plain
            type="primary"
            size="mini"
            @click="showDialogClick(row, 2)"
            >{{ $t("备注") }}</el-button
          >
          <el-button
            plain
            type="primary"
            size="mini"
            @click="detailsClick(row)"
            >{{ $t("详情") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 审核 -->
    <el-dialog
      :title="dialogStatus == 1 ? '审核' : '备注'"
      :visible.sync="dialogVisible"
       
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="35%"
    >
      <div tyle="width: 100%; height: 100%">
        <p>确认奖励兑换后，可确认审核兑换</p>
        <el-form
          ref="dataForm"
          :model="recordModel"
          :rules="rules"
          label-position="top"
          size="medium"
        >
          <el-form-item :label="$t('备注')" prop="remark"
            ><el-input
              v-model="recordModel.remark"
              clearable
              type="textarea"
              :placeholder="$t('请输入备注,20字以内')"
              maxlength="20"
              :rows="4"
          /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogVisible = false">{{
          $t("menu.title258")
        }}</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">{{
          $t("menu.title259")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRecord, updateActivityStatus } from "@/api/roulette/record";
import { numberToUpperCase, formatUnixTime } from "@/utils/tools";

export default {
  name: "PromotionUserBaseController",
  filters: {
    sexFilter(status) {
      const map = { 0: "info", 1: "", 2: "danger" };
      return map[status];
    },
  },
  components: {},
  data() {
    return {
      numberToUpperCase,
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        uid: "",
        status: "",
        pickerValue: [],
      },
      pickerOptions: {
        shortcuts: [
          {
            text: this.$t("menu.title959"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("menu.title960"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: this.$t("menu.title961"),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      downloadLoading: false,
      // 弹窗数值
      dialogVisible: false,
      dialogRemarkVisible: false,
      dialogStatus: 1, //1审核，2备注
      // 表单模型
      recordModel: {
        remark: "",
      },
      rules: {
        remark: [
          {
            required: true,
            message: "请输入备注",
            trigger: "change",
          },
          { min: 1, max: 200, message: "最多为200个字符", trigger: "change" },
        ],
      },
      bindTypeOptions: [
        { label: this.$t("未兑奖"), value: 0 },
        { label: this.$t("已兑奖"), value: 1 },
        { label: this.$t("已派发完毕"), value: 2 },
      ],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 刷新数据
    reloadData() {
      // 重置数据
      this.list = null;
      this.listLoading = true;
      this.listQuery = {
        page: 1,
        limit: 20,
        uid: "",
        status: "",
        pickerValue: [],
      };
      setTimeout(() => {
        this.fetchData();
      }, 80);
    },
    resetCreateModel() {
      this.recordModel = {
        uid: "",
      };
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      console.log(11);
      // 请求服务器
      listRecord(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
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
    // 显示创建弹出窗
    showDialogClick(row, status) {
      this.dialogStatus = status;
      this.resetCreateModel();
      this.recordModel = row;
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 详情
    detailsClick({ id }) {
      this.$router.push({
        path: "/roulette/roulette/record/detail",
        query: { id },
      });
    },
    // 创建/更新 数据
    handleDataClick() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let { id, remark } = this.recordModel;
          let params = {
            id,
            remark,
          };
          if (this.dialogStatus == 1) {
            params.status = 1;
          }
          updateActivityStatus(params)
            .then((res) => {
              this.dialogVisible = false;
              this.$notify({
                title: this.$t("menu.title262"),
                message: `${this.dialogStatus == 1 ? "审核成功" : "备注成功"}`,
                type: "success",
                duration: 1500,
              });
              setTimeout((_) => {
                this.fetchData();
              }, 200);
            })
            .catch((err) => {
              this.$message.error(err);
            });
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
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error(this.$t("menu.title286"));
        return;
      }
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "序号",
          "用户ID",
          "活动名称",
          "中奖等级",
          "中奖码",
          "奖品",
          "兑奖状态",
          "抽奖时间",
          "审核时间",
          "备注",
        ];
        const filterVal = [
          "id",
          "uid",
          "rouletteName",
          "prizeLevel",
          "rouletteMsg",
          "prizeName",
          "status",
          "createTime",
          "updateTime",
          "remark",
        ];
        const list = this.list;
        const data = this.formatJson(filterVal, list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "中奖记录列表",
          autoWidth: this.true,
          bookType: "xlsx",
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === "prizeLevel") {
            return numberToUpperCase(v[j]) + "等奖";
          }
          if (
            (j === "createTime" && v[j] != null) ||
            (j === "updateTime" && v[j] != null)
          ) {
            return formatUnixTime(v[j]);
          }
          if (j === "status" && v[j] != null) {
            if ((v[j] = 0)) return "未兑奖";
            else if ((v[j] = 1)) return "已兑奖";
            else if ((v[j] = 2)) return "已派发完毕";
            return v[j];
          } else {
            return v[j];
          }
        })
      );
    },
  },
};
</script>
<style scoped>
.prizeInfo {
  display: flex;
  align-items: center;
  justify-content: center;
}
.prizeInfo .el-image img {
  width: 50%;
}
.prizeInfo span {
  margin-left: 20px;
}
.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
</style>
