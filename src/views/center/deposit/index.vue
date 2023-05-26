<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item> -->
      <!-- <el-tag type="primary">日期:</el-tag> -->
      <!-- <el-date-picker -->
          <!-- v-model="listQuery.pickerValue"
          size="small"
          clearable
          type="datetimerange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          @change="handleSearchFilter"
        /> -->
      <!-- </el-form-item> -->
      <el-form-item>
        <el-input v-model="listQuery.title" size="small" class="input-with-select" placeholder="请输入活动名称" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.state" size="small" placeholder="请选择状态" clearable @change="handleSearchFilter">
          <el-option label="关闭" :value="0" />
          <el-option label="开启" :value="1" />
          <el-option label="过期" :value="-1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
        <!-- 重置 -->
        <el-button size="small" icon="el-icon-refresh" @click="resets">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">
          添加</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" size="mini" fit highlight-current-row>
      <el-table-column type="index" label="序号" width="60" />
      <!-- <el-table-column prop="pic" label="封面图" min-width="220"  >
        <template slot-scope="{ row }">
          <img :src="row.pic" alt="" style="width: 200px; height: 100px" />
        </template>
      </el-table-column> -->
      <el-table-column prop="title" label="活动名称" min-width="100" />
      <!-- <el-table-column
        prop="month"
        label="充值金额"
        min-width="100"
         
        sortable
      /> -->
      <!-- <el-table-column
        prop="participateSize"
        label="单次领取优惠金额"
        min-width="140"
         
        sortable
      /> -->
      <el-table-column prop="receiveNum" label="领取次数" min-width="100" sortable />
      <el-table-column prop="startTime" label="开始时间" min-width="130">
        <template slot-scope="{ row }">
          {{ dateToSrting(row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" min-width="130">
        <template slot-scope="{ row }">
          {{ dateToSrting(row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" min-width="80">
        <template slot-scope="{ row }">
          <div>
            {{ row.state == 0 ? "关闭" : row.state == 1 ? "开启" : "过期" }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="添加时间" min-width="140">
        <template slot-scope="{ row }">
          {{ dateToSrting(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTimeString" :label="'操作'" width="80">
        <template slot-scope="{ row }">
          <el-dropdown trigger="hover">
            <span class="el-dropdown-link">
              <span class="operation_btn" type="primary" size="mini">
                操作
              </span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="closeClick(row, 1)">详情</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="closeClick(row, 2)">编辑</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="detailsClick(row)">领取详情</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="deleteClick(row, 0)" v-if="row.state == 1">
                  禁用
                </div>
                <div @click="deleteClick(row, 1)" v-if="row.state == 0">
                  启用
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
      :destroy-on-close="true" top="2vh" width="950px">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :inline="true" :model="createModel" label-position="top" label-width="100px" size="medium"
          style="display: flex; flex-direction: column; align-items: flex-start">
          <!-- <el-form-item label="封面图">
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :http-request="(params) => uploadImgRequest(params)"
              :disabled="createModel.disabled == true ? true : false"
            >
              <img
                v-if="createModel.pic"
                :src="createModel.pic"
                class="avatar"
                style="width: 200px; height: 100px"
              />
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
                style="width: 200px; height: 100px"
              />
            </el-upload>
          </el-form-item> -->
          <el-form-item label="活动名称">
            <el-input style="width: 750px" v-model="createModel.title" placeholder="请输入活动名称" clearable
              :disabled="createModel.disabled == true ? true : false" />
          </el-form-item>
          <el-form-item label="活动时间">
            <el-date-picker style="width: 750px" v-model="createModel.pickerValue" type="datetimerange"
              range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']" value-format="timestamp"
              :disabled="createModel.disabled == true ? true : false">
            </el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="活动链接">
            <el-input
              style="width: 750px"
              v-model="createModel.title"
              placeholder="请输入活动链接"
              clearable
              :disabled="createModel.disabled == true ? true : false"
            />
          </el-form-item> -->
          <!-- 充值金额 -->
          <el-form-item label="充值金额">
            <div v-for="item in createModel.activityGiftConditionsReqs" :key="item.id"
              style="display: flex; align-items: center; margin-bottom: 5px">
              <div>
                <el-input style="width: 150px" v-model="item.payAmount" placeholder="请输入金额"
                  @change="(e) => changeD(e, item)" clearable :disabled="createModel.disabled == true ? true : false" />
              </div>
              <div style="display: flex; align-items: center; white-space: nowrap">
                <div style="margin: 0 10px; font-weight: 600; color: #606266">
                  单次优惠金额
                </div>
                <el-input style="width: 150px" v-model="item.discountAmount" placeholder="请输入金额" clearable
                  :disabled="createModel.disabled == true ? true : false" />
              </div>
              <div style="display: flex; align-items: center; white-space: nowrap">
                <div style="margin: 0 10px; font-weight: 600; color: #606266">
                  领取流水
                </div>
                <el-input style="width: 150px" v-model="item.cashFlow" placeholder="请输入领取流水" clearable
                  :disabled="createModel.disabled == true ? true : false" />
              </div>
              <!-- type="primary" icon="el-icon-plus" size="mini" -->
              <div class="adds" style="margin-left: 10px" @click="createModel.disabled != true && adds()"></div>
              <!-- 减 -->
              <div class="subtract" v-if="createModel.activityGiftConditionsReqs.length > 1" style="margin-left: 10px"
                @click="createModel.disabled != true && reduce(item)"></div>
            </div>
          </el-form-item>
          <el-form-item label="领取次数">
            <el-input style="width: 750px" v-model="createModel.receiveNum" placeholder="请输入领取次数" clearable
              :disabled="createModel.disabled == true ? true : false" />
          </el-form-item>
          <el-form-item label="红利倍数">
            <el-input style="width: 750px" v-model="createModel.flowFultiple" placeholder="请输入活动彩金提现倍数" clearable
              :disabled="createModel.disabled == true ? true : false" />
          </el-form-item>
          <el-form-item label="活动内容">
            <el-input type="textarea" style="width: 750px" v-model="createModel.descriptions1" placeholder="请输入活动内容"
              clearable :rows="4" :disabled="createModel.disabled == true ? true : false" />
            <div style="color: red; font-size: 12px">
              输入文案请按Enter换行处理
            </div>
          </el-form-item>
          <el-form-item label="提款要求">
            <el-input type="textarea" style="width: 750px" v-model="createModel.descriptions2" placeholder="请输入提款要求"
              clearable :rows="4" :disabled="createModel.disabled == true ? true : false" />
            <div style="color: red; font-size: 12px">
              输入文案请按Enter换行处理
            </div>
          </el-form-item>
          <el-form-item label="满足条件">
            <el-input type="textarea" style="width: 750px" v-model="createModel.descriptions3" placeholder="请输入满足条件"
              clearable :rows="4" :disabled="createModel.disabled == true ? true : false" />
            <div style="color: red; font-size: 12px">
              输入文案请按Enter换行处理
            </div>
          </el-form-item>
          <el-form-item label="活动规则">
            <el-input type="textarea" :rows="4" style="width: 750px" v-model="createModel.activityRules"
              placeholder="请输入活动规则" clearable :disabled="createModel.disabled == true ? true : false" />
            <div style="color: red; font-size: 12px">
              输入文案请按Enter换行处理
            </div>
          </el-form-item>

          <el-form-item label="活动状态">
            <!-- <el-input
              style="width: 750px"
              v-model="createModel.anchorId"
              placeholder="请输入领取次数"
              clearable
              :disabled="createModel.disabled == true ? true : false"
            /> -->
            <el-radio-group v-model="createModel.state" :disabled="createModel.disabled == true ? true : false">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 中奖名单 -->
    <el-dialog title="领取详情" :visible.sync="dialogCreateVisible2" :close-on-click-modal="false" :destroy-on-close="true"
      top="2vh" width="70%">
      <div v-cloading="dialogCreateLoading2" style="width: 100%; height: 100%">
        <el-form :inline="true">
          <el-form-item>
            <el-tag type="info">用户ID:</el-tag>
            <el-input v-model="listQuery2.uid" size="small" class="input-with-select" placeholder="请输入用户ID" clearable
              @keyup.enter.native="handleSearchFilter2" @clear="handleSearchFilter2" />
          </el-form-item>
          <el-form-item>
            <el-tag type="info">用户昵称</el-tag>
            <el-input v-model="listQuery2.nickname" size="small" class="input-with-select" placeholder="请输入用户昵称" clearable
              @keyup.enter.native="handleSearchFilter2" @clear="handleSearchFilter2" />
          </el-form-item>
          <el-form-item>
            <el-tag type="info">存款单号</el-tag>
            <el-input v-model="listQuery2.depositNo" size="small" class="input-with-select" placeholder="请输入存款单号"
              clearable @keyup.enter.native="handleSearchFilter2" @clear="handleSearchFilter2" />
          </el-form-item>

          <el-form-item>
            <el-tag type="info">日期</el-tag>
            <el-date-picker v-model="listQuery2.pickerValue" size="small" clearable type="datetimerange"
              range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期" align="right" format="yyyy-MM-dd HH:mm"
              :default-time="['00:00:00', '23:59:59']" value-format="timestamp" @change="handleSearchFilter2" />
          </el-form-item>
          <el-form-item>
            <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter2" />
            <!-- 重置 -->
            <el-button size="small" icon="el-icon-refresh" @click="resets2" />
          </el-form-item>
        </el-form>
        <el-table v-cloading="listLoading2" :data="list2" size="mini" fit highlight-current-row>
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="uid" label="用户ID" min-width="100" />
          <el-table-column prop="nickname" label="用户昵称" min-width="100" />
          <el-table-column prop="depositNo" label="存款单号" min-width="100" sortable />
          <el-table-column prop="depositAmt" label="存款金额" min-width="100" sortable />
          <el-table-column prop="finalDiscountAmount" label="已领优惠" min-width="100" sortable />
          <el-table-column prop="discountAmount" label="申请金额" min-width="100" sortable />
          <el-table-column prop="cashFlow" label="需要流水" min-width="100" sortable />
          <el-table-column prop="gameAllTatement" label="已有流水" min-width="100" sortable />
          <el-table-column prop="createTime" label="领取时间" min-width="100">
            <template slot-scope="{ row }">
              {{ dateToSrting(row.createTime) }}
            </template>
          </el-table-column>
          <!-- <el-table-column :label="'操作'"   width="120">
            <template slot-scope="{ row }">
              <el-button
                v-if="row.status == 0"
                plain
                type="success"
                size="mini"
                @click="deleteClick2(row)"
                >{{ "奖励发放" }}</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible2 = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick2()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  giftList,
  giftSaveActivity,
  giftUpdateActivity,
  giftUpdateState,
  giftDetail,
  giftGetParticipateDetail,
} from "@/api/center/deposit/deposit";
import {
  emptyS,
  nullS,
  beforeUploadImage,
  uploadFile,
  formatUnixTime,
  getDateTime
} from "@/utils/tools";
// const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: "centerDepositIndex",
  data() {
    return {
      list: [],
      list2: [],
      listLoading: true,
      listLoading2: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        pickerValue: [],
      },
      listQuery2: {
        id: "",
        uid: "",
        pickerValue: [],
      },
      // 弹窗数值
      // 弹窗数值

      dialogCreateVisible: false,
      dialogCreateLoading: false,

      dialogCreateLoading2: false,
      dialogCreateVisible2: false,

      activityGiftConditionsReqsD: [],

      dialogStatus: "",
      dialogTitleMap: {
        create: "新增",
        update: "编辑",
        details: "详情",
      },
      // 表单模型
      createModel: {
        id: 0,
        pic: "",
        title: "",
        pickerValue: [],
        startTime: "",
        endTime: "",
        activityGiftConditionsReqs: [
          {
            id: 1,
            payAmount: "",
            discountAmount: "",
            cashFlow: "",
          },
        ],
        receiveNum: "",
        flowFultiple: "",
        descriptions: "",
        descriptions1: "",
        descriptions2: "",
        descriptions3: "",
        activityRules: "",
        checkList: false,
        checkList2: false,
        isAdd: 0,
      },
      // 重新设置表单数据
      resetCreateModel() {
        this.createModel = {
          id: 0,
          pic: "",
          title: "",
          pickerValue: [],
          startTime: "",
          endTime: "",
          activityGiftConditionsReqs: [
            {
              id: 1,
              payAmount: "",
              discountAmount: "",
              cashFlow: "",
            },
          ],
          receiveNum: "",
          flowFultiple: "",
          descriptions: "",
          descriptions1: "",
          descriptions2: "",
          descriptions3: "",
          activityRules: "",
          checkList: false,
          checkList2: false,
          isAdd: 0,
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
    this.fetchData();
  },
  methods: {
    dateToSrting(da) {
      return formatUnixTime(da);
      // let str = "";
      // if (da != undefined) {
      //   let date = new Date(da.toString().length == 10 ? da * 1000 : da);
      //   let y = date.getFullYear();
      //   let m = date.getMonth() + 1;
      //   let d = date.getDate();
      //   let h = date.getHours();
      //   let min = date.getMinutes();
      //   let s = date.getSeconds();
      //   y = y < 10 ? "0" + y : y;
      //   m = m < 10 ? "0" + m : m;
      //   d = d < 10 ? "0" + d : d;
      //   h = h < 10 ? "0" + h : h;
      //   min = min < 10 ? "0" + min : min;
      //   s = s < 10 ? "0" + s : s;
      //   str = `${y}-${m}-${d}  ${h}:${min}:${s}`;
      // }
      // return str;
    },
    // 添加提示语
    changeD(e, item) {
      //   console.log("这是", e, item);
      let tr = false;
      let data = JSON.stringify(this.createModel.activityGiftConditionsReqs);
      let data2 = JSON.parse(data);
      data2.forEach((value) => {
        if (value.id != item.id) {
          //   console.log("多少数据", value, value.id, item.id);
          if (value.payAmount == e) {
            tr = true;
          }
        }
      });
      if (tr) {
        this.createModel.payAmountLimit = true;
        this.$message({
          message: "充值金额输入框不能输入重复数据",
          type: "warning",
        });
      } else {
        this.createModel.payAmountLimit = false;
      }
    },
    //
    // checkLists(e) {
    //   console.log(e);
    //   // this.createModel.checkList = e;
    //   // this.createModel.checkList2 = false;
    //   // console.log("这是什么1", this.createModel);
    // },
    // checkList2s(e) {
    //   console.log(e);
    //   // this.createModel.checkList = false;
    //   // this.createModel.checkList2 = e;
    //   // console.log("这是什么12", this.createModel);
    // },
    // 名称加
    adds() {
      this.createModel.activityGiftConditionsReqs = [
        ...this.createModel.activityGiftConditionsReqs,
        {
          id: this.createModel.activityGiftConditionsReqs.length + 1,
          payAmount: "",
          discountAmount: "",
          cashFlow: "",
        },
      ];
      this.createModel.isAdd = 1;
    },
    // 减
    reduce(d) {
      let data = [...this.createModel.activityGiftConditionsReqs];
      data.forEach((value, index, array) => {
        if (value.id == d.id) {
          data.splice(index, 1);
        }
        this.createModel.activityGiftConditionsReqs = data;
        this.createModel.payAmountLimit = false;
      });
    },
    // 重置
    resets() {
      this.reloadData();
      this.resetCreateModel();
    },
    // 重置2
    resets2() {
      this.listQuery2.uid = "";
      this.fetchData2();
    },

    // 上传图片
    beforeImgUpload(file) {
      console.log("-----------上传之前------------");
      const { can, msg } = beforeUploadImage(file.type, file.size);
      if (!can) {
        this.$message.error(msg);
      } else {
        this.dialogCreateLoading = true;
      }
      return can;
    },
    uploadImgRequest(option) {
      console.log("-----------自定义上传方法------------");
      this.$store
        .dispatch("oss/getOSSInfos")
        .then((res) => {
          return uploadFile(
            res,
            'assets',
            option.file.name,
            option.file
          );
        })
        .then((url) => {
          console.log("这是什么数据123213213", url);
          this.createModel.pic = url;
          // this.$set(this.createModel, content, url);
          this.dialogCreateLoading = false;
        })
        .catch((err) => {
          console.error("oss失败" + JSON.stringify(err));
          this.dialogCreateLoading = false;
          this.$message.error("上传失败，请重试");
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
      if (this.createModel.disabled) {
        this.dialogCreateLoading = false;
        this.dialogCreateVisible = false;
      } else {
        var datas = true;
        let data2 = JSON.stringify(this.createModel);
        // const createModelDemo = Object.assign({}, this.createModel);
        const createModelDemo = JSON.parse(data2);
        const {
          checkList,
          checkList2,
          activityGiftConditionsReqs,
          pickerValue,
        } = createModelDemo;

        // 信息必填限制
        if (datas) {
          if (
            createModelDemo.title == null ||
            createModelDemo.title == undefined ||
            createModelDemo.title.toString().length == 0
          ) {
            datas = false;
            this.$message({
              message: "请填写活动名称",
              type: "warning",
            });
          }
        }
        if (datas) {
          if (
            pickerValue == null ||
            pickerValue[0] == undefined ||
            pickerValue[0].toString().length == 0
          ) {
            datas = false;
            this.$message({
              message: "请选择活动时间",
              type: "warning",
            });
          }
        }
        // 充值金额完整限制
        if (datas) {
          activityGiftConditionsReqs.forEach((value, index, array) => {
            if (
              value.cashFlow.toString().length == 0 ||
              value.discountAmount.toString().length == 0 ||
              value.payAmount.toString().length == 0
            ) {
              datas = false;
              this.$message({
                message: "请把金额条件填写完整",
                type: "warning",
              });
            }
          });
        }
        // 限制不能输入一样的金额
        if (datas) {
          if (this.createModel.payAmountLimit) {
            datas = false;
            this.$message({
              message: "充值金额输入框不能输入重复数据",
              type: "warning",
            });
          }
        }
        //   领取次数
        if (datas) {
          if (
            createModelDemo.receiveNum == null ||
            createModelDemo.receiveNum == undefined ||
            createModelDemo.receiveNum.toString().length == 0
          ) {
            datas = false;
            this.$message({
              message: "请填写领取次数",
              type: "warning",
            });
          }
        }
        //   红利倍数
        if (datas) {
          if (
            createModelDemo.flowFultiple == null ||
            createModelDemo.flowFultiple == undefined ||
            createModelDemo.flowFultiple.toString().length == 0
          ) {
            datas = false;
            this.$message({
              message: "请填写红利倍数",
              type: "warning",
            });
          }
        }
        //   活动说明
        if (datas) {
          if (
            createModelDemo.descriptions1 == null ||
            createModelDemo.descriptions1 == undefined ||
            createModelDemo.descriptions1.toString().length == 0
          ) {
            datas = false;
            this.$message({
              message: "请填写活动说明-活动内容信息",
              type: "warning",
            });
          }
        }
        if (datas) {
          if (
            createModelDemo.descriptions2 == null ||
            createModelDemo.descriptions2 == undefined ||
            createModelDemo.descriptions2.toString().length == 0
          ) {
            datas = false;
            this.$message({
              message: "请填写活动说明-提款要求信息",
              type: "warning",
            });
          }
        }
        if (datas) {
          if (
            createModelDemo.descriptions3 == null ||
            createModelDemo.descriptions3 == undefined ||
            createModelDemo.descriptions3.toString().length == 0
          ) {
            datas = false;
            this.$message({
              message: "请填写活动说明-满足条件信息",
              type: "warning",
            });
          }
        }
        //   活动规则
        if (datas) {
          if (
            createModelDemo.activityRules == null ||
            createModelDemo.activityRules == undefined ||
            createModelDemo.activityRules.toString().length == 0
          ) {
            datas = false;
            this.$message({
              message: "请填写活动规则",
              type: "warning",
            });
          }
        }
        //   活动状态
        if (datas) {
          if (
            createModelDemo.state == null ||
            createModelDemo.state == undefined ||
            createModelDemo.state.toString().length == 0
          ) {
            datas = false;
            this.$message({
              message: "请填写活动状态",
              type: "warning",
            });
          }
        }
        // 判断是否通过
        if (datas) {
          //   this.dialogCreateLoading = true;
          const params = {
            title: createModelDemo.title,
            startTime:
              pickerValue !== null && pickerValue[0] !== undefined
                ? pickerValue[0]
                : null,
            endTime:
              pickerValue !== null && pickerValue[1] !== undefined
                ? pickerValue[1]
                : null,
            activityGiftConditionsReqs: activityGiftConditionsReqs,
            flowFultiple:
              createModelDemo.flowFultiple.toString().length > 0
                ? createModelDemo.flowFultiple
                : null,
            descriptions: `${createModelDemo.descriptions1}||${createModelDemo.descriptions2}||${createModelDemo.descriptions3}`,
            receiveNum:
              createModelDemo.receiveNum.toString().length > 0
                ? createModelDemo.receiveNum
                : null,
            state: createModelDemo.state,
            activityRules: createModelDemo.activityRules,
          };
          //   console.log("这是多少数据2", this.createModel, params);
          // 请求服务器  新增
          if (this.dialogStatus === "create") {
            console.log("新增", params);

            giftSaveActivity(params)
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "新增成功",
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
            let data = {
              ...createModelDemo,
              startTime:
                pickerValue !== null && pickerValue[0] !== undefined
                  ? pickerValue[0]
                  : null,
              endTime:
                pickerValue !== null && pickerValue[1] !== undefined
                  ? pickerValue[1]
                  : null,
              descriptions: `${createModelDemo.descriptions1}||${createModelDemo.descriptions2}||${createModelDemo.descriptions3}`,
            };
            let a = false;
            // ids集合
            let delConditionsIds = [];
            // console.log(
            //   "新数据",
            //   data.activityGiftConditionsReqs,
            //   "旧数据",
            //   this.activityGiftConditionsReqsD
            // );
            this.activityGiftConditionsReqsD.forEach((value, index, array) => {
              // 判断ids数据是否相同
              if (
                JSON.stringify(data.activityGiftConditionsReqs) !=
                JSON.stringify(this.activityGiftConditionsReqsD)
              ) {
                console.log(
                  JSON.stringify(data.activityGiftConditionsReqs).indexOf(
                    `"ids":${value.ids}`
                  )
                );
                if (
                  JSON.stringify(data.activityGiftConditionsReqs).indexOf(
                    `"ids":${value.ids}`
                  ) == -1
                ) {
                  delConditionsIds.push(value.ids);
                  a = true;
                }
              }
              // 判断cashFlow数据是否相同
              if (
                JSON.stringify(data.activityGiftConditionsReqs) !=
                JSON.stringify(this.activityGiftConditionsReqsD)
              ) {
                console.log(
                  JSON.stringify(data.activityGiftConditionsReqs).indexOf(
                    `"cashFlow":${value.cashFlow}`
                  )
                );
                if (
                  JSON.stringify(data.activityGiftConditionsReqs).indexOf(
                    `"cashFlow":${value.cashFlow}`
                  ) == -1
                ) {
                  delConditionsIds.push(value.ids);
                  a = true;
                }
              }

              // 判断discountAmount数据是否相同
              if (
                JSON.stringify(data.activityGiftConditionsReqs) !=
                JSON.stringify(this.activityGiftConditionsReqsD)
              ) {
                console.log(
                  JSON.stringify(data.activityGiftConditionsReqs).indexOf(
                    `"discountAmount":${value.discountAmount}`
                  )
                );
                if (
                  JSON.stringify(data.activityGiftConditionsReqs).indexOf(
                    `"discountAmount":${value.discountAmount}`
                  ) == -1
                ) {
                  delConditionsIds.push(value.ids);
                  a = true;
                }
              }
              // 判断内容数据是否相同
              if (
                JSON.stringify(data.activityGiftConditionsReqs) !=
                JSON.stringify(this.activityGiftConditionsReqsD)
              ) {
                console.log(
                  JSON.stringify(data.activityGiftConditionsReqs).indexOf(
                    `"payAmount":${value.payAmount}`
                  )
                );
                if (
                  JSON.stringify(data.activityGiftConditionsReqs).indexOf(
                    `"payAmount":${value.payAmount}`
                  ) == -1
                ) {
                  delConditionsIds.push(value.ids);
                  a = true;
                }
              }
            });
            // console.log("ids", data, delConditionsIds);
            let c = new Set(delConditionsIds);
            // console.log("这是多少", c);
            let idsD = "";
            for (const item of c) {
              idsD += `${item},`;
            }
            let delConditionsId = idsD.substring(0, idsD.lastIndexOf(","));
            // console.log("asdad", idsD, delConditionsId);

            console.log("编辑数据", {
              ...createModelDemo,
              startTime:
                pickerValue !== null && pickerValue[0] !== undefined
                  ? pickerValue[0]
                  : null,
              endTime:
                pickerValue !== null && pickerValue[1] !== undefined
                  ? pickerValue[1]
                  : null,
              delConditionsIds: a ? delConditionsId : null,
              descriptions: `${createModelDemo.descriptions1}||${createModelDemo.descriptions2}||${createModelDemo.descriptions3}`,
              isAdd: this.createModel.isAdd,
            });

            giftUpdateActivity({
              ...createModelDemo,
              startTime:
                pickerValue !== null && pickerValue[0] !== undefined
                  ? pickerValue[0]
                  : null,
              endTime:
                pickerValue !== null && pickerValue[1] !== undefined
                  ? pickerValue[1]
                  : null,
              delConditionsIds: a ? delConditionsId : null,
              descriptions: `${createModelDemo.descriptions1}||${createModelDemo.descriptions2}||${createModelDemo.descriptions3}`,
              isAdd: this.createModel.isAdd,
            })
              .then((res) => {
                this.dialogCreateLoading = false;
                this.dialogCreateVisible = false;
                this.$notify({
                  title: "提示",
                  message: "修改成功",
                  type: "success",
                  duration: 1500,
                });
                this.fetchData();
              })
              .catch((err) => {
                this.dialogCreateLoading = false;
                this.$message.error(err);
              });
          }
        }
      }
    },
    // 确认按钮
    handleDataClick2() {
      this.dialogCreateVisible2 = false;
    },
    // 中奖明细
    detailsClick(row) {
      this.listQuery2.id = row.id;
      this.fetchData2();
      this.dialogCreateVisible2 = true;
    },
    // 刷新数据
    reloadData() {
      // 重置数据
      this.list = [];
      this.listLoading = true;
      this.listQuery = {
        pageSize: 20,
        pageNum: 1,
        pickerValue: this.initTimer,
      };
      setTimeout(() => {
        this.fetchData();
      }, 80);
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      // 请求服务器
      giftList(this.listQuery)
        .then((res) => {
          console.log("这是多少", res);
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
    // 获取列表数据
    fetchData2() {
      this.listLoading2 = true;
      // 请求服务器
      giftGetParticipateDetail(this.listQuery2)
        .then((res) => {
          console.log(res);
          this.list2 = res.data.list || [];
          this.listLoading2 = false;
        })
        .catch((err) => {
          this.list2 = null;
          this.listLoading2 = false;
          this.$message.error(err);
        });
    },
    // 禁用/启用
    deleteClick(row, d) {
      this.listLoading = true;
      giftUpdateState({ ...row, state: d })
        .then((res) => {
          this.listLoading = false;
          this.$notify({
            title: "提示",
            message: `${d == 0 ? "禁用成功" : "启用成功"}`,
            type: "success",
            duration: 1500,
          });
          this.fetchData();
        })
        .catch((err) => {
          this.listLoading = false;
          this.$message.error(err);
        });
    },
    // 查询详细接口
    rouletteDetails(d, i) {
      giftDetail(d.id).then((item) => {
        let descriptionsD = d.descriptions.split("||");
        let datas = {
          ...d,
          pickerValue: [d.startTime, d.endTime],
          activityGiftConditionsReqs: item.data.list,
          descriptions1:
            descriptionsD[0] != undefined ? descriptionsD[0] : null,
          descriptions2:
            descriptionsD[0] != undefined && descriptionsD[1] != undefined
              ? descriptionsD[1]
              : null,
          descriptions3:
            descriptionsD[0] != undefined && descriptionsD[2] != undefined
              ? descriptionsD[2]
              : null,
          disabled: i == 1 ? true : false,
          isAdd: 0,
        };
        datas.activityGiftConditionsReqs.forEach((value_2, index_2) => {
          value_2.id = index_2;
        });
        console.log("详细数据", item.data.list, d, datas, descriptionsD);
        // let data = Object.assign({}, item.data);
        // if (
        //   data.totalEpositAmt !== null &&
        //   data.totalEpositAmt !== undefined &&
        //   data.totalEpositAmt.toString().length > 0
        // ) {
        //   data.checkList = true;
        // }
        // if (
        //   data.monthEpositAmt !== null &&
        //   data.monthEpositAmt !== undefined &&
        //   data.monthEpositAmt.toString().length > 0
        // ) {
        //   data.checkList2 = true;
        // }
        // // 编辑没有设定中奖数据添加空项
        // if (
        //   data.winnersReqs[0] == undefined ||
        //   data.winnersReqs[0].uid == undefined
        // ) {
        //   data.winnersReqs = [{ id: "1", typeName: "", uid: "" }];
        // }
        // // 判断是设定中奖是否有数据，有数据只能看不能编辑
        // data.winnersReqs.forEach((value, index) => {
        //   if (value.uid != undefined && value.uid.toString().length > 0) {
        //     value.disabled = true;
        //   } else {
        //     value.disabled = false;
        //   }
        // });
        // // 所有的概率展示乘以100
        // data.activityGiftConditionsReqs.forEach((value, index, array) => {
        //   value.rate = Number(value.rate) * 100;
        // });
        // // 判断当前时间是否大于开始时间进行限制
        // if (new Date().getTime() > data.startTime) {
        //   console.log("大于");
        //   data.disabled = true;
        //   data.activityGiftConditionsReqs.forEach((value, index, array) => {
        //     value.disabled = true;
        //   });
        // } else {
        //   data.disabled = false;
        //   data.activityGiftConditionsReqs.forEach((value, index, array) => {
        //     value.disabled = false;
        //   });
        // }
        let a = JSON.stringify(item.data.list);
        let b = JSON.parse(a);
        this.activityGiftConditionsReqsD = b;
        this.dialogCreateVisible = true;
        if (i == 1) {
          this.dialogStatus = "details";
        } else {
          this.dialogStatus = "update";
        }

        this.createModel = datas;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      });
    },
    // 编辑
    closeClick(row, i) {
      this.resetCreateModel();
      console.log("这是", row, i);
      this.rouletteDetails(row, i);

      // this.$confirm("是否确认关闭该活动？", "提示", {
      //   confirmButtonText: "确认",
      //   cancelButtonText: "取消",
      //   type: "warning",
      //   showClose: false,
      // })
      //   .then(() => {
      //     // 请求网络
      //     this.listLoading = true;
      //     updateActivityStatus({ id: row.id, status: 0 })
      //       .then((res) => {
      //         this.listLoading = false;
      //         this.$notify({
      //           title: "提示",
      //           message: "关闭活动成功",
      //           type: "success",
      //           duration: 1500,
      //         });
      //         setTimeout((_) => {
      //           this.fetchData();
      //         }, 200);
      //       })
      //       .catch((err) => {
      //         this.listLoading = false;
      //         this.$message.error(err);
      //       });
      //   })
      //   .catch(() => {});
    },
    // 过滤
    handleSearchFilter() {
      console.log(this.listQuery);
      this.listQuery.pageNum = 1;
      setTimeout(() => { this.fetchData(); }, 80)

    },
    // 过滤2
    handleSearchFilter2() {
      setTimeout(() => { this.fetchData2(); }, 80)

    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.listQuery.pageNum = 1;
      setTimeout(() => { this.fetchData(); }, 80)
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      setTimeout(() => { this.fetchData(); }, 80)
    },
  },
};
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
  width: 260px;
  margin-right: 10px;

  /* .el-input-group__prepend {
      background-color: #fff;
    } */
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

.span_primary {
  margin-right: 10px;
  color: #fc708b;
  cursor: pointer;
}

.adds {
  width: 32px;
  height: 32px;
  background: url("../../../assets/imgs/Line/plus-square.svg") no-repeat;
  background-size: 100% 100%;

  border: none;
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

  border: none;
}

.subtract:hover {
  /* fill: #fa0; */
  filter: drop-shadow(#f90435 0 0);
}

/deep/ .el-input--suffix .el-input__inner {
  padding-right: 15px;
}
</style>
