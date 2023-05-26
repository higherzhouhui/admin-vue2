<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <!-- 状态 -->
        <el-select v-model="listQuery.status" size="small" placeholder="请选择启用状态" clearable @change="handleSearchFilter">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" size="small" @click="handleSearchFilter">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加主播标签</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="refreshList">手动刷新列表</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column prop="name" label="名称" min-width="80" />
      <el-table-column prop="remake" label="备注" min-width="80" />
      <el-table-column prop="createTimeString" label="创建时间" width="160" />
      <el-table-column prop="updateTimeString" label="更新时间" width="160" />
      <el-table-column label="状态" width="160">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            :width="30"
            :disabled="row.type == 1 || row.type == 2"
            active-text="启用"
            :active-value="1"
            inactive-text="停用"
            :inactive-value="0"
            @change="switchStatusChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="70" fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" type="primary" size="mini" :disabled="row.type == 1 || row.type == 2" @click="showUpdateDialogClick(row)">编辑</span>
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
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" size="medium">
          <el-form-item label="排序" prop="sort"><el-input v-model.number="createModel.sort" clearable placeholder="请输入排序号" maxlength="5" /></el-form-item>
          <el-form-item label="标签名称" prop="name">
            <el-input v-model="createModel.name" clearable placeholder="请输入主播标签名称" maxlength="20" show-word-limit />
          </el-form-item>
          <el-form-item label="标签Type" prop="type"><el-input v-model.number="createModel.type" clearable placeholder="请输入主播标签Type" maxlength="10" /></el-form-item>

          <el-form-item label="备注">
            <el-input v-model="createModel.remake" type="textarea" placeholder="请输入备注说明" maxlength="100" :autosize="{ minRows: 2, maxRows: 4 }" show-word-limit />
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
import { getAnchorTagList, createAnchorTag, updateAnchorTag, refreshAnchorList } from '@/api/config/tag'
import { emptyS, nullS, formatUnixTime } from '@/utils/tools'

export default {
  name: 'ConfigTagPage',
  filters: {},
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        type: null,
        status: null
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加主播标签',
        update: '编辑主播标签'
      },

      // 表单模型
      createModel: {
        id: 0,
        sort: 0,
        name: null,
        type: 0,
        remake: null,
        status: 0
      },
      statusOptions: [{ label: '停用', value: 0 }, { label: '启用', value: 1 }],

      // 验证规则
      rules: {
        sort: [{ required: true, message: '请输入排序号' }, { type: 'number', message: '请输入正确的排序号' }],
        type: [{ required: true, message: '请输入主播标签Type' }, { type: 'number', message: '请输入正确的栏目类型' }],
        name: [{ required: true, message: '请输入主播标签名称', trigger: 'change' }, { min: 1, max: 20, message: '最多为20个字符', trigger: 'change' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    refreshList() {
      this.$confirm('是否确定清除缓存，刷新列表？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(res => {
        refreshAnchorList().then(res => {
          if (res.code === 200) {
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success'
            })
          } else {
            this.$notify({
              title: '提示',
              message: '操作失败',
              type: 'error'
            })
          }
        })
      }).catch(() => {
      })
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        sort: 0,
        name: null,
        type: 0,
        remake: null,
        status: 0
      }
    },
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.fetchData()
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getAnchorTagList(this.listQuery.limit, this.listQuery.page, this.listQuery.status, this.listQuery.type)
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
            name: nullS(formDic.name),
            remake: nullS(formDic.remake),
            status: formDic.type || 0
          }
          if (this.dialogStatus === 'create') {
            createAnchorTag(params)
              .then(res => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建主播标签成功',
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
            updateAnchorTag(params)
              .then(res => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改主播标签成功',
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

    // 滑块状态改变
    switchStatusChange(row) {
      const rowDic = Object.assign({}, row)
      this.listLoading = true
      // 请求网络
      updateAnchorTag({
        id: rowDic.id || 0,
        status: rowDic.status
      })
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
