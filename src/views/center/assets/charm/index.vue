<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true" class="searchFormWrapper">
      <!-- <el-form-item>
        <span class="search_info">创建时间</span>
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
          :default-time="['00:00:00', '23:59:59']"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="timestamp"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          style="width: 125px"
          class="input-with-select"
          placeholder="请输入用户ID"
          clearable
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <!-- <el-form-item>
        <el-tag type="info">类型</el-tag>
        <el-select
          v-model="listQuery.isIncrease"
          size="small"
          placeholder="请选择类型"
          clearable
          style="width: 120px"
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in isIncreaseOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-select
          v-model="listQuery.type"
          filterable
          size="small"
          placeholder="请选择来源"
          style="width: 120px"
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
        <el-input
          v-model="listQuery.trn"
          size="small"
          style="width: 170px"
          class="input-with-select"
          placeholder="请输入订单号"
          clearable
          maxlength="50"
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
        >搜索</el-button>
        <el-button
          size="small"
          plain
          icon="el-icon-refresh"
          @click="refreshData()"
        >重置</el-button>
      </el-form-item>
      <el-form-item class="export_btn">
        <el-button
          :loading="downloadLoading"
          size="small"
          type="primary"
          icon="el-icon-document"
          @click="handleDownload"
        >导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item>
        <span
          type="primary"
        >总魅力值：{{
          todayList.length > 0
            ? todayList[0].totalGoldCoin.toLocaleString()
            : 0
        }}</span>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60">
        <template slot-scope="{ row }">
          {{ row.cIndex + (listQuery.page - 1) * listQuery.limit }}
        </template>
      </el-table-column>
      <el-table-column label="用户ID" width="125">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column
        prop="oldCoin"
        label="变更前魅力值"
        sortable
        min-width="130"
      />
      <el-table-column
        prop="goldCoin"
        label="变更魅力值"
        min-width="130"
        sortable
      />
      <el-table-column
        prop="endCoin"
        label="变更后魅力值"
        min-width="130"
        sortable
      />
      <!-- <el-table-column label="类型" width="100"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.isIncrease ? 'info' : 'primary'">{{
            row.typeString
          }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column label="来源" width="200">
        <template slot-scope="{ row }">
          <el-tag
            size="medium"
            :type="row.isIncrease ? 'info' : 'success'"
          >{{ row.stringString }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="trn"
        label="订单号"
        min-width="160"
      />
      <el-table-column
        prop="gmtCreateString"
        label="订单创建时间"
        width="140"
      />
      <!-- <el-table-column
          prop="gmtUpdateString"
          label="更新时间"
          width="140"

        /> -->
    </el-table>

    <!-- <el-table v-cloading="todayListLoading" :data="todayList" border size="mini">
        <el-table-column type="" label="" width="60"   />
        <el-table-column label="" min-width="60"   />
        <el-table-column prop="" label="" min-width="60"   />
        <el-table-column
          prop="totalGoldCoin"
          label="总金币"
          min-width="60"

        />
        <el-table-column label="" width="100"   />
        <el-table-column label="" width="200"   />
        <el-table-column prop="" label="" width="140"   />
        <el-table-column prop="" label="" width="140"   />
      </el-table> -->
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
// import { getAssetsPlusList, getAssetsPlus } from "@/api/center/assets/plus";
import { getAssetsPlusList, getAssetsPlus } from '@/api/center/assets/charm'
import { anchorAllTypes } from '@/api/center/user/assets_log'
import { formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: 'CenterUserAssetsPlusController',
  filters: {
    typeFilter(status) {
      const map = { 0: 'info', 1: 'success', 2: 'danger' }
      return map[status]
    },
    stringFilter(type) {
      const map = {
        0: 'info',
        1: 'success',
        2: 'danger',
        3: 'success',
        4: 'success',
        5: 'success',
        6: 'success',
        7: 'success',
        8: 'success',
        9: 'success',
        11: 'success',
        12: 'success',
        13: 'success',
        14: 'success',
        15: 'success',
        16: 'success',
        17: 'success',
        18: 'success',
        19: 'success',
        20: 'success',
        21: 'success',
        22: 'success',
        23: 'success',
        24: 'success',
        25: 'success'
      }
      return map[type]
    }
  },
  components: {
    UserDrawer
  },
  data() {
    return {
      todayList: [],
      list: [],
      listLoading: true,
      downloadLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        status: null,
        trn: null,
        pickerValue: []
      },
      // 状态选择
      isIncreaseOptions: [
        { label: '增加资产', value: 0 },
        { label: '减少资产', value: 1 }
      ],
      typeOptions: [],
      typeOptionsOld: [
        { label: '关播付费收益', value: 0 },
        { label: '送礼收益', value: 1 },
        { label: '日榜彩金发送', value: 24 },
        { label: '周榜彩金发送', value: 25 },
        { label: '用户购买贵族', value: 33 },
        { label: '用户续费贵族', value: 34 },
        { label: '用户升级贵族', value: 35 },
        { label: '线上充值', value: 2 },
        { label: '用户付费扣费', value: 3 },
        { label: '用户送礼扣费', value: 4 },
        { label: '主播守护收益', value: 6 },
        { label: '金牌主播保底收益发放', value: 7 },
        { label: '金币提现', value: 8 },
        { label: '魅力提现', value: 9 },
        { label: '后台修改资产', value: 12 },
        { label: '魅力值转换成金币', value: 13 },
        { label: '银行卡充值收益', value: 28 },
        { label: '开元游戏上分变换金币', value: 16 },
        { label: '开元游戏下分变换金币', value: 17 },
        { label: '彩票投注扣费', value: 18 },
        { label: '彩票投注失败退回金币', value: 19 },
        { label: '彩票开奖结算金币', value: 20 },
        { label: '金币提现被驳回', value: 26 },
        { label: '彩票补偿金币', value: 36 },
        { label: '彩票补偿添加金币资产', value: 37 },
        { label: '用户购买座驾', value: 23 },
        { label: '红包中奖', value: 613 },
        { label: '今存明送彩票彩金', value: 40 },
        { label: '神秘活动彩金', value: 42 },
        { label: '红包活动', value: 45 },
        { label: 'BG游戏上分变换金币', value: 52 },
        { label: 'BG游戏下分变换金币', value: 53 },
        { label: 'CMD游戏上分变换金币', value: 54 },
        { label: 'CMD游戏下分变换金币', value: 55 },
        { label: '沙巴体育上分变换金币', value: 56 },
        { label: '沙巴体育下分变换金币', value: 57 },
        { label: 'BTI体育上分变换金币', value: 58 },
        { label: 'BTI体育下分变换金币', value: 59 },
        { label: 'SE真人上分变换金币', value: 60 },
        { label: 'SE真人下分变换金币', value: 61 },
        { label: 'USDT充值收益', value: 299 },
        { label: '人工-测试金币', value: 120 },
        { label: '人工-首充彩金', value: 121 },
        { label: '人工-首提彩金', value: 122 },
        { label: '人工-用户亏损彩金', value: 123 },
        { label: '人工-掉单', value: 124 },
        { label: '人工-其他', value: 125 },
        { label: '人工-人工提出', value: 126 },
        { label: '人工-每日亏损彩金', value: 127 },
        { label: '人工-用户贡献彩金', value: 128 },
        { label: '人工-每日首充彩金', value: 129 },
        { label: '人工-用户回馈彩金', value: 130 },
        { label: '人工-广告工资', value: 131 },
        { label: 'OB真人上分变换金币', value: 70 },
        { label: 'OB真人下分变换金币', value: 71 },
        { label: 'XG体育上分变换金币', value: 74 },
        { label: 'XG体育下分变换金币', value: 75 },
        { label: 'PG电子上分变换金额', value: 320 },
        { label: 'PG电子下分变换金额', value: 321 },
        { label: 'RSG电子上分变换金额', value: 322 },
        { label: 'RSG电子下分变换金额', value: 323 },
        { label: 'AG上分变换金额', value: 29 },
        { label: 'AG下分变换金额', value: 30 },
        { label: 'PP电子上分变换金额', value: 324 },
        { label: 'PP电子下分变换金额', value: 325 },
        { label: 'EVO电子上分变换金额', value: 326 },
        { label: 'EVO电子下分变换金额', value: 327 },
        { label: 'QT游戏上分变换金额', value: 328 },
        { label: 'QT游戏下分变换金额', value: 329 },
        { label: '体育反水', value: 331 },
        { label: '真人反水', value: 332 },
        { label: '老虎机反水', value: 333 },
        { label: 'RWB投注扣钱', value: 420 },
        { label: 'RWB重新结算扣钱', value: 421 },
        { label: 'RWB结算加钱', value: 422 },
        { label: 'FB投注扣钱', value: 400 },
        { label: 'FB派彩/本金', value: 401 },
        { label: 'FB退款', value: 402 },
        { label: 'FB提前结算', value: 403 },
        { label: 'FB订单取消补扣', value: 404 },
        { label: 'FB订单取消返还', value: 405 },
        { label: '注册体验活动', value: 460 },
        { label: '注册体验活动扣除', value: 461 },
        { label: 'VIP升级礼金', value: 334 },
        { label: 'VIP月红包', value: 335 },
        { label: 'VIP生日礼金', value: 336 },
        { label: 'VIP周复赛奖金', value: 337 }
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
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
  },
  methods: {
    // 刷新
    refreshData() {
      this.list = null
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        isIncrease: null,
        trn: null,
        pickerValue: this.initTimer
      }
      this.fetchData()
    },

    // 获取列表数据
    async fetchData() {
      this.listLoading = true
      this.todayListLoading = true
      getAssetsPlus(
        this.listQuery.limit,
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
        console.log(this.todayList)
      })
      if (!this.typeOptions.length) {
        const itemsArray = []
        const moneyTypeRes = await anchorAllTypes()
        if (moneyTypeRes.code === 200 && moneyTypeRes.data.all) {
          moneyTypeRes.data.all.map((item) => {
            const citem = {
              label: item.assetsName,
              value: item.assetsType
            }
            itemsArray.push(citem)
          })
        }
        this.typeOptions = itemsArray
      }
      getAssetsPlusList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      )
        .then((res) => {
          console.log(res, '23222')
          this.list = (res.data.list || []).map((item, index) => {
            var typeString = ''
            if (item.isIncrease === 0) {
              typeString = '增加资产'
            } else if (item.isIncrease === 1) {
              typeString = '减少资产'
            }
            item.cIndex = index + 1
            var stringString = item.type
            const fliterArray = this.typeOptions.filter((citem) => {
              return citem.value === item.type
            })
            if (fliterArray.length) {
              stringString = fliterArray[0].label
            }
            // if (item.type == 0) {
            //   stringString = '关播付费收益'
            // } else if (item.type == 1) {
            //   stringString = '送礼收益'
            // } else if (item.type == 2) {
            //   stringString = '充值收益'
            // } else if (item.type == 3) {
            //   stringString = '用户付费扣费'
            // } else if (item.type == 4) {
            //   stringString = '用户送礼扣费'
            // } else if (item.type == 5) {
            //   stringString = '用户守护扣费'
            // } else if (item.type == 6) {
            //   stringString = '主播守护收益'
            // } else if (item.type == 7) {
            //   stringString = '金牌主播保底收益发放'
            // } else if (item.type == 8) {
            //   stringString = '金币提现'
            // } else if (item.type == 9) {
            //   stringString = '魅力提现'
            // } else if (item.type == 10) {
            //   stringString = '游戏代入金币'
            // } else if (item.type == 11) {
            //   stringString = '游戏代出金币'
            // } else if (item.type == 12) {
            //   stringString = '后台修改资产'
            // } else if (item.type == 13) {
            //   stringString = '魅力值转换成金币'
            // } else if (item.type == 14) {
            //   stringString = '分享收益兑换金币'
            // } /* else if (item.type == 15) {
            //     stringString = '代理账户给用户充值金币'
            //   } */ else if (item.type == 16) {
            //   stringString = '开元游戏上分变换金币'
            // } else if (item.type == 17) {
            //   stringString = '开元游戏下分变换金币'
            // } else if (item.type == 18) {
            //   stringString = '彩票投注扣费'
            // } else if (item.type == 19) {
            //   stringString = '彩票投注失败退回金币'
            // } else if (item.type == 20) {
            //   stringString = '彩票开奖结算金币'
            // } else if (item.type == 22) {
            //   stringString = 'job添加用户资产'
            // } else if (item.type == 23) {
            //   stringString = '用户购买座驾'
            // } else if (item.type == 24) {
            //   stringString = '日榜彩金发送'
            // } else if (item.type == 25) {
            //   stringString = '周榜彩金发送'
            // } else if (item.type == 26) {
            //   stringString = '金币提现被驳回'
            // } else if (item.type == 27) {
            //   stringString = '魅力提现被驳回'
            // } else if (item.type == 28) {
            //   stringString = '银行卡充值收益'
            // } else if (item.type == 29) {
            //   stringString = 'ag游戏上分变换金币'
            // } else if (item.type == 30) {
            //   stringString = 'ag游戏下分变换金币'
            // } /* else if (item.type == 31) {
            //     stringString = '大富翁游戏上分变换金币'
            //   } else if (item.type == 32) {
            //     stringString = '大富翁游戏下分变换金币'
            //   } */ else if (item.type == 33) {
            //   stringString = '用户购买贵族'
            // } else if (item.type == 34) {
            //   stringString = '用户续费贵族'
            // } else if (item.type == 35) {
            //   stringString = '用户升级贵族'
            // } else if (item.type == 36) {
            //   stringString = '彩票补偿金币'
            // } else if (item.type == 37) {
            //   stringString = '资产变更-彩票补偿金币'
            // } else if (item.type == 40) {
            //   stringString = '今存明送彩票彩金'
            // } else if (item.type == 42) {
            //   stringString = '神秘活动彩金'
            // } else if (item.type == 41) {
            //   stringString = '工资等级彩金'
            // } else if (item.type == 43) {
            //   stringString = '现金回馈彩金'
            // } else if (item.type == 44) {
            //   stringString = '彩票得意彩金'
            // } else if (item.type == 45) {
            //   stringString = '红包彩金'
            // } else if (item.type == 47) {
            //   stringString = '每日盈亏'
            // } else if (item.type == 51) {
            //   stringString = '金牛报春'
            // } else if (item.type == 52) {
            //   stringString = 'BG游戏上分变换金币'
            // } else if (item.type == 53) {
            //   stringString = 'BG游戏下分变换金币'
            // } else if (item.type == 54) {
            //   stringString = 'CMD体育上分变换金额'
            // } else if (item.type == 55) {
            //   stringString = 'CMD体育下分变换金额'
            // } else if (item.type == 561) {
            //   stringString = '一分快三-[和值]'
            // } else if (item.type == 562) {
            //   stringString = '一分快三-[二同号复选]'
            // } else if (item.type == 563) {
            //   stringString = '一分快三-[三军]'
            // } else if (item.type == 571) {
            //   stringString = '一分时时彩-[个位]'
            // } else if (item.type == 572) {
            //   stringString = '一分时时彩-[十位]'
            // } else if (item.type == 573) {
            //   stringString = '一分时时彩-[龙虎万千]'
            // } else if (item.type == 581) {
            //   stringString = '北京赛车-[猜冠军]'
            // } else if (item.type == 582) {
            //   stringString = '北京赛车-[冠亚和大小单双]'
            // } else if (item.type == 591) {
            //   stringString = '一分六合彩-[特码两面]'
            // } else if (item.type == 592) {
            //   stringString = '一分六合彩-[特码生肖]'
            // } else if (item.type == 593) {
            //   stringString = '一分六合彩-[特码色波]'
            // } else if (item.type == 601) {
            //   stringString = '鱼虾蟹-[一同号]'
            // } else if (item.type == 602) {
            //   stringString = '鱼虾蟹-[二同号]'
            // } else if (item.type == 603) {
            //   stringString = '鱼虾蟹-[二不同]'
            // } else if (item.type == 611) {
            //   stringString = '河内彩票-[特码]'
            // } else if (item.type == 612) {
            //   stringString = '河内彩票-[普通号]'
            // } else if (item.type == 120) {
            //   stringString = '人工-测试金币'
            // } else if (item.type == 121) {
            //   stringString = '人工-首充彩金'
            // } else if (item.type == 122) {
            //   stringString = '人工-首提彩金'
            // } else if (item.type == 123) {
            //   stringString = '人工-用户亏损彩金'
            // } else if (item.type == 124) {
            //   stringString = '人工-掉单'
            // } else if (item.type == 125) {
            //   stringString = '人工-其他'
            // } else if (item.type == 126) {
            //   stringString = '人工-人工提出'
            // } else if (item.type == 127) {
            //   stringString = '人工-每日亏损彩金'
            // } else if (item.type == 128) {
            //   stringString = '人工-用户贡献彩金'
            // } else if (item.type == 129) {
            //   stringString = '人工-每日首充彩金'
            // } else if (item.type == 130) {
            //   stringString = '人工-用户回馈彩金'
            // } else if (item.type == 131) {
            //   stringString = '人工-广告工资'
            // } else if (item.type == 299) {
            //   stringString = 'USDT充值收益'
            // } else if (item.type == 56) {
            //   stringString = '沙巴体育上分变换金币'
            // } else if (item.type == 57) {
            //   stringString = '沙巴体育下分变换金币'
            // } else if (item.type == 613) {
            //   stringString = '红包中奖'
            // } else if (item.type == 58) {
            //   stringString = 'BTI体育上分变换金币'
            // } else if (item.type == 59) {
            //   stringString = 'BTI体育下分变换金币'
            // } else if (item.type == 60) {
            //   stringString = 'SE真人上分变换金币'
            // } else if (item.type == 61) {
            //   stringString = 'SE真人下分变换金币'
            // } else if (item.type == 74) {
            //   stringString = 'XG体育上分变换金币'
            // } else if (item.type == 75) {
            //   stringString = 'XG体育下分变换金币'
            // } else if (item.type == 70) {
            //   stringString = 'OB真人上分变换金币'
            // } else if (item.type == 71) {
            //   stringString = 'OB真人下分变换金币'
            // } else if (item.type == 324) {
            //   stringString = 'PP电子上分变换金额'
            // } else if (item.type == 325) {
            //   stringString = 'PP电子下分变换金额'
            // } else if (item.type == 326) {
            //   stringString = 'EVO电子上分变换金额'
            // } else if (item.type == 327) {
            //   stringString = 'EVO电子下分变换金额'
            // } else if (item.type == 328) {
            //   stringString = 'QT游戏上分变换金额'
            // } else if (item.type == 329) {
            //   stringString = 'QT游戏下分变换金额'
            // } else if (item.type == 331) {
            //   stringString = '体育反水'
            // } else if (item.type == 332) {
            //   stringString = '真人反水'
            // } else if (item.type == 333) {
            //   stringString = '老虎机反水'
            // } else if (item.type == 420) {
            //   stringString = 'RWB投注扣钱'
            // } else if (item.type == 421) {
            //   stringString = 'RWB重新结算扣钱'
            // } else if (item.type == 422) {
            //   stringString = 'RWB结算加钱'
            // } else if (item.type == 400) {
            //   stringString = 'FB投注扣钱'
            // } else if (item.type == 401) {
            //   stringString = 'FB派彩/本金'
            // } else if (item.type == 402) {
            //   stringString = 'FB退款'
            // } else if (item.type == 403) {
            //   stringString = 'FB提前结算'
            // } else if (item.type == 404) {
            //   stringString = 'FB订单取消补扣'
            // } else if (item.type == 405) {
            //   stringString = 'FB订单取消返还'
            // } else if (item.type == 460) {
            //   stringString = '注册体验活动'
            // } else if (item.type == 461) {
            //   stringString = '注册体验活动扣除'
            // } else if (item.type == 334) {
            //   stringString = 'VIP升级礼金'
            // } else if (item.type == 335) {
            //   stringString = 'VIP月红包'
            // } else if (item.type == 336) {
            //   stringString = 'VIP生日礼金'
            // } else if (item.type == 337) {
            //   stringString = 'VIP周复赛奖金'
            // }
            this.$set(item, 'typeString', typeString)
            this.$set(item, 'stringString', stringString)
            this.$set(item, 'gmtCreateString', formatUnixTime(item.gmtCreate))
            this.$set(item, 'gmtUpdateString', formatUnixTime(item.gmtUpdate))
            return item
          })
          this.listQuery.total = res.data.total
          this.listLoading = false
        })
        .catch((err) => {
          this.list = []
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j]
        })
      )
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
          '变更前魅力值',
          '变更魅力值',
          '变更后魅力值',
          '类型',
          '来源',
          '订单号',
          '订单创建时间'
        ]
        const filterVal = [
          'uid',
          'oldCoin',
          'goldCoin',
          'endCoin',
          'typeString',
          'stringString',
          'trn',
          'gmtCreateString'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '用户魅力值报表',
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    // 过滤
    handleSearchFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.listQuery.page = 1
      this.fetchData()
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    }
  }
}
</script>
<style scoped>
.input-with-select {
  background-color: #fff;

  /* .el-input-group__prepend {
      background-color: #fff;
    } */
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
</style>
