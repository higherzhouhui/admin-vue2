<template>
  <div class="app-container">
    <div class="flex-top-center">
      <div>
        <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
        <el-form :inline="true">
          <!-- <el-form-item> -->
          <!-- <el-tag type="primary">领取时间:</el-tag> -->
          <!-- <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
            :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
            align="right" :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd HH:mm:ss" value-format="timestamp"
            @change="handleSearchFilter" />
        </el-form-item> -->
          <el-form-item>
            <el-input v-model="listQuery.uid" size="small" class="input-with-select" placeholder="请输入用户ID" clearable
              @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="listQuery.agentId" size="small" class="input-with-select" placeholder="请输入所属代理" clearable
              @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="listQuery.startActivityGold" size="small" class="input-with-select" placeholder="请输入开始金额"
              clearable style="width: 150px" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
            -
            <el-input v-model="listQuery.endActivityGold" size="small" class="input-with-select" placeholder="请输入结束金额"
              clearable style="width: 150px" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="listQuery.userType" size="small" placeholder="请选择用户标签" clearable
              @change="handleSearchFilter">
              <el-option v-for="(item, index) in userCategoryData" :key="index" :label="item.categoryName"
                :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="listQuery.activityType" size="small" placeholder="请选择活动名称" clearable
              @change="handleSearchFilter">
              <el-option v-for="(item, index) in activityData" :key="index" :label="item.activityName"
                :value="item.activityType" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="listQuery.status" size="small" placeholder="请选择状态" clearable @change="handleSearchFilter">
              <el-option :label="'已领取'" :value="1" />
              <el-option :label="'未领取'" :value="0" />
              <el-option :label="'失效'" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
            <el-button size="small" icon="el-icon-refresh" @click="resets">重置</el-button>



          </el-form-item>
        </el-form>
      </div>

      <el-button size="small" :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">
        导出Excel
      </el-button>
    </div>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-edit-outline"
          @click="showCreateDialogClick()">彩金存提</el-button>
      </el-form-item>
      <el-form-item>
        <span plain size="small" type="primary" :loading="totalLoading">
          红利总额：{{ totalStatistics.toLocaleString() }}
        </span>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" size="mini" :cell-style="cellStyle" fit highlight-current-row>
      <el-table-column prop="uid" label="用户ID" min-width="120" fixed="left">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column label="首存时间" min-width="135">
        <template slot-scope="{ row }">
          {{
            row.firstSaveTime ? formatUnixTime(Number(row.firstSaveTime)) : ""
          }}
        </template>
      </el-table-column>
      <el-table-column prop="userTypeName" label="用户标签" />
      <el-table-column label="是否绑定银行卡" min-width="135">
        <template slot-scope="{ row }">
          {{ row.flagBank == 0 ? "未绑定" : row.flagBank == 1 ? "已绑定" : "-" }}
        </template>
      </el-table-column>
      <el-table-column label="所属代理" min-width="120">
        <template slot-scope="{ row }">
          {{ row.agentId }}
        </template>
      </el-table-column>
      <el-table-column prop="activityName" label="活动名称" min-width="120" />
      <el-table-column prop="amount" label="金额" />
      <el-table-column prop="checkName" label="审核人" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="{ row }">
          <span v-if="row.status == 0">未领取</span>
          <span v-else-if="row.status == 1">已领取</span>
          <span v-else-if="row.status == 2">失效</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="领取时间" min-width="135">
        <template slot-scope="{ row }">
          {{ row.receiveTime ? formatUnixTime(Number(row.receiveTime)) : "" }}
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="拒绝原因" min-width="120" :show-overflow-tooltip="true" />
      <el-table-column prop="remark" label="备注" min-width="120" :show-overflow-tooltip="true" />
      <el-table-column prop="ip" label="同IP用户" min-width="120" />
    </el-table>
    <el-dialog title="彩金存提" :visible.sync="dialogVisible" :close-on-click-modal="false" :destroy-on-close="true">
      <div v-cloading="dialogLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-width="100px" label-position="top"
          size="medium">
          <el-form-item label="用户ID" prop="uid">
            <el-input v-model.number="createModel.uid" clearable placeholder="请输入用户ID" @change="getCurrentUserGoldls()" />
            <el-tag v-if="createModel.uidIsNotValid && createModel.uid" type="danger">当前用户不存在，请重新输入</el-tag>
            <el-tag v-if="!createModel.uidIsNotValid && createModel.uid && !liushuiLoading" type="success">提现所需流水：{{
              createModel.withdrawalCash }}</el-tag>
          </el-form-item>
          <el-form-item label="存提类型">
            <el-radio-group v-model="createModel.assetsType">
              <el-radio :label="0">存款</el-radio>
              <el-radio :label="1">提款</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="彩金类型" prop="type">
            <el-select v-model="createModel.type" placeholder="请选择彩金类型" style="width: 100%">
              <el-option v-for="item in bonusTypes" :key="item.label" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="用户经验" prop="userExp"><el-input v-model.number="createModel.userExp" clearable
              placeholder="请输入用户经验" maxlength="20" /></el-form-item>
          <el-form-item label="主播经验" prop="anchorExp"><el-input v-model.number="createModel.anchorExp" clearable
              placeholder="请输入主播经验" maxlength="20" /></el-form-item>
          <el-form-item label="金币" prop="goldCoin"><el-input v-model.number="createModel.goldCoin" clearable
              placeholder="请输入金币数量" maxlength="20" />
          </el-form-item>
          <el-form-item label="流水倍数" prop="water"><el-input v-model.number="createModel.water" clearable
              placeholder="请输入流水倍数" maxlength="20" oninput="value=value.replace(/[^\d]/g,'')" /></el-form-item>
          <el-form-item label="魅力" prop="anchorCoin"><el-input v-model.number="createModel.anchorCoin" clearable
              placeholder="请输入魅力值" maxlength="20" /></el-form-item>
          <el-form-item label="备注">
            <el-input v-model="createModel.remark" type="textarea" placeholder="请输入备注" maxlength="200" row="4"
              show-word-limit />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogVisible = false">取消</el-button>
        <el-button size="medium" type="primary" :loading="dialogLoading" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import {
  getQueryActivityConfigList,
  getQueryReceiveActivityList,
  queryReceiveActivityListExcel,
  countReceiveActivityVO,
} from '@/api/center/user/bonusStatement'
import {
  createUserAssets,
  createWithdrawUserAssets,
  getTypeOfFunds,
  getUserWithdrawGold,
  getUserflagGoOn,
} from '@/api/center/user/assets_log'
import { getUserCategoryList } from '@/api/center/assets/assets'
import { formatUnixTime, nullS, specifyZoneTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
// const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: 'AgentManagementStatistics',
  components: {
    UserDrawer,
  },
  data() {
    const validateNumber = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error('数值必须大于等于0'))
      } else {
        callback()
      }
    }
    var checkWater = (rule, value, callback) => {
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value < 0) {
            callback(new Error('流水倍数不可小于0'))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    return {
      formatUnixTime,
      list: [],
      totalStatistics: 0,
      totalLoading: true,
      total: 0,
      listLoading: true,
      downloadLoading: false,
      dialogVisible: false,
      dialogLoading: false,
      createModel: {},
      bonusTypes: [],
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        uid: undefined,
        userName: undefined,
        agentId: undefined,
        startActivityGold: undefined,
        endActivityGold: undefined,
        userType: undefined,
        activityType: undefined,
        status: undefined,
        pickerValue: [],
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      activityData: [],
      userCategoryData: [],
      // 验证规则
      rules: {
        uid: [
          { required: true, message: '请输入用户ID' },
          { type: 'number', message: '请输入正确的用户ID' },
        ],
        userExp: [
          { type: 'number', message: '请输入数字' },
          { required: false, trigger: 'change', validator: validateNumber },
        ],
        type: [
          { required: true, trigger: 'change', message: '请选择彩金类型' },
        ],
        anchorExp: [
          { type: 'number', message: '请输入数字' },
          { required: false, trigger: 'change', validator: validateNumber },
        ],
        goldCoin: [{ type: 'number', message: '请输入数字' }],
        anchorCoin: [{ type: 'number', message: '请输入数字' }],
        water: [{ validator: checkWater, trigger: 'blur', required: true }],
      },
    }
  },
  computed: {
    initTimer() {
      return this.$store.getters.timerDate
    }
  },
  created() {
    this.listQuery.pickerValue = this.initTimer
    this.fetchData()
    this.queryActivityConfigList()
    this.userCategoryList()
    this.getBonustTypeList()
  },
  methods: {
    queryActivityConfigList() {
      getQueryActivityConfigList()
        .then((res) => {
          if (res.code === 200) {
            this.activityData = res.data
          }
        })
        .catch((err) => {
          this.activityData = []
          this.$message.error(err)
        })
    },
    resetCreateModel() {
      this.createModel = {
        uid: null,
        userExp: 0,
        anchorExp: 0,
        goldCoin: 0,
        anchorCoin: 0,
        remark: null,
        water: 1,
        type: null,
        assetsType: 0,
        withdrawalCash: 0,
        uidIsNotValid: false,
      }
    },
    getCurrentUserGoldls() {
      this.liushuiLoading = true
      this.createModel.uidIsNotValid = false
      this.createModel.withdrawalCash = 0
      try {
        getUserWithdrawGold({ uid: this.createModel.uid })
          .then((res) => {
            if (res.code === 200) {
              this.createModel.withdrawalCash = res.data
              this.createModel.uidIsNotValid = false
              this.liushuiLoading = false
            }
          })
          .catch(() => {
            this.createModel.uidIsNotValid = true
            this.liushuiLoading = true
          })
      } catch {
        this.createModel.uidIsNotValid = true
        this.liushuiLoading = true
      }
    },
    // 显示创建弹出窗
    showCreateDialogClick() {
      this.resetCreateModel()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getBonustTypeList() {
      const bonusArray = []
      getTypeOfFunds().then((res) => {
        if (res.code === 200) {
          if (res.data.flagLottery) {
            res.data.flagLottery.map((item) => {
              const citem = {
                label: item.assetsName,
                value: item.assetsType,
              }
              bonusArray.push(citem)
            })
            this.bonusTypes = bonusArray
          }
        }
      })
    },
    userCategoryList() {
      getUserCategoryList({ pid: 1 })
        .then((res) => {
          if (res.code === 200) {
            this.userCategoryData = res.data
          }
        })
        .catch((err) => {
          this.activityData = []
          this.$message.error(err)
        })
    },
    cellStyle(row, column, rowIndex, columnIndex) {
      // 根据报警级别显示颜色
      // console.log(row);
      // console.log(row.column);
      if (row.column.label === '商户名称') {
        return 'color:#42b983'
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.totalLoading = true
      if (this.listQuery.pickerValue && this.listQuery.pickerValue.length) {
        this.listQuery = {
          ...this.listQuery,
          startReceiveTime: specifyZoneTime(this.listQuery.pickerValue[0]),
          endReceiveTime: specifyZoneTime(this.listQuery.pickerValue[1]),
        }
      } else {
        this.listQuery = {
          ...this.listQuery,
          startReceiveTime: undefined,
          endReceiveTime: undefined,
        }
      }
      // countReceiveActivityVO(this.listQuery).then((res) => {
      //   this.totalLoading = false
      //   if (res.code === 200) {
      //     this.totalStatistics = res.data.amount
      //   }
      // })
      getQueryReceiveActivityList(this.listQuery)
        .then((res) => {
          this.listLoading = false
          if (res.code === 200) {
            this.list = res.data.list
            this.total = res.data.total
            this.totalStatistics = res.data.ext.amount || 0
          }
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },
    listQueryData() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 20,
        uid: undefined,
        userName: undefined,
        agentId: undefined,
        startActivityGold: undefined,
        endActivityGold: undefined,
        userType: undefined,
        activityType: undefined,
        status: undefined,
        pickerValue: this.initTimer,
      }
    },
    // 重置刷新
    resets() {
      this.listQueryData()
      this.fetchData()
    },

    // 导出
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      this.downloadLoading = true
      queryReceiveActivityListExcel(this.listQuery) // 导出的接口
        .then((result) => {
          this.downloadLoading = false
          console.log(result)
          const link = document.createElement('a') // 创建a标签
          const blob = new Blob([result], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }) // 设置文件流
          link.style.display = 'none'
          // 设置连接
          link.href = URL.createObjectURL(blob) // 将文件流转化为blob地址
          link.download = '红利报表'
          document.body.appendChild(link)
          // 模拟点击事件
          link.click() // 设置点击事件
        })
        .catch((err) => {
          this.downloadLoading = false
          console.log(err)
        })
    },

    // 过滤
    handleSearchFilter() {
      this.listQuery.pageNum = 1
      this.fetchData()
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.listQuery.pageNum = 1
      this.fetchData()
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.fetchData()
    },

    // 佣金发放
    showUpdateDialogClick(row) {
      console.log('佣金发放', row)
    },
    formatterType(row) {
      if (row.agentLevel === 1) {
        return '总代'
      } else if (row.agentLevel === 2) {
        return '一级代理'
      } else if (row.agentLevel === 3) {
        return '二级代理'
      } else if (row.agentLevel === 4) {
        return '三级代理'
      } else if (row.agentLevel === 5) {
        return '四级代理'
      }
    },
    totalRedAmtMoney(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '当前页合计'
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (column.property === 'amount') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index]
        }
      })
      return sums
    },
    // 创建 数据
    async handleDataClick() {
      if (this.dialogLoading) {
        return
      }
      this.dialogLoading = true
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogLoading = true
          const params = {
            uid: formDic.uid || 0,
            userExp: formDic.userExp || 0,
            anchorExp: formDic.anchorExp || 0,
            goldCoin: formDic.goldCoin || 0,
            anchorCoin: formDic.anchorCoin || 0,
            remark: nullS(formDic.remark),
            water: formDic.water || 0,
            type: formDic.type,
            assetsType: formDic.assetsType || 0,
          }
          const flagres = await getUserflagGoOn(params)
          this.dialogLoading = false
          const depositOrwithDrawMoney = async () => {
            this.dialogLoading = true
            // 0存款 1取款
            let res
            try {
              if (formDic.assetsType) {
                res = await createWithdrawUserAssets(params)
              } else {
                res = await createUserAssets(params)
              }
              if (res.code === 200) {
                setTimeout((_) => {
                  this.fetchData()
                  this.dialogLoading = false
                  this.dialogVisible = false
                }, 200)
                this.$notify({
                  title: '提示',
                  message: '操作成功！',
                  type: 'success',
                  duration: 1500,
                })
              } else {
                this.$notify({
                  title: '提示',
                  message: res.mas || '操作失败！',
                  type: 'error',
                  duration: 1500,
                })
              }
            } catch {
              this.dialogLoading = false
            }
          }
          if (!flagres.data) {
            this.$confirm('用户提现流水可能清零，是否继续操作？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              showClose: false,
            })
              .then(() => {
                depositOrwithDrawMoney()
              })
              .catch(() => { })
          } else {
            depositOrwithDrawMoney()
          }
        }
      })
    },
  },
}
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
  width: auto;
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
</style>
