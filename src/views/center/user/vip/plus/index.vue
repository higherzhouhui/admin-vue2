<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
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
          format="yyyy-MM-dd HH:mm"
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
          placeholder="请输入用户ID"
          clearable
          maxlength="12"
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.orderId"
          size="small"
          style="width: 220px"
          placeholder="请输入订单号"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchFilter"
          >搜索</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-refresh" @click="reset"
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
          @click="showUpdateDialogClick()"
          >编辑群组</el-button
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
      <el-table-column label="用户ID" min-width="80">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="trn" label="订单号" min-width="120" />
      <el-table-column
        prop="levelId"
        label="贵族等级"
        min-width="100"
        sortable
      />
      <el-table-column
        prop="goldCoin"
        label="购买贵族消耗的金币"
        min-width="160"
        sortable
      />
      <el-table-column prop="statusString" label="购买类型" min-width="100" />
      <el-table-column prop="days" label="天数" min-width="100" sortable />
      <el-table-column
        prop="gmtCreate"
        label="创建时间"
        width="160"
        :formatter="formatDate"
      />
      <el-table-column
        prop="gmtUpdate"
        label="更新时间"
        width="160"
        :formatter="formatDate"
      />
      <el-table-column prop="operator" label="操作人" min-width="80" />
      <!-- <el-table-column label="操作" width="100"  >
        <template slot-scope="{ row }">
          <el-button plain type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新建/编辑 弹窗 -->
    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="createModel"
          :rules="rules"
          label-position="top"
          label-width="120px"
          size="medium"
        >
          <el-form-item label="VIP群1" prop="vip1"
            ><el-input
              v-model="createModel.vip1"
              clearable
              placeholder="贵族在子爵到公爵的VIP群"
              maxlength="100"
          /></el-form-item>
          <el-form-item label="VIP群2" prop="vip2"
            ><el-input
              v-model="createModel.vip2"
              clearable
              placeholder="贵族在国王和皇帝的VIP群"
              maxlength="100"
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
  </div>
</template>

<script>
import {
  getCenterUusrVipPlusList,
  getUserGroup,
  updateUserVipGroup,
} from "@/api/vip/vip";
import { getPropList } from "@/api/config/vip";
import { emptyS, nullS, formatUnixTime, getDateTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: "CenterUserVipPlusController",
  filters: {},
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
        gids: null,
        pickerValue: [],
        orderId: null,
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      dialogTitleMap: {
        update: "编辑群号",
      },

      // 表单模型
      createModel: {
        vip1: null,
        vip2: null,
      },

      rules: {
        vip1: [
          { required: true, message: "群组名称不能为空", trigger: "change" },
          { min: 1, max: 100, message: "最多为20个字符", trigger: "change" },
        ],
        vip2: [
          { required: true, message: "群组名称不能为空", trigger: "blur" },
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
        pickerValue: this.initTimer,
        limit: 20,
      };
      this.fetchData();
    },
    resetCreateModel() {
      this.createModel = {
        vip1: null,
        vip2: null,
      };
    },

    // 方法区
    formatDate(row, column) {
      // 获取单元格数据
      const data = row[column.property];
      if (data == null) {
        return null;
      }
      const dt = new Date(data);
      return (
        dt.getFullYear() +
        "-" +
        (dt.getMonth() + 1) +
        "-" +
        dt.getDate() +
        " " +
        dt.getHours() +
        ":" +
        dt.getMinutes() +
        ":" +
        dt.getSeconds()
      );
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      var cars = [];
      // getUserGroup()
      //     .then(res => {
      //       const formDic = res.data || {};
      //       this.configModel = {
      //         vip1: nullS(formDic.vip1),
      //         vip2: nullS(formDic.vip2),
      //       };
      //       this.loading = false;
      //     })
      //     .catch(err => {
      //       this.loading = false;
      //       this.$message.error(err);
      //     });
      //     return getPropList({ type: 1 });
      //     })
      getPropList({ type: 1 })
        .then((res) => {
          for (const item of res.data.list || []) {
            if (item.type == 1) {
              cars.push({
                gid: item.gid || 0,
                gname: nullS(item.gname),
              });
            }
          }
          // 获取座驾明细列表
          return getCenterUusrVipPlusList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          );
          // console.log('数据类型' + this.listQuery.limit, this.listQuery.page, this.listQuery);
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var gname = "";
            for (const car of cars) {
              if (car.gid == item.gid) {
                gname = car.gname;
              }
            }

            var statusString = "";
            switch (item.status) {
              case 0:
                statusString = "金币购买  ";
                break;
              case 1:
                statusString = "充值赠送";
                break;
              case 2:
                statusString = "后台增加";
                break;
            }
            this.$set(item, "statusString", statusString);
            this.$set(item, "gmtCreateString", formatUnixTime(item.gmtCreate));
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

    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      this.resetCreateModel();
      this.dialogCreateVisible = true;
      this.dialogStatus = "update";
      this.createModel = Object.assign({}, row);
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate();
      // });
      getUserGroup()
        .then((res) => {
          const formDic = res.data || {};
          this.createModel = {
            vip1: nullS(formDic.vip1),
            vip2: nullS(formDic.vip2),
          };
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err);
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
            vip1: formDic.vip1,
            vip2: formDic.vip2,
          };
          updateUserVipGroup(params)
            .then((res) => {
              this.dialogCreateLoading = false;
              this.dialogCreateVisible = false;
              this.$notify({
                title: "提示",
                message: "修改成功",
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
      });
    },

    // 更新贵族等级数据
    // updateUserVipGroup() {
    //   this.$refs['dataForm'].validate(valid => {
    //     if (valid) {
    //       const formDic = Object.assign({}, this.createModel);

    //       // 请求服务器
    //       this.dialogCreateLoading = true;
    //       const params = {
    //         vip1: formDic.vip1,
    //         vip2: formDic.vip2
    //       };
    //       updateUserVipGroup(params)
    //         .then(res => {
    //           this.dialogCreateLoading = false;
    //           this.dialogCreateVisible = false;
    //           this.$notify({
    //             title: '提示',
    //             message: '修改成功',
    //             type: 'success',
    //             duration: 1500
    //           });
    //           setTimeout(_ => {
    //             this.fetchData();
    //           }, 200);
    //         })
    //         .catch(err => {
    //           this.dialogCreateLoading = false;
    //           this.$message.error(err);
    //         });
    //     }
    //   });
    // },

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

    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        uid: 0,
        nickname: null,
        signature: null,
      };
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
