<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button
        size="medium"
        type="primary"
        icon="el-icon-edit-outline"
        @click="showCreateDialogClick()"
        >添加代理商用户</el-button
      >
      <span style="margin-right: 10px" />
      <el-button
        size="medium"
        type="primary"
        icon="el-icon-edit-outline"
        @click="showChangeDialogClick()"
        >编辑用户充值金额</el-button
      >
      <span style="margin-right: 10px" />
      <el-input
        v-model="listQuery.username"
        size="medium"
        class="input-with-select"
        placeholder="请输入代理商名称"
        clearable
        @keyup.enter.native="handleSearchFilter"
        @clear="handleSearchFilter"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleSearchFilter"
        />
      </el-input>
      <span style="margin-right: 10px" />
      <el-input
        v-model="listQuery.phoneNum"
        size="medium"
        style="width: 240px"
        clearable
        placeholder="请输入代理商手机号"
        class="input-with-select"
        oninput="value=value.replace(/[^\d]/g,'')"
        @keyup.enter.native="handleSearchFilter"
        @clear="handleSearchFilter"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleSearchFilter"
        />
      </el-input>
      <span style="margin-right: 10px" />
      <el-input
        v-model="listQuery.lastQq"
        size="medium"
        class="input-with-select"
        placeholder="请输入下展客服号/QQ"
        clearable
        @keyup.enter.native="handleSearchFilter"
        @clear="handleSearchFilter"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleSearchFilter"
        />
      </el-input>
      <span style="margin-right: 10px" />
      <el-input
        v-model="listQuery.lastWechat"
        size="medium"
        class="input-with-select"
        placeholder="请输入下展客服号/微信"
        clearable
        @keyup.enter.native="handleSearchFilter"
        @clear="handleSearchFilter"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleSearchFilter"
        />
      </el-input>
      <el-select
        v-model="listQuery.status"
        size="medium"
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
      <span style="margin-right: 10px" />
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
    </div>

    <el-table
      v-cloading="listLoading"
      :data="list"
      border
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60"   />
      <el-table-column
        prop="id"
        label="代理商ID"
        min-width="80"
         
      />
      <el-table-column
        prop="username"
        label="代理商名称"
        min-width="80"
         
      />
      <el-table-column
        prop="phoneNum"
        label="手机号"
        min-width="80"
         
      />
      <el-table-column
        prop="balance"
        label="代理账户金币余量"
        min-width="80"
         
      />
      <el-table-column
        prop="maxBalance"
        label="代理账户最大金币数量"
        min-width="80"
         
      />
      <el-table-column prop="sort" label="排序" min-width="80"   />
      <el-table-column prop="qq" label="qq" min-width="80"   />
      <el-table-column
        prop="wechat"
        label="微信号码"
        min-width="80"
         
      />
      <el-table-column
        prop="lastQq"
        label="下展客服号/QQ"
        min-width="80"
         
      />
      <el-table-column
        prop="lastWechat"
        label="下展客服号/微信"
        min-width="80"
         
      />
      <el-table-column
        prop="remark"
        label="备注"
        min-width="80"
         
      />
      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="160"
         
      />
      <el-table-column label="状态" width="160"  >
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            :width="30"
            active-text="启用"
            :active-value="1"
            inactive-text="禁用"
            :inactive-value="2"
            @change="switchChangeFlag(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160"  >
        <template slot-scope="{ row }">
          <el-button
            plain
            type="primary"
            size="mini"
            @click="showUpdateDialogClick(row)"
            >编辑</el-button
          >
          <el-button
            plain
            type="danger"
            size="mini"
            @click="showDeleteDialogClick(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-cloading="todayListLoading"
      :data="todayList"
      border
      highlight-current-row
      size="mini"
    >
      <el-table-column type="" label="" width="60"   />
      <el-table-column prop="" label="" min-width="80"   />
      <el-table-column prop="" label="" min-width="80"   />
      <el-table-column prop="" label="" min-width="80"   />
      <el-table-column
        prop="totalCoin"
        label="总金币余量"
        min-width="80"
         
      />
      <el-table-column prop="" label="" min-width="80"   />
      <el-table-column prop="" label="" min-width="80"   />
      <el-table-column prop="" label="" min-width="80"   />
      <el-table-column prop="" label="" min-width="80"   />
      <el-table-column prop="" label="" min-width="80"   />
      <el-table-column prop="" label="" width="160"   />
      <el-table-column label="" width="160"   />
      <el-table-column label="" width="160"   />
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

    <!-- 新建/编辑 弹窗 -->
    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      :visible.sync="dialogCreateVisible"
       
      :close-on-click-modal="false"
      :destroy-on-close="true"
      top="5vh"
      width="35%"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="createModel"
          :rules="rules"
          label-position="left"
          label-width="120px"
          size="medium"
        >
          <span v-if="dialogStatus === 'create'">
            <el-form-item label="代理商名称" prop="username">
              <el-input
                v-model="createModel.username"
                clearable
                placeholder="请输入代理商名称"
                maxlength="40"
                show-word-limit
              />
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="createModel.password"
                clearable
                placeholder="请输入密码"
                maxlength="40"
                show-word-limit
              />
            </el-form-item>
          </span>
          <el-form-item label="手机号" prop="phoneNum">
            <el-input
              v-model.number="createModel.phoneNum"
              clearable
              placeholder="请输入手机号"
              maxlength="40"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="金币余量" prop="balance">
            <el-input
              v-model.number="createModel.balance"
              clearable
              placeholder="请输入金币余量"
              maxlength="30"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="最大金币数量" prop="maxBalance">
            <el-input
              v-model.number="createModel.maxBalance"
              clearable
              placeholder="请输入最大金币数量"
              maxlength="40"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="单次充值限额" prop="goldCoin">
            <el-input
              v-model.number="createModel.goldCoin"
              clearable
              placeholder="请输入单次充值最大限额"
              maxlength="40"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input
              v-model.number="createModel.sort"
              clearable
              placeholder="请输入排序"
              maxlength="40"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="qq" prop="qq">
            <el-input
              v-model.number="createModel.qq"
              clearable
              placeholder="请输入qq"
              maxlength="40"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="微信号码" prop="wechat">
            <el-input
              v-model="createModel.wechat"
              clearable
              placeholder="请输入微信号码"
              maxlength="40"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              v-model="createModel.remark"
              type="textarea"
              placeholder="请输入备注说明"
              maxlength="100"
              :autosize="{ minRows: 2, maxRows: 4 }"
              show-word-limit
            />
          </el-form-item>
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

    <!-- 添加用户限制金额 -->
    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      :visible.sync="dialogChangeVisible"
       
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="35%"
    >
      <div v-cloading="dialogChangeLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="changeModel"
          :rules="rules"
          label-position="top"
          size="medium"
        >
          <el-form-item label="用户ID" prop="chinese"
            ><el-input
              v-model="changeModel.id"
              clearable
              placeholder="请输入用户ID"
              maxlength="200"
          /></el-form-item>
          <el-form-item label="金币" prop="chinese"
            ><el-input
              v-model="changeModel.goldCoin"
              clearable
              placeholder="请输入限制金币数量"
              maxlength="200"
          /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogChangeVisible = false"
          >取消</el-button
        >
        <el-button
          size="medium"
          type="primary"
          @click="handleChangeDataClick(changeModel.id, changeModel.goldCoin)"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  agentUserList,
  createUser,
  updateUser,
  updateStatus,
  deleteUser,
  agentUserListTotal,
  updateGoldCoin,
} from "@/api/agent/user";
import { nullS, formatUnixTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";

export default {
  name: "AgentUserController",
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
        id: null,
        username: null,
        phoneNum: null,
        status: null,
        pickerValue: [],
        lastWechat: null,
        lastQq: null,
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

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogChangeVisible: false,
      dialogChangeLoading: false,
      dialogStatus: "",
      dialogTitleMap: {
        create: "添加代理商",
        update: "编辑代理商",
        change: "添加限制金额",
      },

      statusOptions: [
        { label: "启用", value: 1 },
        { label: "禁用", value: 2 },
      ],

      // 表单模型
      createModel: {
        username: null,
        phoneNum: 0,
        balance: 0,
        maxBalance: 0,
        qq: 0,
        wechat: null,
        password: null,
        remark: null,
        status: 1,
        goldCoin: 0,
        sort: 0,
      },
      // 表单模型
      changeModel: {
        id: null,
        goldCoin: 0,
      },

      // 验证规则
      rules: {
        username: [
          { required: true, message: "请输入代理商名称", trigger: "change" },
          { min: 1, max: 30, message: "最多为30个字符", trigger: "change" },
        ],
        phoneNum: [
          { required: true, message: "请输入手机号", trigger: "change" },
        ],
        password: [
          { required: true, message: "请输入6位以上密码", trigger: "change" },
        ],
        // password: [{ required: true, trigger: 'change', validator: validatePassword }],
        balance: [
          {
            required: true,
            message: "请输入代理账户金币余量",
            trigger: "change",
          },
          { type: "number", message: "请输入正确的数值" },
        ],
        maxBalance: [
          {
            required: true,
            message: "请输入代理账户最大金币数量",
            trigger: "change",
          },
          { type: "number", message: "请输入正确的数值", trigger: "change" },
        ],
        wechat: [
          { required: false, message: "请输入微信号码", trigger: "change" },
          { min: 1, max: 40, message: "最多为40个字符", trigger: "change" },
        ],
      },
    };
  },

  created() {
    this.fetchData();
  },
  methods: {
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        username: null,
        phoneNum: null,
        balance: 0,
        maxBalance: 0,
        qq: 0,
        wechat: null,
        password: null,
        remark: null,
        status: 1,
        goldCoin: 0,
        sort: 0,
      };
    },
    // 重新设置表单数据
    resetChangeModel() {
      this.changeModel = {
        id: null,
        goldCoin: 0,
      };
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      agentUserListTotal(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      )
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
          return agentUserList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          );
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            this.$set(
              item,
              "createTimeString",
              formatUnixTime(item.createTime)
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
    // 显示编辑用户单次充值限制金额弹出窗
    showChangeDialogClick() {
      this.resetChangeModel();
      this.dialogChangeVisible = true;
      this.dialogStatus = "change";
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

    // 更改状态
    switchChangeFlag(row) {
      const rowDic = Object.assign({}, row);
      this.listLoading = true;
      // 请求网络
      updateStatus(rowDic.id, rowDic.status)
        .then((res) => {
          this.listLoading = false;
          this.$notify({
            title: "提示",
            message: "修改成功",
            type: "success",
            duration: 1000,
          });
        })
        .catch((err) => {
          // 错误的情况下，修改内存属性
          row.status = !row.status;
          this.listLoading = false;
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
            id: formDic.id || 0,
            username: nullS(formDic.username),
            phoneNum: formDic.phoneNum || 0,
            balance: formDic.balance || 0,
            maxBalance: formDic.maxBalance || 0,
            sort: formDic.sort || 0,
            qq: formDic.qq || 0,
            wechat: nullS(formDic.wechat),
            password: nullS(formDic.password),
            remark: nullS(formDic.remark),
            status: formDic.status || 0,
            goldCoin: formDic.goldCoin || 0,
          };
          if (this.dialogStatus === "create") {
            createUser(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "创建代理账号成功",
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
            updateUser(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "修改代理账号成功",
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
    // 编辑用户单次充值限制金额
    handleChangeDataClick(id, goldCoin) {
      const params = {
        id: id,
        goldCoin: goldCoin,
      };
      // 请求服务器
      this.dialogChangeVisible = true;
      if (this.dialogStatus === "change") {
        updateGoldCoin(params)
          .then((res) => {
            this.dialogChangeLoading = false;
            this.dialogChangeVisible = false;
            this.$notify({
              title: "提示",
              message: "修改用户单次充值限制金额成功",
              type: "success",
              duration: 1500,
            });
            this.fetchData();
          })
          .catch((err) => {
            this.dialogChangeLoading = false;
            this.$message.error(err);
          });
      }
    },

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error("参数错误");
        return;
      }
      this.$confirm("是否删除该代理账号？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true;
          deleteUser([row.id])
            .then((res) => {
              this.listLoading = false;
              this.$notify({
                title: "提示",
                message: "删除代理账号成功",
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
  margin: 20px 0px 20px 0px;
  padding: 0px;
}
</style>
