<template>
  <div class="app-container">
    <div class="flex-top-center">
      <div>
        <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
        <el-form :inline="true">
          <!-- <el-form-item>
          <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
            :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
            align="right" format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" value-format="timestamp"
            @change="handleSearchFilter" />
        </el-form-item> -->
          <el-form-item>
            <el-input v-model="listQuery.uid" size="small" style="width: 240px" placeholder="请输入用户ID" clearable
              maxlength="10" oninput="value=value.replace(/[^\d]/g,'')" @keyup.enter.native="handleSearchFilter"
              @clear="handleSearchFilter" />
          </el-form-item>
          <el-form-item class="nowrap">
            <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
            <el-button size="small" plain icon="el-icon-refresh" @click="refreshData()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-button :loading="downloadLoading" size="small" type="primary" icon="el-icon-document" @click="handleDownload">
        导出Excel
      </el-button>
    </div>


    <el-table v-cloading="listLoading" :data="list" size="mini">
      <el-table-column type="index" label="序号" min-width="60" />
      <el-table-column label="用户ID" min-width="80">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="addCount" label="新增用户数量" min-width="60" />
      <el-table-column prop="activeCount" label="活跃用户数量" min-width="60" />
      <el-table-column prop="rechargeCount" label="充值用户数量" min-width="60" />
      <el-table-column prop="rechargeAmount" label="充值金额" min-width="60" />
      <el-table-column prop="seconddayPreserve" label="次日留存" min-width="60" />
      <el-table-column prop="thirddayPreserve" label="三日留存" min-width="60" />
      <el-table-column prop="weekPreserve" label="周留存" min-width="60" />
      <el-table-column prop="monthPreserve" label="月留存" min-width="60" />
      <el-table-column prop="date" label="日期" min-width="80" />
      <el-table-column prop="shareProfit" label="分享获得的VND" width="120" />
    </el-table>

    <div style="margin: 40px 0px">
      <el-divider content-position="center">
        <h2>总统计</h2>
      </el-divider>
    </div>

    <el-table v-cloading="todayListLoading" :data="todayList" size="mini">
      <el-table-column type="" label="" min-width="18" />
      <el-table-column prop="" label="" min-width="80" />
      <el-table-column prop="addCount" label="总新增用户数量" min-width="60" />
      <el-table-column prop="activeCount" label="活跃总用户数量" min-width="60" />
      <el-table-column prop="rechargeCount" label="总充值用户数量" min-width="60" />
      <el-table-column prop="rechargeAmount" label="总充值金额" min-width="60" />
      <el-table-column label="次日留存" min-width="60">
        <template slot-scope="{ row }">
          <span>{{ `${row.seconddayPreserve}%` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="三日留存" min-width="60">
        <template slot-scope="{ row }">
          <span>{{ `${row.thirddayPreserve}%` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周留存" min-width="60">
        <template slot-scope="{ row }">
          <span>{{ `${row.weekPreserve}%` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="月留存" min-width="60">
        <template slot-scope="{ row }">
          <span>{{ `${row.monthPreserve}%` }}</span>
        </template>
      </el-table-column>
      <!--  <el-table-column prop="" label="" min-width="80"  ></el-table-column> -->
      <el-table-column prop="shareProfit" label="分享获得的总VND" width="120" />
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 4000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import { getUserList, getTotal } from '@/api/promotion/user'
import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: 'StatPromotionUserController',
  filters: {},
  components: {
    UserDrawer
  },
  data() {
    return {
      list: null,
      listLoading: true,
      todayList: null,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        pickerValue: [NOW_TIME_START, NOW_TIME_END]
      },
      downloadLoading: false,
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
      this.list = null
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        pickerValue: [NOW_TIME_START, NOW_TIME_END]
      }
      this.fetchData()
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.todayListLoading = true
      getTotal(this.listQuery.limit, this.listQuery.page, this.listQuery)
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
          return getUserList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          )
        })
        .then((res) => {
          this.list = (res.data != null ? res.data.list : []).map((item) => {
            this.$set(item, 'gmtCreateString', formatUnixTime(item.gmtUpdate))
            return item
          })
          this.listQuery.total = res.data != null ? res.data.total : 0
          this.listLoading = false
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
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
          '新增用户数量',
          '活跃用户数量',
          '充值用户数量',
          '充值金额',
          '次日留存',
          '三日留存',
          '周留存',
          '月留存',
          '日期',
          '分享获得的金币'
        ]
        const filterVal = [
          'uid',
          'addCount',
          'activeCount',
          'rechargeCount',
          'rechargeAmount',
          'seconddayPreserve',
          'thirddayPreserve',
          'weekPreserve',
          'monthPreserve',
          'date',
          'shareProfit'
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
        })
      )
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
