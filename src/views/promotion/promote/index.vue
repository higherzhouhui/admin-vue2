<template>
  <div class="app-container">
    <el-form :inline="true">
      <!-- 状态 -->
      <el-form-item>
        <el-select v-model="listQuery.status" size="small" placeholder="请选择状态" clearable @change="handleSearchFilter">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.urlName"
          size="small"
          placeholder="请输入链接名称"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <!-- <span style="margin-right: 10px;"></span> -->
      <el-form-item>
        <el-input
          v-model="listQuery.url"
          size="small"
          placeholder="请输入链接url"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item class="nowrap">
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini"  >
      <el-table-column type="index" label="序号" width="60"   />
      <el-table-column prop="id" label="ID" min-width="30"   />
      <el-table-column prop="urlName" label="链接名" min-width="60"   />
      <el-table-column prop="url" label="推广链接" min-width="60"   />
      <el-table-column prop="statusString" label="绑定状态" min-width="60"   />
      <!--  <el-table-column label="状态" width="160"  >
        <template slot-scope="{ row }">
          <el-switch v-model="row.status" :width="30" active-text="启用" :active-value="1" inactive-text="禁用" :inactive-value="2" @change="switchStatusChange(row)"></el-switch>
        </template>
      </el-table-column> -->
      <el-table-column prop="operator" label="操作人" width="120"   />
      <el-table-column prop="updateTimeString" label="更新时间" width="160"   />
      <el-table-column label="操作" width="100"  >
        <template slot-scope="{ row }">
          <span class="operation_btn" plain type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</span>
          <span class="operation_btn" plain type="danger" size="mini" @click="showDeleteDialogClick(row)">删除</span>
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

    <!-- 新建/编辑 消息公告   等等-->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible"   :close-on-click-modal="false" :destroy-on-close="true" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%;height: 100%;">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" size="medium">
          <el-form-item label="链接名" prop="urlName"><el-input v-model="createModel.urlName" clearable placeholder="请输入链接名" maxlength="200" /></el-form-item>
          <el-form-item label="推广链接" prop="url"><el-input v-model="createModel.url" clearable placeholder="请输入推广链接" maxlength="200" /></el-form-item>
          <el-form-item label="绑定状态">
            <el-switch v-model="createModel.status" active-text="绑定" :active-value="1" inactive-text="未绑定" :inactive-value="0" />
          </el-form-item>
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
import { getUrlList, createUrl, updateUrl, deleteUrl, updateStatus } from '@/api/promotion/promote'
import { emptyS, nullS, formatUnixTime } from '@/utils/tools'

export default {
  name: 'PromoteUrlController',
  filters: {
    statusFilter(status) {
      const map = { 1: 'info', 0: 'success', 2: 'danger' }
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
        urlName: null,
        url: null,
        status: null
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加推广链接',
        update: '编辑推广链接'
      },

      // 表单模型
      createModel: {
        urlName: null,
        url: null,
        status: 0
      },
      statusOptions: [{ value: 0, label: '未绑定' }, { value: 1, label: '已绑定' }],

      // 验证规则
      rules: {
        urlName: [{ required: true, message: '请输入链接名', trigger: 'change' }, { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }],
        url: [{ required: true, message: '请输入链接url', trigger: 'change' }, { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }]

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
        urlName: null,
        url: null,
        status: 0
      }
    },

    // 刷新
    refreshData() {
      this.list = null
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        urlName: null,
        url: null,
        status: null
      }
      this.fetchData()
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      console.log(this.listQuery.status)
      getUrlList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then(res => {
          this.list = (res.data.list || []).map(item => {
            var statusString = ''
            if (item.status == 0) {
              statusString = '未绑定'
            } else if (item.status == 1) {
              statusString = '已绑定'
            }
            this.$set(item, 'statusString', statusString)
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

    // 滑块状态改变
    switchStatusChange(row) {
      const rowDic = Object.assign({}, row)
      this.listLoading = true
      // 请求网络
      const params = {
        bankId: rowDic.bankId || 0,
        status: rowDic.status
      }
      updateStatus(params)
        .then(res => {
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: '修改成功',
            type: 'success',
            duration: 1000
          })
        })
        .catch(err => {
          // 错误的情况下，修改内存属性
          row.status = !row.status
          this.listLoading = false
          this.$message.error(err)
        })
    },

    // 滑块状态改变
    switchStatusChangevip(row) {
      const rowDic = Object.assign({}, row)
      this.listLoading = true
      // 请求网络
      const params = {
        bankId: rowDic.bankId || 0,
        vip: rowDic.vip,
        status: rowDic.status
      }
      updateStatus(params)
        .then(res => {
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: '修改成功',
            type: 'success',
            duration: 1000
          })
        })
        .catch(err => {
          // 错误的情况下，修改内存属性
          row.status = !row.status
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
      this.$confirm('是否删除该推广链接成功？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteUrl([row.id])
            .then(res => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除推广链接成功',
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
            id: formDic.id || 0,
            urlName: nullS(formDic.urlName),
            url: nullS(formDic.url),
            status: formDic.status
          }
          if (this.dialogStatus === 'create') {
            createUrl(params)
              .then(res => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建推广链接成功',
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
            params['id'] = formDic.id || 0
            updateUrl(params)
              .then(res => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改推广链接成功',
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
.span_primary {
  margin-right: 10px;
  color: #FC708B;
  cursor: pointer;
}
</style>
