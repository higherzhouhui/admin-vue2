<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-select v-model="listQuery.status" size="small" placeholder="请选择状态" clearable @change="handleSearchFilter">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加直播间广告</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column prop="title" label="标题" min-width="80" />
      <el-table-column label="图片" width="100">
        <template slot-scope="{ row }">
          <el-image class="vue-img-preview" :src="row.imgUrl" fit="contain" lazy>
            <div slot="error" class="image-slot"><i class="el-icon-picture-outline" /></div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column label="跳转链接" min-width="120">
        <template slot-scope="{ row }">
          <a target="_blank" :href="row.jumpUrlHref">
            <el-link type="primary">{{ row.jumpUrl }}</el-link>
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="createTimeString" label="创建时间" width="160" />
      <el-table-column prop="updateTimeString" label="修改时间" width="160" />
      <el-table-column label="状态" width="160">
        <template slot-scope="{ row }">
          <el-switch v-model="row.status" :width="30" active-text="启用" :active-value="1" inactive-text="停用" :inactive-value="0" @change="changeAdvertStatus(row)" />
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
          <el-form-item label="广告标题" prop="title"><el-input v-model="createModel.title" clearable placeholder="请输入广告标题" maxlength="20" show-word-limit /></el-form-item>
          <el-form-item label="广告图片" prop="imgUrl">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload" :http-request="uploadImgRequest">
              <img v-if="createModel.imgUrl" :src="createModel.imgUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <div class="uploadFileDesc" v-html="getImageLibary('banner', true)" />
            <p>{{ createModel.imgUrl }}</p>
          </el-form-item>
          <el-form-item label="跳转链接 (不写http或者https,点击跳转时,会自动加上[http://]开头)" prop="jumpUrl">
            <el-input v-model="createModel.jumpUrl" type="textarea" placeholder="请输入跳转链接" :autosize="{ minRows: 2, maxRows: 4 }" maxlength="500" show-word-limit />
          </el-form-item>
          <el-form-item label="选择状态">
            <el-switch v-model="createModel.status" active-text="启用" :active-value="1" inactive-text="停用" :inactive-value="0" />
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
import { getLiveAdvertList, createLiveAdvert, updateLiveAdvert, deleteLiveAdvert } from '@/api/live/advert'
import { getImageLibary, nullS, formatUnixTime, beforeUploadImage, uploadResourceFiles } from '@/utils/tools'

export default {
  name: 'LiveAdvertPage',
  filters: {},
  data() {
    return {
      list: [],
      listLoading: true,
      getImageLibary: getImageLibary,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        status: null
      },

      statusOptions: [{ value: 0, label: '停用' }, { value: 1, label: '启用' }],

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加直播间广告',
        update: '编辑直播间广告'
      },

      // 表单模型
      createModel: {
        id: 0,
        sort: 0,
        status: 1,
        title: null,
        imgUrl: null,
        jumpUrl: null
      },

      // 验证规则
      rules: {
        sort: [{ required: true, message: '请输入排序号' }, { type: 'number', message: '请输入正确的排序号' }],
        title: [{ required: true, message: '请输入广告标题' }, , { min: 1, max: 20, message: '最多为20个字符', trigger: 'change' }],
        imgUrl: [{ required: true, message: '请上传广告图片', trigger: 'blur' }],
        jumpUrl: [{ required: true, message: '请输入广告跳转链接', trigger: 'change' }]
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
        id: 0,
        sort: 0,
        status: 1,
        title: null,
        imgUrl: null,
        jumpUrl: null
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getLiveAdvertList(this.listQuery.limit, this.listQuery.page, this.listQuery.status)
        .then(res => {
          this.list = (res.data.list || []).map(item => {
            var jumpUrlHref = ''
            if (`${item.jumpUrl}` === '' || typeof item.jumpUrl === undefined) {
              jumpUrlHref = ''
            } else if (`${item.jumpUrl}`.indexOf('http') === -1 && `${item.jumpUrl}`.indexOf('https') === -1) {
              jumpUrlHref = `http://${item.jumpUrl}`
            } else {
              jumpUrlHref = `${item.jumpUrl}`
            }
            this.$set(item, 'jumpUrlHref', jumpUrlHref)
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
        title: nullS(rowCopy.title),
        imgUrl: nullS(rowCopy.imgUrl),
        jumpUrl: nullS(rowCopy.jumpUrl)
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
      this.$confirm('是否删除该直播间广告？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteLiveAdvert([row.id])
            .then(res => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除直播间广告成功',
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
            createLiveAdvert(params)
              .then(res => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建直播间广告成功',
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
            updateLiveAdvert(params)
              .then(res => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改直播间广告成功',
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
      updateLiveAdvert({
        id: row.id || 0,
        status: row.status || 0
      })
        .then(res => {
          this.listLoading = false
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
          return uploadResourceFiles({
            ossParams: res,
            fileName: option.file.name,
            file: option.file,
            dir: 'banner'
          })
        })
        .then(url => {
          this.createModel.imgUrl = url
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
