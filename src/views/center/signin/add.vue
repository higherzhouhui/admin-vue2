<template>
  <div class="app-container" style="padding: 50px" v-cloading="loading">
    <el-form
      ref="activityForm"
      :model="activity"
      :rules="rules"
      label-width="160px"
    >
      <div class="goback" @click="goBack">
        <span class="el-icon-arrow-left"></span> 返回
      </div>
      <el-descriptions style="margin: 0px 0" title="基础设置"></el-descriptions>
      <el-form-item label="活动标题" prop="title">
        <el-input
          v-model="activity.title"
          placeholder="请输入活动标题"
          :disabled="id ? true : false"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动链接" prop="activityLink">
        <el-input
          v-model="activity.activityLink"
          placeholder="请输入活动链接"
          :disabled="id ? true : false"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动时间" prop="time">
        <!-- :picker-options="pickerOptions" -->
        <el-date-picker
          :default-time="['00:00:00', '23:59:59']"
          v-model="activity.time"
          type="datetimerange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :disabled="id ? true : false"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="参加范围" prop="joinScope">
        <el-input
          type="textarea"
          v-model="activity.joinScope"
          :rows="4"
          placeholder="请输入参加范围"
          :disabled="id ? true : false"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动说明" prop="explanation">
        <el-input
          type="textarea"
          v-model="activity.explanation"
          :rows="4"
          placeholder="请输入活动说明"
          :disabled="id ? true : false"
        ></el-input>
      </el-form-item>
      <el-descriptions style="margin: 0px 0" title="活动设置"></el-descriptions>

      <!-- <el-form-item label="补签兑换天数" prop="compensateDay">
        <el-input
          v-model="activity.compensateDay"
          placeholder="请输入补签兑换天数"
          :disabled="id ? true : false"
        ></el-input>
      </el-form-item>
      <div class="tips">
        <el-link type="danger"
          >如果补签兑换天数输入3，则表示用户需要连续签到3天，才可兑换一次补签天数</el-link
        >
      </div> -->
      <el-form-item label="签到条件" prop="demo1">
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <div>
            <el-input
              v-model="activity.betCoin"
              placeholder="请输入当日投注金额"
              type="number"
              :disabled="id ? true : false"
            >
              <template slot="suffix"> 金币 </template>
            </el-input>
          </div>
          <div>
            <el-input
              v-model="activity.rewardCoin"
              placeholder="请输入当日打赏金额"
              type="number"
              :disabled="id ? true : false"
            >
              <template slot="suffix"> 金币 </template></el-input
            >
          </div>
          <div>
            <el-input
              v-model="activity.seeLiveDuration"
              placeholder="请输入当日观看直播时长"
              type="number"
              :disabled="id ? true : false"
            >
              <template slot="suffix"> 分钟 </template></el-input
            >
          </div>
          <div>
            <el-checkbox
              v-model="activity.buyCar"
              :true-label="1"
              :false-label="0"
              :disabled="id ? true : false"
              >当日购买座驾</el-checkbox
            >
          </div>
          <div>
            <el-checkbox
              v-model="activity.buyVip"
              :true-label="1"
              :false-label="0"
              :disabled="id ? true : false"
              >当日购买vip</el-checkbox
            >
          </div>
        </div>
      </el-form-item>
      <el-form-item label="兑换规则" prop="rules">
        <el-button
          size="small"
          type="success"
          @click="addRules"
          :disabled="id ? true : false"
          >新增一行</el-button
        >
      </el-form-item>
      <el-form-item label="">
        <el-table
          :data="activity.rules"
          size="mini"
          border
          :row-style="{ height: '40px' }"
        >
          <el-table-column prop="signDay" label="签到天数" align="center">
            <template slot-scope="{ row, $index }">
              <div v-if="id">{{ row["signDay"] }}</div>
              <EditCall
                v-else
                number
                :text="row['signDay']"
                :active="0"
                :editable="callIndex === $index && callName === 'signDay'"
                @onChange="(val) => onEditCall('signDay', $index, val)"
                @onClick="onEditCallClick('signDay', $index)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="awardCoin" label="金币奖励" align="center" >
            <template slot-scope="{ row, $index }">
              <div v-if="id">{{ row["awardCoin"] }}</div>
              <EditCall
                v-else
                number
                :text="row['awardCoin']"
                :active="0"
                :editable="callIndex === $index && callName === 'awardCoin'"
                @onChange="(val) => onEditCall('awardCoin', $index, val)"
                @onClick="onEditCallClick('awardCoin', $index)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="awardCoin" label="操作" align="center">
            <template slot-scope="{ row, $index }">
              <el-button
                plain
                type="danger"
                size="mini"
                @click="onDelete(row, $index)"
                >删除</el-button
              >
            </template>
          </el-table-column>

          <!-- <el-table-column label="是否设置补签"  >
            <template slot-scope="{ row, $index }">
              <div v-if="id">
                {{ row["compensateFlag"] == 0 ? "否" : "是" }}
              </div>
              <EditCall
                v-else
                radioGroup
                :text="row['compensateFlag']"
                :active="0"
                :editable="
                  callIndex === $index && callName === 'compensateFlag'
                "
                @onChange="(val) => onEditCall('compensateFlag', $index, val)"
                @onClick="onEditCallClick('compensateFlag', $index)"
              />
            </template>
          </el-table-column>
          <el-table-column label="补签兑换天数"  >
            <template slot-scope="{ row, $index }">
              <div v-if="id">
                {{ row["compensateFlag"] == 1 ? row["compensateDay"] : "-" }}
              </div>
              <div v-else>
                <EditCall
                  number
                  v-if="row['compensateFlag'] == 1"
                  :text="row['compensateDay']"
                  :active="0"
                  :editable="
                    callIndex === $index && callName === 'compensateDay'
                  "
                  @onChange="(val) => onEditCall('compensateDay', $index, val)"
                  @onClick="onEditCallClick('compensateDay', $index)"
                />
                <div v-else>-</div>
              </div>
            </template>
          </el-table-column> -->
        </el-table>
      </el-form-item>

      <el-form-item label="任意游戏流水倍数" prop="flowMultiple">
        <el-input
          :disabled="id ? true : false"
          v-model="activity.flowMultiple"
          placeholder="请输入任意游戏流水倍数"
          type="number"
          onkeyup="value=value.replace(/[^\d]+/g,'')"
        ></el-input>
      </el-form-item>
      <div class="tips">
        <el-link type="danger"
          >打款规则（任意游戏流水总和>=提现金币数*6
          【6是值填写的任意游戏流水倍数】)</el-link
        >
      </div>
      <el-form-item label="活动状态" prop="status">
        <el-radio-group
          v-model="activity.status"
          :disabled="status == 0 ? true : false"
        >
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="status != 0" label="">
        <el-button class="btn" @click="goBack()">取 消</el-button>
        <el-button class="btn" type="primary" @click="saveClick()"
          >提 交</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  addSignIn,
  detailSignIn,
  updateStateSignIn,
} from "@/api/center/signin";
import EditCall from "@/views/center/signin/Components/EditCall";
export default {
  components: {
    EditCall,
  },
  data() {
    const validTime = (rule, value, callback) => {
      if (value) {
        let time1 = this.id ? value[0] : value[0].getTime();
        let time2 = this.id ? value[1] : value[1].getTime();
        if (time2 - time1 < 7 * 24 * 3600 * 1000) {
          callback(new Error("活动时间范围周期最少七天"));
        } else {
          callback();
        }
      }
    };
    return {
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
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() < Date.now() - 8.64e7;
      //   },
      // },
      loading: false,
      id: "", //活动id
      status: 1,
      activity: {
        activityLink: "", //活动地址
        title: "", //活动标题
        time: [],
        joinScope: "", //参加范围
        flowMultiple: 6, //请输入流水倍数
        explanation: "", //奖项活动说明
        status: 1, //0关闭 1开启
        rules: [], //活动规则
        compensateDay: undefined, //补签兑换天数
      },
      rulesModelId: 0,
      rulesModel: {
        awardCoin: 0, // 奖励金币 ,
        compensateDay: 0, //补签兑换天数 ,
        // compensateFlag: 0, //是否设置补签1-是；0-否 ,
        // signDay: 0, //签到天数
      },
      callName: null,
      callIndex: null,
      // 表单模型
      rules: {
        activityLink: [
          {
            required: true,
            message: "请输入活动链接",
            trigger: "change",
          },
          {
            pattern:
              /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
            message: "请输入正确的活动链接URL",
          },
        ],
        title: [
          {
            required: true,
            message: "请输入活动标题",
            trigger: "change",
          },
        ],
        time: [
          {
            required: true,
            message: "请选择活动时间",
            trigger: "change",
          },
          {
            validator: validTime,
            trigger: "change",
          },
        ],
        joinScope: [
          {
            required: true,
            message: "请输入参加范围",
            trigger: "change",
          },
        ],
        // compensateDay: [
        //   {
        //     required: true,
        //     message: "请输入补签兑换天数",
        //     trigger: "change",
        //   },
        // ],
        rules: [
          {
            required: true,
            message: "请添加签到活动规则",
            trigger: "change",
          },
        ],
        flowMultiple: [
          {
            required: true,
            message: "请输入流水倍数",
            trigger: "change",
          },
        ],
        explanation: [
          {
            required: true,
            message: "请输入活动说明",
            trigger: "change",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择活动状态",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getSignInDetail();
    }
  },
  methods: {
    // 活动详情
    getSignInDetail() {
      this.loading = true;
      detailSignIn(this.id)
        .then((res) => {
          this.activity = res.data;
          this.activity.time = [this.activity.startTime, this.activity.endTime];
          this.status = this.activity.status;
          this.loading = false;
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    onEditCall(name, index, val) {
      if (name == "signDay") {
        if (val > 7) {
          return this.$message({
            message: "签到天数设置不能大于7",
            type: "warning",
          });
        }
        if (
          this.activity.rules.length > 0 &&
          this.activity.rules.length - 1 > 0 &&
          this.activity.rules[this.activity.rules.length - 2].signDay
        ) {
          if (
            val <= this.activity.rules[this.activity.rules.length - 2].signDay
          ) {
            return this.$message({
              message: "签到天数请按照顺序填写",
              type: "warning",
            });
          }
        }
      }
      this.activity.rules[index][name] = val;
      this.callName = "";
      this.callIndex = "";
      this.callType = "";
    },
    onEditCallClick(name, index, type) {
      this.callName = name;
      this.callIndex = index;
      this.callType = type;
    },
    onDelete(row, index) {
      console.log(index, "index");
      this.activity.rules.splice(index, 1);
    },
    addRules() {
      let rulesModel = {
        id: this.rulesModelId++,
        ...this.rulesModel,
      };
      this.activity.rules.push(rulesModel);
    },
    // 创建活动
    saveClick() {
      this.$refs["activityForm"].validate((valid) => {
        if (valid) {
          if (this.id && this.activity.status == 1) {
            this.goBack();
            return;
          }
          if (this.id && this.activity.status == 0) {
            this.closeClick();
            return;
          }

          for (let i = 0; i < this.activity.rules.length; i++) {
            let temp = this.activity.rules[i];
            if (temp.awardCoin == 0 || temp.signDay == 0) {
              return this.$message({
                message: "签到天数和金币奖励不能为0",
                type: "warning",
              });
            }
            // if (temp.compensateFlag == 1 && temp.compensateDay == 0) {
            //   return this.$message({
            //     message: `第${i + 1}行数据设置补签，补签天数至少大于0`,
            //     type: "warning",
            //   });
            // }
          }
          this.$confirm("确认是否创建该签到活动？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            showClose: false,
          }).then(() => {
            this.activity.compensateDay = Number(this.activity.compensateDay);
            this.activity.rules = this.activity.rules.map((e) => {
              return {
                awardCoin: Number(e.awardCoin),
                signDay: Number(e.signDay),
                // compensateDay: Number(e.compensateDay),
                // compensateFlag: Number(e.compensateFlag),
              };
            });
            if (this.activity.time) {
              this.activity.startTime = Date.parse(this.activity.time[0]);
              this.activity.endTime = Date.parse(this.activity.time[1]);
            }
            delete this.activity.time;
            this.loading = true;
            console.log(this.activity, "this.activity");
            addSignIn(this.activity)
              .then((res) => {
                this.$notify({
                  title: "提示",
                  message: "创建成功",
                  type: "success",
                  duration: 1500,
                });
                this.loading = false;
                this.goBack();
              })
              .catch((err) => {
                this.$message.error(err);
                this.loading = false;
              });
          });
        }
      });
    },
    closeClick() {
      this.$confirm("是否确认关闭该活动？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        showClose: false,
      })
        .then(() => {
          this.loading = true;
          updateStateSignIn(this.id)
            .then((res) => {
              this.loading = false;
              this.$notify({
                title: "提示",
                message: "关闭活动成功",
                type: "success",
                duration: 1500,
              });
              this.goBack();
            })
            .catch((err) => {
              this.loading = false;
              this.$message.error(err);
            });
        })
        .catch(() => {});
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
<style scoped>
.btn {
  margin-top: 20px;
  min-width: 150px;
}

.prizeInfo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.prizeInfo span {
  margin-left: 20px;
}

.tips {
  margin: 15px 0 15px 160px;
}

.goback {
  cursor: pointer;
  margin-bottom: 20px;
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
</style>
