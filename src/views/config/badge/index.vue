<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加徽章配置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column label="图标" width="80">
        <template slot-scope="scope">
          <el-image class="vue-img-preview" :src="scope.row.logoUrl" fit="contain" lazy>
            <div slot="error" class="image-slot"><i class="el-icon-picture-outline" /></div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" min-width="80" />
      <el-table-column prop="descript" label="描述及获得方式" min-width="100" />
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
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" size="medium">
          <el-form-item label="bid" prop="bid"><el-input v-model.number="createModel.bid" clearable placeholder="请输入徽章bid" maxlength="4" /></el-form-item>
          <el-form-item label="徽章名" prop="name"><el-input v-model="createModel.name" clearable placeholder="请输入徽章名称" maxlength="20" show-word-limit /></el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="createModel.descript"
              type="textarea"
              placeholder="请输入徽章描述或获得方式等"
              maxlength="100"
              :autosize="{ minRows: 2, maxRows: 4 }"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="徽章图">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload" :http-request="uploadImgRequest">
              <img v-if="createModel.logoUrl" :src="createModel.logoUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <div class="uploadFileDesc" v-html="getImageLibary('badge', true)" />
            <el-input
              v-model="createModel.logoUrl"
              type="textarea"
              placeholder="上传图片之后自动生成资源地址"
              :autosize="{ minRows: 2, maxRows: 4 }"
            />
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
import { getBadgeList, createBadge, updateBadge, deleteBadge } from '@/api/config/badge'
import { getImageLibary, nullS, formatUnixTime, beforeUploadImage, uploadResourceFiles } from '@/utils/tools'

export default {
  name: 'ConfigPayChannelPage',
  filters: {
    callbackFilter(status) {
      const map = { 1: '', 2: 'success', 3: 'warning' }
      return map[status]
    },
    typeFilter(status) {
      const map = { 1: '', 2: 'success', 3: 'warning', 4: 'info' }
      return map[status]
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0
      },
      getImageLibary: getImageLibary,
      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加徽章配置',
        update: '编辑徽章配置'
      },

      // 表单模型
      createModel: {
        bid: 0,
        sort: 0,
        name: null,
        descript: null,
        logoUrl: null
      },

      // 验证规则
      rules: {
        name: [{ required: true, message: '请输入徽章名称' }, , { min: 1, max: 20, message: '最多为20个字符', trigger: 'change' }],
        sort: [{ required: true, message: '请输入排序号' }, { type: 'number', message: '请输入正确的排序号' }]
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
        bid: 0,
        sort: 0,
        name: null,
        descript: null,
        logoUrl: null
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getBadgeList(this.listQuery.limit, this.listQuery.page)
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
      if (row.bid == null || row.bid < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('是否删除该徽章配置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteBadge([row.bid])
            .then(res => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除徽章配置成功',
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

    // 创建/更新
    handleDataClick() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogCreateLoading = true
          const params = {
            sort: formDic.sort || 0,
            name: nullS(formDic.name),
            descript: nullS(formDic.descript),
            logoUrl: nullS(formDic.logoUrl)
          }
          if (this.dialogStatus === 'create') {
            createBadge(params)
              .then(res => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建徽章配置成功',
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
            params['bid'] = formDic.bid || 0
            updateBadge(params)
              .then(res => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改徽章配置成功',
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
            dir: 'badge'
          })
        })
        .then(url => {
          this.createModel.logoUrl = url
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
  margin: 20px 0px;
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
