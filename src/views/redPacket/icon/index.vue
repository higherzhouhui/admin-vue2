<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="success" icon="el-icon-plus" @click="showCreateDialogClick()">添加红包雨图标</el-button>
      </el-form-item>
      <!-- 状态 -->
      <el-form-item>
        <el-select v-model="listQuery.status" size="small" placeholder="请选择状态" clearable @change="handleSearchFilter">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.iconName" type="type" size="small" clearable placeholder="请输入红包名称" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" plain icon="el-icon-search" @click="fetchData" />
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini"  >
      <el-table-column type="index" label="序号" width="60"   />
      <el-table-column prop="sort" label="排序" width="60"   />
      <el-table-column prop="iconName" label="图标名称" min-width="80"   />
      <el-table-column label="红包图标" width="100"  >
        <template slot-scope="{ row }">
          <el-image class="vue-img-preview" :src="row.iconUrl" fit="contain" lazy>
            <div slot="error" class="image-slot"><i class="el-icon-picture-outline" /></div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="80"   />
      <el-table-column prop="createTimeString" label="创建时间" width="160"   />
      <el-table-column prop="updateTimeString" label="修改时间" width="160"   />
      <el-table-column label="状态" width="160"  >
        <template slot-scope="{ row }">
          <el-switch v-model="row.status" :disabled="row.status === 1" :width="30" active-text="启用" :active-value="1" inactive-text="停用" :inactive-value="0" @change="changeAdvertStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160"  >
        <template slot-scope="{ row }">
          <el-button plain type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</el-button>
          <el-button plain type="danger" :disabled="row.status === 1" size="mini" @click="showDeleteDialogClick(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新建/编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible"   :close-on-click-modal="false" :destroy-on-close="true" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%;height: 100%;">
        <el-form ref="dataForm" :model="createModel" :rules="rules" size="medium" label-width="80px">
          <el-form-item label="排序" prop="sort"><el-input v-model.number="createModel.sort" clearable placeholder="请输入排序号" maxlength="5" /></el-form-item>
          <el-form-item label="图标名称" prop="iconName"><el-input v-model="createModel.iconName" clearable placeholder="请输入图标名称" maxlength="30" show-word-limit /></el-form-item>
          <el-form-item label="红包图标" prop="iconUrl">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload" :http-request="uploadImgRequest">
              <img v-if="createModel.iconUrl" :src="createModel.iconUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </el-form-item>
          <el-form-item label="备注" prop="remark"><el-input v-model="createModel.remark" clearable placeholder="请输入备注" maxlength="40" show-word-limit /></el-form-item>
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
  getRedPacketIconList,
  redPacketIconAdd,
  redPacketUpdate,
  redPacketUpdateStatus
} from '@/api/config/redPacketIcon'
import { emptyS, nullS, formatUnixTime, beforeUploadImage, uploadFile } from '@/utils/tools'

export default {
  name: 'RedPacketIconPage',
  filters: {},
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        status: '',
        iconName: ''
      },

      statusOptions: [{ value: 0, label: '停用' }, { value: 1, label: '启用' }],

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加红包雨图标',
        update: '编辑红包雨图标'
      },

      // 表单模型
      createModel: {
      },

      // 验证规则
      rules: {
        sort: [{ required: true, message: '请输入排序号' }, { type: 'number', message: '请输入正确的排序号' }],
        iconName: [{ required: true, message: '请输入图标名称' }, { min: 1, max: 30, message: '最多为30个字符', trigger: 'change' }],
        iconUrl: [{ required: true, message: '请上传红包图标' }],
        remark: [{ required: true, message: '请输入备注' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        sort: 0,
        status: 1,
        iconName: '',
        iconUrl: '',
        remark: ''
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getRedPacketIconList({ status: this.listQuery.status, iconName: this.listQuery.iconName, pageSize: this.listQuery.pageSize, pageNum: this.listQuery.pageNum })
        .then(res => {
          this.list = (res.data.list || []).map(item => {
            this.$set(item, 'createTimeString', formatUnixTime(item.createTime))
            this.$set(item, 'updateTimeString', formatUnixTime(item.updateTime))
            return item
          })
          this.listQuery.total = res.data.total
          this.listLoading = false
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
      const rowCopy = Object.assign({}, row) // 浅 copy
      this.createModel = {
        id: rowCopy.id || 0,
        sort: rowCopy.sort,
        status: rowCopy.status,
        iconName: nullS(rowCopy.iconName),
        iconUrl: nullS(rowCopy.iconUrl),
        remark: nullS(rowCopy.remark),
        createTime: rowCopy.createTime,
        updateTime: rowCopy.updateTime
      }
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
      this.$confirm('是否删除该红包图标？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          redPacketUpdateStatus({
            id: row.id,
            status: 2
          })
            .then(res => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除红包图标成功',
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
          const params = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogCreateLoading = true
          if (this.dialogStatus === 'create') {
            redPacketIconAdd(params)
              .then(res => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建红包图标成功',
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
            redPacketUpdate(params)
              .then(res => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改红包图标成功',
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

    // 更改状态
    changeAdvertStatus(row) {
      this.listLoading = true
      // 请求网络
      redPacketUpdateStatus({
        id: row.id || 0,
        status: row.status || 0
      })
        .then(res => {
          this.listLoading = false
          this.fetchData()
          this.$notify({
            title: '提示',
            message: '修改状态成功',
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
    },

    // 上传图片

    beforeImgUpload(file) {
      console.log('-----------上传之前------------')
      const { can, msg } = beforeUploadImage(file.type, file.size)
      if (!can) {
        this.$message.error(msg)
      } else {
        this.dialogCreateLoading = true
      }
      return can
    },

    uploadImgRequest(option) {
      console.log('-----------自定义上传方法------------')
      this.$store
        .dispatch('oss/getOSSInfos')
        .then(res => {
          return uploadFile(res, 'refGift', option.file.name, option.file)
        })
        .then(url => {
          this.createModel.iconUrl = url
          this.$refs.dataForm.validateField('iconUrl')
          this.dialogCreateLoading = false
        })
        .catch(err => {
          console.error('oss失败' + JSON.stringify(err))
          this.dialogCreateLoading = false
          this.$message.error('上传失败，请重试')
        })
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

.vue-img-preview {
  width: 30px;
  height: 30px;
  margin: 0px;
  padding: 0px;
  border-radius: 3px;
}
</style>
