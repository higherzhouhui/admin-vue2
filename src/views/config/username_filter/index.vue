<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-select
          v-model="listQuery.type"
          size="small"
          placeholder="请选择处理类型"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <!-- 状态 -->
      <!--   <el-input
        size="medium"
        v-model="listQuery.uid"
        class="input-with-select"
        placeholder="请输入用户ID"
        clearable
        @keyup.enter.native="handleSearchFilter"
        @clear="handleSearchFilter"
      >
      </el-input>-->
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchFilter"
        >搜索</el-button>
        <el-button
          size="small"
          icon="el-icon-refresh"
          @click="reset"
        >重置</el-button>
      </el-form-item>
      <!--  <el-button size="medium" plain icon="el-icon-refresh" @click="fetchData()" /> -->
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="showChangeDialogClick()"
        >添加敏感词汇</el-button>
      </el-form-item>
      <el-form-item>
        <span
          style="color: #f00"
        >注意:多个敏感词必须以英文逗号( , )相隔,否则只作为一个敏感词存储</span>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column
        prop="word"
        label="敏感词"
        min-width="60"
      />
      <el-table-column label="类型" width="120">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.type | statusFilter">{{
            row.typeString
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="{ row }">
          <span
            class="operation_btn"
            type="primary"
            size="mini"
            @click="showUpdateDialogClick(row)"
          >编辑</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!--    <el-pagination
      class="vue-pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
    ></el-pagination> -->
    <!-- 新建/编辑 消息公告 -->
    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      :visible.sync="dialogCreateVisible"

      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="35%"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="changeModel"
          label-position="top"
          size="medium"
        >
          <!-- <el-form-item label="敏感词类型" prop="type">
            <el-select v-model="changeModel.type"  placeholder="请选择类型">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item> -->
          <el-form-item
            label="修改敏感词汇"
            prop="chinese"
          ><el-input
            v-model="changeModel.word"
            type="textarea"
            clearable
            placeholder="请输入敏感词汇"
          /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          size="medium"
          @click="dialogCreateVisible = false"
        >取消</el-button>
        <el-button
          size="medium"
          type="primary"
          :disabled="
            changeModel.word !== null && changeModel.word.length > 0
              ? false
              : true
          "
          @click="handleDataClick()"
        >确定</el-button>
      </div>
    </el-dialog>
    <!-- 新建/编辑 敏感词汇 -->
    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      :visible.sync="dialogChangeVisible"

      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="35%"
    >
      <div v-cloading="dialogChangeLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="changeModel"
          label-position="top"
          size="medium"
        >
          <el-form-item label="敏感词类型" prop="type">
            <el-select v-model="changeModel.type" placeholder="请选择类型">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="添加敏感词汇"
            prop="chinese"
          ><el-input
            v-model="changeModel.word"
            type="textarea"
            clearable
            placeholder="请输入敏感词汇"
          /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          size="medium"
          @click="dialogChangeVisible = false"
        >取消</el-button>
        <el-button
          size="medium"
          type="primary"
          :disabled="
            (changeModel.type !== null ? false : true) ||
              (changeModel.word !== null && changeModel.word.length > 0
                ? false
                : true)
          "
          @click="handleChangeDataClick(changeModel.type, changeModel.word)"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserNameFilterList,
  addWord,
  updateWord,
  deleteWord
} from '@/api/config/username_filter'
import { emptyS, nullS, formatUnixTime } from '@/utils/tools'

export default {
  name: 'ConfigUserNameFilterController',
  filters: {
    statusFilter(status) {
      const map = { 1: 'info', 0: 'success', 2: 'danger' }
      return map[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      oldType: null,
      oldWord: null,
      listQuery: {
        type: null
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogChangeVisible: false,
      dialogChangeLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加敏感词汇',
        update: '编辑敏感词汇',
        change: '维护状态'
      },

      // 表单模型
      createModel: {
        word: null,
        type: null
      },

      // 表单模型
      changeModel: {
        type: null,
        word: null
      },

      typeOptions: [
        { label: '广告', value: 0 },
        { label: '签名', value: 1 },
        { label: '用户名', value: 2 }
      ]
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
    resetChangeModel() {
      this.changeModel = {
        type: null,
        word: null
      }
    },

    // 刷新
    refreshData() {
      this.list = null
      this.listQuery = {
        type: null
      }
      this.fetchData()
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getUserNameFilterList(this.listQuery)
        .then((res) => {
          console.log(res.data)
          this.list = (res.data || []).map((item) => {
            var typeString = ''
            if (item.type == 0) {
              typeString = '广告'
            } else if (item.type == 1) {
              typeString = '签名'
            } else if (item.type == 2) {
              typeString = '用户名'
            }
            this.$set(item, 'typeString', typeString)
            return item
          })
          this.listLoading = false
        })
        .catch((err) => {
          this.list = null
          this.listLoading = false
          this.$message.error(err)
        })
    },

    // 显示创建弹出窗
    showCreateDialogClick() {
      this.resetChangeModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示编辑弹出窗
    showUpdateDialogClick(row) {
      this.oldType = row.type
      this.oldWord = row.word
      this.resetChangeModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'update'
      this.changeModel = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示删除弹窗
    showDeleteDialogClick(row) {
      if (row.type == null || row.type < 0) {
        this.$message.error('参数错误')
        return
      }
      if (row.word == null || row.word == '') {
        this.$message.error('参数错误')
        return
      }

      const params = {
        type: row.type,
        word: row.word
      }
      this.$confirm('是否删除该敏感词汇？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true

          deleteWord(params)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除敏感词汇成功',
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

    // 显示编辑弹出窗
    showChangeDialogClick() {
      this.resetChangeModel()

      this.dialogChangeVisible = true
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.changeModel)
          // 请求服务器
          this.dialogCreateLoading = true
          const params = {
            type: formDic.type,
            word: formDic.word,
            oldType: this.oldType,
            oldWord: this.oldWord
          }
          if (this.dialogStatus === 'create') {
            createFilterUser(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建过滤信息成功',
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
            updateWord(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改敏感词汇成功',
                  type: 'success',
                  duration: 1500
                })
                setTimeout((_) => {
                  this.fetchData()
                }, 200)
                this.oldtype = null
                this.oldWord = null
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
    handleChangeDataClick(type, word) {
      const params = {
        type: type,
        word: word
      }
      // 请求服务器
      this.dialogChangeLoading = true

      addWord(params)
        .then((res) => {
          this.dialogChangeLoading = false
          this.dialogChangeVisible = false
          this.$notify({
            title: '提示',
            message: '添加敏感词汇成功',
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
