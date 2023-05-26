<template>
  <div class="app-container">
    <el-form :inline="true">
      <!-- 筛选状态 -->
      <el-form-item>
        <el-select
          v-model="listQuery.status"
          size="small"
          clearable
          placeholder="请选择开启状态"
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
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
    </el-form>
    <el-form>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="showCreateDialogClick()"
        >添加支付产品</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
      :default-sort="{ prop: 'sort', order: 'ascending' }"
      @sort-change="listSortChange"
    >
      <el-table-column type="index" label="序号" width="70" />
      <el-table-column
        prop="sort"
        sortable="custom"
        label="排序"
        width="80"
      />
      <el-table-column
        prop="code"
        label="产品代码"
        min-width="100"
      />
      <el-table-column
        prop="userRmb"
        label="VND-分"
        min-width="100"

        sortable
      />
      <el-table-column
        prop="goldCoin"
        label="金币"
        min-width="80"

        sortable
      />
      <el-table-column
        prop="remark"
        label="产品描述"
        min-width="120"
      />
      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="160"
      />
      <el-table-column
        prop="updateTimeString"
        label="修改时间"
        width="160"
      />
      <el-table-column label="状态" width="140">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            :width="30"
            active-text="启用"
            :active-value="0"
            inactive-text="禁用"
            :inactive-value="1"
            @change="handleSwitchChange(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="{ row }">
          <span
            class="operation_btn"
            type="primary"
            size="mini"
            @click="showUpdateDialogClick(row)"
          >编辑</span>
          <span
            class="operation_btn"
            type="danger"
            size="mini"
            @click="showDeleteDialogClick(row)"
          >删除</span>
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
          size="medium"
        >
          <el-form-item
            label="排序"
            prop="sort"
          ><el-input
            v-model.number="createModel.sort"
            clearable
            placeholder="请输入排序号"
            maxlength="4"
          /></el-form-item>
          <el-form-item
            label="产品代码"
            prop="code"
          ><el-input
            v-model="createModel.code"
            clearable
            placeholder="请输入产品代码"
            maxlength="20"
            show-word-limit
          /></el-form-item>
          <el-form-item label="充值金额(分)" prop="userRmb">
            <el-input
              v-model.number="createModel.userRmb"
              clearable
              placeholder="请输入充值的金额"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item label="获得金币" prop="goldCoin">
            <el-input
              v-model.number="createModel.goldCoin"
              clearable
              placeholder="请输入充值金额所获得的金币"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item label="商品描述">
            <el-input
              v-model="createModel.remark"
              type="textarea"
              placeholder="请输入商品描述"
              maxlength="200"
              :autosize="{ minRows: 2, maxRows: 4 }"
              show-word-limit
            />
          </el-form-item>
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
          @click="handleDataClick()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPayProductList,
  updatePayProduct,
  addPayProduct,
  deletePayProduct
} from '@/api/config/pay_product'
import { emptyS, nullS, formatUnixTime, sortBy } from '@/utils/tools'

export default {
  name: 'ConfigPayProductController',
  filters: {},
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        status: null
      },
      statusOptions: [
        { label: '启用', value: 0 },
        { label: '禁用', value: 1 }
      ],

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '新增支付产品',
        update: '编辑支付产品'
      },

      // 表单模型
      createModel: {
        sort: 0,
        code: null,
        userRmb: 0,
        goldCoin: 0,
        remark: null
      },

      // 验证规则
      rules: {
        sort: [
          { required: true, message: '请输入排序号' },
          { type: 'number', message: '请输入正确的排序号' }
        ],
        code: [
          { required: true, message: '请输入产品代码', trigger: 'change' },
          { min: 1, max: 20, message: '最多为20个字符', trigger: 'change' }
        ],
        userRmb: [
          { required: true, message: '请输入充值金额' },
          { type: 'number', message: '请输入正确的充值金额' }
        ],
        goldCoin: [
          { required: true, message: '请输入获得的金币' },
          { type: 'number', message: '请输入正确的获得的金币' }
        ]
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
        sort: 0,
        code: null,
        userRmb: 0,
        goldCoin: 0,
        remark: null
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getPayProductList({
        pageSize: this.listQuery.limit,
        pageNum: this.listQuery.page,
        status: this.listQuery.status
      })
        .then((res) => {
          const list = (res.data.list || []).map((item) => {
            this.$set(
              item,
              'createTimeString',
              formatUnixTime(item.createTime)
            )
            this.$set(
              item,
              'updateTimeString',
              formatUnixTime(item.updateTime)
            )
            return item
          })
          this.list = list.sort(sortBy('sort'))
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

    // 列表排序改变
    listSortChange(val) {
      if (val.prop === 'sort') {
        var list = this.list
        if (val.order === 'ascending') {
          this.list = list.sort(sortBy('sort'))
        } else {
          this.list = list.sort(sortBy('sort', false))
        }
      }
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
      this.$confirm('是否删除该产品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deletePayProduct(row.id)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除产品成功',
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

    // 创建 数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogCreateLoading = true
          const params = {
            sort: formDic.sort || 0,
            userRmb: formDic.userRmb || 0,
            goldCoin: formDic.goldCoin || 0,
            code: nullS(formDic.code),
            remark: nullS(formDic.remark)
          }
          if (this.dialogStatus === 'create') {
            addPayProduct(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建产品成功',
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
            updatePayProduct(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改产品成功',
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

    // 滑竿变化
    handleSwitchChange(row) {
      const rowDic = Object.assign({}, row)
      if (rowDic.id == null || rowDic.id < 1) {
        this.$message.error('参数错误')
        return
      }
      this.listLoading = true
      updatePayProduct({
        id: rowDic.id,
        status: rowDic.status
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
          this.listLoading = false
          this.$message.error(err)
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
</style>
