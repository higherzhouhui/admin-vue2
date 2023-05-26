<template>
  <div class="app-container" style="padding: 50px" v-cloading="loading">
    <el-form ref="activityForm" :model="activity" :rules="rules" label-width="160px">
      <div class="goback" @click="goBack">
        <span class="el-icon-arrow-left"></span> 返回
      </div>
      <el-descriptions style="margin: 0px 0" title="基础设置"></el-descriptions>
      <el-form-item label="活动标题" prop="rouletteName">
        <el-input v-model="activity.rouletteName" :disabled="true" placeholder="请输入活动标题"></el-input>
      </el-form-item>
      <el-form-item label="活动连接" prop="activityLink">
        <el-input v-model="activity.activityLink" :disabled="true" placeholder="请输入活动连接"></el-input>
      </el-form-item>
      <el-form-item label="活动时间" prop="time">
        <el-date-picker v-model="activity.time" type="datetimerange" range-separator="~" start-placeholder="开始日期"
          end-placeholder="结束日期" @input="timeChange" :disabled="status == 0 ? true : false">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动规则" prop="playMethod">
        <el-input type="textarea" v-model="activity.playMethod" :rows="4" placeholder="请输入活动规则"
          :disabled="status == 0 ? true : false"></el-input>
      </el-form-item>
      <el-descriptions style="margin: 0px 0" title="活动设置"></el-descriptions>
      <el-form-item label="奖级类型" prop="rewardType">
        <el-radio-group v-model="activity.rewardType" @change="initPrizeData()" :disabled="true">
          <el-radio :label="4">4等奖</el-radio>
          <el-radio :label="6">6等奖</el-radio>
          <el-radio :label="8">8等奖</el-radio>
          <el-radio :label="12">12等奖</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- {{ prizeData }} -->
      <el-form-item label="">
        <el-table :data="prizeData" size="mini">
          <el-table-column prop="prizeLevel" :label="$t('奖项名称')">
            <template slot-scope="{ row }">
              {{ numberToUpperCase(row.prizeLevel) }}等奖
            </template>
          </el-table-column>
          <el-table-column prop="prizeName" :label="$t('奖品内容')">
          </el-table-column>
          <el-table-column prop="level" :label="$t('奖品')" align="left">
            <template slot-scope="{ row }">
              <div class="prizeInfo">
                <el-image style="width: 50px; height: 50px" :src="row.prizeIcon" fit="fill"
                  :preview-src-list="[row.prizeIcon]"></el-image>
                <span>{{ row.prizeAmount }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="prizeCountTotal" :label="$t('奖品数量')">
          </el-table-column>
          <el-table-column prop="prizeFee" :label="$t('中奖概率(%)')">
            <template slot-scope="{ row, $index }">
              <div v-if="status == 0">
                {{ row.prizeFee }}
              </div>
              <div v-else>
                <EditCall :text="`${row['prizeFee']}`" :active="0"
                  :editable="callIndex === $index && callName === 'prizeFee'"
                  @onChange="(val) => onEditCall('prizeFee', $index, val)"
                  @onClick="onEditCallClick('prizeFee', $index)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="winCount" :label="$t('单人最多中奖次数')">
          </el-table-column>
        </el-table>
      </el-form-item>
      <div class="tips">
        <el-link type="danger">抽奖条件规则（例如填写‘5’规则为每邀请5人充值增加一次抽奖机会）</el-link>
      </div>
      <el-form-item label="邀请充值人数" prop="inviteCount">
        <el-input v-model="activity.inviteCount" :disabled="status == 0 ? true : false" type="number"
          onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
      </el-form-item>
      <el-form-item label="充值金额" prop="cash">
        <el-input type="number" v-model="activity.cash" placeholder="大于等于该设置金额有效"
          :disabled="status == 0 ? true : false"></el-input>
      </el-form-item>
      <el-form-item label="奖级轮播" prop="carouselLevel">
        <el-checkbox-group v-model="activity.carouselLevel" :disabled="status == 0 ? true : false">
          <el-checkbox v-for="(item, index) in activity.rewardType" :key="index + 1"
            :label="index + 1">{{ numberToUpperCase(index + 1) }}等奖</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="兑换说明" prop="awardMethod">
        <el-input type="textarea" v-model="activity.awardMethod" :rows="4" placeholder="请输入兑奖说明"
          :disabled="status == 0 ? true : false"></el-input>
      </el-form-item>
      <div class="tips">
        <el-link type="danger">提示：所有中奖概率之和不能超过100%</el-link>
      </div>
      <el-descriptions style="margin: 0px 0" title="虚拟数据设置"></el-descriptions>
      <el-form-item label="虚拟中奖用户">
        <el-button size="small" type="success" @click="addMock()"
          :disabled="status == 0 ? true : false">{{ $t("添加") }}</el-button>
      </el-form-item>
      <el-form-item label="">
        <el-table :data="userData" size="mini">
          <el-table-column prop="uid" :label="$t('用户ID')" />
          <el-table-column prop="nickName" :label="$t('用户昵称')" />
          <el-table-column prop="prizeLevel" :label="$t('中奖等级')">
            <template slot-scope="{ row }">
              {{ numberToUpperCase(Number(row.prizeLevel)) }}等奖
            </template>
          </el-table-column>
          <el-table-column prop="prizeName" :label="$t('奖品内容')" />
          <el-table-column prop="prizeAmount" :label="$t('奖品价格')" />
          <el-table-column :label="$t('操作')">
            <template slot-scope="{ row }">
              <el-button plain type="danger" size="mini" @click="virtualDeleteClick(row)"
                :disabled="status == 0 ? true : false">{{ $t("删除") }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="活动状态" prop="status">
        <el-radio-group v-model="activity.status" :disabled="status == 0 ? true : false">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="0">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="">
        <el-button class="btn" @click="goBack()" v-if="status == 0">{{
          $t("返回")
        }}</el-button>
        <span v-else>
          <el-button class="btn" type="info" @click="closeClick()">{{
            $t("提前结束本期")
          }}</el-button>
          <el-button class="btn" type="primary" @click="updateClick()">{{
            $t("设置完成提交")
          }}</el-button>
        </span>
      </el-form-item>
    </el-form>

    <!-- 虚拟中奖用户 -->
    <el-dialog :title="'添加虚拟中奖用户'" :visible.sync="dialogUserVisible" :close-on-click-modal="false"
      :destroy-on-close="true" width="30%">
      <div style="width: 100%; height: 100%">
        <el-form ref="virtualForm" :model="userModel" :rules="userRules" label-position="top" label-width="100px"
          size="medium">
          <el-form-item :label="$t('用户ID')" prop="uid"><el-input v-model="userModel.uid" clearable
              :placeholder="$t('请输入用户ID')" /></el-form-item>
          <el-form-item :label="$t('用户昵称')" prop="nickName"><el-input v-model="userModel.nickName" clearable
              :placeholder="$t('请输入用户昵称（16个字以内）')" /></el-form-item>
          <el-form-item :label="$t('中奖等级')" prop="prizeLevel">
            <el-select v-model="userModel.prizeLevel" placeholder="请选择中奖等级" style="width: 100%"
              @change="changePrizeLevel()">
              <el-option v-for="(item, index) in activity.rewardType" :key="index"
                :label="`${numberToUpperCase(index + 1)}等奖`" :value="index + 1">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('奖品内容')" prop="prizeName"><el-input v-model="userModel.prizeName" clearable
              :placeholder="$t('请输入奖品内容')" :disabled="true" /></el-form-item>
          <el-form-item :label="$t('奖品价格')" prop="prizeAmount"><el-input type="number" v-model="userModel.prizeAmount"
              clearable :placeholder="$t('请输入奖品价格')" :disabled="true"
              onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogUserVisible = false">{{
          $t("menu.title258")
        }}</el-button>
        <el-button size="medium" type="primary" @click="handleVirtualDataClick()">{{ $t("menu.title259") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import EditCall from '@/views/roulette/Components/EditCall'
import {
  detailActivity,
  updateActivity,
  updateActivityStatus,
  pushActivity,
} from '@/api/roulette/activity'
import { numberToUpperCase } from '@/utils/tools'
export default {
  name: '',
  filters: {},
  components: {
    EditCall,
  },
  data() {
    const validPrizeAmount = (rule, value, callback) => {
      console.log(rule, value, callback)
      if (value < 5000 || value > 1000000) {
        callback(new Error('金额输入应大于5000且小于1000000'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      id: undefined,
      status: 0, //0关闭 1开启
      activity: {
        time: [],
        carouselLevel: [],
        startTime: null,
        endTime: null,
      },
      prize: {},
      user: {},
      prizeData: [],
      callName: null,
      callIndex: null,
      // 表单模型
      rules: {
        activityLink: [
          {
            required: true,
            message: this.$t('请输入活动链接'),
            trigger: 'change',
          },
          {
            pattern:
              /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
            message: '请输入正确的url',
          },
        ],
        rouletteName: [
          {
            required: true,
            message: '请输入活动标题',
            trigger: 'change',
          },
        ],
        time: [
          {
            required: true,
            message: '请选择活动时间',
            trigger: 'change',
          },
        ],
        playMethod: [
          {
            required: true,
            message: '请输入活动规则',
            trigger: 'change',
          },
        ],
        rewardType: [
          {
            required: true,
            message: '请选择奖级类型',
            trigger: 'change',
          },
        ],
        inviteCount: [
          {
            required: true,
            message: '请输入邀请充值人数',
            trigger: 'change',
          },
        ],
        cash: [
          {
            required: true,
            message: '请输入充值金额',
            trigger: 'change',
          },
        ],
        carouselLevel: [
          {
            required: true,
            message: '请选择奖级轮播',
            trigger: 'change',
          },
        ],
        awardMethod: [
          {
            required: true,
            message: '请输入兑奖说明',
            trigger: 'change',
          },
        ],
        status: [
          {
            required: true,
            message: '请选择活动状态',
            trigger: 'change',
          },
        ],
      },
      numberToUpperCase,
      // 虚拟用户
      userModel: {
        uid: '',
        nickName: '',
        prizeLevel: '',
        prizeName: '',
        prizeAmount: '',
      },
      userData: [],
      userId: 0,
      dialogUserVisible: false,
      userRules: {
        uid: [
          {
            required: true,
            message: '请输入用户ID',
            trigger: 'change',
          },
        ],
        nickName: [
          {
            required: true,
            message: '请输入用户昵称',
            trigger: 'change',
          },
          { min: 1, max: 16, message: '最多为16个字符', trigger: 'change' },
        ],
        prizeLevel: [
          {
            required: true,
            message: '请输入中奖等级',
            trigger: 'change',
          },
        ],
        prizeName: [
          {
            required: true,
            message: '请输入奖品内容',
            trigger: 'change',
          },
        ],
        prizeAmount: [
          {
            required: true,
            message: '请输入奖品价格',
            trigger: 'change',
          },
          {
            validator: validPrizeAmount,
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.getDetailActivity()
    }
  },
  methods: {
    timeChange(data) {
      console.log(data)
      this.activity.time = data
      this.$forceUpdate()
    },
    // 根据id查询详情
    getDetailActivity() {
      this.loading = true
      detailActivity(this.id)
        .then((res) => {
          let activity = res.data.activity
          this.status = activity.status
          this.activity = activity
          this.activity.time = [
            this.$moment(activity.startTime).format('YYYY-MM-DD HH:mm:ss'),
            this.$moment(activity.endTime).format('YYYY-MM-DD HH:mm:ss'),
          ]
          let carouselLevel = activity.carouselLevel.split(',')
          this.activity.carouselLevel = carouselLevel.map((item) => {
            return +item
          })
          this.prizeData = res.data.prize
          this.userData = res.data.user
          this.loading = false
        })
        .catch((err) => {
          this.$message.error(err)
          this.loading = false
        })
    },
    changePrizeLevel() {
      let obj = this.prizeData.find((e) => {
        return e.prizeLevel == this.userModel.prizeLevel
      })
      this.userModel.prizeName = obj.prizeName
      this.userModel.prizeAmount = obj.prizeAmount
    },
    // 新增虚拟用户按钮
    addMock() {
      this.userId++
      this.userModel = {
        id: this.userId,
        uid: '',
        nickName: '',
        prizeLevel: '',
        prizeName: '',
        prizeAmount: '',
      }
      this.dialogUserVisible = true
    },
    // 新增虚拟用户
    handleVirtualDataClick() {
      this.$refs['virtualForm'].validate((valid) => {
        if (valid) {
          this.userData.push(this.userModel)
          this.dialogUserVisible = false
        }
      })
    },
    // 删除表格虚拟用户
    virtualDeleteClick(row) {
      this.$confirm('确认是否删除？', this.$t('menu.title262'), {
        confirmButtonText: this.$t('menu.title259'),
        cancelButtonText: this.$t('menu.title258'),
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          this.userData.splice(
            this.userData.findIndex((item) => item.id === row.id),
            1
          )
          this.$notify({
            title: this.$t('menu.title262'),
            message: '删除成功',
            type: 'success',
            duration: 1500,
          })
        })
        .catch(() => {})
    },
    // 取消活动
    goBack() {
      this.$router.go(-1)
    },
    // 修改活动
    updateClick() {
      this.$refs['activityForm'].validate((valid) => {
        if (valid) {
          if (this.prizeData.length > 0) {
            let prizeFeeTotal = 0
            for (let i = 0; i < this.prizeData.length; i++) {
              let temp = this.prizeData[i]
              prizeFeeTotal += +temp.prizeFee
            }
            if (prizeFeeTotal != 100) {
              return this.$message({
                message: '中奖概率之和必须等于100%',
                type: 'warning',
              })
            }
          } else {
            return this.$notify({
              title: this.$t('menu.title262'),
              message: '请添加奖品信息内容',
              type: 'warning',
              duration: 1500,
            })
          }

          this.$confirm('确认是否修改该抽奖活动？', this.$t('menu.title262'), {
            confirmButtonText: this.$t('menu.title259'),
            cancelButtonText: this.$t('menu.title258'),
            type: 'warning',
            showClose: false,
          }).then(() => {
            // 请求网络
            let {
              id,
              activityLink,
              awardMethod,
              cash,
              inviteCount,
              playMethod,
              rewardType,
              rouletteName,
              status,
            } = this.activity
            let params = {
              activity: {
                id,
                activityLink, // 活动链接
                awardMethod, //兑奖规则
                carouselLevel: this.activity.carouselLevel.join(','), // 轮播等级
                cash, // 充值金额
                inviteCount, // 邀请人数
                playMethod, //兑换说明
                rewardType, // 奖级类型 4 6 8 12
                rouletteName, // 活动名称
                status, // 活动状态 0 关闭 1 开启
                startTime: Date.parse(this.activity.time[0]),
                endTime: Date.parse(this.activity.time[1]),
              },
              prize: this.prizeData.map((e) => {
                return {
                  id: e.id,
                  prizeAmount: e.prizeAmount,
                  prizeCountTotal: e.prizeCountTotal,
                  prizeFee: e.prizeFee,
                  prizeIcon: e.prizeIcon,
                  prizeLevel: e.prizeLevel,
                  prizeName: e.prizeName,
                  winCount: e.winCount,
                }
              }),
              // 虚拟中奖人数
              user: this.userData.map((e) => {
                return {
                  id: e.id,
                  uid: e.uid,
                  createTime: e.createTime,
                  prizeLevel: e.prizeLevel,
                  rouletteName: this.activity.rouletteName,
                  nickName: e.nickName,
                  prizeName: e.prizeName,
                  prizeAmount: e.prizeAmount,
                }
              }),
            }
            updateActivity(params)
              .then((res) => {
                this.$notify({
                  title: this.$t('menu.title262'),
                  message: '活动修改成功',
                  type: 'success',
                  duration: 1500,
                })
                this.$router.go(-1)
              })
              .catch((err) => {
                this.$message.error(err)
              })
          })
        }
      })
    },
    // 提前结束
    closeClick(row) {
      this.$confirm('是否确认结束该活动？', this.$t('menu.title262'), {
        confirmButtonText: this.$t('menu.title259'),
        cancelButtonText: this.$t('menu.title258'),
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          updateActivityStatus({ id: this.id, status: 0 })
            .then((res) => {
              this.$notify({
                title: this.$t('menu.title262'),
                message: '活动结束成功',
                type: 'success',
                duration: 1500,
              })
              this.$router.go(-1)
            })
            .catch((err) => {
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },
    onEditCall(name, index, val) {
      this.prizeData[index][name] = val
      this.callName = ''
      this.callIndex = ''
      this.callType = ''
    },
    onEditCallClick(name, index, type) {
      this.callName = name
      this.callIndex = index
      this.callType = type
    },
  },
}
</script>
<style scoped>
.btn {
  margin-top: 20px;
  min-width: 150px;
}
.prizeInfo {
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
