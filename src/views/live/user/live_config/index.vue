<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-refresh" @click="fetchData">刷新</el-button>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="name" label="路线名称" width="80" />
      <el-table-column label="线路类型" width="100">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.type | openWayFilter">{{ row.type == 1 ? '正常路线' : '成人路线' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="appId" label="appId" width="90" />
      <el-table-column prop="licenceUrl" label="licenceUrl" show-overflow-tooltip min-width="80" />
      <el-table-column prop="licenceKey" label="licenceKey" show-overflow-tooltip min-width="90" />
      <el-table-column prop="apiKey" label="apiKey" show-overflow-tooltip min-width="90" />
      <el-table-column prop="authKey" label="authKey" show-overflow-tooltip min-width="90" />
      <el-table-column prop="secretId" label="secretId" show-overflow-tooltip min-width="90" />
      <el-table-column prop="secretKey" label="secretKey" show-overflow-tooltip min-width="90" />
      <el-table-column prop="bizid" label="bizid" width="80" />
      <el-table-column label="状态" width="160">
        <template slot-scope="{ row }">
          <el-switch v-model="row.status" :width="30" active-text="启用" :active-value="1" inactive-text="停用"
            :inactive-value="0" @change="changeSwitchClick(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="pushUrl" label="推流" show-overflow-tooltip min-width="90" />
      <el-table-column prop="pullUrl" label="拉流" show-overflow-tooltip min-width="90" />
      <el-table-column prop="rtmp" label="rtmp" show-overflow-tooltip min-width="90" />

      <el-table-column prop="remark" label="备注" width="80" />

      <el-table-column prop="operator" label="操作人" width="80" />
      <el-table-column prop="createTimeString" label="创建时间" width="150" />
      <!-- <el-table-column prop="updateTimeString" label="更新时间" width="150"  ></el-table-column> -->
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

    <!-- 新建/编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading" style="width: 100%;height: 100%;">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-width="100px" label-position="top"
          size="medium">
          <el-form-item label="路线名称" prop="name"><el-input v-model.number="createModel.name" clearable
              placeholder="请输入路线名称" maxlength="20" /></el-form-item>
          <!--  <el-form-item label="线路类型" prop="type"><el-input v-model.number="createModel.type" clearable placeholder="请输入路线类型" maxlength="20" /></el-form-item> -->
          <el-form-item label="路线类型">
            <el-select v-model="createModel.type" placeholder="请选择路线类型">
              <el-option v-for="item in openWayOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="appId" prop="appId"><el-input v-model="createModel.appId" clearable
              placeholder="请输入appId" maxlength="50" show-word-limit /></el-form-item>
          <el-form-item label="licenceUrl" prop="licenceUrl"><el-input v-model="createModel.licenceUrl" clearable
              placeholder="请输入licenceUrl" maxlength="250" /></el-form-item>
          <el-form-item label="licenceKey" prop="licenceKey"><el-input v-model="createModel.licenceKey" clearable
              placeholder="请输入licenceKey" maxlength="250" /></el-form-item>
          <el-form-item label="apiKey" prop="apiKey"><el-input v-model="createModel.apiKey" clearable
              placeholder="请输入api_key" maxlength="80" /></el-form-item>
          <el-form-item label="authKey" prop="authKey"><el-input v-model="createModel.authKey" clearable
              placeholder="请输入auth_key" maxlength="80" /></el-form-item>
          <el-form-item label="secretId" prop="secretId"><el-input v-model="createModel.secretId" clearable
              placeholder="请输入secret_id" maxlength="80" /></el-form-item>
          <el-form-item label="secretKey" prop="secretKey"><el-input v-model="createModel.secretKey" clearable
              placeholder="请输入secret_key" maxlength="80" /></el-form-item>
          <el-form-item label="bizid" prop="bizid"><el-input v-model="createModel.bizid" clearable
              placeholder="请输入bizid" maxlength="100" /></el-form-item>
          <el-form-item label="推流" prop="pushUrl"><el-input v-model="createModel.pushUrl" clearable placeholder="请输入推流"
              maxlength="100" /></el-form-item>
          <el-form-item label="拉流" prop="pullUrl"><el-input v-model="createModel.pullUrl" clearable placeholder="请输入拉流"
              maxlength="100" /></el-form-item>
          <el-form-item label="rtmp" prop="rtmp"><el-input v-model="createModel.rtmp" clearable placeholder="请输入rtmp"
              maxlength="100" /></el-form-item>

          <el-form-item label="备注">
            <el-input v-model="createModel.remark" type="textarea" placeholder="请输入备注说明" maxlength="200"
              :autosize="{ minRows: 2, maxRows: 4 }" show-word-limit />
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
  getColumnList,
  createColumn,
  updateColumn,
  deleteColumn,
} from '@/api/config/live_config'
import { emptyS, nullS, formatUnixTime } from '@/utils/tools'

export default {
  name: 'ConfigColumnPage',
  filters: {
    openWayFilter(status) {
      const map = { 0: '', 1: 'warning' }
      return map[status]
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
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加线路',
        update: '编辑线路',
      },

      // 表单模型
      createModel: {
        id: 0,
        name: null,
        appId: null,
        licenceUrl: null,
        licenceKey: null,
        apiKey: null,
        authKey: null,
        bizid: null,
        pushUrl: null,
        pullUrl: null,
        rtmp: null,
        remark: null,
        secretId: null,
        secretKey: null,
      },
      openWayOptions: [
        { label: '正常路线', value: 1 },
        { label: '成人路线', value: 2 },
      ],

      // 验证规则
      rules: {
        name: [
          { required: true, message: '请输入路线名称', trigger: 'change' },
          { min: 1, max: 200, message: '最多为100个字符', trigger: 'change' },
        ],
        appId: [{ required: true, message: 'app_Id不能为空', trigger: 'blur' }],
        licenceUrl: [
          { required: true, message: 'licenceUrl不能为空', trigger: 'blur' },
        ],
        licenceKey: [
          { required: true, message: 'licenceKey不能为空', trigger: 'blur' },
        ],
        apiKey: [
          { required: true, message: 'apiKey不能为空', trigger: 'blur' },
        ],
        authKey: [
          { required: true, message: 'authKey不能为空', trigger: 'blur' },
        ],
        secretId: [
          { required: true, message: 'secretId不能为空', trigger: 'blur' },
        ],
        secretKey: [
          { required: true, message: 'secretKey不能为空', trigger: 'blur' },
        ],
        bizid: [{ required: true, message: 'bizid不能为空', trigger: 'blur' }],
        pushUrl: [
          { required: true, message: 'pushUrl不能为空', trigger: 'blur' },
        ],
        pullUrl: [
          { required: true, message: 'pullUrl不能为空', trigger: 'blur' },
        ],
        rtmp: [{ required: true, message: 'rtmp不能为空', trigger: 'blur' }],
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
        id: 0,
        name: null,
        appId: null,
        licenceUrl: null,
        licenceKey: null,
        apiKey: null,
        authKey: null,
        bizid: null,
        pushUrl: null,
        pullUrl: null,
        rtmp: null,
        remark: null,
        secretId: null,
        secretKey: null,
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getColumnList(this.listQuery.limit, this.listQuery.page)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            this.$set(item, 'createTimeString', formatUnixTime(item.gmtCreate))
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
      this.$confirm('是否删除该线路？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteColumn([row.id])
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除线路成功',
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
            name: formDic.name,
            appId: formDic.appId,
            licenceUrl: formDic.licenceUrl,
            licenceKey: formDic.licenceKey,
            apiKey: formDic.apiKey,
            authKey: formDic.authKey,
            bizid: formDic.bizid,
            pushUrl: formDic.pushUrl,
            pullUrl: formDic.pullUrl,
            rtmp: formDic.rtmp,
            status: formDic.status,
            type: formDic.type,
            secretId: formDic.secretId,
            secretKey: formDic.secretKey,
            remark: formDic.remark,
          }
          if (this.dialogStatus === 'create') {
            createColumn(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建线路成功',
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

            updateColumn(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改线路成功',
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

    changeSwitchClick(row) {
      this.listLoading = true
      const rowDic = Object.assign({}, row)
      // 请求网络
      updateColumn({
        id: rowDic.id,
        status: rowDic.status,
        appId: rowDic.appId,
        pullUrl: rowDic.pullUrl,
        pushUrl: rowDic.pushUrl,
        apiKey: rowDic.apiKey,
        authKey: rowDic.authKey,
        rtmp: rowDic.rtmp,
        bizid: rowDic.bizid,
      })
        .then((res) => {
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: '修改成功',
            type: 'success',
            duration: 1000,
          })
        })
        .catch((err) => {
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
  margin: 20px 0px;
  padding: 0px;
}
</style>
