<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加广告类别</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-refresh" @click="reset">刷新</el-button>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column prop="name" label="类别名称" min-width="80" />
      <el-table-column prop="type" label="Type值" min-width="80" />
      <el-table-column prop="createTimeString" label="创建时间" width="160" />
      <el-table-column prop="updateTimeString" label="修改时间" width="160" />
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
      :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新建/编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false" :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading" style="width: 100%;height: 100%;">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-width="100" label-position="top" size="medium">
          <el-form-item label="广告类别名称" prop="name">
            <el-input v-model="createModel.name" clearable placeholder="请输入广告类别名称" maxlength="20" show-word-limit />
          </el-form-item>
          <el-form-item label="排序" prop="sort"><el-input v-model.number="createModel.sort" clearable placeholder="请输入排序号" maxlength="5" /></el-form-item>
          <el-form-item label="广告Type值" prop="type"><el-input v-model.number="createModel.type" clearable placeholder="请输入广告的Type值" maxlength="5" /></el-form-item>
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
import { getAdvertTypeList, createAdvertType, updateAdvertType, deleteAdvertType } from '@/api/config/advert_type'
import { emptyS, nullS, formatUnixTime } from '@/utils/tools'

export default {
  name: 'ConfigAdvertTypePage',
  filters: {},
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加广告类别配置',
        update: '编辑广告类别配置'
      },

      // 表单模型
      createModel: {
        id: 0,
        name: null,
        sort: 0,
        type: 0
      },

      // 验证规则
      rules: {
        name: [{ required: true, message: '请输入广告类别名称' }, , { min: 1, max: 20, message: '最多为20个字符', trigger: 'change' }],
        sort: [{ required: true, message: '请输入排序号' }, { type: 'number', message: '请输入正确的排序号' }],
        type: [{ required: true, message: '请输入广告的Type值' }, { type: 'number', message: '请输入正确的广告的Type值' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    reset() {
      this.fetchData()
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        name: null,
        sort: 0,
        type: 0
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getAdvertTypeList(this.listQuery.limit, this.listQuery.page)
        .then(res => {
          this.list = (res.data.list || []).map(item => {
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
      this.$confirm('是否删除该广告类别配置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteAdvertType(row.id)
            .then(res => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除广告类别配置成功',
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
            sort: formDic.sort || 0,
            type: formDic.type || 0,
            name: nullS(formDic.name)
          }
          if (this.dialogStatus === 'create') {
            createAdvertType(params)
              .then(res => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建广告类别配置成功',
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
            updateAdvertType(params)
              .then(res => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改广告类别配置成功',
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
