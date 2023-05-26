<template>
  <div class="app-container">
    <audio
      ref="audio"
      controls="controls"
      hidden
      src="../../../assets/tip.wav"
      muted
    />
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <!-- 状态 -->
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
          format="yyyy-MM-dd HH:mm"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
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
          placeholder="请选择查询银行卡"
          clearable
          @change="handleSearchFilter"
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
          style="width: 150px"
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
          v-model="listQuery.orderName"
          size="small"
          placeholder="请输入汇款姓名"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.orderNo"
          size="small"
          placeholder="请输入订单号"
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
    <el-form>
      <el-form-item>
        <span class="search_info">页面刷新时间</span>
        <el-select
          v-model="timerType"
          style="width: 100px"
          size="small"
          placeholder="请选择刷新方式"
          @change="refresh"
        >
          <el-option
            v-for="item in timerList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="timerType !== -1">
        <span
          style="font-size: 14px"
        >将在 <span style="color: red">{{ num }}</span> 秒后刷新数据</span>
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
      <!-- <el-table-column prop="bankId" label="支付银行卡id" min-width="120"  ></el-table-column> -->
      <!-- <el-table-column prop="bankIdString" label="支付银行卡xx" min-width="120"  ></el-table-column> -->
      <el-table-column
        prop="orderNo"
        label="订单号"
        min-width="170"
      />
      <el-table-column prop="name" label="层级" min-width="80" />
      <el-table-column
        prop="accountNumber"
        label="汇款账号"
        min-width="150"
      />
      <el-table-column
        prop="orderName"
        label="汇款姓名"
        min-width="80"
      />
      <el-table-column
        prop="orderRemark"
        label="汇款留言"
        min-width="80"
      />
      <el-table-column
        prop="cardNo"
        label="银行卡号"
        min-width="150"
      />
      <el-table-column
        prop="goldCoin"
        label="充值金币"
        min-width="120"

        sortable
      />
      <el-table-column
        prop="recMoney"
        label="充值金额"
        min-width="150"

        sortable
      />
      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="140"
      />
      <el-table-column
        prop="updateTimeString"
        label="审核时间"
        width="140"
      />
      <!--  <el-table-column prop="thirdOrderNo" label="第三方订单号" min-width="120"  ></el-table-column> -->
      <el-table-column label="状态" width="80">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.status | statusFilter">{{
            row.statusString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="operator"
        label="操作人"
        min-width="80"
      />
      <el-table-column
        prop="remark"
        label="备注"
        min-width="60"
      />
      <el-table-column
        v-if="$store.getters.buttonPermission.includes('公司入款审核操作')"
        label="操作"
        width="160"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <span
            class="operation_btn"
            type="success"
            size="mini"
            :disabled="row.status !== 1"
            @click="checkAnchorPassClick(row)"
          >审核</span>
          <span
            class="operation_btn"
            type="danger"
            size="mini"
            :disabled="row.status !== 1"
            @click="checkAnchorRefuseClick(row)"
          >驳回</span>
          <span
            class="operation_btn"
            type="warning"
            size="mini"
            :disabled="row.status !== 1"
            @click="checkErrorRefuseClick(row)"
          >异常驳回</span>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-cloading="todayListLoading" :data="todayList" size="mini">
      <el-table-column type="" label="" width="60" />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column
        prop="totalCoin"
        label="总充值金币"
        min-width="150"
      />
      <el-table-column
        prop="totalAmount"
        label="总充值金额"
        min-width="150"
      />
      <el-table-column prop="" label="" min-width="120" />
      <el-table-column prop="" label="" min-width="120" />
      <el-table-column prop="" label="" min-width="120" />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column label="" width="80" />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column prop="" label="" width="160" />
      <el-table-column prop="" label="" width="160" />
      <el-table-column label="" width="160" />
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
  update_Time,
  getupdate_Time
} from '@/api/config/bank_record'
import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import FilenameOption from './components/FilenameOption'
import AutoWidthOption from './components/AutoWidthOption'
import BookTypeOption from './components/BookTypeOption'
import UserDrawer from '@/components/UserDrawer'
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: 'ConfigBankBaseController',
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
        orderName: null,
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
        { value: 3, label: '已驳回' },
        { value: 5, label: '失败' }
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
      },
      timerList: [
        { label: '10秒', value: 10 },
        { label: '30秒', value: 30 },
        { label: '1分钟', value: 60 },
        { label: '3分钟', value: 180 },
        { label: '5分钟', value: 300 },
        { label: '10分钟', value: 600 },
        { label: '不刷新', value: -1 }
      ],
      timerType: -1,
      num: 0
    }
  },
  watch: {
    $route(val) {
      if (val.fullPath != '/finance/config/bank_record/index') {
        clearInterval(this.timer)
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
  mounted() {
    clearInterval(this.timer)
    this.refresh()
  },
  activated() {
    this.refresh()
  },
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
    // 刷新
    refresh(num) {
      this.num = this.timerType
      clearInterval(this.timer)
      if (this.num == -1) return
      const _this = this
      this.timer = setInterval((num) => {
        _this.num = this.num - 1
        if (this.num === 0) {
          this.num = this.timerType
          this.fetchData()
        }
      }, 1016)
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.todayListLoading = true
      this.familyList = []

      getBankList().then((res) => {
        this.familyList = (res.data.list || []).map((item) => {
          return {
            value: item.bankId,
            label: item.bankName + ' ---- ' + item.trueName
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
      const _the = this
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
          this.listLoading = false
          return gatRecordList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          )
        })
        .then((res) => {
          let playFlag = true
          let orderNos = localStorage.getItem('orderNos')
          if (!orderNos) {
            orderNos = []
          } else {
            orderNos = JSON.parse(orderNos)
          }
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
              if (orderNos.indexOf(item.orderNo) == -1) {
                orderNos.push(item.orderNo)
                if (playFlag) {
                  _the.playTip()
                  playFlag = false
                }
              }
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
          localStorage.setItem('orderNos', JSON.stringify(orderNos))
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
          '订单号',
          '层级',
          '汇款账号',
          '汇款姓名',
          '汇款留言',
          '银行卡号',
          '充值金币',
          '充值金额',
          '创建时间',
          '审核时间',
          '状态',
          '操作人',
          '备注'
        ]
        const filterVal = [
          'uid',
          'orderNo',
          'name',
          'accountNumber',
          'orderName',
          'orderRemark',
          'cardNo',
          'goldCoin',
          'recMoney',
          'createTimeString',
          'updateTimeString',
          'statusString',
          'operator',
          'remark'
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
    playTip() {
      this.$refs.audio.currentTime = 0 // 从头开始播放提示音
      this.$refs.audio.play() // 播放
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
      this.num = this.timerType
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
