<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-select v-model="listQuery.status" size="small" placeholder="请选择是否启用" clearable @change="handleSearchFilter">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item class="nowrap">
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateShareClick()">添加分享链接</el-button>
      </el-form-item></el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="url" label="分享链接地址" min-width="80" />
      <el-table-column label="是否启用" width="120">
        <template slot-scope="{ row }">
          <el-switch v-model="row.status" :width="30" active-text="是" :active-value="0" inactive-text="否"
            :inactive-value="1" @change="changeShareStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作人" min-width="80" />
      <el-table-column prop="createTimeString" label="创建时间" width="160" />
      <el-table-column prop="updateTimeString" label="修改时间" width="160" />
      <el-table-column label="操作" width="100">
        <template slot-scope="{ row }">
          <span class="operation_btn" plain type="primary" size="mini" @click="showUpdateShareClick(row)">编辑</span>
          <span class="operation_btn" plain type="danger" size="mini" @click="showDeleteShareClick(row)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page" :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 新建/编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true" top="5vh" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="createModel"
          :rules="rules"
          label-position="top"
          label-width="120px"
          size="medium"
        >
          <el-form-item label="分享链接地址" prop="url">
            <el-input v-model.number="createModel.url" clearable placeholder="请输入分享链接地址" maxlength="50"
              show-word-limit />
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch v-model="createModel.status" active-text="启用" :active-value="0" inactive-text="禁用"
              :inactive-value="1" />
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
import {
  getShareList,
  createShare,
  updateShare,
  deleteShare,
  updateShareStatus,
} from '@/api/promotion/share'
import { emptyS, nullS, isFloatAndNumber, formatUnixTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'

export default {
  name: 'ConfigShareBaseController',
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
        status: null,
        total: 0,
      },

      statusOptions: [
        { label: '启用', value: 0 },
        { label: '禁用', value: 1 },
      ],

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加分享链接',
        update: '编辑分享链接',
      },

      // 表单模型
      createModel: {
        url: null,
        status: 1,
      },

      // 验证规则
      rules: {
        url: [
          { required: true, message: '请输入分享链接地址' },
          { min: 1, max: 50, message: '最多为50个字符' },
        ],
        status: [
          { required: true, message: '请输入状态', trigger: 'change' },
          { min: 1, max: 20, message: '最多为20个字符', trigger: 'change' },
        ],
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    reset() {
      this.listQuery = {}
      this.fetchData()
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        url: null,
        status: 1,
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getShareList(this.listQuery.status)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            this.$set(item, 'createTimeString', formatUnixTime(item.createTime))
            this.$set(item, 'updateTimeString', formatUnixTime(item.updateTime))
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

    // 显示创建弹出窗
    showCreateShareClick() {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示编辑弹出窗
    showUpdateShareClick(row) {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'update'
      this.createModel = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示删除弹窗
    showDeleteShareClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('是否删除该链接？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteShare(row.id)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除分享链接成功',
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
        .catch(() => {})
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogCreateLoading = true
          const params = {
            id: formDic.id || 0,
            url: formDic.url,
            status: formDic.status,
          }
          if (this.dialogStatus === 'create') {
            createShare(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建分享链接成功',
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
            updateShare(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改分享链接成功',
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

    // 更改分享链接状态
    changeShareStatus(row) {
      this.listLoading = true
      const id = row.id
      const mgr = row.status
      // 请求网络
      updateShareStatus(id, mgr)
        .then((res) => {
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: mgr === 0 ? '启用成功' : '禁用成功',
            type: 'success',
            duration: 1000,
          })
        })
        .catch((err) => {
          // 错误的情况下，修改内存属性
          row.status = !mgr
          this.listLoading = false
          this.$message.error(err)
        })
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
.span_primary {
  margin-right: 10px;
  color: #fc708b;
  cursor: pointer;
}
</style>
