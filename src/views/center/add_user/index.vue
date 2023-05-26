<template>
  <div class="app-container">
    <div class="flex-top-center">
      <div>
        <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="listQuery.uid" size="small" style="width: 240px" placeholder="请输入用户ID" clearable
              maxlength="10" oninput="value=value.replace(/[^\d]/g,'')" @keyup.enter.native="handleSearchFilter"
              @clear="handleSearchFilter" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="listQuery.parentChannel" size="small" style="width: 240px" placeholder="请输入渠道名称" clearable
              maxlength="50" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="listQuery.fromValue" size="small" clearable placeholder="请选择用户渠道"
              @change="handleSearchFilter">
              <el-option v-for="item in options" :key="item.value" clearable :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="listQuery.agentId" size="small" style="width: 240px" placeholder="请输入代理ID" clearable
              maxlength="50" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
          </el-form-item>
          <el-form-item class="nowrap">
            <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
            <el-button size="small" icon="el-icon-refresh" @click="refreshData()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-button :loading="downloadLoading" size="small" type="primary" icon="el-icon-document" @click="handleDownload">
        导出Excel
      </el-button>

    </div>

    <el-table v-cloading="listLoading" :data="list" size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="用户ID" min-width="100">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="agent_id" label="代理ID" min-width="80" />
      <el-table-column prop="channel" label="上级渠道" min-width="80" />
      <el-table-column prop="ip" label="IP" min-width="60" />
      <el-table-column prop="udid" label="udid" />
      <el-table-column prop="name" label="层级" min-width="40" />
      <el-table-column prop="userLevel" label="等级" min-width="30" />
      <el-table-column prop="createTime" label="注册时间" min-width="160" />
      <el-table-column prop="lastLoginString" label="最后登录时间" min-width="160" />
      <el-table-column prop="offlineDayString" label="离线天数" min-width="80" />
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
import { getUserList } from '@/api/center/user/add_user'
// const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: 'CenterUserAccountController',
  filters: {},
  components: {
    UserDrawer
  },
  computed: {
    initTimer() {
      return this.$store.getters.timerDate
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
        pickerValue: [],
        uid: null,
        parentChannel: null,
        fromValue: ''
      },
      options: [
        {
          value: 1,
          label: '自然增长'
        },
        {
          value: 2,
          label: '用户推广'
        }
      ],
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
        parentChannel: null,
        fromValue: '',
        pickerValue: this.initTimer
      }
      this.fetchData()
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      var channel = this.$route.query.tt
      console.log(channel)

      var type = this.$route.query.ss
      console.log(type)

      var date = this.$route.query.dd
      console.log(date)

      getUserList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery,
        channel,
        type,
        date
      )
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            if (item.channel == null && item.puid == 0) {
              this.$set(item, 'channel', '自然增长')
            } else if (item.channel == null && item.puid != 0) {
              this.$set(item, 'channel', '用户推广:' + item.puid)
            }

            const milli = item.offlineDay || 0
            const days = Math.floor(milli / 1000 / 60 / 60 / 24)
            const hour = Math.floor((milli / 1000 / 60 / 60) % 24)
            const minute = Math.floor((milli / 1000 / 60) % 60)
            const second = Math.floor((milli / 1000) % 60)
            var lsatTimeString = ''
            if (days > 0) {
              lsatTimeString = `${days}天${hour}时${minute}分${second}秒`
            } else if (hour > 0) {
              lsatTimeString = `${hour}时${minute}分${second}秒`
            } else if (minute > 0) {
              lsatTimeString = `${minute}分${second}秒`
            } else if (second > 0) {
              lsatTimeString = `${second}秒`
            }
            this.$set(item, 'offlineDayString', lsatTimeString)
            this.$set(item, 'gmtCreateString', formatUnixTime(item.gmtCreate))
            this.$set(item, 'lastLoginString', formatUnixTime(item.lastLogin))
            return item
          })
          this.listQuery.total = res.data.total
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
          '上级渠道',
          'IP',
          'udid',
          '层级',
          '等级',
          '注册时间',
          '最后登录时间',
          '离线天数'
        ]
        const filterVal = [
          'uid',
          'channel',
          'ip',
          'udid',
          'name',
          'userLevel',
          'createTime',
          'lastLoginString',
          'offlineDayString'
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
