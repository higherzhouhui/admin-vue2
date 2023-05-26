<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true" class="searchFormWrapper">
      <!-- <el-form-item>
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
      <!-- 状态 -->
      <el-form-item>
        <el-input
          v-model="listQuery.anchorId"
          size="small"
          placeholder="请输入主播ID"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-search"
          type="primary"
          @click="handleSearchFilter"
        >搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="refreshData">重置</el-button>
      </el-form-item>
      <el-form-item class="export_btn">
        <!-- 导出 -->
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
    <el-form :inline="true">
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-edit"
          type="primary"
          @click="handlePrice"
        >价格设置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="主播ID" min-width="125">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.anchorId" :jumps="true" />
        </template>
      </el-table-column>
      <el-table-column
        prop="anchorNickname"
        label="主播昵称"
        min-width="100"
      />
      <el-table-column
        prop="liveId"
        label="房间ID"
        min-width="100"
      />
      <el-table-column
        prop="broadCastMessage"
        label="广播内容"
        min-width="200"
      />
      <el-table-column
        prop="clicks"
        label="点击人数"
        min-width="100"
      />
      <el-table-column
        prop="gold"
        label="付费价格（金币）"
        min-width="200"
      />
      <el-table-column
        prop="createTimeString"
        label="发送时间"
        min-width="200"
      />
    </el-table>
    <el-dialog title="设置邀请广播价格" :visible.sync="dialogVisible" :close-on-click-modal="false" :destroy-on-close="true">
      <div v-cloading="dialogLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="createModel"
          :rules="rules"
          label-width="100px"
          label-position="top"
          size="medium"
        >
          <el-form-item label="价格" prop="goldCoin">
            <el-input
              v-model.number="createModel.goldCoin"
              clearable
              placeholder="请输入价格"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogVisible = false">取消</el-button>
        <el-button size="medium" type="primary" :loading="dialogLoading" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>
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
  </div>
</template>

<script>
import { getInvitedList, updateBroadcast, getBroadcast } from '@/api/live/invited_record'
import { formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime() 

export default {
  name: 'InvitedRecord',
  filters: {},
  components: {
    UserDrawer
  },
  data() {
    return {
      list: [],
      listLoading: true,
      downloadLoading: false,
      dialogVisible: false,
      dialogLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        pickerValue: []
      },
      rules: {
        goldCoin: [
          { required: true, message: '请输入价格', trigger: 'change' }
        ]
      },
      createModel: {},
      statusOptions: [
        { value: 1, label: '日榜' },
        { value: 2, label: '周榜' },
        { value: 3, label: '月榜' }
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
      peopleData: 0,
      rankValueData: 0
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
      this.listQuery = {
        pageNum: 1,
        pageSize: 20,
        pickerValue: this.initTimer
      }
      setTimeout(() => {
        this.fetchData()
      }, 80)
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.familyList = null
      let startTime = ''
      let endTime = ''
      if (this.listQuery.pickerValue && this.listQuery.pickerValue.length) {
        startTime = this.listQuery.pickerValue[0]
        endTime = this.listQuery.pickerValue[1]
      }
      this.listQuery = {
        ...this.listQuery,
        startTime,
        endTime
      }
      getInvitedList(this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            item.createTimeString = formatUnixTime(item.createTime)
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
    handlePrice() {
      this.dialogVisible = true
      // 获取价格
      this.createModel = {}
      this.dialogLoading = true
      getBroadcast().then(res => {
        this.dialogLoading = false
        if (res.code === 200) {
          this.createModel = {
            goldCoin: res.data.gold
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 创建/更新 数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogLoading = true
          updateBroadcast(this.createModel).then(res => {
            this.dialogLoading = false
            if (res.code === 200) {
              this.$notify({
                title: '提示',
                message: '操作成功！',
                type: 'success'
              })
              this.dialogVisible = false
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    // 导出
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          '主播ID',
          '主播昵称',
          '房间ID',
          '广播内容',
          '点击人数',
          '付费价格（金币）',
          '发送时间',
        ]
        const filterVal = [
          'anchorId',
          'anchorNickname',
          'liveId',
          'broadCastMessage',
          'clicks',
          'gold',
          'createTimeString'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '主播邀请记录'
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
    }
  }
}
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
  width: 360px;
  margin-right: 10px;
  /*
  .el-input-group__prepend {
    background-color: #fff;
  } */
}
.vue-img-preview {
  width: 30px;
  height: 30px;
  margin: 0px;
  padding: 0px;
  border-radius: 3px;
}
.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
</style>
