<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-select size="small" v-model="listQuery.status" placeholder="请选择状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="启用" :value="1"></el-option>
          <el-option label="未启用" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">新建充值档位</el-button>
        <el-button size="small" @click="checkStatus">
          活动状态：{{ status == 1 ? '开启' : '关闭' }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="gname" label="档位名称" min-width="120" />
      <el-table-column prop="rechargeAmount" label="充值金额" min-width="120" />
      <el-table-column prop="content" label="礼包内容" min-width="200" />
      <el-table-column prop="tag" label="角标" />
      <el-table-column prop="bossGiftProfit" label="状态" width="200">
        <template slot-scope="{ row, $index }">
          <el-switch type="primary" @change="editStatus(row.id, $event, $index)" :value="row.status" active-text="启用"
            inactive-text="未启用">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="bossGiftProfit" label="创建时间" min-width="160">
        <template slot-scope="{ row }">
          {{ formatUnixTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="bossGiftProfit" label="更新时间" min-width="160">
        <template slot-scope="{ row }">
          {{ formatUnixTime(row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="110" fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</span>
          <span class="operation_btn" type="danger" size="mini" @click="showDeleteDialogClick(row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新建/编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true" top="5vh" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" label-position="top" label-width="120px" size="medium">
          <el-form-item label="档位名称" prop="gname">
            <el-input v-model="createModel.gname" clearable placeholder="请输入档位名称" maxlength="20" show-word-limit />
          </el-form-item>
          <el-form-item label="充值金额" prop="rechargeAmount">
            <el-input v-model.number="createModel.rechargeAmount" clearable placeholder="请输入充值金额"><span
                slot="suffix">金币</span></el-input>
          </el-form-item>
          <el-form-item label="角标类型" prop="tag">
            <el-select size="small" v-model="createModel.tag" placeholder="请选择状态">
              <el-option label="无" value="无"></el-option>
              <el-option label="推荐" value="推荐"></el-option>
              <el-option label="热门" value="热门"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="礼包内容" prop="tag">
            <el-input style="width: 100%" placeholder="请输入体验天数" v-model.number="createModel.value1"
              class="input-with-select">
              <el-select clearable style="width: 160px" v-model="createModel.type1" slot="prepend" placeholder="请选择贵族等级">
                <el-option :label="item.name" :value="item.id" v-for="item in vipList"></el-option>
              </el-select>
              <span slot="suffix" style="position: relative; top: 8px">天</span>
            </el-input>
            <el-input style="width: 100%; margin-top: 10px" placeholder="请输入体验天数" v-model.number="createModel.value2"
              class="input-with-select">
              <el-select clearable style="width: 160px" v-model="createModel.type2" slot="prepend" placeholder="请选择坐骑">
                <el-option :label="item.name" :value="item.id" v-for="item in zqList">
                  <div style="display: flex">
                    <img style="width: 33px; height: 33px; object-fit: cover" :src="item.picUrl" alt="" />
                    <span style="margin-left: 5px">{{ item.name }}</span>
                  </div>
                </el-option>
              </el-select>
              <span slot="suffix" style="position: relative; top: 8px">天</span>
            </el-input>
            <el-input style="width: 100%; margin-top: 10px" placeholder="请输入礼物个数" v-model.number="createModel.value3"
              class="input-with-select">
              <el-select clearable style="width: 160px" v-model="createModel.type3" slot="prepend" placeholder="请选择礼物">
                <el-option :label="item.name" :value="item.id" v-for="item in giftList">
                  <div style="display: flex">
                    <img style="width: 33px; height: 33px; object-fit: cover" :src="item.picUrl" alt="" /><span
                      style="margin-left: 5px">{{ item.name }}</span>
                  </div>
                </el-option>
              </el-select>
              <span slot="suffix" style="position: relative; top: 8px">个</span>
            </el-input>
            <el-input style="width: 100%; margin-top: 10px" placeholder="请输入经验值" v-model.number="createModel.value4"
              class="input-with-select">
              <span style="width: 120px; display: inline-block" slot="prepend">用户经验值</span>
              <span slot="suffix" style="position: relative; top: 8px">exp</span>
            </el-input>
          </el-form-item>
          <el-form-item label="礼包总价值" prop="totalValue">
            <el-input v-model.number="createModel.totalValue" clearable placeholder="请输入价值金额"><span
                slot="suffix">金币</span></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getList,
  edit,
  getTypeList,
  getVipList,
  add,
  changeStatus,
  delData,
  show,
  swift
} from "@/api/center/giftPick";
import { formatUnixTime } from "@/utils/tools";
import UserDrawer from "@/components/UserDrawer";

export default {
  name: "CenterUserFamilyPage",
  filters: {},
  components: {
    UserDrawer,
  },
  data() {
    return {
      vipList: [],
      zqList: [],
      giftList: [],
      list: null,
      listLoading: true,
      status: false,
      listQuery: {
        status: "",
      },
      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: "",
      dialogTitleMap: {
        create: "添加充值档位",
        update: "编辑充值档位",
      },

      // 表单模型
      createModel: {
        gname: null,
        rechargeAmount: null,
        tag: null,
        type1: null,
        value1: null,
        type2: null,
        value2: null,
        type3: null,
        value3: null,
        value4: null,
        totalValue: null,
      },
    };
  },
  created() {
    this.fetchData();
    this.getShow()
  },
  methods: {
    formatUnixTime,
    reset() {
      this.listQuery = {
        status: "",
      };
      this.fetchData();
    },
    getShow() {
      show().then(rt => {
        this.status = rt.data
      })
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        gname: null,
        rechargeAmount: null,
        tag: null,
        type1: null,
        value1: null,
        type2: null,
        value2: null,
        type3: null,
        value3: null,
        value4: null,
        totalValue: null,
      };
    },
    editStatus(id, val, index) {
      this.list[index].status = val;
      // this.$set(, 'status', !val)
      changeStatus({ id, status: val ? 1 : 0 })
        .then((rt) => {
          if (rt.code == 200) {
            this.$notify({
              title: "提示",
              message: "切换成功",
              type: "success",
              duration: 1500,
            });
            // this.fetchData()
            // this.listLoading = false
          } else {
            this.fetchData();
          }
        })
        .catch((err) => {
          this.fetchData();
          this.listLoading = false;
          this.$message({
            type: "error",
            message: err,
          });
        });
      //
    },
    getVipLabelList() {
      getVipList().then((rt) => {
        if (rt.code == 200) {
          this.vipList = rt.data;
        }
      });
    },
    getLableListByType(type) {
      getTypeList(type).then((rt) => {
        if (rt.code == 200) {
          if (type == 1) {
            this.zqList = rt.data;
          } else {
            this.giftList = rt.data;
          }
        }
      });
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      getList(this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            item.status = item.status == 1;
            return item;
          });
          this.listLoading = false;
        })
        .catch((err) => {
          this.list = null;
          this.listLoading = false;
          this.$message.error(err);
        });
    },
    getSelectList() {
      this.getVipLabelList();
      this.getLableListByType(0);
      this.getLableListByType(1);
    },
    // 显示创建弹出窗
    showCreateDialogClick() {
      this.getSelectList();
      this.resetCreateModel();
      this.dialogCreateVisible = true;
      this.dialogStatus = "create";
    },

    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      this.resetCreateModel();
      this.getSelectList();
      this.dialogCreateVisible = true;
      this.dialogStatus = "update";
      let info = Object.assign({}, row);
      let {
        gifts = [],
        gname,
        rechargeAmount,
        totalValue,
        id,
        tag,
        status,
      } = info;
      let params = { gname, rechargeAmount, totalValue, id, tag, status };
      gifts.forEach((item) => {
        let type = item.type;
        if (type == 1) {
          params.type1 = item.gid * 1;
          params.value1 = item.giftNum;
        } else if (type == 2) {
          params.type2 = item.gid * 1;
          params.value2 = item.giftNum;
        } else if (type == 3) {
          params.type3 = item.gid * 1;
          params.value3 = item.giftNum;
        } else if (type == 4) params.value4 = item.giftNum;
      });
      this.createModel = params;
    },
    checkStatus() {
      let txt = this.status == 1 ? '关闭' : '开启'
      let status = this.status == 1 ? 0 : 1
      this.$confirm(`确认${txt}活动？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          swift({ status })
            .then(rt => {
              if (rt.code == 200) {
                this.$notify({
                  title: "提示",
                  message: txt + "成功",
                  type: "success",
                  duration: 1500,
                })
                this.status = status
              } else {
                this.$message.error(rt.msg || '操作失败')
              }
            })

        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消了该操作",
          });
        });

    },
    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error("参数错误");
        return;
      }
      this.$confirm("是否删除该条数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          // 请求网络
          delData({ id: row.id })
            .then((rt) => {
              if (rt.code == 200) {
                this.$notify({
                  title: "提示",
                  message: "删除成功",
                  type: "success",
                  duration: 1500,
                });
                this.fetchData();
              }
            })
            .catch((err) => {
              this.$message({
                type: "error",
                message: err,
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消了该操作",
          });
        });
    },
    verify() {
      let msg = "";
      let {
        id,
        gname,
        rechargeAmount,
        tag,
        type1,
        value1,
        type2,
        value2,
        type3,
        value3,
        value4,
        totalValue,
        status,
      } = this.createModel;
      if (!gname) {
        msg = "请输入档位名称";
      } else if (!rechargeAmount || isNaN(rechargeAmount * 1)) {
        msg = "请输入正确档位充值金额";
      } else if (
        !type1 &&
        !type2 &&
        !type3 &&
        !value4 &&
        !value1 &&
        !value2 &&
        !value3
      ) {
        msg = "请填写礼包内容";
      } else if (value1 && !type1) {
        msg = "请选择贵族等级";
      } else if (value2 && !type2) {
        msg = "请选择坐骑";
      } else if (value3 && !type3) {
        msg = "请选择礼物";
      } else if (type1 && (!value1 || isNaN(value1 * 1))) {
        msg = "请填写正确的贵族体验天数";
      } else if (type2 && (!value2 || isNaN(value2 * 1))) {
        msg = "请填写正确的坐骑体验天数";
      } else if (type3 && (!value3 || isNaN(value3 * 1))) {
        msg = "请填写正确的礼物个数";
      } else if (value4 && isNaN(value4 * 1)) {
        msg = "请填写正确的经验值";
      } else if (!totalValue || isNaN(totalValue * 1)) {
        msg = "请填写正确的总价值金额";
      }
      if (msg) {
        this.$message.error(msg);
        return false;
      }
      let params = {
        gname,
        rechargeAmount,
        tag,
        totalValue,
        gifts: [],
      };
      if (type1 && value1)
        params.gifts.push({ type: 1, gid: type1, giftNum: value1 });
      if (type2 && value2)
        params.gifts.push({ type: 2, gid: type2, giftNum: value2 });
      if (type3 && value3)
        params.gifts.push({ type: 3, gid: type3, giftNum: value3 });
      if (value4) params.gifts.push({ type: 4, giftNum: value4 });
      if (id) {
        params.id = id;
        params.status = status ? 1 : 0;
      }
      return params;
    },
    // 创建/更新 数据
    handleDataClick() {
      let info = this.verify();
      if (!info) return;
      let methods = info.id ? edit : add;
      methods(info)
        .then((item) => {
          if (item.code === 200) {
            this.dialogCreateVisible = false;
            this.resetCreateModel();
            this.type = 1;
            this.fetchData();
            this.$notify({
              title: "提示",
              message: info.id ? "编辑成功" : "新增成功",
              type: "success",
              duration: 1500,
            });
          }
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: err,
          });
        });
    },

    // 过滤
    handleSearchFilter() {
      this.fetchData();
    },
  },
};
</script>
<style>
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
