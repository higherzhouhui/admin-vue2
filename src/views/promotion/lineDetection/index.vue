<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-select v-model="listQuery.state" size="small" placeholder="请选择是否启用" clearable @change="handleSearchFilter">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.siteName" size="small" placeholder="请输入站点名称" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.url" size="small" placeholder="请输入站点地址" clearable />
      </el-form-item>
      <el-form-item class="nowrap">
        <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
        <!-- 重置 -->
        <el-button size="small" icon="el-icon-refresh" @click="resets">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showaddLineDetectionClick()">添加站点</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini"
      :header-cell-style="{ background: 'green', color: '#fff' }">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="siteName" label="名称" min-width="120" />
      <el-table-column prop="url" label="URL地址" min-width="120" />
      <el-table-column prop="type" label="类型" min-width="120">
        <template slot-scope="{ row }">
          <el-tag :type="row.type == 1 ? 'primary' : 'success'">
            {{ row.type == 1 ? 'PC/H5' : 'APP' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" width="120">
        <template slot-scope="{ row }">
          <el-switch v-model="row.state" :width="30" active-text="是" :active-value="1" inactive-text="否"
            :inactive-value="-1" @change="changeShareStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作人" min-width="80" />
      <el-table-column prop="createTimeString" label="创建时间" width="160" />
      <el-table-column prop="updateTimeString" label="修改时间" width="160" />
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" plain type="primary" size="mini"
            @click="showUpdateLineDectionClick(row)">编辑</span>
          <span class="operation_btn" plain type="danger" size="mini" @click="showDeleteLineDectionClick(row)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.pageSize" :page-sizes="[10, 20, 50]"
      :page-size="listQuery.pageNum" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 新建/编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
          <el-form-item label="名称" prop="siteName">
            <el-input v-model.number="createModel.siteName" clearable placeholder="请输入站点名称" maxlength="50"
              show-word-limit />
          </el-form-item>
          <el-form-item label="站点类型">
            <el-radio-group v-model="createModel.type">
              <el-radio :label="1">PC/H5</el-radio>
              <el-radio :label="2">APP</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="站点地址" prop="url">
            <el-input v-model.number="createModel.url" clearable placeholder="请输入站点地址" maxlength="50" show-word-limit />
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch v-model="createModel.state" active-text="启用" :active-value="1" inactive-text="禁用"
              :inactive-value="-1" />
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
  getLineDetectionList,
  addLineDetection,
  updateLineDection,
  deleteLineDection,
} from '@/api/promotion/line_detection'
import { formatUnixTime } from '@/utils/tools'

export default {
  name: 'PromotionLineDetectionIndex',
  filters: {},
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        state: null,
        total: 0,
        url: null,
      },

      statusOptions: [
        { label: '启用', value: 1 },
        { label: '禁用', value: -1 },
      ],

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加站点',
        update: '编辑站点',
      },

      // 表单模型
      createModel: {
        url: '',
        state: -1,
        type: 1,
        siteName: '',
      },

      // 验证规则
      rules: {
        url: [{ required: true, message: '请输入站点地址' }],
        siteName: [
          { required: true, message: '请输入站点名称', trigger: 'change' },
        ],
        type: [
          { required: true, message: '请输入站点名称', trigger: 'change' },
        ],
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    resets() {
      this.listQuery = {
        pageNum: 1,
        pageSize: 20,
      }
      this.fetchData()
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        url: '',
        state: -1,
        type: 1,
        siteName: '',
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getLineDetectionList(this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
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

    // 显示创建弹出窗
    showaddLineDetectionClick() {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示编辑弹出窗
    showUpdateLineDectionClick(row) {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'update'
      this.createModel = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示删除弹窗
    showDeleteLineDectionClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('是否删除该链接？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteLineDection(row.id)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除分享链接成功',
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
          if (this.dialogStatus === 'create') {
            addLineDetection(formDic)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建分享链接成功',
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
            updateLineDection(formDic)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '操作成功',
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

    changeShareStatus(row) {
      this.listLoading = true
      // 请求网络
      updateLineDection(row)
        .then((res) => {
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: '操作成功！',
            type: 'success',
            duration: 1500,
          })
          this.fetchData()
        })
        .catch((err) => {
          // 错误的情况下，修改内存属性
          this.fetchData()
          this.listLoading = false
          this.$message.error(err)
        })
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

.span_primary {
  margin-right: 10px;
  color: #fc708b;
  cursor: pointer;
}

.vue-pagination {
  margin: 20px 0px 20px 0px;
  padding: 0px;
}
</style>

