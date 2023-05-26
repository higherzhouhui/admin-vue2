<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-edit-outline"
          @click="showCreateDialogClick()"
          >清空流水可提现</el-button
        >
      </el-form-item>
      <!-- 状态 -->
      <el-form-item>
        <el-select
          v-model="listQuery.type"
          size="small"
          placeholder="请选择类别"
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
        <el-input
          v-model="listQuery.orderId"
          size="small"
          style="width: 280px"
          placeholder="请输入订单号"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
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
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-search"
          @click="handleSearchFilter"
        />
      </el-form-item>
    </el-form>

    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
     >
      <el-table-column type="index" label="序号" width="60"   />
      <el-table-column prop="id" label="ID" min-width="60"   />
      <el-table-column
        prop="uid"
        label="用户id"
        min-width="120"
         
      />
      <el-table-column
        prop="localCoin"
        label="本地金币"
        min-width="100"
         
        sortable
      />
      <el-table-column
        prop="kyCoin"
        label="开元金币(VND)"
        min-width="140"
         
        sortable
      />
      <el-table-column label="类别" width="80"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.type | typeFilter">{{
            row.typeString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderId"
        label="订单号"
        min-width="180"
         
      />
      <el-table-column
        prop="remark"
        label="备注"
        min-width="60"
         
      />
      <el-table-column label="类别" width="80"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.status | statusFilter">{{
            row.statusString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="160"
         
      />
      <el-table-column
        prop="updateTimeString"
        label="更新时间"
        width="160"
         
      />
      <el-table-column label="操作" width="160"  >
        <template slot-scope="{ row }">
          <el-button
            plain
            type="primary"
            size="mini"
            @click="showUpdateDialogClick(row)"
            >金币补偿</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-table v-cloading="todayListLoading" :data="todayList" size="mini">
      <el-table-column type="" label="" width="60"   />
      <el-table-column prop="" label="" min-width="60"   />
      <el-table-column prop="" label="" min-width="60"   />
      <el-table-column prop="" label="" min-width="60"   />
      <el-table-column
        prop="upCoin"
        label="总代入"
        min-width="60"
         
      />
      <el-table-column
        prop="downCoin"
        label="总代出"
        width="80"
         
      />
      <el-table-column
        prop="allCoin"
        label="总盈亏"
        min-width="120"
         
      />
      <el-table-column prop="" label="" min-width="60"   />
      <el-table-column label="" width="80"   />
      <el-table-column prop="" label="" width="160"   />
      <el-table-column prop="" label="" width="160"   />
      <el-table-column label="" width="160"   />
    </el-table>

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
          <el-form-item label="用户ID" prop="uid"
            ><el-input
              v-model="createModel.uid"
              clearable
              placeholder="请输入用户ID"
              maxlength="200"
          /></el-form-item>
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
  </div>
</template>

<script>
import {
  getTransList,
  getTransTotal,
  queryOrder,
  createTrans,
} from "@/api/game/trans";
import { emptyS, nullS, formatUnixTime } from "@/utils/tools";

export default {
  name: "KyGameCoinTransController",
  filters: {
    typeFilter(type) {
      const map = { 0: "info", 1: "success", 2: "danger" };
      return map[type];
    },
    statusFilter(status) {
      const map = { 0: "info", 2: "success", 3: "danger" };
      return map[status];
    },
  },
  data() {
    return {
      list: null,
      todayList: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        orderId: null,
        type: null,
        uid: null,
        status: null,
        pickerValue: [],
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      dialogTitleMap: {
        create: "添加流水",
        update: "编辑流水",
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
      // 表单模型
      createModel: {
        uid: 0,
      },

      typeOptions: [
        { value: 1, label: "代入" },
        { value: 2, label: "代出" },
      ],
      statusOptions: [
        { value: 0, label: "成功" },
        { value: 2, label: "失败" },
        { value: 3, label: "处理中" },
      ],

      rules: {
        uid: [
          { required: true, message: "请输入用户ID", trigger: "change" },
          { min: 1, max: 200, message: "最多为200个字符", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    resetCreateModel() {
      this.createModel = {
        uid: 0,
      };
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      this.todayListLoading = true;
      getTransTotal(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
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
          this.listLoading = false;
          return getTransList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          );
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var statusString = "";
            if (item.status == -1) {
              statusString = "已处理";
            } else if (item.status == 0) {
              statusString = "成功";
            } else if (item.status == 2) {
              statusString = "失败";
            } else if (item.status == 3) {
              statusString = "处理中";
            }
            var typeString = "";
            if (item.type == 1) {
              typeString = "代入";
            } else if (item.type == 2) {
              typeString = "代出";
            }
            this.$set(item, "statusString", statusString);
            this.$set(item, "typeString", typeString);
            this.$set(
              item,
              "createTimeString",
              formatUnixTime(item.createTime)
            );
            this.$set(
              item,
              "updateTimeString",
              formatUnixTime(item.updateTime)
            );
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

    // 显示创建弹出窗
    showCreateDialogClick() {
      this.resetCreateModel();
      this.dialogCreateVisible = true;
      this.dialogStatus = "create";
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel);
          if (formDic.uid == null || formDic.uid < 0) {
            this.$message.error("参数错误");
            return;
          }
          this.$confirm("是否添加该流水？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            showClose: false,
          }).then(() => {
            // 请求网络
            this.listLoading = true;
            createTrans([formDic.uid])
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "添加流水成功",
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
          });
        }
      });
    },

    showUpdateDialogClick(row) {
      if (row.status == 0) {
        this.$message.error("订单正常，无需进行金币补偿");
        return;
      }
      if (row.uid == null || row.uid < 0) {
        this.$message.error("参数错误");
        return;
      }
      if (row.orderId == null || row.orderId < 0) {
        this.$message.error("参数错误");
        return;
      }
      this.$confirm("是否进行金币补偿？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          const params = {
            uid: row.uid,
            orderId: row.orderId,
          };
          queryOrder(params)
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "金币补偿成功",
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
