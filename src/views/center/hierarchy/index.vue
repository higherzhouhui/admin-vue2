<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
        <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
          :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" value-format="timestamp"
          @change="handleSearchFilter" />
      </el-form-item> -->

      <el-form-item>
        <el-input v-model="listQuery.name" size="small" style="width: 240px" placeholder="请输入层级名称" clearable
          maxlength="50" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="refreshData()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加用户层级</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <!-- <el-table-column prop="id" label="用户ID" min-width="35"  ></el-table-column> -->
      <el-table-column prop="name" label="层级名称" min-width="110" />
      <el-table-column prop="inComeTime" label="入款次数" min-width="80" sortable />
      <el-table-column prop="inComeTotal" label="入款总额" min-width="120" sortable />
      <el-table-column prop="userNumber" label="用户数量" min-width="80" :cell-class-name="addClass" sortable />
      <el-table-column prop="statusString" label="类型" min-width="80">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.type | statusFilter">{{
            row.statusString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="80" />
      <el-table-column prop="gmtCreateString" label="创建时间" width="140" />
      <el-table-column prop="operator" label="创建人" min-width="80" />
      <el-table-column label="操作" width="130" fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" plain type="warning" size="mini" @click="addRoutes1(row)">分层</span>
          <span class="operation_btn" type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</span>
          <span class="operation_btn" type="danger" size="mini" @click="showDeleteDialogClick(row)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新建编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
          <el-form-item prop="name" label="层级名称"><el-input v-model="createModel.name" clearable placeholder="层级名称"
              maxlength="20" /></el-form-item>
          <el-form-item prop="inComeTime" label="入款次数"><el-input v-model="createModel.inComeTime" clearable
              placeholder="人款次数" maxlength="10" /></el-form-item>
          <el-form-item prop="inComeTotal" label="入款总额"><el-input v-model="createModel.inComeTotal" clearable
              placeholder="入款总额" maxlength="20" /></el-form-item>
          <el-form-item label="层级类型">
            <el-switch v-model="createModel.type" active-text="人工" :active-value="'1'" inactive-text="自动"
              :inactive-value="'0'" />
          </el-form-item>
          <el-form-item prop="remark" label="备注"><el-input v-model="createModel.remark" clearable placeholder="备注"
              maxlength="10" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import {
  getOrderList,
  getOrder,
  deleteHierarchyUser,
  updateHierarchyUser,
  createHierarchyUser,
} from '@/api/center/hierarchy/hierarchy'
import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: 'CenterUserHierarchyController3',
  filters: {
    statusFilter(status) {
      const map = { 0: 'info', 1: 'success', 2: 'danger' }
      return map[status]
    },
    wayFilter(status) {
      const map = { 1: 'success', 2: '' }
      return map[status]
    },
  },
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
        uid: null,
        status: null,
        name: null,
        pickerValue: [],
      },
      // 状态选择
      statusOptions: [
        { label: '未支付', value: 0 },
        { label: '已支付', value: 1 },
      ],

      rules: {
        uid: [{ required: true, message: '请输入用户ID', trigger: 'change' }],
      },

      // 表单模型
      createModel: {
        id: null,
        name: null,
        inComeTime: null,
        inComeTotal: null,
        userNumber: null,
        type: null,
        remark: null,
      },
      resetCreateModel() {
        this.createModel = {
          id: null,
          name: null,
          inComeTime: null,
          inComeTotal: null,
          userNumber: null,
          type: null,
          remark: null,
        }
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogChangeVisible: false,
      dialogChangeLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        update: '修改用户层级',
        create: '添加用户层级',
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
        pickerValue: this.initTimer,
      }
      this.fetchData()
    },

    addRoutes1(row) {
      this.$router.push({
        path: '/finance/center/dlized/index',
        query: { tt: row.id },
      })
      // this.$router.push({path:'/user/center/user/letter/index',query:{tt:row.id }})
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      // this.todayListLoading = true;
      getOrderList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var statusString = ''
            if (item.type == '0') {
              statusString = '自动'
            } else if (item.type == '1') {
              statusString = '人工'
            }
            this.$set(item, 'statusString', statusString)
            this.$set(item, 'gmtCreateString', formatUnixTime(item.gmtCreate))
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

    addClass({ row, column, rowIndex, columnIndex }) {
      console.log(row)
      console.log(column)
      console.log(rowIndex)
      console.log(columnIndex)
    },

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('是否删除该用户层级？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteHierarchyUser([row.id])
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除用户ID成功',
                type: 'success',
                duration: 1500,
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
        .catch(() => { })
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogCreateLoading = true
          const params = {
            id: formDic.id,
            name: nullS(formDic.name),
            inComeTime: formDic.inComeTime,
            inComeTotal: formDic.inComeTotal,
            type: nullS(formDic.type),
            remark: nullS(formDic.remark),
          }
          if (this.dialogStatus === 'create') {
            createHierarchyUser(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建用户层级成功',
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
          } else {
            params['uid'] = formDic.uid || 0
            updateHierarchyUser(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改用户层级成功',
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

    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'update'
      this.createModel = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示新建弹出窗
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

  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}

.cell-blue {
  color: blue !important;
  cursor: pointer;
}
</style>
