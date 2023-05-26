<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- 搜索主播ID框 -->
      <!-- <el-form-item>
        <span class="search_info">创建时间:</span>
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
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          style="width: 220px"
          placeholder="请输入主播ID"
          clearable
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <!-- 状态 -->
      <el-form-item>
        <el-select
          v-model="listQuery.status"
          size="small"
          placeholder="请选择状态"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          type="primary"
          size="small"
          @click="handleSearchFilter"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="small" @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-edit-outline"
          @click="showHandleDialogClick()"
          >家族封禁</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="主播昵称和ID" min-width="120">
        <template slot-scope="{ row }">
          <user-drawer
            :uid="row.uid"
            :show-text="`${row.nickname} (${row.uid})`"
          />
        </template>
      </el-table-column>
      <el-table-column label="主播封面" min-width="80">
        <template slot-scope="scope">
          <el-image
            class="vue-img-preview"
            :src="scope.row.avatar"
            fit="contain"
            lazy
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="70">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.status | statusFilter">{{
            row.statusString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="位置信息" min-width="80" />
      <el-table-column prop="gmtUpdateString" label="创建时间" width="160" />
      <el-table-column label="操作" width="70" fixed="right">
        <template slot-scope="{ row }">
          <span
            class="operation_btn"
            type="primary"
            size="mini"
            @click="showDialogClick(row)"
            >通过</span
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

    <!-- 主播认证 弹窗 -->
    <el-dialog
      title="主播认证"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="35%"
    >
      <div v-cloading="dialogLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="formDatas"
          :rules="rules"
          label-position="top"
          size="medium"
        >
          <!--       <el-form-item label="选择主播类型(必选)" prop="goldMedal">
           <el-select style="width: 50%;" v-model="formDatas.goldMedal">
              <el-option v-for="item in dialogGoldOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="选择主播类型(必选)">
            <el-select v-model="formDatas.goldMedal" placeholder="请--选--择 ">
              <el-option
                v-for="item in typeList"
                :key="item.label"
                :label="item.label"
                :value="item.value"
                :v-model="formDatas.goldMedal"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="选择主播家族(必选)" prop="family">
            <el-select
              v-model="formDatas.family"
              style="width: 50%"
              filterable
              clearable
              placeholder="请输入或选择一个家族"
            >
              <el-option
                v-for="item in dialogFamilyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="选择主播标签 (可以不选)">
            <el-select
              v-model="formDatas.tags"
              style="width: 50%"
              filterable
              clearable
              multiple
              placeholder="请输入或选择标签"
            >
              <el-option
                v-for="item in dialogTagOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="commitAuthClick()"
          >确定认证</el-button
        >
      </div>
    </el-dialog>

    <!-- 主播认证 弹窗 -->
    <el-dialog
      title="家族封禁"
      :visible.sync="handleDialogVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="35%"
    >
      <div v-cloading="handleDdialogLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="handleFormDatas"
          :rules="rules"
          label-position="top"
          size="medium"
        >
          <el-form-item label="选择主播家族(必选)" prop="family">
            <el-select
              v-model="handleFormDatas.family"
              style="width: 50%"
              filterable
              clearable
              placeholder="请输入或选择一个家族"
            >
              <el-option
                v-for="item in dialogFamilyOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="chinese"
            ><el-input
              v-model="handleFormDatas.remark"
              clearable
              placeholder="请输入封禁备注"
              maxlength="200"
          /></el-form-item>
          <!--  <el-form-item label="封禁类型">
          <el-switch v-model="handleFormDatas.handleType"  inactive-text="封号" :inactive-value="'0'"></el-switch>
        </el-form-item> -->
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="handleDialogVisible = false"
          >取消</el-button
        >
        <el-button
          size="medium"
          type="primary"
          @click="
            commitHandleClick(handleFormDatas.family, handleFormDatas.remark)
          "
          >确定封禁</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserAnchorAuthList,
  updateUserAnchorAuth,
  getUserFamilyList,
  handleBatch,
  getTypeList,
} from "@/api/center/user/anchor";
import { getAnchorTagList } from "@/api/config/tag";
import { emptyS, nullS, formatUnixTime, getDateTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";
const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: "CenterUserAnchorAuthPage",
  filters: {
    statusFilter(status) {
      const map = { 0: "info", 2: "success", 1: "danger" };
      return map[status];
    },
  },
  components: {
    UserDrawer,
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        status: null,
        pickerValue: [],
      },

      typeList: null,
      // 弹窗数值
      dialogVisible: false,
      dialogLoading: false,
      // 弹窗数值
      handleDialogVisible: false,
      handleDdialogLoading: false,
      dialogGoldOptions: [
        { label: "普通主播", value: 0 },
        { label: "金牌主播", value: 1 },
        { label: "纯提成主播", value: 2 },
      ],
      dialogTagOptions: [],
      dialogFamilyOptions: [],

      // 状态选择
      statusOptions: [
        { label: "取消认证", value: 0 },
        { label: "待审核", value: 1 },
        { label: "已认证", value: 2 },
      ],

      // 表单模型
      formDatas: {
        id: 0,
        uid: 0,
        goldMedal: 0,
        family: null,
        tags: [],
      },
      // 表单模型
      handleFormDatas: {
        family: null,
        handleType: 0,
        remark: null,
      },

      // 验证规则
      rules: {
        goldMedal: [{ required: true, message: "请选择主播类型" }],
        family: [{ required: true, message: "请选择主播家族" }],
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
        pickerValue: this.initTimer,
      };
      this.fetchData();
    },
    // 重新设置表单数据
    resetFormDatas() {
      this.dialogTagOptions = [];
      this.dialogFamilyOptions = [];
      this.formDatas = {
        id: 0,
        uid: 0,
        goldMedal: 0,
        family: null,
        status: null,
        tags: [],
      };
    },

    // 重新设置表单数据
    resetHandleFormDatas() {
      this.dialogFamilyOptions = [];
      this.handleFormDatas = {
        family: null,
        remark: null,
      };
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;

      getTypeList()
        .then((res) => {
          this.typeList = (res.data.list || []).map((item) => {
            return {
              value: item.id,
              label: nullS(item.typeName),
            };
          });
          // 获取未认证的主播列表
          return getUserAnchorAuthList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          );
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var statusString = "";
            if (item.status == 0) {
              statusString = "取消认证";
            } else if (item.status == 1) {
              statusString = "待审核";
            } else if (item.status == 2) {
              statusString = "已认证";
            }
            this.$set(item, "statusString", statusString);
            this.$set(item, "gmtUpdateString", formatUnixTime(item.gmtUpdate));
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

    // 显示认证弹窗
    showDialogClick(row) {
      this.resetFormDatas();
      this.dialogVisible = true;
      this.formDatas = Object.assign({}, row);
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.showDialogBefore();
    },

    // 显示封禁弹窗
    showHandleDialogClick() {
      this.resetHandleFormDatas();
      this.handleDialogVisible = true;
      // this.handleFormDatas = Object.assign({}, row);
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
      this.showHandelDialogBefore();
    },

    // 显示认证弹窗之前
    showDialogBefore() {
      this.dialogLoading = true;
      // 请求标签
      getAnchorTagList()
        .then((res) => {
          const customTags = (res.data.list || []).filter(
            (item) => item.type > 0 && item.type != 1 && item.type != 2
          );
          this.dialogTagOptions = customTags.map((item) => {
            return {
              value: item.id || 0,
              label: nullS(item.name),
            };
          });

          // 请求家族列表
          return getUserFamilyList();
        })
        .then((res) => {
          this.dialogFamilyOptions = (res.data.list || []).map((item) => {
            return {
              value: item.bossId || 0,
              label: nullS(item.familyName),
            };
          });
          this.dialogLoading = false;
        })
        .catch((err) => {
          this.dialogLoading = false;
          this.$message.error(err);
        });
    },

    // 显示封禁弹窗之前
    showHandelDialogBefore() {
      this.handleDdialogLoading = true;
      // 请求标签
      getAnchorTagList()
        .then((res) => {
          const customTags = (res.data.list || []).filter(
            (item) => item.type > 0 && item.type != 1 && item.type != 2
          );
          this.dialogTagOptions = customTags.map((item) => {
            return {
              value: item.id || 0,
              label: nullS(item.name),
            };
          });

          // 请求家族列表
          return getUserFamilyList();
        })
        .then((res) => {
          this.dialogFamilyOptions = (res.data.list || []).map((item) => {
            return {
              value: item.bossId || 0,
              label: nullS(item.familyName),
            };
          });
          this.handleDdialogLoading = false;
        })
        .catch((err) => {
          this.handleDdialogLoading = false;
          this.$message.error(err);
        });
    },

    // 提交认证方法
    commitAuthClick() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.formDatas);
          const params = {
            id: formDic.id || 0,
            uid: formDic.uid || 0,
            goldMedal: formDic.goldMedal || 0,
            familyId: formDic.family || 0,
            status: 2,
          };
          // 更新主播认证
          this.dialogLoading = true;
          updateUserAnchorAuth(formDic.tags, params)
            .then((res) => {
              this.dialogLoading = false;
              this.dialogVisible = false;
              this.$notify({
                title: "提示",
                message: "主播认证成功",
                type: "success",
                duration: 1500,
              });
              setTimeout((_) => {
                this.fetchData();
              }, 200);
            })
            .catch((err) => {
              this.dialogLoading = false;
              this.$message.error(err);
            });
        }
      });
    },

    // 提交封禁方法
    commitHandleClick(family, remark) {
      // console.log(family);
      //  console.log(remark);
      const params = {
        family: family,
        remark: remark,
      };
      console.log(params);
      // 封禁主播
      this.HandleDialogLoading = true;
      handleBatch(params)
        .then((res) => {
          this.HandleDialogLoading = false;
          this.handleDialogVisible = false;
          this.$notify({
            title: "提示",
            message: "家族封禁成功",
            type: "success",
            duration: 1500,
          });
          setTimeout((_) => {
            this.fetchData();
          }, 200);
        })
        .catch((err) => {
          this.dialogLoading = false;
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

.vue-img-preview {
  width: 40px;
  height: 40px;
  margin: 0px;
  padding: 0px;
  border-radius: 4px;
}
</style>
