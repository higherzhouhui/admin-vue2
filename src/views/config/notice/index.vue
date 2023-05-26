<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <!-- 筛选类型 -->
        <el-select v-model="listQuery.typeId" size="small" clearable placeholder="请选择消息类型" @change="handleSearchFilter">
          <el-option v-for="item in typeList" :key="item.value" :label="item.typeNameZh" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset">刷新</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加消息公告</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="title" label="标题" min-width="80" />
      <el-table-column prop="content" label="内容" min-width="200">
        <template slot-scope="{ row }">
          <span>{{ removeHTMLTag(row.content).length > 20 ? removeHTMLTag(row.content).slice(0, 20) + '...' : removeHTMLTag(row.content) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="typeString" label="类别" min-width="80" />
      <el-table-column prop="status" label="状态" min-width="80">
        <template slot-scope="{ row }">
          <el-tag :type="row.status == 1 ? 'success' : 'info'">{{ row.status == 1 ? '已发送' : '待发送' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateUser" label="操作人" min-width="100" />
      <el-table-column prop="createTimeString" label="创建时间" width="160" />
      <el-table-column prop="updateTimeString" label="更新时间" width="160" />
      <el-table-column label="操作" width="130" fixed="right">
        <template slot-scope="{ row }">
          <span v-if="row.status != 1" class="operation_btn" type="primary" size="mini" @click="sendMessage(row)">发送</span>
          <span v-if="row.status != 1" class="operation_btn" type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</span>
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

    <!-- 新建/编辑 消息公告 -->
    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%;height: 100%;">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" size="medium">
          <el-form-item label="消息类型">
            <el-select v-model="createModel.typeId" size="small" clearable placeholder="请选择消息类型">
              <el-option v-for="item in typeList" :key="item.value" :label="item.typeNameZh" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="消息标题" prop="title">
            <el-input
              v-model="createModel.title"
              type="textarea"
              placeholder="请输入消息标题"
              :autosize="{ minRows: 1, maxRows: 2 }"
              maxlength="40"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="消息内容">
            <Tinymce id="tinymce_id" ref="editor" v-model="createModel.content" :height="400" />
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
  sysTemNoticeList,
  sysTemTypeList,
  createNotice,
  updateNotice,
  deleteNotice,
  addSysTemNotice,
  sendSysTemNotice,
  updateSysTemNotice,
  deleteSysTemNotice
} from '@/api/config/notice'
import { removeHTMLTag, formatUnixTime } from '@/utils/tools'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'ConfigNoticePage',
  components: {
    Tinymce
  },
  filters: {
    typeFilter(status) {
      const map = { 0: '', 1: 'success' }
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
      removeHTMLTag: removeHTMLTag,
      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加消息',
        update: '编辑消息'
      },

      // 表单模型
      createModel: {},
      typeOptions: [{ label: '普通', value: 0 }, { label: '跳转', value: 1 }],

      // 验证规则
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'change' }, { min: 1, max: 40, message: '最多为40个字符', trigger: 'change' }],
      },
      typeList: []
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
    sendMessage(row) {
      this.$confirm('确定要发送该消息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          sendSysTemNotice(row)
            .then(res => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '操作成功！',
                type: 'success'
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
        .catch(() => { })
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {}
    },

    // 获取列表数据
    async fetchData() {
      this.listLoading = true
      if (!this.typeList.length) {
        const typeListRes = await sysTemTypeList()
        if (typeListRes.code === 200) {
          this.typeList = typeListRes.data
        }
      }
      sysTemNoticeList(this.listQuery)
        .then(res => {
          this.list = (res.data.list || []).map(item => {
            let typeString = '活动'
            const filterArr = this.typeList.filter(ctype => { return ctype.id === item.typeId })
            if (filterArr.length) {
              typeString = filterArr[0].typeNameZh
            }
            this.$set(item, 'typeString', typeString)
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
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('确认要删除该消息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteSysTemNotice(row)
            .then(res => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '操作成功！',
                type: 'success',
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
        .catch(() => { })
    },

    // 创建/更新 数据
    handleDataClick() {
      if (this.dialogCreateLoading) {
        return
      }
      if (!this.createModel.typeId) {
        this.$message.warning('请选择消息类型！')
        return
      }
      if (!this.createModel.content) {
        this.$message.warning('请输入消息内容！')
        return
      }
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogCreateLoading = true
          if (this.dialogStatus === 'create') {
            addSysTemNotice(formDic)
              .then(res => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '操作成功！',
                  type: 'success',
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
            updateSysTemNotice(formDic)
              .then(res => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '操作成功！',
                  type: 'success',
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
