<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true" class="searchFormWrapper">
      <!-- <el-form-item>
        <span class="search_info">创建时间:</span>
        <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
          :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" value-format="timestamp"
          @change="handleSearchFilter" />
      </el-form-item> -->
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" placeholder="请输入用户ID" clearable style="width: 125px"
          oninput="value=value.replace(/[^\d]/g,'')" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.assetsType" size="small" placeholder="请选择存提类型" style="width: 140px" clearable
          @change="handleSearchFilter">
          <el-option label="存款" :value="0" />
          <el-option label="提款" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.type" multiple size="small" style="width: 300px" placeholder="请选择类型(可多选)" clearable>
          <el-option v-for="item in serverInitTypes" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-input
          v-model="listQuery.remark"
          size="small"
          placeholder="请输入备注信息"
          clearable
          maxlength="100"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <el-input v-model="listQuery.operator" size="small" placeholder="请输入操作人" clearable style="width: 125px"
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </el-form-item>
      <el-form-item class="export_btn">
        <el-button size="small" :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">
          导出Excel
        </el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-edit" @click="showCreateDialogClick('test')">测试金币</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-edit-outline" @click="showCreateDialogClick('bonus')">彩金存提</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-edit-outline" @click="showCreateDialogClick('people')">本金存提</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <span size="medium" plain type="primary">
          总金币：{{
            todayList.length ? todayList[0].totalGoldCoin.toLocaleString() : ""
          }}
        </span>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <!-- 展开 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="描述">
              <span>{{ scope.row.returnMsg }}</span>
            </el-form-item>
            <el-form-item label="更新时间">
              <span>{{ scope.row.gmtUpdateString }}</span>
            </el-form-item>
            <el-form-item label="队列消息ID">
              <span>{{ scope.row.messageId }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="cindex" label="序号" width="60" />
      <el-table-column label="用户ID" width="125">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="goldCoin" label="金币" sortable width="90">
        <template slot-scope="{ row }">
          {{ row.goldCoin.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="anchorCoin" label="主播币" sortable width="90" />
      <el-table-column prop="userExp" label="用户经验" sortable width="105" />
      <el-table-column prop="anchorExp" label="主播经验" sortable width="105" />
      <!-- <el-table-column
        prop="assetsString"
        label="存提类型"
        min-width="80"

      /> -->
      <el-table-column prop="typeString" label="彩金类型" min-width="110" />
      <el-table-column label="状态" width="100">
        <template slot-scope="{ row }">
          <span v-if="row.status == 0">
            <!-- <svg-icon
              icon-class="sandglass"
              class-name="status-icon-0"
            /> -->
            <el-tag type="info">待审核</el-tag>
          </span>
          <span v-else-if="row.status == 1">
            <!-- <svg-icon
              icon-class="success"
              class-name="status-icon-1"
            /> -->
            <el-tag type="success">成功</el-tag>
          </span>
          <span v-else-if="row.status == 2">
            <!-- <svg-icon
              icon-class="fail"
              class-name="status-icon-2"
            /> -->
            <el-tag type="info">失败</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作人" min-width="80" />
      <el-table-column prop="remark" label="备注" min-width="120" />
      <el-table-column prop="gmtCreateString" label="创建时间" width="160" />
    </el-table>
    <!-- <el-table v-cloading="todayListLoading" :data="todayList" border size="mini">
    //   <el-table-column type="expand" />
    //   <el-table-column type="" label="" width="60"   />
    //   <el-table-column label="" min-width=""   />
    //   <el-table-column
    //     prop="totalGoldCoin"
    //     label="总金币"
    //     min-width="60"
    //
    //   />
    //   <el-table-column prop="" label="" min-width="60"   />
    //   <el-table-column prop="" label="" min-width="60"   />
    //   <el-table-column prop="" label="" min-width="60"   />
    //   <el-table-column prop="" label="" min-width="60"   />
    //   <el-table-column prop="" label="" min-width="60"   />
    //   <el-table-column prop="" label="" min-width="60"   />
    //   <el-table-column prop="" label="" width="160"   />
    //   <el-table-column label="" width="100"   />
    // </el-table> -->

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <!-- 新建 弹窗 -->
    <el-dialog :title="
      operateType === 'test'
        ? '测试金币'
        : operateType === 'bonus'
          ? '彩金存提'
          : '人工存提'
    " :visible.sync="dialogVisible" :close-on-click-modal="false" :destroy-on-close="true">
      <div v-cloading="dialogLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-width="100px" label-position="top"
          size="medium">
          <el-form-item label="用户ID" prop="uid">
            <el-input v-model.number="createModel.uid" clearable placeholder="请输入用户ID" @change="getCurrentUserGoldls()" />
            <el-tag v-if="createModel.uidIsNotValid && createModel.uid" type="danger">当前用户不存在，请重新输入</el-tag>
            <el-tag v-if="
              !createModel.uidIsNotValid && createModel.uid && !liushuiLoading
            " type="success">提现所需流水：{{ createModel.withdrawalCash }}</el-tag>
          </el-form-item>
          <el-form-item v-if="operateType !== 'test'" label="存提类型">
            <el-radio-group v-model="createModel.assetsType">
              <el-radio :label="0">存款</el-radio>
              <el-radio :label="1">提款</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="operateType === 'bonus'" label="彩金类型" prop="type">
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

    <!-- 新建 弹窗 -->
    <el-dialog title="本金存提" :visible.sync="withdrawDialogVisible" :close-on-click-modal="false" :destroy-on-close="true"
      width="700px">
      <div v-cloading="withdrawDialogLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-width="100px" label-position="top"
          size="medium">
          <el-form-item label="用户ID" prop="uid"><el-input v-model.number="createModel.uid" clearable
              placeholder="请输入用户ID" />
            <el-tag v-if="createModel.uidIsNotValid && createModel.uid" type="danger">当前用户不存在，请重新输入</el-tag>
          </el-form-item>
          <el-form-item label="存提类型">
            <el-radio-group v-model="createModel.assetsType">
              <el-radio :label="0">存款</el-radio>
              <el-radio :label="1">提款</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户经验" prop="userExp"><el-input v-model.number="createModel.userExp" clearable
              placeholder="请输入用户经验" maxlength="20" /></el-form-item>
          <!-- <el-form-item label="提款类型">
            <el-select v-model="createModel.type" placeholder="请--选--择 ">
              <el-option
                v-for="item in outTypeOptions"
                :key="item.label"
                :label="item.label"
                :value="item.value"
                :v-model="createModel.type"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="主播经验" prop="anchorExp"><el-input v-model.number="createModel.anchorExp" clearable
              placeholder="请输入主播经验" maxlength="20" /></el-form-item>
          <el-form-item label="金币" prop="goldCoin">
            <el-input v-model.number="createModel.goldCoin" clearable placeholder="请输入金币数量" maxlength="20" />
            <el-tag v-if="!createModel.uidIsNotValid && createModel.uid" type="success">提现所需流水：{{
              createModel.withdrawalCash }}</el-tag>
          </el-form-item>
          <el-form-item label="流水倍数" prop="water"><el-input v-model.number="createModel.water" clearable
              placeholder="请输入流水倍数" maxlength="20" oninput="value=value.replace(/[^\d]/g,'')" /></el-form-item>
          <el-form-item label="魅力" prop="anchorCoin"><el-input v-model.number="createModel.anchorCoin" clearable
              placeholder="请输入魅力值" maxlength="20" /></el-form-item>
          <el-form-item label="备注">
            <el-input v-model="createModel.remark" type="textarea" placeholder="请输入操作描述" maxlength="200"
              :autosize="{ minRows: 2, maxRows: 4 }" show-word-limit />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="withdrawDialogVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleWithdrawDataClick()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserAssetsLogList,
  createUserAssets,
  getTotalList,
  createWithdrawUserAssets,
  getTypeOfFunds,
  getUserWithdrawGold,
  getUserflagGoOn,
} from '@/api/center/user/assets_log'
import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: 'CenterUserAssetsLogPage',
  filters: {},
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
      // if (!value) {
      //   return callback(new Error('流水倍数不能为0'))
      // }
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
      list: [],
      listLoading: true,
      todayList: [],
      todayListLoading: false,
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        remark: null,
        bookType: 'xlsx',
        pickerValue: [NOW_TIME_START, NOW_TIME_END],
        operator: null,
        type: null,
        assetsType: null,
      },
      liushuiLoading: true,
      operateType: 'test',
      // inTypeOptions: [
      //   { label: '测试金币', value: 0 },
      //   { label: '首充彩金', value: 1 },
      //   { label: '首提彩金', value: 2 },
      //   { label: '用户亏损彩金', value: 3 },
      //   { label: '掉单', value: 4 },
      //   { label: '其他', value: 5 },
      //   { label: '每日亏损彩金', value: 7 },
      //   { label: '用户贡献彩金', value: 8 },
      //   { label: '每日首充彩金', value: 9 },
      //   { label: '用户回馈彩金', value: 10 },
      //   { label: '广告工资', value: 11 }
      // ],
      // desposiType: [
      //   { label: '注册彩金', value: 1001 },
      //   { label: '存送彩金', value: 1002 },
      //   { label: '输返彩金', value: 1003 },
      //   { label: '包赔彩金', value: 1004 },
      //   { label: '推荐彩金', value: 1005 },
      //   { label: '用户回馈彩金', value: 10 },
      //   { label: '用户贡献彩金', value: 8 },
      //   { label: '用户亏损彩金', value: 3 },
      //   { label: '其他', value: 5 }
      // ],
      typeOptions: [
        { label: '测试金币', value: 0 },
        { label: '用户回馈彩金', value: 10 },
        { label: '用户贡献彩金', value: 8 },
        { label: '用户亏损彩金', value: 3 },
        { label: '人工提款', value: 6 },
      ],
      serverInitTypes: [],
      bonusTypes: [],
      outTypeOptions: [{ label: '人工提出', value: 6 }],
      // 快速充值
      quickRechargeUid: null,
      quickRechargeCoin: null,
      // 弹窗数值
      dialogVisible: false,
      dialogLoading: false,

      // 弹窗数值
      withdrawDialogVisible: false,
      withdrawDialogLoading: false,
      // 表单模型
      createModel: {
        uid: null,
        userExp: 0,
        anchorExp: 0,
        goldCoin: 0,
        anchorCoin: 0,
        remark: null,
        water: 1,
        assetsType: 0,
        withdrawalCash: 0,
        uidIsNotValid: false,
      },

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
    }
  },
  created() {
    this.listQuery.uid = this.$route.query.uid
    this.fetchData()
  },
  methods: {
    // 重新设置表单数据
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
    simultType() {
      // 兼容老数据type
      // { label: '测试金币', value: 0 },
      // { label: '首充彩金', value: 1 },
      // { label: '首提彩金', value: 2 },
      // { label: '掉单', value: 4 },
      // { label: '每日亏损彩金', value: 7 },
      // { label: '每日首充彩金', value: 9 },
      // { label: '广告工资', value: 11 },
      // { label: '用户回馈彩金', value: 10 },
      // { label: '用户贡献彩金', value: 8 },
      // { label: '用户亏损彩金', value: 3 },
      // { label: '人工提款', value: 6 },
      // { label: '其他', value: 5 }
      // 使用深拷贝
      let serachType = JSON.parse(JSON.stringify(this.listQuery)).type
      if (serachType && serachType.length) {
        if (serachType.includes(120)) {
          serachType.push(0)
        }
        if (serachType.includes(126)) {
          serachType.push(6)
        }
        if (serachType.includes(125)) {
          serachType = [5, 1, 2, 4, 7, 9, 11, ...serachType]
        }
        if (serachType.includes(130)) {
          serachType.push(10)
        }
        if (serachType.includes(128)) {
          serachType.push(8)
        }
        if (serachType.includes(123)) {
          serachType.push(3)
        }
      }
      this.listQuery.simultType = serachType || null
    },
    // 获取列表数据
    async fetchData() {
      this.simultType()
      this.listLoading = true
      if (!this.serverInitTypes.length) {
        const res = await getTypeOfFunds()
        const itemsArray = []
        const bonusArray = []
        if (res.code === 200) {
          if (res.data.rgct) {
            res.data.rgct.map((item) => {
              const citem = {
                label: item.assetsName,
                value: item.assetsType,
              }
              itemsArray.push(citem)
            })
            this.serverInitTypes = itemsArray
          }
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
      }
      this.todayListLoading = true
      getTotalList(
        this.listQuery.pageSize,
        this.listQuery.page,
        this.listQuery
      ).then((res) => {
        var totallist = []
        if (
          res.data != null &&
          res.data != undefined &&
          JSON.stringify(res.data) != '{}'
        ) {
          totallist.push(res.data)
        }
        this.todayList = totallist
        this.todayListLoading = false
      })
      getUserAssetsLogList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      )
        .then((res) => {
          this.list = (res.data.list || []).map((item, index) => {
            var statusString = ''
            switch (item.status) {
              case 0:
                statusString = '待审核'
                break
              case 1:
                statusString = '完成'
                break
              case 2:
                statusString = '失败'
                break
              default:
                statusString = '其他'
                break
            }
            var typeString = '其他'
            let assetsString = '存款'
            if (item.assetsType) {
              assetsString = '提款'
            }
            const mergeOldTypes = this.serverInitTypes.concat(this.typeOptions)
            mergeOldTypes.map((citem) => {
              if (citem.value === item.type) {
                typeString = citem.label
              }
            })
            const cindex =
              index + 1 + (this.listQuery.page - 1) * this.listQuery.limit
            this.$set(item, 'cindex', cindex)
            this.$set(item, 'typeString', typeString)
            this.$set(item, 'assetsString', assetsString)
            this.$set(item, 'statusString', statusString)
            this.$set(item, 'gmtCreateString', formatUnixTime(item.gmtCreate))
            this.$set(item, 'gmtUpdateString', formatUnixTime(item.gmtUpdate))
            return item
          })
          this.listLoading = false
          this.listQuery.total = res.data.total
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
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
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          '用户ID',
          '金币',
          '主播币',
          '用户经验',
          '主播经验',
          '描述',
          '状态',
          '备注',
          '操作人',
          '创建时间',
        ]
        const filterVal = [
          'uid',
          'goldCoin',
          'anchorCoin',
          'userExp',
          'anchorExp',
          'returnMsg',
          'status',
          'remark',
          'operator',
          'gmtCreate',
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '人工存提报表',
          autoWidth: this.autoWidth,
          bookType: this.bookType,
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === 'gmtCreate') {
            return new Date(v[j])
          }
          if (j === 'updateTime' && v[j] != null) {
            return new Date(v[j])
          }
          if (j === 'status' && v[j] != null) {
            if ((v[j] = 0)) {
              return '等待'
            } else if ((v[j] = 1)) {
              return '成功'
            } else if ((v[j] = 2)) {
              return '失败'
            }
            return v[j]
          } else {
            return v[j]
          }
        })
      )
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.assetsType === 1) {
        return 'warning-row'
      }
      return ''
    },
    // 显示创建弹出窗
    showCreateDialogClick(type) {
      this.operateType = type
      this.resetCreateModel()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示创建弹出窗
    showCreateWithdrawDialogClick() {
      this.resetCreateModel()
      this.withdrawDialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 创建 数据
    async handleDataClick() {
      const getCurrentType = (formDic) => {
        let ctype = formDic.type || 126
        if (this.operateType === 'test') {
          this.serverInitTypes.map((item) => {
            if (item.label.includes('测试')) {
              ctype = item.value
            }
          })
        }
        if (this.operateType === 'people') {
          this.serverInitTypes.map((item) => {
            if (formDic.assetsType === 1) {
              if (item.label.includes('提款') || item.label.includes('提出')) {
                ctype = item.value
              }
            }
            if (formDic.assetsType === 0) {
              if (item.label.includes('存款')) {
                ctype = item.value
              }
            }
          })
        }
        return ctype
      }
      this.dialogLoading = true
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          formDic.type = getCurrentType(formDic)
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
        } else {
          this.dialogLoading = false
        }
      })
    },

    // 创建 数据
    handleWithdrawDataClick() {
      this.withdrawDialogLoading = true
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器  withdrawDialogVisible: false, withdrawDialogLoading: false,
          const params = {
            uid: formDic.uid || 0,
            userExp: formDic.userExp || 0,
            anchorExp: formDic.anchorExp || 0,
            goldCoin: formDic.goldCoin || 0,
            anchorCoin: formDic.anchorCoin || 0,
            remark: nullS(formDic.remark),
            water: formDic.water || 0,
            assetsType: formDic.assetsType || 0,
          }
          const res = await getUserflagGoOn(params)
          const exctFunction = () => {
            createWithdrawUserAssets(params)
              .then((res) => {
                this.withdrawDialogLoading = false
                this.withdrawDialogVisible = false
                this.$notify({
                  title: '提示',
                  message: '本金存提成功',
                  type: 'success',
                  duration: 1500,
                })
                setTimeout((_) => {
                  this.fetchData()
                }, 200)
              })
              .catch((err) => {
                this.withdrawDialogLoading = false
                this.$message.error(err)
              })
          }
          this.dialogLoading = false
          if (!res.data) {
            this.$confirm('用户提现流水可能清零，是否继续操作？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              showClose: false,
            })
              .then(() => {
                exctFunction()
              })
              .catch(() => { })
          } else {
            exctFunction()
          }
        } else {
          this.withdrawDialogLoading = false
        }
      })
    },

    // 快速充值
    quickRechargeClick() {
      const uid = this.quickRechargeUid
      const coin = this.quickRechargeCoin
      if (emptyS(uid) || parseInt(`${uid}`) <= 0) {
        this.$message({
          message: '用户ID不能为空',
          type: 'warning',
        })
        return
      }
      if (emptyS(coin) || parseInt(`${coin}`) <= 0) {
        this.$message({
          message: '金币数量不能为空',
          type: 'warning',
        })
        return
      }
      // if (`${coin}`.indexOf('-') != -1) {
      //   // 先判断第一位
      //   if (`${coin}`.indexOf('-') === 0) {
      //     const arr = `${coin}`.split('-');
      //     if (arr.length > 2) {
      //       this.$message({
      //         message: '金币数量输入错误！1',
      //         type: 'warning'
      //       });
      //       return;
      //     }
      //   } else {
      //     this.$message({
      //       message: '金币数量输入错误！2',
      //       type: 'warning'
      //     });
      //     return;
      //   }
      // }

      const loading = this.$loading({
        lock: true,
        text: '充值中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)',
      })
      // 请求服务器
      createUserAssets({
        uid: uid,
        userExp: coin,
        goldCoin: coin,
        remark: 'cms快速充值入口',
        anchorCoin: 0,
        anchorExp: 0,
      })
        .then((res) => {
          loading.close()
          this.quickRechargeUid = null
          this.quickRechargeCoin = null
          this.$notify({
            title: '提示',
            message: '添加资产成功',
            type: 'success',
            duration: 1500,
          })
          setTimeout((_) => {
            this.fetchData()
          }, 200)
        })
        .catch((err) => {
          loading.close()
          this.quickRechargeUid = null
          this.quickRechargeCoin = null
          this.$message.error(err)
        })
    },

    // 过滤
    handleSearchFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },
    // 重置刷新
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        pickerValue: [NOW_TIME_START, NOW_TIME_END],
      }
      this.fetchData()
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.listQuery.page = 1
      this.fetchData()
    },
  },
}
</script>
<style scoped>
.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}

.status-icon-0 {
  fill: #e6a23c;
}

.status-icon-1 {
  fill: #67c23a;
}

.status-icon-2 {
  fill: #f56c6c;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}

.box-card {
  /* width: 60%; */
  margin-bottom: 20px;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
