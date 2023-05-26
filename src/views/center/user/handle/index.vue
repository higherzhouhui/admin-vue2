<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <!-- 处理类型 -->
        <el-select v-model="listQuery.type" size="small" placeholder="请选择处理类型" clearable @change="handleSearchFilter">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <!-- id搜索框 -->
      <el-form-item>
        <el-input v-model="listQuery.flag" size="small" style="width: 240px" placeholder="请输入被封禁用户ID" clearable
          maxlength="200" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加封禁配置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-edit-outline" @click="showChangeDialogClick()">批量封禁</el-button>
      </el-form-item>
      <el-form-item>
        <el-upload ref="fileRef" v-cloading="execlLoading" :file-list="fileList" :show-file-list="true"
          :http-request="uploadImgRequest" action="">
          <el-button icon="el-icon-plus" size="small">ID 批量封禁(上传表格)</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-refresh" @click="refreshClick()">刷新封禁缓存</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="封禁标识" min-width="80">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" :show-text="row.flag" />
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="描述信息" min-width="80" />
      <el-table-column prop="operator" label="操作人" min-width="80" />
      <el-table-column prop="createTimeString" label="创建时间" width="160" />
      <el-table-column label="处理类型" width="120">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.type | typeFilter">{{
            row.typeString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="{ row }">
          <!-- <el-button plain type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</el-button> -->
          <span class="operation_btn" plain type="danger" size="mini" @click="showDeleteDialogClick(row)">解禁</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page" :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 新建/编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" size="medium">
          <el-form-item label="被封禁用户id" prop="flag"><el-input v-model="createModel.flag" clearable
              placeholder="请输入被封禁用户id" /></el-form-item>
          <el-form-item label="描述信息">
            <el-input v-model="createModel.remark" type="textarea" placeholder="请输入描述信息" maxlength="100"
              :autosize="{ minRows: 2, maxRows: 4 }" show-word-limit />
          </el-form-item>
          <el-form-item label="处理类型" prop="type">
            <el-select v-model="createModel.type" placeholder="请选择处理类型">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新建/编辑 消息公告 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogChangeVisible" :close-on-click-modal="false"
      :destroy-on-close="true" width="35%">
      <div v-cloading="dialogChangeLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm1" :model="changeModel" :rules="rule1" label-position="top" size="medium">
          <el-form-item label="封禁IP" prop="ip"><el-input v-model="changeModel.ip" clearable placeholder="请输入封禁IP"
              maxlength="200" /></el-form-item>
          <el-form-item label="备注" prop="chinese"><el-input v-model="changeModel.remark" clearable placeholder="请输入封禁备注"
              maxlength="200" /></el-form-item>
          <el-form-item label="封禁类型" prop="type">
            <!--            <el-switch v-model="changeModel.type" active-text="封终端" :active-value="'1'" inactive-text="封号" :inactive-value="'0'" />-->
            <el-select v-model="changeModel.type" placeholder="请选择">
              <el-option v-for="item in moreTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogChangeVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="
          handleChangeDataClick(
            changeModel.type,
            changeModel.remark,
            changeModel.ip
          )
          ">确定</el-button>
      </div>
    </el-dialog>

    <!-- <UploadFile :files="fileList" @updateList="updateList">上传</UploadFile> -->
  </div>
</template>

<script>
import {
  getUserHandleList,
  createUserHandle,
  updateUserHandle,
  deleteUserHandle,
  handleBatch,
  handleUploadExcel,
  refreshCache
} from '@/api/center/user/handle'
import { nullS, formatUnixTime } from '@/utils/tools'

import UserDrawer from '@/components/UserDrawer'

export default {
  name: 'CenterUserHandlePage',
  components: {
    UserDrawer
  },
  filters: {
    typeFilter(status) {
      const map = { 0: 'info', 1: 'warning', 2: 'danger' }
      return map[status]
    }
  },
  data() {
    return {
      execlLoading: false,
      fileList: [],

      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        id: null,
        type: null
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogChangeVisible: false,
      dialogChangeLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加封号配置',
        update: '编辑封号配置',
        change: '批量封禁'
      },

      // 表单模型
      createModel: {
        id: 0,
        flag: null,
        remark: null,
        type: null
      },
      // 表单模型
      changeModel: {
        type: null,
        remark: null,
        ip: null
      },
      // typeOptions: [{ label: '封号', value: 0 }, { label: '封终端', value: 1 }, { label: '封IP', value: 2 }],
      typeOptions: [
        { label: '封号', value: 0 },
        { label: '封终端', value: 1 }
      ],
      moreTypeOptions: [
        { label: '封号', value: 0 },
        { label: '封终端', value: 1 }
      ],

      // 验证规则
      rules: {
        flag: [
          { required: true, message: '请输入封禁标识', trigger: 'change' }
          // { min: 1, max: 20, message: "最多为20个字符", trigger: "change" },
        ],
        type: [{ required: true, message: '请选择处理类型' }]
      },
      rule1: {
        ip: [{ required: true, message: '请输入封禁IP', trigger: 'change' }],
        type: [{ required: true, message: '请选择封禁类型' }]
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
    refreshClick() {
      refreshCache().then(rt => {
        if (rt.code == 200) {
          this.$notify({
            title: '提示',
            message: '刷新成功',
            type: 'success',
            duration: 1500
          })
        }
      })
    },
    uploadImgRequest(option) {
      const formData = new FormData() // FormData对象，添加参数只能通过append(\'key\', value)的形式添加
      formData.append('file', option.file) // 添加文件对象
      this.$refs.fileRef.clearFiles()
      this.execlLoading = true
      handleUploadExcel(formData).then((res) => {
        try {
          if (res && res.code) {
            this.execlLoading = false
            this.$message.success('上传批量封禁文件成功')
            this.fetchData()
          }
          console.log(res, 'res')
        } catch (error) {
          this.execlLoading = false
        }
      })
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        flag: null,
        remark: null,
        type: null
      }
    },
    // 重新设置表单数据
    resetChangeModel() {
      this.changeModel = {
        type: null,
        remark: null,
        ip: null
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getUserHandleList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery.flag,
        this.listQuery.type
      )
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var typeString = ''
            if (item.type == 0) {
              typeString = '封号'
            } else if (item.type == 1) {
              typeString = '封终端'
            } else if (item.type == 2) {
              typeString = '封IP'
            }
            this.$set(item, 'typeString', typeString)
            this.$set(item, 'createTimeString', formatUnixTime(item.gmtCreate))
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
    // 显示编辑弹出窗
    showChangeDialogClick() {
      this.resetChangeModel()
      // getCpMessage()
      //   .then(res => {
      //     if (res.data != null && res.data != undefined && JSON.stringify(res.data) != '{}') {
      //       this.changeModel.type=res.data.type;
      //       this.changeModel.changeMessage=res.data.changeMessage;
      //     }
      //   })
      this.dialogChangeVisible = true
      this.dialogStatus = 'change'
      //  this.changeModel = Object.assign({}, row);
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
      this.$confirm('是否解禁该账号/设备？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteUserHandle([row.id])
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除封禁配置成功',
                type: 'success',
                duration: 1500
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
            flag: nullS(formDic.flag),
            remark: nullS(formDic.remark),
            type: formDic.type || 0
          }
          if (this.dialogStatus === 'create') {
            createUserHandle(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建封禁配置成功',
                  type: 'success',
                  duration: 1500
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
            updateUserHandle(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改封禁配置成功',
                  type: 'success',
                  duration: 1500
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

    // 创建/更新 数据
    handleChangeDataClick(type, remark, ip) {
      this.$refs['dataForm1'].validate((valid) => {
        if (valid) {
          const params = {
            type: type,
            remark: remark,
            ip: ip
          }
          // 请求服务器
          this.dialogChangeVisible = true
          if (this.dialogStatus === 'change') {
            handleBatch(params)
              .then((res) => {
                this.dialogChangeLoading = false
                this.dialogChangeVisible = false
                this.$notify({
                  title: '提示',
                  message: '批量封禁成功',
                  type: 'success',
                  duration: 1500
                })
                setTimeout((_) => {
                  this.fetchData()
                }, 200)
              })
              .catch((err) => {
                this.dialogChangeLoading = false
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
