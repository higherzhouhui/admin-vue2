<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-select
          v-model="listQuery.activityStatus"
          size="small"
          placeholder="请选择状态"
          clearable
          @change="handleSearchFilter"
        >
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="listQuery.distributeType"
          size="small"
          clearable
          placeholder="请选择派发方式"
          @clear="handleSearchFilter"
        >
          <el-option
            v-for="item in applyTypeOptions"
            v-if="item.id !== 0"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.activityName" size="small" type="text" clearable placeholder="请输入标题" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加活动</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="refreshList">手动刷新列表</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <!--      <el-table-column type="index" label="序号" width="60"   />-->
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column prop="activityName" label="活动标题" min-width="120" />
      <el-table-column label="活动主页" min-width="200">
        <template slot-scope="{ row }">
          <span>
            <el-image
              class="vue-img-preview"
              fit="contain"
              lazy
              :src="row.activityHomePage"
              :preview-src-list="[row.activityHomePage]"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="活动详情" min-width="120">
        <template slot-scope="{ row }">
          <a target="_blank" :href="row.jumpUrlHref">
            <el-link type="primary">{{ row.activityDetail }}</el-link>
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="createTimeOwn" label="创建时间" min-width="150" />
      <el-table-column prop="remark" label="备注" width="200" />
      <el-table-column label="派发方式" width="100">
        <template slot-scope="{ row }">
          <div>{{ row.distributeName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="160">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.activityStatus"
            :width="30"
            active-text="启用"
            :active-value="0"
            inactive-text="停用"
            :inactive-value="1"
            @change="changeSwitchClick(row)"
          />
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
      :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 新建/编辑 弹窗 -->
    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="createModel"
          :rules="rules"
          label-position="top"
          label-width="100px"
          size="medium"
        >
          <el-form-item label="排序" prop="sort"><el-input
            v-model.number="createModel.sort"
            clearable
            placeholder="请输入排序号"
            maxlength="5"
          /></el-form-item>
          <el-form-item label="活动标题" prop="activityName"><el-input
            v-model="createModel.activityName"
            clearable
            placeholder="请输入活动标题"
            maxlength="50"
            show-word-limit
          /></el-form-item>
          <!-- activityType -->
          <el-form-item label="活动类型" prop="activityType">
            <el-select v-model="createModel.activityType" placeholder="请选择">
              <el-option v-for="(item, index) in activityType" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="申请方式" required>
            <el-col :span="11">
              <el-form-item>
                <el-select v-model="createModel.distributeType" placeholder="请选择派发方式">
                  <el-option
                    v-for="item in applyTypeOptions"
                    v-if="item.id === 1 || item.id === 2"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="createModel.distributeType === 0" :span="13">
              <el-form-item prop="distributeName">
                <el-input v-model="createModel.distributeName" placeholder="请输入自定义派发方式" />
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="活动banner" prop="activityHomePage">
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :http-request="
                (params) =>
                  uploadImgRequest(params, 'uploadFile', 'activityHomePage', 'alist')
              "
            >
              <img v-if="createModel.activityHomePage" :src="createModel.activityHomePage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <div class="uploadFileDesc" v-html="getImageLibary('alist', true)" />
            <el-input
              v-model="createModel.activityHomePage"
              type="text"
              :placeholder="
                createModel.activityType != 1001
                  ? '上传图片自动生成活动详情图片链接'
                  : '请输入活动地址'
              "
              :autosize="{ minRows: 2, maxRows: 4 }"
            />
          </el-form-item>
          <el-form-item label="活动详情" prop="activityDetail">
            <el-upload
              v-if="createModel.activityType != 1001"
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :http-request="
                (params) =>
                  uploadImgRequest(params, 'uploadFileadver', 'activityDetail', 'ainfo')
              "
            >
              <img v-if="createModel.activityDetail" :src="createModel.activityDetail" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <div class="uploadFileDesc" v-html="getImageLibary('ainfo', true)" />
            <el-input
              v-model="createModel.activityDetail"
              type="text"
              :placeholder="
                createModel.activityType != 1001
                  ? '上传图片自动生成活动详情图片链接'
                  : '请输入活动地址'
              "
              :autosize="{ minRows: 2, maxRows: 4 }"
            />
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input
              v-model="createModel.remark"
              type="textarea"
              placeholder="请输入备注信息"
              :autosize="{ minRows: 2, maxRows: 4 }"
              maxlength="200"
              show-word-limit
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
import {
  getActivityList,
  createActivity,
  editActivity,
  updateActivity,
  getDistributeType,
  refreshActivityList
} from '@/api/config/activity'
import { getAdvertTypeList } from '@/api/config/advert_type'
import {
  emptyS,
  nullS,
  beforeUploadImage,
  uploadResourceFiles,
  formatUnixTime,
  getImageLibary
} from '@/utils/tools'
export default {
  name: 'ConfigAdvertPage',
  filters: {
    openWayFilter(status) {
      const map = { 1: '', 2: 'warning' }
      return map[status]
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
      getImageLibary: getImageLibary,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        distributeType: '',
        activityStatus: '',
        activityName: '',
        total: 0
      },
      activityType: [],
      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加活动',
        update: '编辑活动'
      },

      // 表单模型
      createModel: {},
      statusOptions: [
        { value: 1, label: '停用' },
        { value: 0, label: '启用' }
      ],
      applyTypeOptions: [],
      // 验证规则
      rules: {
        activityName: [
          { required: true, message: '请输入标题' },
          { min: 1, max: 50, message: '最多为50个字符', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请输入排序号' },
          { type: 'number', message: '请输入正确的排序号' }
        ],
        distributeName: [{ required: true, message: '请输入自定义派发方式' }],
        activityHomePage: [{ required: true, message: '请上传活动banner图' }],
        activityDetail: [{ required: true, message: '请上传活动详情图' }]
      }
    }
  },
  created() {
    this.getType()
    this.getAdvertTypeLists()
  },
  methods: {
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20
      }
      this.fetchData()
    },
    refreshList() {
      this.$confirm('是否确定清除缓存，刷新列表？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then((res) => {
          refreshActivityList().then((res) => {
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
        })
        .catch(() => {})
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        sort: 0,
        activityName: '',
        distributeType: 1,
        activityHomePage: '',
        activityDetail: '',
        remark: '',
        activityStatus: 0,
        distributeName: null
      }
    },
    // 获取类型
    getType() {
      getDistributeType()
        .then((res) => {
          this.applyTypeOptions = res.data
          this.fetchData()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getActivityList({
        pageSize: this.listQuery.pageSize,
        pageNum: this.listQuery.pageNum,
        distributeType: this.listQuery.distributeType,
        activityStatus: this.listQuery.activityStatus,
        activityName: this.listQuery.activityName
      })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var jumpUrlHref = ''
            if (
              `${item.activityDetail}` === '' ||
              typeof item.activityDetail === undefined
            ) {
              jumpUrlHref = ''
            } else if (
              `${item.activityDetail}`.indexOf('http') === -1 &&
              `${item.activityDetail}`.indexOf('https') === -1
            ) {
              jumpUrlHref = `http://${item.activityDetail}`
            } else {
              jumpUrlHref = `${item.activityDetail}`
            }
            this.$set(item, 'createTimeOwn', formatUnixTime(item.createTime))
            this.$set(item, 'jumpUrlHref', jumpUrlHref)
            return item
          })
          this.listLoading = false
          this.listQuery.total = res.data.total
        })
        .catch((err) => {
          this.list = []
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },
    // 获取活动类型
    getAdvertTypeLists() {
      var advertTypes = []
      getAdvertTypeList(50, 1).then((res) => {
        advertTypes = res.data.list || []
        this.activityType = advertTypes.map((item) => {
          return {
            value: item.type,
            label: item.name
          }
        })
      })
    },

    // 显示创建弹出窗
    showCreateDialogClick() {
      this.getAdvertTypeLists()

      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      this.getAdvertTypeLists()

      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'update'
      const rowCopy = Object.assign({}, row) // 浅 copy
      this.createModel = {
        id: rowCopy.id || 0,
        sort: rowCopy.sort || 0,
        activityName: rowCopy.activityName,
        distributeType: rowCopy.distributeType,
        activityHomePage: rowCopy.activityHomePage,
        activityDetail: rowCopy.activityDetail,
        remark: rowCopy.remark,
        activityStatus: rowCopy.activityStatus,
        createTime: rowCopy.createTime || null,
        activityType: rowCopy.activityType || 0
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
      this.$confirm('是否删除该活动配置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          updateActivity({
            id: row.id,
            activityStatus: 2
          })
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除活动配置成功',
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
            sort: formDic.sort || 0,
            activityName: nullS(formDic.activityName),
            distributeType: formDic.distributeType,
            activityHomePage: nullS(formDic.activityHomePage),
            activityDetail: nullS(formDic.activityDetail),
            remark: nullS(formDic.remark),
            activityStatus: formDic.activityStatus,
            activityType: formDic.activityType || 0,
            createTime: formDic.createTime
          }
          if (formDic.distributeType === 0) {
            params.distributeName = nullS(formDic.distributeName)
          }
          if (this.dialogStatus === 'create') {
            console.log(params, this.createModel.activityDetail)
            createActivity(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建活动配置成功',
                  type: 'success',
                  duration: 1500
                })
                setTimeout((_) => {
                  this.getType()
                }, 16)
              })
              .catch((err) => {
                this.dialogCreateLoading = false
                this.$message.error(err)
              })
          } else {
            params['id'] = formDic.id || 0
            editActivity(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改活动配置成功',
                  type: 'success',
                  duration: 1500
                })
                setTimeout((_) => {
                  this.getType()
                }, 16)
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
      updateActivity({
        id: rowDic.id,
        activityStatus: rowDic.activityStatus
      })
        .then((res) => {
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: '修改成功',
            type: 'success',
            duration: 1000
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
      this.listQuery.pageNum = 1
      this.fetchData()
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.listQuery.pageNum = 1
      this.fetchData()
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
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

    uploadImgRequest(option, functionName, content, dir) {
      console.log('-----------自定义上传方法------------')
      this.$store
        .dispatch('oss/getOSSInfos')
        .then((res) => {
          return uploadResourceFiles({
            ossParams: res,
            fileName: option.file.name,
            file: option.file,
            dir: dir
          })
        })
        .then((url) => {
          // this.createModel.activityHomePage = url
          // content = url
          this.$set(this.createModel, content, url)
          console.log(content)
          this.dialogCreateLoading = false
        })
        .catch((err) => {
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
  width: 200px;
  margin: 0px;
  padding: 0px;
  border-radius: 3px;
}
</style>
