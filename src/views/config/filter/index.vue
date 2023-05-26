<template>
  <div class="app-container">
    <el-form :inline="true">
      <!-- 状态 -->
      <el-form-item>
        <el-select v-model="listQuery.filterType" size="small" placeholder="请选择处理类型" clearable @change="handleSearchFilter">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加用户</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column prop="uid" label="用户ID" width="120" />
      <el-table-column label="过滤类型" width="120">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.filterType | typeFilter">{{ row.typeString }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="details" label="详情" min-width="35" />
      <el-table-column prop="createTimeString" label="创建时间" width="150" />
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</span>
          <span class="operation_btn" type="danger" size="mini" @click="showDeleteDialogClick(row)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新建/编辑 消息公告 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false" :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading" style="width: 100%;height: 100%;">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" size="medium">
          <el-form-item label="用户ID" prop="uid"><el-input v-model="createModel.uid" clearable placeholder="请输入用户ID" maxlength="200" /></el-form-item>
          <el-form-item label="过滤类型">
            <el-switch v-model="createModel.filterType" active-text="发言过滤" :active-value="'1'" inactive-text="统计过滤" :inactive-value="'0'" />
          </el-form-item>
          <el-form-item label="用户备注" prop="details"><el-input v-model="createModel.details" clearable placeholder="请输入备注信息" maxlength="200" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFilterUserList, createFilterUser, updateFilterUser, deleteFilterUser } from '@/api/config/filter'
import { emptyS, nullS, formatUnixTime } from '@/utils/tools'

export default {
  name: 'ConfigFilterUserController',
  filters: {
    statusFilter(status) {
      const map = { 1: 'info', 0: 'success', 2: 'danger' }
      return map[status]
    },
    typeFilter(status) {
      const map = { 0: 'info', 1: 'warning', 2: 'danger' }
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
        filterType: null
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加过滤用户',
        update: '编辑过滤用户'
      },

      // 表单模型
      createModel: {
        id: null,
        uid: null,
        details: null,
        filterType: null
      },
      typeOptions: [{ label: '统计过滤', value: 0 }, { label: '发言过滤', value: 1 }],
      // 验证规则
      rules: {
        uid: [{ required: true, message: '请输入用户ID', trigger: 'change' }]

      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.fetchData()
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: null,
        uid: null,
        details: null,
        filterType: '0'
      }
    },

    // 刷新
    refreshData() {
      this.list = null
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        filterType: null

      }
      this.fetchData()
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getFilterUserList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then(res => {
          this.list = (res.data.list || []).map(item => {
            var typeString = ''
            if (item.filterType == 0) {
              typeString = '统计过滤'
            } else if (item.filterType == 1) {
              typeString = '发言过滤'
            }
            this.$set(item, 'typeString', typeString)
            this.$set(item, 'createTimeString', formatUnixTime(item.createTime))
            this.$set(item, 'updateTimeString', formatUnixTime(item.updateTime))
            return item
          })
          this.listLoading = false
          this.listQuery.total = res.data.total
        })
        .catch(err => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
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

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('是否删除该用户ID？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteFilterUser([row.id])
            .then(res => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除用户ID成功',
                type: 'success',
                duration: 1500
              })
              setTimeout(_ => {
                this.fetchData()
              }, 200)
            })
            .catch(err => {
              this.listLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogCreateLoading = true
          const params = {

            uid: nullS(formDic.uid),
            details: nullS(formDic.details),
            filterType: nullS(formDic.filterType)
          }
          if (this.dialogStatus === 'create') {
            createFilterUser(params)
              .then(res => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建过滤信息成功',
                  type: 'success',
                  duration: 1500
                })
                setTimeout(_ => {
                  this.fetchData()
                }, 200)
              })
              .catch(err => {
                this.dialogCreateLoading = false
                this.$message.error(err)
              })
          } else {
            params['uid'] = formDic.uid || 0
            updateFilterUser(params)
              .then(res => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改过滤信息成功',
                  type: 'success',
                  duration: 1500
                })
                setTimeout(_ => {
                  this.fetchData()
                }, 200)
              })
              .catch(err => {
                this.dialogCreateLoading = false
                this.$message.error(err)
              })
          }
        }
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
  width: 360px;
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
