<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
        <span class="search_info">创建时间</span>
        <el-date-picker
          v-model="listQuery.pickerValue"
          size="small"
          clearable
          type="datetimerange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <el-input
          v-model="listQuery.bossId"
          size="small"
          placeholder="请输入家族长ID"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.bossName"
          size="small"
          placeholder="请输入家族长名称"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.status"
          size="small"
          placeholder="请选择状态"
          clearable
          @change="handleSearchFilter"
        >
          <el-option label="已发放" value="1" />
          <el-option label="未发放" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-search"
          type="primary"
          @click="handleSearchFilter"
        >搜索</el-button>
        <el-button
          size="small"
          icon="el-icon-refresh"
          @click="resets()"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column
        prop="showTime"
        label="时间"
        min-width="120"
      />
      <el-table-column
        prop="bossId"
        label="家族长ID"
        min-width="120"
      />
      <el-table-column
        prop="bossName"
        label="家族名称"
        min-width="120"

        sortable
      />
      <el-table-column
        prop="anchorNum"
        label="主播数量"
        min-width="100"
      />
      <el-table-column
        prop="anchorTime"
        label="总播时长"
        min-width="130"
      />
      <el-table-column
        prop="anchorValidTime"
        label="总播有效时长"
        min-width="110"
      />
      <el-table-column
        prop="totalFamilyAgencyFee"
        label="总中介费"
        min-width="120"
      />
      <el-table-column label="状态" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.status | statusFilter">{{
            row.statusString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime2"
        label="创建时间"
        width="160"
      />
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="{ row }">
          <span
            class="operation_btn"
            type="primary"
            size="mini"
            @click="showUpdateDialogClick(row)"
          >查看明细</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 查看明细 -->
    <el-dialog
      title="中介费明细"
      :visible.sync="dialogCreateVisible2"
      :show-close="true"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogCreateLoading2" style="width: 100%; height: 100%">
        <el-form :inline="true">
          <el-form-item>
            <el-input
              v-model="listQuery2.uid"
              size="small"
              class="input-with-select"
              placeholder="请输入主播ID"
              clearable
              @keyup.enter.native="handleSearchFilter2"
              @clear="handleSearchFilter2"
            />
          </el-form-item>

          <el-form-item>
            <el-button
              size="small"
              icon="el-icon-search"
              type="primary"
              @click="handleSearchFilter2"
            >搜索</el-button>
            <!-- 重置 -->
            <el-button size="small" icon="el-icon-refresh" @click="resets2">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-cloading="listLoading2"
          :data="list2"
          size="mini"
          fit
          highlight-current-row
          show-summary
          :summary-method="getSummaries"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
          />
          <el-table-column
            prop="anchorId"
            label="主播ID"
            min-width="100"
          />
          <el-table-column
            prop="anchorName"
            label="主播昵称"
            min-width="100"
          />
          <el-table-column
            prop="anchorTypeName"
            label="主播类型"
            min-width="100"
          />
          <el-table-column
            prop="belong"
            label="所属日期"
            min-width="100"
          />
          <el-table-column
            prop="activeTime"
            label="有效时长"
            min-width="100"
          />
          <el-table-column
            prop="subsidy"
            label="工资"
            min-width="100"

            sortable
          />
          <el-table-column
            prop="familyAgencyFee"
            label="中介费"
            min-width="100"

            sortable
          />
        </el-table>
      </div>
      <!-- <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible2 = false"
          >取消</el-button
        >
        <el-button
          size="medium"
          type="primary"
          @click="dialogCreateVisible2 = false"
          >确定</el-button
        >
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import {
  queryFamilyAgencyFeeList,
  queryFamilyAgencyFeeDetailList,
  queryTotalFamilyAgencyFeeDetailList
} from '@/api/live/FamilyLeader'
import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: 'AgentPayController',
  filters: {
    statusFilter(status) {
      const map = { 0: 'info', 1: 'success' }
      return map[status]
    }
  },
  data() {
    return {
      list: null,
      list2: null,
      data3: {},
      listLoading: true,
      listLoading2: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        uid: null,
        orderNo: null,
        status: null,
        type: null,
        cardName: null,
        pickerValue: [],
        startTime: '',
        endTime: ''
      },
      listQuery2: {
        uid: ''
      },

      dialogCreateVisible2: false,
      dialogCreateLoading2: false,
      queryFamilyAgencyFeeDetailListFData: {}
    }
  },
  computed: {
    initTimer() {
      return this.$store.getters.timerDate
    }
  },
  created() {
    let [NOW_TIME_START, NOW_TIME_END] = this.initTimer
    this.listQuery.startTime = NOW_TIME_START
    this.listQuery.endTime = NOW_TIME_END
    this.listQuery.pickerValue = this.initTimer
    this.fetchData()
  },
  methods: {
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      queryFamilyAgencyFeeList(this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var statusString = ''
            if (item.status == 1) {
              statusString = '已发放'
            } else if (item.status == 0) {
              statusString = '未发放'
            }
            if (item.createTime.toString().length > 0) {
              item.createTime2 = formatUnixTime(item.createTime)
            }
            this.$set(item, 'statusString', statusString)
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
    // 开起
    showUpdateDialogClick(res) {
      this.queryFamilyAgencyFeeDetailListFData = res
      this.queryFamilyAgencyFeeDetailListF(res)
      this.dialogCreateVisible2 = true
    },

    // 中介费明细
    queryFamilyAgencyFeeDetailListF(res) {
      this.listLoading2 = true
      queryFamilyAgencyFeeDetailList({
        bossId: res.bossId,
        startTime: res.startTime,
        endTime: res.endTime,
        ...this.listQuery2
      })
        .then((res_2) => {
          this.list2 = (res_2.data.list || []).map((item) => {
            // var statusString = "";
            // if (item.status == 1) {
            //   statusString = "已发放";
            // } else if (item.status == 0) {
            //   statusString = "未发放";
            // }
            // if (item.createTime.toString().length > 0) {
            //   item.createTime2 = formatUnixTime(item.createTime);
            // }
            // this.$set(item, "statusString", statusString);
            return item
          })
          this.listLoading2 = false

          queryTotalFamilyAgencyFeeDetailList({
            bossId: res.bossId,
            startTime: res.startTime,
            endTime: res.endTime,
            ...this.listQuery2
          }).then((item) => {
            console.log('获取统计', item)
            this.data3 = item.data || {}
          })
        })
        .catch((err) => {
          this.list2 = null
          this.listLoading2 = false
          this.$message.error(err)
        })
    },

    // 尾部合计
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      if (columns != undefined && data != undefined) {
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '当前页合计'
            return
          }
          if (index === 1) {
            sums[index] = '--'
            return
          }
          if (index === 2) {
            sums[index] = '--'
            return
          }
          if (index === 3) {
            sums[index] = '--'
            return
          }
          if (index === 4) {
            sums[index] = '--'
            return
          }
          if (index === 5) {
            sums[index] = this.data3.activeTime || '0小时0分'
            return
          }
          if (index === 6) {
            sums[index] = this.data3.subsidy || '0'
            return
          }
          if (index === 7) {
            sums[index] = this.data3.familyAgencyFee || '0'
            return
          }
          //   const values = data.map((item) => Number(item[column.property]));
          //   if (!values.every((value) => isNaN(value))) {
          //     sums[index] = values.reduce((prev, curr) => {
          //       const value = Number(curr);
          //       if (!isNaN(value)) {
          //         return prev + curr;
          //       } else {
          //         return prev;
          //       }
          //     }, 0);
          //     sums[index] += " 元";
          //   } else {
          //     sums[index] = "N/A";
          //   }
        })
        return sums
      }
    },
    // 过滤
    handleSearchFilter() {
      this.listQuery.pageNum = 1
      if (this.listQuery.pickerValue != null) {
        this.listQuery.startTime =
          this.listQuery.pickerValue[0] != undefined
            ? this.listQuery.pickerValue[0]
            : null
        this.listQuery.endTime =
          this.listQuery.pickerValue[0] != undefined
            ? this.listQuery.pickerValue[1]
            : null
      } else {
        this.listQuery.startTime = null
        this.listQuery.endTime = null
      }
      this.fetchData()
    },
    // 过滤
    handleSearchFilter2() {
      this.queryFamilyAgencyFeeDetailListF(
        this.queryFamilyAgencyFeeDetailListFData
      )
    },
    // 重置
    resets() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        uid: null,
        orderNo: null,
        status: null,
        type: null,
        cardName: null,
        pickerValue: this.initTimer
      }
      this.fetchData()
    },
    // 重置2
    resets2() {
      this.listQuery2.uid = ''
      this.queryFamilyAgencyFeeDetailListF(
        this.queryFamilyAgencyFeeDetailListFData
      )
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
    }
  }
}
</script>
<style scoped>
.vue-pagination {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0px;
  padding: 0px;
}
</style>
