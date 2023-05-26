<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" placeholder="请输入用户ID" clearable
          oninput="value=value.replace(/[^\d]/g,'')" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter">
          <!-- <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter" /> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.bankName" size="small" placeholder="请输入协议类型" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter" /> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.cardNo" size="small" placeholder="请输入Usdt地址" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <!-- <span style="margin-right: 10px;" /> -->
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" plain icon="el-icon-refresh" @click="reloadData()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="用户ID" min-width="125">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="bankName" label="协议类型" min-width="80" />
      <el-table-column prop="cardNo" label="地址" min-width="200" />
      <el-table-column prop="remarkString" label="操作人" width="100" />
      <el-table-column prop="createTimeString" label="创建时间" width="180" />
      <el-table-column prop="updateTimeString" label="更新时间" width="180" />
      <el-table-column v-if="($store.getters.buttonPermission.includes('用户银行卡操作'))" label="操作" width="100"
        fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" plain type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</span>
          <span class="operation_btn" plain type="danger" size="mini" @click="showDeleteDialogClick(row)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page" :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 新建/编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true" top="5vh" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%;height: 100%;">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
          <el-form-item label="协议类型" prop="bankName">
            <el-input v-model="createModel.bankName" clearable placeholder="请输入协议类型" maxlength="50" show-word-limit />
          </el-form-item>
          <el-form-item label="地址" prop="cardNo">
            <el-input v-model="createModel.cardNo" clearable placeholder="请输入地址" maxlength="64" show-word-limit />
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
  getCenterBankList,
  updateCenterBank,
  deleteCenterBank,
} from '@/api/center/user/usdt'
import { emptyS, nullS, formatUnixTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'

export default {
  name: 'CenterUserBankUsdtController',
  filters: {},
  components: {
    UserDrawer,
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null,
        bankName: null,
        cardNo: null,
      },
      logstypeOptions: [],
      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        update: '编辑USDT地址',
      },

      // 表单模型
      createModel: {
        uid: 0,
        cardNo: null,
        bankName: null,
      },

      rules: {
        uid: [
          { required: true, message: '请输入用户ID' },
          { type: 'number', message: '请输入正确的数值' },
        ],
        cardNo: [
          { required: true, message: '请输入地址', trigger: 'change' },
          { min: 1, max: 64, message: '最多为64个字符', trigger: 'change' },
        ],
        bankName: [
          { required: true, message: '请输入协议类型', trigger: 'change' },
          { min: 1, max: 30, message: '最多为30个字符', trigger: 'change' },
        ],
      },
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 刷新数据
    reloadData() {
      // 重置数据
      this.list = null
      this.listLoading = true
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        id: 0,
        uid: null,
        bankName: null,
        cardNo: null,
      }
      setTimeout(() => {
        this.fetchData()
      }, 80)
    },

    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        uid: 0,
        cardNo: null,
        bankName: null,
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      // 请求服务器
      getCenterBankList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      )
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            this.$set(item, 'createTimeString', formatUnixTime(item.createTime))
            this.$set(item, 'updateTimeString', formatUnixTime(item.updateTime))
            if (typeof JSON.parse(item.remark) === 'object') {
              this.$set(item, 'remarkString', JSON.parse(item.remark).updater)
            }
            return item
          })
          this.listQuery.total = res.data.total
          this.listLoading = false
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
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
      this.$confirm('是否删除该地址？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteCenterBank(row.id)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除地址成功',
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
            id: formDic.id || 0,
            uid: formDic.uid || 0,
            cardNo: nullS(formDic.cardNo),
            bankName: nullS(formDic.bankName),
          }
          if (this.dialogStatus === 'update') {
            updateCenterBank(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改地址成功',
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
  },
}
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
  width: 260px;
  margin-right: 10px;

  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}

.vue-img-preview {
  width: 30px;
  height: 30px;
  margin: 0px;
  padding: 0px;
  border-radius: 3px;
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
</style>
