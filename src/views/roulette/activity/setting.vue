<template>
  <div class="app-container" style="padding: 50px">
    <el-form ref="activityForm" :model="activity" :rules="rules" label-width="160px">
      <div class="goback" @click="goBack">
        <span class="el-icon-arrow-left"></span> 返回
      </div>
      <el-descriptions style="margin: 0px 0" title="基础设置"></el-descriptions>
      <el-form-item label="活动标题" prop="rouletteName">
        <el-input v-model="activity.rouletteName" placeholder="请输入活动标题"></el-input>
      </el-form-item>
      <el-form-item label="活动连接" prop="activityLink">
        <el-input v-model="activity.activityLink" placeholder="请输入活动连接"></el-input>
      </el-form-item>
      <el-form-item label="活动时间" prop="time">
        <!-- :picker-options="pickerOptions" -->
        <el-date-picker v-model="activity.time" type="datetimerange" range-separator="~" start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="活动规则" prop="playMethod">
        <el-input type="textarea" v-model="activity.playMethod" :rows="4" placeholder="请输入活动规则"></el-input>
      </el-form-item>
      <el-descriptions style="margin: 0px 0" title="活动设置"></el-descriptions>
      <el-form-item label="奖级类型" prop="rewardType">
        <el-radio-group v-model="activity.rewardType" @change="initPrizeData()">
          <el-radio :label="4">4等奖</el-radio>
          <el-radio :label="6">6等奖</el-radio>
          <el-radio :label="8">8等奖</el-radio>
          <el-radio :label="12">12等奖</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="">
        <el-table :data="prizeData" size="mini">
          <el-table-column prop="prizeLevel" :label="$t('奖项名称')">
            <template slot-scope="{ row }">
              {{ numberToUpperCase(row.prizeLevel) }}等奖
            </template>
          </el-table-column>
          <el-table-column prop="prizeName" :label="$t('奖品内容')">
            <template slot-scope="{ row, $index }">
              <EditCall :text="row['prizeName']" :active="0"
                :editable="callIndex === $index && callName === 'prizeName'"
                @onChange="(val) => onEditCall('prizeName', $index, val)"
                @onClick="onEditCallClick('prizeName', $index)" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('奖品')" align="left" width="300">
            <template slot-scope="{ row, $index }">
              <span class="prizeInfo">
                <el-button size="small" type="success"
                  @click="addPrize(row, $index)">{{ row.prizeIcon ? "修改奖品" : "选择奖品" }}</el-button>
                <span class="prizeInfo" v-if="row.prizeIcon">
                  <el-image style="width: 50px; height: 50px" :src="row.prizeIcon" fit="fill"
                    :preview-src-list="[row.prizeIcon]"></el-image>
                  <span>金币：{{ row.prizeAmount }} </span>
                </span>
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('奖品数量')">
            <template slot-scope="{ row, $index }">
              <EditCall :text="row['prizeCountTotal']" :active="0" :editable="
                  callIndex === $index && callName === 'prizeCountTotal'
                " @onChange="(val) => onEditCall('prizeCountTotal', $index, val)"
                @onClick="onEditCallClick('prizeCountTotal', $index)" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('中奖概率(%)')">
            <template slot-scope="{ row, $index }">
              <EditCall :text="`${row['prizeFee']}`" :active="0"
                :editable="callIndex === $index && callName === 'prizeFee'"
                @onChange="(val) => onEditCall('prizeFee', $index, val)"
                @onClick="onEditCallClick('prizeFee', $index)" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('单人最多中奖次数')">
            <template slot-scope="{ row, $index }">
              <EditCall :text="row['winCount']" :active="0" :editable="callIndex === $index && callName === 'winCount'"
                @onChange="(val) => onEditCall('winCount', $index, val)"
                @onClick="onEditCallClick('winCount', $index)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <div class="tips">
        <el-link type="danger">抽奖条件规则（例如填写‘5’规则为每邀请5人充值增加一次抽奖机会）</el-link>
      </div>
      <el-form-item label="邀请充值人数" prop="inviteCount">
        <el-input v-model="activity.inviteCount" placeholder="请输入充值人数" type="number"
          onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
      </el-form-item>
      <el-form-item label="充值金额" prop="cash">
        <el-input type="number" v-model="activity.cash" placeholder="大于等于该设置金额有效"
          onkeyup="value=value.replace(/^(0+)|[^\d]+/g,'')"></el-input>
      </el-form-item>
      <el-form-item label="奖级轮播" prop="carouselLevel">
        <el-checkbox-group v-model="activity.carouselLevel">
          <el-checkbox v-for="(item, index) in activity.rewardType" :key="index + 1"
            :label="index + 1">{{ numberToUpperCase(index + 1) }}等奖</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="兑换说明" prop="awardMethod">
        <el-input type="textarea" v-model="activity.awardMethod" :rows="4" placeholder="请输入兑奖说明"></el-input>
      </el-form-item>
      <div class="tips">
        <el-link type="danger">提示：所有中奖概率之和不能超过100%</el-link>
      </div>
      <el-descriptions style="margin: 0px 0" title="虚拟数据设置"></el-descriptions>
      <el-form-item label="虚拟中奖用户">
        <el-button size="small" type="success" @click="addMock()">{{
          $t("添加")
        }}</el-button>
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
          <el-table-column prop="updateTimeString" :label="$t('操作')">
            <template slot-scope="{ row }">
              <el-button plain type="danger" size="mini" @click="virtualDeleteClick(row)">{{ $t("删除") }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="活动状态" prop="status">
        <el-radio-group v-model="activity.status">
          <el-radio :label="1">开启</el-radio>
          <el-radio :label="2">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="">
        <el-button class="btn" @click="cancelClick()">{{
          $t("取消")
        }}</el-button>
        <el-button class="btn" type="primary" @click="saveClick()">{{
          $t("设置完成提交")
        }}</el-button>
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
          <el-form-item :label="$t('中奖等级')" prop="prizeLevel"><el-select v-model="userModel.prizeLevel"
              placeholder="请选择中奖等级" style="width: 100%" @change="changePrizeLevel()">
              <el-option v-for="(item, index) in activity.rewardType" :key="index"
                :label="`${numberToUpperCase(index + 1)}等奖`" :value="index + 1">
              </el-option> </el-select></el-form-item>
          <el-form-item :label="$t('奖品内容')" prop="prizeName"><el-input v-model="userModel.prizeName" clearable
              :placeholder="$t('请输入奖品内容')" :disabled="true" /></el-form-item>
          <el-form-item :label="$t('奖品价格')" prop="prizeAmount"><el-input v-model="userModel.prizeAmount" clearable
              :placeholder="$t('请输入奖品价格')" :disabled="true" type="number"
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

    <!-- 选择奖品 -->
    <el-dialog :title="'选择奖品'" :visible.sync="dialogPrizeVisible" :close-on-click-modal="false" :destroy-on-close="true"
      width="30%">
      <div style="width: 100%; height: 100%">
        <el-form ref="prizeForm" :model="prizeModel" :rules="prizeRules" label-position="top" label-width="120px"
          size="medium">
          <el-form-item :label="$t('金币奖励金额')" prop="prizeAmount"><el-input v-model="prizeModel.prizeAmount" clearable
              :placeholder="$t('请输入金额')" onkeyup="value=value.replace(/^[^\d]+/g,'')" type="number" /></el-form-item>
          <el-form-item :label="$t('奖品图片上传')" prop="prizeIcon">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload"
              :http-request="uploadImgRequest">
              <img v-if="prizeModel.prizeIcon" :src="prizeModel.prizeIcon" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogPrizeVisible = false">{{
          $t("menu.title258")
        }}</el-button>
        <el-button size="medium" type="primary" @click="handlePrizeClick()">{{
          $t("menu.title259")
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { createActivity } from '@/api/roulette/activity'
import EditCall from '@/views/roulette/Components/EditCall'
import { beforeUploadImage, uploadFile, numberToUpperCase } from '@/utils/tools'

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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
      },
      activity: {
        activityLink: '', //活动链接 http://www.baidu.com
        rouletteName: '', //活动标题
        time: [],
        playMethod: '', //活动规则
        rewardType: 4, //奖级类型
        inviteCount: '', //邀请充值人数
        cash: '', //充值金额 10
        carouselLevel: [],
        awardMethod: '', //奖项兑换说明
        status: 1, //0关闭 1开启
      },
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
      dialogPrizeVisible: false,
      prizeIndex: 0,
      prizeModel: {
        prizeAmount: '',
        prizeIcon: null,
      },
      prizeRules: {
        prizeAmount: [
          {
            required: true,
            message: '请输入奖品金额',
            trigger: 'change',
          },
          {
            validator: validPrizeAmount,
            trigger: 'blur',
          },
        ],
        prizeIcon: [
          {
            required: true,
            message: '请选择奖品图片',
            trigger: 'change',
          },
        ],
      },
      // 虚拟用户
      userModel: {
        uid: '', //用户uid
        nickName: '', //用户昵称
        prizeLevel: '', //中奖等级
        prizeAmount: '', //中奖金额
        prizeName: '', //中奖名称
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
    this.initPrizeData()
  },
  methods: {
    initPrizeData() {
      this.prizeData = []
      this.activity.carouselLevel = []

      for (var i = 0; i < this.activity.rewardType; i++) {
        let prizeObj = {
          prizeLevel: i + 1, // 等级
          rouletteName: this.activity.rouletteName, // 活动名称
          // prizeIcon:
          //   "http://fbs-osss.oss-ap-southeast-1.aliyuncs.com/game/game_1661589123000.png", // 奖品图标
          prizeAmount: undefined, // 奖品价格
          prizeIcon: null,
          // prizeAmount: 10, // 奖品价格
          prizeCountTotal: 0,
          prizeFee: 0, // 中奖概率
          winCount: 1, //单人中奖次数
          prizeName: '',
        }
        this.activity.carouselLevel.push(i + 1)
        this.prizeData.push(prizeObj)
      }
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
    // 选择奖品
    addPrize(row, index) {
      this.prizeIndex = index
      this.prizeModel = {
        prizeAmount: row.prizeAmount,
        prizeIcon: row.prizeIcon,
      }
      this.dialogPrizeVisible = true
    },
    // 上传图片
    beforeImgUpload(file) {
      const { can, msg } = beforeUploadImage(file.type, file.size)
      if (!can) this.$message.error(msg)
      return can
    },

    uploadImgRequest(option) {
      this.$store
        .dispatch('oss/getOSSInfos')
        .then((res) => {
          return uploadFile(
            res,
            'ainfo',
            option.file.name,
            option.file
          )
        })
        .then((res) => {
          console.log(res, 'res2')
          this.prizeModel.prizeIcon = res
        })
        .catch((err) => {
          this.$message.error('上传失败，请重试')
        })
    },
    // 选择奖品
    handlePrizeClick() {
      this.dialogPrizeVisible = true
      this.$refs['prizeForm'].validate((valid) => {
        if (valid) {
          this.$set(
            this.prizeData[this.prizeIndex],
            'prizeAmount',
            this.prizeModel.prizeAmount
          )
          this.$set(
            this.prizeData[this.prizeIndex],
            'prizeIcon',
            this.prizeModel.prizeIcon
          )
          this.dialogPrizeVisible = false
          this.prizeModel = {
            prizeAmount: 0,
            prizeIcon: null,
          }
        }
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
      for (let i = 0; i < this.prizeData.length; i++) {
        let temp = this.prizeData[i]
        if (temp.prizeName == '') {
          return this.$message({
            message: '请填写完奖品内容',
            type: 'warning',
          })
        }
        if (!temp.prizeIcon || !temp.prizeAmount) {
          return this.$message({
            message: '请填写完整奖品信息',
            type: 'warning',
          })
        }
      }
      this.userId++
      this.userModel = {
        id: this.userId,
        uid: '',
        nickName: '',
        prizeName: '',
        prizeLevel: '',
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
    cancelClick() {
      this.$confirm('是否确认取消该活动？', this.$t('menu.title262'), {
        confirmButtonText: this.$t('menu.title259'),
        cancelButtonText: this.$t('menu.title258'),
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          this.$router.go(-1)
        })
        .catch(() => {})
    },
    // 创建活动
    saveClick() {
      this.$refs['activityForm'].validate((valid) => {
        if (valid) {
          if (this.prizeData.length > 0) {
            let prizeFeeTotal = 0
            for (let i = 0; i < this.prizeData.length; i++) {
              let temp = this.prizeData[i]
              prizeFeeTotal += +temp.prizeFee
              if (temp.prizeName == '') {
                return this.$message({
                  message: '请填写完奖品内容',
                  type: 'warning',
                })
              }
              if (!temp.prizeIcon || !temp.prizeAmount) {
                return this.$message({
                  message: '请填写完整奖品信息',
                  type: 'warning',
                })
              }
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
          this.$confirm('确认是否创建该抽奖活动？', this.$t('menu.title262'), {
            confirmButtonText: this.$t('menu.title259'),
            cancelButtonText: this.$t('menu.title258'),
            type: 'warning',
            showClose: false,
          }).then(() => {
            // 请求网络
            let params = {
              activity: {
                activityLink: this.activity.activityLink, // 活动链接
                awardMethod: this.activity.awardMethod,
                carouselLevel: this.activity.carouselLevel.join(','), // 轮播等级
                cash: this.activity.cash, // 充值金额
                inviteCount: this.activity.inviteCount, // 邀请人数
                playMethod: this.activity.playMethod,
                rewardType: this.activity.rewardType, // 奖级类型 4 6 8 12
                rouletteName: this.activity.rouletteName, // 活动名称
                status: this.activity.status, // 活动状态 0 关闭 1 开启
              },
              prize: this.prizeData.map((e) => {
                return {
                  winCount: e.winCount, // 单人领取次数
                  prizeLevel: e.prizeLevel, // 奖品等级 1 2 3 4
                  prizeName: e.prizeName, // 奖品名称
                  prizeIcon: e.prizeIcon, // 奖品图标
                  prizeAmount: e.prizeAmount, // 奖品价格
                  prizeFee: e.prizeFee, // 中奖概率
                  prizeCountTotal: e.prizeCountTotal, // 奖品总数
                }
              }),
              // 虚拟中奖人数
              user: this.userData.map((e) => {
                return {
                  rouletteName: this.activity.rouletteName,
                  uid: e.uid,
                  nickName: e.nickName,
                  prizeName: e.prizeName,
                  prizeLevel: e.prizeLevel,
                  prizeAmount: e.prizeAmount,
                }
              }),
            }
            if (this.activity.time) {
              params.activity.startTime = Date.parse(this.activity.time[0])
              params.activity.endTime = Date.parse(this.activity.time[1])
            }
            console.log(params)
            createActivity(params)
              .then((res) => {
                this.$notify({
                  title: this.$t('menu.title262'),
                  message: '创建成功',
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
    goBack() {
      this.$router.go(-1)
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
