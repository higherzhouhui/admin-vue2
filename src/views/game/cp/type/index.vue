<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-select v-model="listQuery.status" size="small" placeholder="请选择状态" clearable @change="handleSearchFilter">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.name" size="small" placeholder="请输入彩票名称" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加彩票</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-edit" @click="showChangeDialogClick()">彩票维护</el-button>
      </el-form-item>
      <!-- 状态 -->
      <el-form-item>
        <el-button size="small" icon="el-icon-check" @click="changeStart()">开启彩票弹窗</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-close" @click="changeStop()">关闭彩票弹窗</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-check" @click="buttonStart()">开启彩票按钮</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-close" @click="buttonStop()">关闭彩票按钮</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-refresh" @click="clearCache()" :loading="freshLoading">刷新缓存</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="控制器开关">
              <span>{{ props.row.isControl == 1 ? '启用' : '关闭' }}</span>
            </el-form-item>
            <el-form-item v-if="props.row.isControl == 1" label="放水率">
              <span>{{ props.row.drainageRate }}%</span>
            </el-form-item>
            <el-form-item v-if="props.row.isControl == 1" label="杀率">
              <span>{{ props.row.killingRate }}%</span>
            </el-form-item>
            <el-form-item v-if="props.row.isControl == 1" label="周期">
              <span>{{ props.row.period }}天</span>
            </el-form-item>
            <el-form-item v-if="props.row.isControl == 1" label="循环清除次数">
              <span>{{ props.row.cycleClear }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="id" label="ID" min-width="60" />
      <el-table-column prop="pid" label="上级ID" min-width="60" />
      <el-table-column prop="name" label="彩票英文名称" min-width="120" />
      <el-table-column prop="chinese" label="彩票中文描述" min-width="140" />
      <el-table-column prop="level" label="目录级别" min-width="70" />
      <el-table-column label="状态" width="160">
        <template slot-scope="{ row }">
          <el-switch v-model="row.status" :width="30" active-text="启用" :active-value="1" inactive-text="禁用"
            :inactive-value="2" @change="switchStatusChange(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" show-overflow-tooltip min-width="80" />
      <el-table-column prop="playMethod" label="玩法说明" show-overflow-tooltip min-width="120" />
      <el-table-column prop="createTimeString" label="创建时间" width="140" />
      <el-table-column prop="updateTimeString" label="更新时间" width="140" />
      <el-table-column label="操作" width="110" fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" plain type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</span>
          <span class="operation_btn" plain type="danger" size="mini" @click="showDeleteDialogClick(row)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <!-- 新建/编辑 消息公告 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true" width="800px" top="3vh">
      <div v-cloading="dialogCreateLoading" class="dialogContent">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" size="medium">
          <el-form-item label="上级ID" prop="pid"><el-input v-model="createModel.pid" clearable placeholder="请输入上级ID"
              maxlength="200" /></el-form-item>
          <el-form-item label="彩票英文名称" prop="name"><el-input v-model="createModel.name" clearable
              placeholder="请输入彩票英文名称" maxlength="200" :disabled="dialogStatus === 'update'" /></el-form-item>
          <el-form-item label="彩票中文名称" prop="chinese"><el-input v-model="createModel.chinese" clearable
              placeholder="请输入彩票中文名称" maxlength="200" /></el-form-item>
          <el-form-item label="目录级别" prop="level"><el-input v-model="createModel.level" clearable placeholder="请输入目录级别"
              maxlength="200" /></el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload"
              :http-request="(params) => uploadImgRequest(params, 'icon')">
              <img v-if="createModel.icon" :src="createModel.icon" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <el-input v-model="createModel.icon" clearable placeholder="请输入图标" maxlength="300" />
          </el-form-item>
          <el-form-item label="玩法说明" prop="playMethod"><el-input v-model="createModel.playMethod" type="textarea"
              clearable placeholder="请输入玩法说明" maxlength="8000" /></el-form-item>

          <!--   <Tinymce ref="editor" v-model="playMethod" :height="400" id="tinymce_id"  /> -->
          <el-form-item label="控制器开关">
            <el-switch v-model="createModel.isControl" active-text="启用" active-value="1" inactive-text="关闭"
              inactive-value="2" />
          </el-form-item>
          <div v-if="createModel.isControl == 1">
            <el-form-item label="放水率" prop="drainageRate">
              <el-input v-model="createModel.drainageRate" clearable placeholder="请输入放水率" type="number">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="杀率" prop="killingRate">
              <el-input v-model="createModel.killingRate" clearable placeholder="请输入杀率" type="number">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="周期" prop="period">
              <el-input v-model="createModel.period" clearable placeholder="请输入周期" type="number">
                <template slot="append">天</template>
              </el-input>
            </el-form-item>
            <el-form-item label="循环清除" prop="cycleClear">
              <el-input v-model="createModel.cycleClear" clearable placeholder="请输入循环清除" type="number">
                <template slot="append">次</template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="状态（1启用 2禁用）">
            <el-switch v-model="createModel.status" active-text="启用" :active-value="1" inactive-text="禁用"
              :inactive-value="2" />
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
      :destroy-on-close="true" width="700px">
      <div v-cloading="dialogChangeLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="changeModel" :rules="rules" label-position="top" size="large">
          <el-form-item label="彩票维护状态编辑" prop="chinese"><el-input v-model="changeModel.changeMessage" type="textarea "
              clearable placeholder="请输入提示信息" :row="5" maxlength="2000" /></el-form-item>
          <el-form-item label="状态(1维护 0开放)">
            <el-switch v-model="changeModel.changeStatus" active-text="维护" :active-value="'1'" inactive-text="开放"
              :inactive-value="'0'" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogChangeVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="
            handleChangeDataClick(
              changeModel.changeStatus,
              changeModel.changeMessage
            )
          ">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCpTypeList,
  createCpType,
  updateCpType,
  deleteCpType,
  changeCpStatus,
  getCpMessage,
  startCp,
  stopCp,
  startCpButton,
  stopCpButton,
  HandleClearCache,
} from '@/api/game/cp/type'
import {
  emptyS,
  nullS,
  formatUnixTime,
  beforeUploadImage,
  uploadFile,
} from '@/utils/tools'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'CpTypeController',
  components: { Tinymce },
  filters: {
    statusFilter(status) {
      const map = { 1: 'info', 0: 'success', 2: 'danger' }
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
        status: null,
        name: null,
      },
      editorLoading: true,
      content: '',
      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogChangeVisible: false,
      dialogChangeLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加彩票',
        update: '编辑彩票',
        change: '维护状态',
      },

      // 表单模型
      createModel: {
        pid: 1,
        level: 0,
        name: null,
        icon: null,
        chinese: null,
        status: 1,
        playMethod: null,
      },

      // 表单模型
      changeModel: {
        changeStatus: null,
        changeMessage: null,
      },
      statusOptions: [
        { value: 1, label: '启用' },
        { value: 2, label: '禁用' },
      ],

      // 验证规则
      rules: {
        pid: [{ required: true, message: '请输入上级ID', trigger: 'change' }],
        name: [
          { required: true, message: '请输入彩票英文名称', trigger: 'change' },
        ],
        chinese: [
          { required: true, message: '请输入彩票中文名', trigger: 'change' },
        ],
        level: [
          { required: true, message: '请输入目录级别', trigger: 'change' },
        ],
        icon: [{ required: true, message: '请上传图标', trigger: 'change' }],
        playMethod: [
          { required: true, message: '请输入玩法说明', trigger: 'change' },
        ],
        drainageRate: [
          { required: true, message: '请输入防水率', trigger: 'change' },
        ],
        killingRate: [
          { required: true, message: '请输入杀率', trigger: 'change' },
        ],
        period: [
          { required: true, message: '请输入周期', trigger: 'change' },
          {
            required: true,
            validator: (rule, value, callback) => {
              if (Math.floor(value) !== value * 1) {
                return callback(new Error('必须为整数'))
              } else {
                return callback()
              }
            },
            trigger: 'change',
          },
        ],
        cycleClear: [
          { required: true, message: '请输入循环清除次数', trigger: 'change' },
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value < 1) {
                return callback(new Error('不可小于1'))
              } else {
                return callback()
              }
            },
            trigger: 'change',
          },
        ],
      },
      freshLoading: false,
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
        pid: 1,
        level: 0,
        name: null,
        icon: null,
        chinese: null,
        status: 1,
        playMethod: null,
      }
    },

    // 重新设置表单数据
    resetChangeModel() {
      this.changeModel = {
        changeStatus: null,
        changeMessage: null,
      }
    },

    // 刷新
    refreshData() {
      this.list = null
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        status: null,
        name: null,
      }
      this.fetchData()
    },

    // 获取列表数据 你好
    fetchData() {
      this.listLoading = true
      getCpTypeList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var statusString = ''
            if (item.status == 1) {
              statusString = '启用'
            } else if (item.status == 2) {
              statusString = '禁用'
            }
            this.$set(item, 'statusString', statusString)
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

    // 滑块状态改变
    switchStatusChange(row) {
      const rowDic = Object.assign({}, row)
      this.listLoading = true
      // 请求网络
      updateCpType({
        id: rowDic.id || 0,
        status: rowDic.status,
        chinese: rowDic.chinese,
        name: rowDic.name,
        icon: rowDic.icon,
        playMethod: rowDic.playMethod,
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

    changeStart() {
      this.$confirm('是否开启彩票弹窗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          startCp()
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '开启成功',
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

    changeStop() {
      this.$confirm('是否关闭彩票弹窗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          stopCp()
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '关闭成功',
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

    buttonStart() {
      this.$confirm('是否开启彩票按钮？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          startCpButton()
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '开启成功',
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

    buttonStop() {
      this.$confirm('是否关闭彩票按钮？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          stopCpButton()
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '关闭成功',
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
      getCpMessage().then((res) => {
        if (
          res.data != null &&
          res.data != undefined &&
          JSON.stringify(res.data) != '{}'
        ) {
          this.changeModel.changeStatus = res.data.changeStatus
          this.changeModel.changeMessage = res.data.changeMessage
        }
      })
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
      this.$confirm('是否删除该彩票？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteCpType([row.id])
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除彩票成功',
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
            ...formDic,
            id: null,
          }
          if (this.dialogStatus === 'create') {
            createCpType(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建彩票成功',
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
            updateCpType(formDic)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改彩票成功',
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

    // 创建/更新 数据
    handleChangeDataClick(changeStatus, changeMessage) {
      const params = {
        changeStatus: changeStatus,
        changeMessage: changeMessage,
      }
      // 请求服务器
      this.dialogChangeVisible = true
      if (this.dialogStatus === 'change') {
        changeCpStatus(params)
          .then((res) => {
            this.dialogChangeLoading = false
            this.dialogChangeVisible = false
            this.$notify({
              title: '提示',
              message: '修改彩票维护状态成功',
              type: 'success',
              duration: 1500,
            })
          })
          .catch((err) => {
            this.dialogChangeLoading = false
            this.$message.error(err)
          })
      }
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

    uploadImgRequest(option, content) {
      console.log('-----------自定义上传方法------------')
      this.$store
        .dispatch('oss/getOSSInfos')
        .then((res) => {
          return uploadFile(res, 'cp', option.file.name, option.file)
        })
        .then((url) => {
          this.$set(this.createModel, content, url)
          this.dialogCreateLoading = false
        })
        .catch((err) => {
          console.error('oss失败' + JSON.stringify(err))
          this.dialogCreateLoading = false
          this.$message.error('上传失败，请重试')
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

    //刷新缓存
    async clearCache() {
      this.freshLoading = true
      await HandleClearCache()
      this.freshLoading = false
      this.$message.success('操作成功')
    },
  },
}
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
  width: 360px;
  margin-right: 10px;
}

.el-input-group__prepend {
  background-color: #fff;
}

.vue-pagination {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0px;
  padding: 0px;
}
.dialogContent {
  width: 100%;
  height: 76vh;
  overflow: auto;
  padding-right: 10px;
}
.avatar {
  object-fit: contain;
}
.span_primary {
  margin-right: 10px;
  color: #fc708b;
  cursor: pointer;
}
</style>
