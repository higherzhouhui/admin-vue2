<template>
  <div class="app-container">
    <div style="margin-bottom: 20px">
      <el-button size="medium" type="primary" icon="el-icon-edit-outline"
        @click="showCreateDialogClick()">添加余额</el-button>
      <span style="margin-right: 10px"></span>
      <el-input size="medium" v-model="listQuery.aid" class="input-with-select" placeholder="请输入代理商id" clearable
        @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
        <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button>
      </el-input>
      <span style="margin-right: 10px"></span>
      <el-date-picker size="small" clearable v-model="listQuery.pickerValue" type="datetimerange"
        :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
        align="right" format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" value-format="timestamp"
        @change="handleSearchFilter"></el-date-picker>
      <el-button :loading="downloadLoading" style="margin-left: 0 0 0px 0px" type="primary" icon="el-icon-document"
        @click="handleDownload">
        导出Excel
      </el-button>
    </div>

    <el-table v-cloading="listLoading" :data="list" border highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="aid" label="代理商ID" min-width="80"></el-table-column>
      <el-table-column prop="username" label="代理商名称" min-width="80"></el-table-column>
      <el-table-column prop="balanceAdd" label="添加金币数量" min-width="80"></el-table-column>
      <el-table-column prop="balanceAddBefore" label="添加金币之前数量" min-width="80"></el-table-column>
      <el-table-column prop="balanceAddAfter" label="添加金币之后数量" min-width="80"></el-table-column>
      <el-table-column prop="operator" label="操作人" min-width="80"></el-table-column>
      <el-table-column prop="remark" label="备注" min-width="80"></el-table-column>
      <el-table-column prop="createTimeString" label="创建时间" width="160"></el-table-column>
    </el-table>

    <el-table v-cloading="todayListLoading" :data="todayList" border highlight-current-row size="mini">
      <el-table-column type="" label="" width="60"></el-table-column>
      <el-table-column prop="" label="" min-width="80"></el-table-column>
      <el-table-column prop="" label="" min-width="80"></el-table-column>
      <el-table-column prop="totalCoin" label="总添加金币数量" min-width="80"></el-table-column>
      <el-table-column prop="" label="" min-width="80"></el-table-column>
      <el-table-column prop="" label="" min-width="80"></el-table-column>
      <el-table-column prop="" label="" min-width="80"></el-table-column>
      <el-table-column prop="" label="" min-width="80"></el-table-column>
      <el-table-column prop="" label="" width="160"></el-table-column>
    </el-table>

    <!-- 新建/编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true" top="5vh" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="80px"
          size="medium">
          <span v-if="dialogStatus === 'create'">
            <el-form-item label="代理商ID" prop="aid">
              <el-input v-model.number="createModel.aid" clearable placeholder="请输入代理商ID" maxlength="30"
                show-word-limit />
            </el-form-item>
            <el-form-item label="添加额度量" prop="balance">
              <el-input v-model.number="createModel.balance" clearable placeholder="请输入添加额度量" maxlength="30"
                show-word-limit />
            </el-form-item>
          </span>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="createModel.remark" placeholder="请输入备注说明" maxlength="100"
              :autosize="{ minRows: 2, maxRows: 4 }" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total"></el-pagination>
  </div>
</template>

<script>
import {
  agentBalanceList,
  addBalance,
  agentTotalList,
} from '@/api/agent/balance'
import { nullS, formatUnixTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
import FilenameOption from './components/FilenameOption'
import AutoWidthOption from './components/AutoWidthOption'
import BookTypeOption from './components/BookTypeOption'

export default {
  name: 'AgentUserController',
  filters: {},
  components: {
    UserDrawer,
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        aid: null,
        pickerValue: [],
        downloadLoading: false,
        filename: '',
        autoWidth: true,
        bookType: 'xlsx',
      },

      // 表单模型
      createModel: {
        aid: null,
        balance: 0,
        remark: null,
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加额度',
      },

      // 验证规则
      rules: {
        balance: [
          { required: true, message: '请输入添加额度量', trigger: 'change' },
          { type: 'number', message: '请输入正确的数值', trigger: 'change' },
        ],
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
    this.fetchData()
  },
  methods: {
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        aid: null,
        balance: 0,
        remark: null,
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      agentTotalList(this.listQuery.limit, this.listQuery.page, this.listQuery)
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
          return agentBalanceList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          )
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            this.$set(item, 'createTimeString', formatUnixTime(item.createTime))
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

    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = [
          '商户ID',
          '代理商名称',
          '添加金币数量',
          '添加金币之前数量',
          '添加金币之后数量',
          '操作人',
          '备注',
          '申请时间',
        ]
        const filterVal = [
          'aid',
          'username',
          'balanceAdd',
          'balanceAddBefore',
          'balanceAddAfter',
          'operator',
          'remark',
          'createTime',
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType,
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === 'createTime') {
            return formatUnixTime(v[j])
          }
          if (j === 'gmtComplete' && v[j] != null) {
            return formatUnixTime(v[j])
          }
          if (j === 'status' && v[j] != null) {
            if ((v[j] = 0)) {
              return '待审核'
            } else if ((v[j] = 1)) {
              return '已通过'
            } else if ((v[j] = 2)) {
              return '已驳回'
            }
            return v[j]
          } else {
            return v[j]
          }
        })
      )
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogCreateLoading = true
          const params = {
            aid: formDic.aid || 0,
            balance: formDic.balance || 0,
            remark: nullS(formDic.remark),
          }
          if (this.dialogStatus === 'create') {
            addBalance(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '添加额度成功',
                  type: 'success',
                  duration: 1500,
                })
                setTimeout((_) => {
                  this.fetchData()
                }, 200)
              })
              .catch((err) => {
                this.dialogCreateLoading = false
                this.$message.error(err)
              })
          }
        }
      })
    },

    // 显示创建弹出窗
    showCreateDialogClick() {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
  },
}
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
  width: 360px;
  margin-right: 10px;

  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}

.vue-pagination {
  margin: 20px 0px 20px 0px;
  padding: 0px;
}
</style>
