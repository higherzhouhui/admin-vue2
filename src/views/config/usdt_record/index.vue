<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true" class="searchFormWrapper">
      <!-- <el-form-item>
        <span class="search_info">审核时间</span>
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
          format="yyyy-MM-dd HH:mm"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <!-- 状态 -->
        <el-select
          v-model="listQuery.status"
          style="width: 130px"
          size="small"
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
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.bankId"
          size="small"
          style="width: 200px"
          placeholder="请选择查询USDT类型"
          clearable
          @clear="handleSearchFilter"
        >
          <el-option
            v-for="item in familyList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- <el-input -->
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          style="width: 130px"
          size="small"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <!-- <el-input
        size="medium"
        v-model="listQuery.bankId"
        class="input-with-select"
        placeholder="请输入银行卡ID"
        clearable
        @keyup.enter.native="handleSearchFilter"
        @clear="handleSearchFilter"
      >
      </el-input>
-->
      <el-form-item>
        <el-input
          v-model="listQuery.thirdOrderNo"
          size="small"
          placeholder="请输入第三方转账订单号"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.orderNo"
          size="small"
          placeholder="请输入系统订单号"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <!-- <span style="margin-right: 10px;"></span>
      <el-dropdown split-button type="primary"     trigger="click" >
         刷新时间
        <el-dropdown-menu slot="dropdown">
           <el-dropdown-item @click.native="handleClick(300000000)">不刷新</el-dropdown-item>
           <el-dropdown-item @click.native="handleClick(5000)">5秒</el-dropdown-item>
           <el-dropdown-item @click.native="handleClick(10000)">10秒</el-dropdown-item>
           <el-dropdown-item @click.native="handleClick(20000)">20秒</el-dropdown-item>
           <el-dropdown-item @click.native="handleClick(30000)">30秒</el-dropdown-item>
           <el-dropdown-item @click.native="handleClick(60000)">60秒</el-dropdown-item>
           <el-dropdown-item @click.native="handleClick(120000)">120秒</el-dropdown-item>
           <el-dropdown-item @click.native="handleClick(300000)">300秒</el-dropdown-item>
         </el-dropdown-menu>
       </el-dropdown> -->

      <!--  <div style="display: flex;align-items: center;">审核时间</div> -->

      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchFilter"
        >搜索</el-button>
        <el-button
          size="small"
          icon="el-icon-refresh"
          @click="reset"
        >重置</el-button>
      </el-form-item>
      <el-form-item class="export_btn">
        <el-button
          size="small"
          :loading="downloadLoading"
          type="primary"
          icon="el-icon-document"
          @click="handleDownload"
        >
          导出Excel
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60" fixed="left" />
      <!--  <el-table-column prop="id" label="ID" min-width="60"  ></el-table-column> -->
      <!-- <el-table-column prop="uid"   label="用户id" min-width="60"  ></el-table-column> -->
      <el-table-column label="用户ID" min-width="120" fixed="left">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column
        prop="levelName"
        label="层级"
        min-width="60"
      />
      <el-table-column
        prop="thirdOrderNo"
        label="付款订单号"
        min-width="170"
      />
      <el-table-column
        prop="bankName"
        label="转账通道"
        min-width="70"
      />
      <el-table-column
        prop="cardNoCostomer"
        label="付款地址"
        min-width="170"
      />

      <el-table-column
        prop="goldCoin"
        label="充值金币"
        min-width="100"

        sortable
      />
      <el-table-column
        prop="rewardMoney"
        label="奖励金币"
        min-width="100"

        sortable
      />
      <!--      <el-table-column prop="rechargeMoney" label="充值金额" min-width="100"   />-->
      <el-table-column
        prop="rechargeMoneyUsdt"
        label="USDT数量"
        min-width="120"

        sortable
      />
      <el-table-column
        prop="rate"
        label="汇率"
        min-width="100"

        sortable
      />
      <!--  <el-table-column prop="thirdOrderNo" label="第三方订单号" min-width="120"  ></el-table-column> -->
      <el-table-column
        prop="orderRemark"
        label="汇款留言"
        min-width="120"
      />

      <el-table-column label="状态" width="80">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.status | statusFilter">{{
            row.statusString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        min-width="60"
      />
      <el-table-column
        prop="operator"
        label="操作人"
        min-width="80"
      />
      <el-table-column
        prop="orderNo"
        label="提单订单号"
        min-width="170"
      />
      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="160"
      />
      <el-table-column
        prop="updateTimeString"
        label="审核时间"
        width="160"
      />
      <el-table-column
        v-if="$store.getters.buttonPermission.includes('usdt入款审核操作')"
        label="操作"
        width="160"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <span
            class="operation_btn"
            type="success"
            size="mini"
            @click="checkAnchorPassClick(row)"
          >审核</span>
          <span
            class="operation_btn"
            type="danger"
            size="mini"
            @click="checkAnchorRefuseClick(row)"
          >驳回</span>
          <span
            class="operation_btn"
            type="warning"
            size="mini"
            @click="checkErrorRefuseClick(row)"
          >异常驳回</span>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-cloading="todayListLoading" :data="todayList" size="mini">
      <el-table-column tprop="" label="" width="60" />
      <el-table-column
        prop=""
        label=""
        min-width="100"
      />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column prop="" label="" min-width="160" />
      <el-table-column prop="" label="" min-width="70" />
      <el-table-column prop="" label="" min-width="100" />
      <el-table-column
        prop="goldCoin"
        label="总充值金币"
        min-width="120"
      />
      <el-table-column
        prop="rewardMoney"
        label="总充值奖励金币"
        min-width="120"
      />
      <el-table-column
        prop="rechargeMoneyUsdt"
        label="总充值USDT"
        min-width="120"
      />
      <el-table-column prop="" label="" min-width="100" />
      <el-table-column prop="" label="" min-width="120" />
      <el-table-column
        prop=""
        label=""
        width="80"
      />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column prop="" label="" min-width="170" />

      <!--      <el-table-column prop="goldCoin" label="总充值金币" min-width="100"   />-->
      <!--      <el-table-column prop="rechargeMoneyUsdt" label="总充值USDT" min-width="100"   />-->
      <!--      <el-table-column prop="rewardMoney" label="总充值奖励金币" min-width="100"   />-->
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
  </div>
</template>

<script>
import {
  gatRecordList,
  gatTotalList,
  checkStatus,
  getBankList,
  checkErrorStatus,
  update_Time
} from '@/api/config/usdt_record'
import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: 'ConfigUsdtRechargeRecordController',
  filters: {
    statusFilter(status) {
      const map = { 1: 'info', 2: 'success', 3: 'danger' }
      return map[status]
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
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        bankId: null,
        thirdOrderNo: null,
        orderNo: null,
        uid: null,
        status: null,
        pickerValue: [],
        filename: '',
        autoWidth: true,
        bookType: 'xlsx'
      },
      downloadLoading: false,
      familyList: null,
      updatetime1: 10000,

      timer: null, // 定时器名称
      statusOptions: [
        { value: 1, label: '未支付' },
        { value: 2, label: '已确认' },
        { value: 3, label: '已驳回' }
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

  /* mounted() {
    if	(this.timer) {
      clearInterval(this.timer);
    } else  { this.timer = setInterval(()=>{
      this.fetchData();
        }, 30000);
    }
  }, */

  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        pickerValue: this.initTimer,
      }
      this.fetchData()
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.todayListLoading = true
      this.familyList = null

      getBankList().then((res) => {
        this.familyList = (res.data.list || []).map((item) => {
          return {
            value: item.bankId,
            label: item.bankName
          }
        })
      })
      /* getupdate_Time()
            .then(res => {
                      if (res.data != null && res.data != undefined && JSON.stringify(res.data) != '{}') {
                       if (res.data !== 'null') {
                          this.updatetime1  = null;
                          this.updatetime1  = res.data
                          sessionStorage.setItem("updatetime1",res.data)
                          console.log(res.data)
                           console.log("==========="+this.updatetime1)
                           console.log("===222222222========"+sessionStorage.getItem("updatetime1"))
                      }
                     }
                    }) */

      // this.listLoading = true;
      gatTotalList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
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
          return gatRecordList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          )
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var statusString = ''
            var recMoney = item.rechargeMoney.toLocaleString()

            var bankIdString = ''
            this.familyList.map((m1) => {
              if (item.bankId == m1.value) {
                // return m.label;
                bankIdString = m1.label
              }
            })

            if (item.status == 1) {
              statusString = '未支付'
            } else if (item.status == 2) {
              statusString = '已确认'
            } else if (item.status == 3) {
              statusString = '已驳回'
            } else if (item.status == 5) {
              statusString = '失败'
            }
            this.$set(item, 'recMoney', recMoney)
            this.$set(item, 'bankIdString', bankIdString)
            this.$set(item, 'statusString', statusString)
            this.$set(
              item,
              'createTimeString',
              formatUnixTime(item.createTime)
            )
            this.$set(
              item,
              'updateTimeString',
              formatUnixTime(item.updateTime)
            )
            return item
          })
          this.listLoading = false
          this.listQuery.total = res.data.total
        })
        .catch((err) => {
          this.list = []
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },

    handleClick(num) {
      console.log(num)
      update_Time(num)
        .then((res) => {
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: '设置成功',
            type: 'success',
            duration: 1500
          })
          setTimeout((_) => {
            this.fetchData()
          }, 200)
        })
        .catch((err) => {
          this.listLoading = false
          this.$message.error(err)
        })
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
          '层级',
          '付款订单号',
          '转账通道',
          '付款地址',
          '充值金币',
          '奖励金币',
          'USDT数量',
          '汇率',
          '汇款留言',
          '状态',
          '备注',
          '操作人',
          '提单订单号',
          '创建时间',
          '审核时间'
        ]
        const filterVal = [
          'uid',
          'levelName',
          'thirdOrderNo',
          'bankName',
          'cardNoCostomer',
          'goldCoin',
          'rewardMoney',
          'rechargeMoneyUsdt',
          'rate',
          'orderRemark',
          'statusString',
          'remark',
          'operator',
          'orderNo',
          'createTimeString',
          'updateTimeString'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j]
          /*   debugger;

        if(j === 'bankId'){
          this.familyList.map(m =>{
             if (v[j] == m.value) {
                return m.label;
                }
          })
        } */

          /*
        if (j === 'createTime') {
          return new Date(v[j])
        } if (j === 'updateTime' && v[j] != null) {
          return new Date(v[j])
        } if (j === 'status' && v[j] != null) {
          if (v[j] == 1) {
             return '未支付'
          } else if (v[j] == 2){
            return '已确认'
          } else if (v[j] == 3){
            return '已驳回'
          }
          return v[j]
        } else {
          return v[j]
        } */
        })
      )
    },

    checkAnchorPassClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      if (row.status > 1) {
        this.$message.error('已审核，请勿重复操作')
        return
      }
      const rowDic = Object.assign({}, row)

      this.$confirm('是否通过？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          checkStatus(rowDic.id, 2)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '审核成功',
                type: 'success',
                duration: 1500
              })
              setTimeout((_) => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },

    checkAnchorRefuseClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      if (row.status > 1) {
        this.$message.error('已审核，请勿重复操作')
        return
      }
      const rowDic = Object.assign({}, row)

      this.$confirm('是否驳回？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          checkStatus(rowDic.id, 3)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '驳回成功',
                type: 'success',
                duration: 1500
              })
              setTimeout((_) => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },

    checkErrorRefuseClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      if (row.status > 1) {
        this.$message.error('已审核，请勿重复操作')
        return
      }
      const rowDic = Object.assign({}, row)

      this.$confirm('是否驳回？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          checkErrorStatus(rowDic.id, 3)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '驳回成功',
                type: 'success',
                duration: 1500
              })
              setTimeout((_) => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => {})
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
  width: 250px;
  margin-right: 10px;
  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}

.vue-pagination {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0px;
  padding: 0px;
}
</style>
