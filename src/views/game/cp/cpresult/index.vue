<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item> -->
        <!-- <el-tag type="primary">创建时间:</el-tag> -->
        <!-- <el-date-picker
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
          v-model="listQuery.openMethods"
          size="small"
          placeholder="请选择开奖方式"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in openMethodsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.cpName"
          size="small"
          placeholder="请输入彩票名称"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.issue"
          size="small"
          placeholder="请输入彩票期号"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <!--  <el-input
        size="medium"
        v-model="listQuery.uid"
        class="input-with-select"
        placeholder="请输入uid"
        clearable
        @keyup.enter.native="handleSearchFilter"
        @clear="handleSearchFilter"
      >
      </el-input> -->
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
    </el-form>
    <!-- <el-button style="margin: 10px" type="primary" @click="changeStart()">开启彩票弹窗</el-button>
    <el-button style="margin: 10px" type="primary" @click="changeStop()">关闭彩票弹窗</el-button>

    <el-button style="margin: 10px" type="primary" @click="buttonStart()">开启彩票按钮</el-button>
    <el-button style="margin: 10px" type="primary" @click="buttonStop()">关闭彩票按钮</el-button> -->

    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
     >
      <el-table-column type="index" label="序号" width="50"   />
      <el-table-column prop="id" label="ID" min-width="60"   />
      <el-table-column
        prop="name"
        label="彩票名称"
        min-width="60"
         
      />
      <el-table-column
        prop="issue"
        label="期号"
        min-width="80"
         
      />
      <el-table-column
        prop="result"
        label="开奖结果"
        min-width="140"
         
      />

      <el-table-column label="开奖状态" width="80"  >
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.status | statusFilter">{{
            row.statusString
          }}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="description" label="描述信息" width="80"  ></el-table-column> -->
      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="160"
         
      />
      <el-table-column
        prop="updateTimeString"
        label="更新时间"
        width="160"
         
      />
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
  getRecordList,
  startCp,
  stopCp,
  startCpButton,
  stopCpButton
} from '@/api/game/cp/result'
import { formatUnixTime, getDateTime } from '@/utils/tools'
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: 'CpRecordController',
  filters: {
    statusFilter(status) {
      const map = { 0: 'info', 2: 'success', 3: 'danger' }
      return map[status]
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        cpName: null,
        uid: null,
        status: 1,
        pickerValue: [],
        openMethods: ''
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
      statusOptions: [
        { value: 0, label: '未开奖' },
        { value: 1, label: '已开奖' }
      ],
      openMethodsOptions: [
        { value: '', label: '补偿开奖' },
        { value: 1, label: '系统开奖' },
        { value: 3, label: '人工开奖' }
      ]
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
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        status: 1,
        openMethods: '',
        pickerValue: this.initTimer
      }
      this.fetchData()
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.todayListLoading = true
      //  getTotalList(this.listQuery.limit, this.listQuery.page, this.listQuery)
      /* .then(res => {
          var totallist = [];
          if (res.data != null && res.data != undefined && JSON.stringify(res.data) != '{}') {
            totallist.push(res.data);
          }
          this.todayList = totallist;
          this.todayListLoading = false;
          this.listLoading = false;

        }) */
      getRecordList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var statusString = ''
            if (item.status == 0) {
              statusString = '未开奖'
            } else if (item.status == 1) {
              statusString = '已开奖'
            }

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
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },

    changeStart() {
      this.$confirm('是否开启彩票弹窗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          startCp()
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '开启成功',
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

    changeStop() {
      this.$confirm('是否关闭彩票弹窗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          stopCp()
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '关闭成功',
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

    buttonStart() {
      this.$confirm('是否开启彩票按钮？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          startCpButton()
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '开启成功',
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

    buttonStop() {
      this.$confirm('是否关闭彩票按钮？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          stopCpButton()
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '关闭成功',
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
  width: 300px;
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
