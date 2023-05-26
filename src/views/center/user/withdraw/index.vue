<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
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
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="fetchData()"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="success"
          icon="el-icon-refresh"
          @click="refreshData()"
        />
      </el-form-item>
    </el-form>
    <el-badge style="width: 100%" value="以下所有金额单位为VND" class="item" />
    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <!--      <el-table-column prop="rechargeMoney" label="usdt入款" min-width="80"  >-->
      <!--        <template slot-scope="{ row }">-->
      <!--          &lt;!&ndash; <span>{{ `${row.bankCoin}VND(${row.bankCount}人)`}}</span> &ndash;&gt;-->
      <!--          <span> VND: <strong>{{ `${row.rechargeMoney}` }}</strong><br>usdt: <strong>{{ `${row.rechargeMoneyUsdt}` }}</strong><br>人数: <strong>{{ `${row.usdtCountUsdt}` }}</strong></span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-col0umn prop="rechargeMoney" label="usdt优惠" min-width="80"  >-->
      <!--        <template slot-scope="{ row }">-->
      <!--          &lt;!&ndash; <span>{{ `${row.bankCoin}VND(${row.bankCount}人)`}}</span> &ndash;&gt;-->
      <!--          <span> VND: <strong>{{ `${row.rewardMoneyUsdt}` }}</strong><br>人数: <strong>{{ `${row.rewardMoneyCountUsdt}` }}</strong></span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column
        prop="type"
        label="统计类别"
        min-width="80"
         
      />
      <el-table-column
        prop="bankCoin"
        label="银行卡入款"
        min-width="80"
         
      />
      <el-table-column
        prop="discountBankCoin"
        label="银行卡总优惠"
        min-width="80"
         
      />
      <el-table-column
        prop="orderCoin"
        label="线上入款"
        min-width="80"
         
      />
      <!--  <el-table-column prop="agentCoin" label="代理入款" min-width="80"  >
      <template slot-scope="{ row }">
        <span>{{ `${row.agentCoin}VND(${row.agentCount}人)`}}</span>
      </template>
    </el-table-column> -->
      <el-table-column
        prop="personUp"
        label="人工入款"
        min-width="80"
         
      />

      <!--  <el-table-column prop="discountCoin" label="优惠" min-width="80"  >
      <template slot-scope="{ row }">
        <span>{{ `${row.discountCoin}元(${row.discountCount}人)`}}</span>
      </template>
    </el-table-column> -->
      <el-table-column
        prop="totalDeposit"
        label="总入款(不含人工入款)"
        min-width="80"
         
      />
      <el-table-column
        prop="getPersonCoin"
        label="总入款(含人工入款)"
        min-width="80"
         
      />
      <el-table-column
        prop="totalCoin"
        label="用户出款"
        min-width="80"
         
      />
      <el-table-column
        prop="totalAnchorCoin"
        label="主播出款"
        min-width="80"
         
      />
      <el-table-column
        prop="bankAmount"
        label="代理出款(银行卡)"
        min-width="80"
         
      />
      <el-table-column
        prop="walletAmount"
        label="代理出款(USDT)"
        min-width="80"
         
      />
      <el-table-column
        prop="personDown"
        label="人工提款"
        min-width="80"
         
      />
      <el-table-column
        prop="allCoin"
        label="总出款"
        min-width="80"
         
      />
      <el-table-column
        prop="allGet"
        label="总盈利"
        min-width="80"
         
      />
    </el-table>
  </div>
</template>

<script>
import { totalCoin } from '@/api/center/user/total_withdraw'

export default {
  name: 'WithDrawController',
  filters: {
    typeFilter(status) {
      const map = { 0: 'success', 1: 'warning' }
      return map[status]
    }
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
        type: null,
        pickerValue: []
      },
      // 道具选择
      typeOptions: [
        { label: '代入', value: 0 },
        { label: '代出', value: 1 }
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
  created() {
    this.fetchData()
  },
  methods: {
    // 刷新
    refreshData() {
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        type: null,
        pickerValue: []
      }
      this.fetchData()
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      totalCoin(this.listQuery)
        .then((res) => {
          var totallist = []
          if (
            res.data != null &&
            res.data != undefined &&
            JSON.stringify(res.data) != '{}'
          ) {
            const data = JSON.parse(JSON.stringify(res.data))
            Object.keys(data).map((item) => {
              if (item.includes('Coin')) {
                const newItme = item.replace('Coin', 'Count')
                data[item] = data[newItme]
              }
            })
            totallist = [
              { ...res.data, type: '金额', totalDeposit: res.data.getCoin, bankAmount: res.data.bankAmount || 0, walletAmount: res.data.walletAmount || 0 },
              {
                ...data,
                type: '人数',
                totalDeposit: data.bankCount + data.orderCount,
                personDown: data.personDownCount,
                personUp: data.personUpCount,
                allCoin:
                  data.totalCount +
                  data.totalAnchorCount +
                  data.personDownCount +
                  (data.bankNum || 0) * 1 +
                  (data.walletNum || 0) * 1,
                getPersonCoin:
                  data.bankCount + data.orderCount + data.personUpCount,
                allGet: '-',
                bankAmount: data.bankNum || 0,
                walletAmount: data.walletNum || 0
              }
            ]
          }
          this.list = totallist
          this.listLoading = false
        })
        .catch((err) => {
          this.list = null
          this.$message.error(err)
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

.item {
  display: flex;
  justify-content: flex-end;
}
</style>
