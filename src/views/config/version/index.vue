<template>
  <div class="app-container">
    <el-form :inline="true">
      <!-- 筛选系统 -->
      <el-form-item>
        <el-select v-model="listQuery.os" size="small" placeholder="请选择系统版本" clearable @change="handleSearchFilter">
          <el-option v-for="item in osOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <!-- 筛选强更 -->
      <el-form-item>
        <el-select v-model="listQuery.isUpdate" size="small" placeholder="请选择更新方式" clearable
          @change="handleSearchFilter">
          <el-option v-for="item in updateOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加版本</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="version" label="版本号" width="80" />
      <el-table-column prop="intVersion" label="版本大小" width="80" />
      <el-table-column label="下载地址" min-width="100">
        <template slot-scope="{ row }">
          <a target="_blank" :href="row.downUrlHref" style="color: blue">
            {{ row.downUrl }}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="descript" label="更新说明" min-width="180">
        <template slot-scope="{ row }">
          <div class="descript">{{ row.descript }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTimeString" label="创建时间" width="160" />
      <el-table-column label="强更" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.isUpdate | updateFilter">{{ row.isUpdate == 1 ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="系统" width="120">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.os | osFilter">{{ row.osString }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</span>
          <span class="operation_btn" type="danger" size="mini" @click="showDeleteDialogClick(row)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page" :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 新建/编辑 版本 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true" top="5vh" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%;height: 100%;">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="100px"
          size="medium">
          <el-form-item label="版本号" prop="version"><el-input v-model="createModel.version" clearable
              placeholder="请输入版本号" maxlength="20" show-word-limit /></el-form-item>
          <el-form-item label="版本大小" prop="intVersion"><el-input v-model.number="createModel.intVersion" clearable
              placeholder="请输入版本大小" maxlength="20" /></el-form-item>
          <el-form-item label="下载地址" prop="downUrl">
            <el-input v-model="createModel.downUrl" type="textarea"
              placeholder="请输入下载地址 (不写http或者https,点击跳转时,会自动加上[http://]开头)" maxlength="300"
              :autosize="{ minRows: 2, maxRows: 4 }" show-word-limit />
          </el-form-item>
          <el-form-item label="更新说明">
            <el-input v-model="createModel.descript" type="textarea" placeholder="请输入更新说明" maxlength="8000"
              :autosize="{ minRows: 2, maxRows: 4 }" show-word-limit />
          </el-form-item>
          <el-form-item label="系统版本">
            <el-select v-model="createModel.os" placeholder="请选择系统">
              <el-option v-for="item in osOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否强更">
            <el-switch v-model="createModel.isUpdate" :width="30" active-text="是" :active-value="1" inactive-text="否"
              :inactive-value="0" />
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
  getVersionList,
  createVersion,
  updateVersion,
  deleteVersion,
} from '@/api/config/version'
import { emptyS, nullS, formatUnixTime } from '@/utils/tools'

export default {
  name: 'ConfigVersionPage',
  filters: {
    updateFilter(status) {
      const updateMap = { 0: '', 1: 'danger' }
      return updateMap[status]
    },
    osFilter(os) {
      const osMap = { 1: 'warning', 2: 'success', 3: 'danger', 4: 'success' }
      return osMap[os]
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        os: null,
        isUpdate: null,
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加版本',
        update: '编辑版本',
      },

      // 表单模型
      createModel: {
        id: 0,
        intVersion: 0,
        version: null,
        descript: null,
        downUrl: null,
        os: 1,
        isUpdate: 0,
      },
      osOptions: [
        { label: '安卓用户端', value: 1 },
        { label: '苹果用户端', value: 2 },
        { label: '安卓主播端', value: 3 },
        { label: '苹果主播端', value: 4 },
      ],
      updateOptions: [
        { label: '非强更', value: 0 },
        { label: '强更', value: 1 },
      ],

      // 验证规则
      rules: {
        version: [{ required: true, message: '请输入版本号' }],
        downUrl: [
          { required: true, message: '请输入下载地址', trigger: 'change' },
          { min: 1, max: 300, message: '最多为300个字符', trigger: 'change' },
        ],
        intVersion: [
          { required: true, message: '请输入版本大小数值' },
          { type: 'number', message: '请输入正确的版本大小' },
        ],
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20,
      }
      this.fetchData()
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        intVersion: 0,
        version: null,
        descript: null,
        downUrl: null,
        os: 1,
        isUpdate: 0,
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      const pageSize = this.listQuery.limit
      const pageNum = this.listQuery.page
      const os = this.listQuery.os
      const isUpdate = this.listQuery.isUpdate

      getVersionList(pageSize, pageNum, os, isUpdate)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var downUrlHref = ''
            if (`${item.downUrl}` === '' || typeof item.downUrl === undefined) {
              downUrlHref = ''
            } else if (
              `${item.downUrl}`.indexOf('http') === -1 &&
              `${item.downUrl}`.indexOf('https') === -1
            ) {
              downUrlHref = `http://${item.downUrl}`
            } else {
              downUrlHref = `${item.downUrl}`
            }
            var osString = ''
            switch (item.os) {
              case 1:
                osString = '安卓用户端'
                break
              case 2:
                osString = '苹果用户端'
                break
              case 3:
                osString = '安卓主播端'
                break
              case 4:
                osString = '苹果主播端'
                break
              default:
                break
            }
            this.$set(item, 'osString', osString)
            this.$set(item, 'downUrlHref', downUrlHref)
            this.$set(item, 'createTimeString', formatUnixTime(item.createTime))
            this.$set(item, 'updateTimeString', formatUnixTime(item.updateTime))
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
      this.$confirm('是否删除该版本？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteVersion([row.id])
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除版本成功',
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
            intVersion: formDic.intVersion || 0,
            version: nullS(formDic.version),
            descript: nullS(formDic.descript),
            downUrl: nullS(formDic.downUrl),
            os: formDic.os || 1,
            isUpdate: formDic.isUpdate || 0,
          }

          if (this.dialogStatus === 'create') {
            createVersion(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建版本成功',
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
            params['id'] = formDic.id || 0
            updateVersion(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '更新版本成功',
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
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0px;
  padding: 0px;
}
.descript {
  max-height: 200px;
  overflow: auto;
}
</style>
