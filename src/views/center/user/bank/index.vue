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
        <el-input v-model="listQuery.trueName" size="small" placeholder="请输入用户姓名" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter" /> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.cardNo" size="small" placeholder="请输入银行卡号" clearable
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
      <el-table-column prop="trueName" label="真实姓名" min-width="120" />
      <el-table-column prop="cardNo" label="银行卡号" min-width="120" />
      <el-table-column prop="bankName" label="开户银行" min-width="120" />
      <el-table-column prop="bankProvince" label="开户省" min-width="120" />
      <el-table-column prop="bankCity" label="开户市" min-width="120" />
      <el-table-column prop="bankSub" label="支行名称" min-width="120" />
      <el-table-column prop="remarkString" label="操作人" min-width="120" />
      <el-table-column prop="createTimeString" label="创建时间" width="160" />
      <el-table-column prop="updateTimeString" label="更新时间" width="160" />
      <el-table-column v-if="($store.getters.buttonPermission.includes('用户银行卡操作'))" label="操作" width="100"
        fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" size="mini" @click="showUpdateDialogClick(row)">编辑</span>
          <span class="operation_btn" size="mini" @click="showDeleteDialogClick(row)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page" :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 新建/编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading" style="width: 100%;height: 100%;">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
          <el-form-item label="真实姓名" prop="trueName">
            <el-input v-model="createModel.trueName" clearable placeholder="请输入真实姓名" maxlength="50" show-word-limit />
          </el-form-item>
          <el-form-item label="银行卡号" prop="cardNo">
            <el-input v-model="createModel.cardNo" clearable placeholder="请输入银行卡号" maxlength="30" show-word-limit />
          </el-form-item>
          <!-- <el-form-item label="开户银行" prop="bankName">
            <el-input v-model="createModel.bankName" clearable placeholder="请输入开户银行" maxlength="50" />
          </el-form-item> -->
          <el-form-item label="开户银行" prop="bankName">
            <el-select v-model="createModel.bankName" placeholder="请选择开户银行">
              <el-option v-for="item in logstypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="开户省" prop="bankProvince">
            <el-input v-model="createModel.bankProvince" clearable placeholder="开户省" maxlength="40" />
          </el-form-item>
          <el-form-item label="开户市" prop="bankCity">
            <el-input v-model="createModel.bankCity" clearable placeholder="请输入开户市" maxlength="30" />
          </el-form-item>
          <el-form-item label="支行名称" prop="bankSub">
            <el-input v-model="createModel.bankSub" clearable placeholder="请输入支行名称" maxlength="50" />
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
  getBankList,
} from '@/api/center/user/bank'
import { emptyS, nullS, formatUnixTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'

export default {
  name: 'CenterUserBankController',
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
        trueName: null,
        cardNo: null,
      },
      logstypeOptions: [],
      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        update: '编辑银行卡',
      },

      // 表单模型
      createModel: {
        uid: 0,
        trueName: null,
        cardNo: null,
        bankName: null,
        bankProvince: null,
        bankCity: null,
        bankSub: null,
      },

      rules: {
        uid: [
          { required: true, message: '请输入用户ID' },
          { type: 'number', message: '请输入正确的数值' },
        ],
        trueName: [
          { required: true, message: '请输入真实姓名', trigger: 'change' },
          { min: 1, max: 30, message: '最多为30个字符', trigger: 'change' },
        ],
        cardNo: [
          { required: true, message: '请输入银行卡号', trigger: 'change' },
          { min: 1, max: 30, message: '最多为30个字符', trigger: 'change' },
        ],
        bankName: [
          { required: true, message: '请输入开户银行', trigger: 'change' },
          { min: 1, max: 30, message: '最多为30个字符', trigger: 'change' },
        ],
        bankProvince: [
          { required: true, message: '请输入开户省', trigger: 'change' },
          { min: 1, max: 30, message: '最多为30个字符', trigger: 'change' },
        ],
        bankCity: [
          { required: true, message: '请输入开户市', trigger: 'change' },
          { min: 1, max: 30, message: '最多为30个字符', trigger: 'change' },
        ],
        bankSub: [
          { required: true, message: '请输入支行名称', trigger: 'change' },
          { min: 1, max: 30, message: '最多为30个字符', trigger: 'change' },
        ],
      },
    }
  },
  created() {
    getBankList()
      .then((res) => {
        this.logstypeOptions = (res.data != null ? res.data : []).map(
          (item) => {
            return {
              value: item,
              label: nullS(item),
            }
          }
        )
      })
      .catch((err) => {
        this.logstypeOptions = []
        this.$message.error(err)
      })
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
        trueName: null,
        cardNo: null,
        bankName: null,
        bankProvince: null,
        bankCity: null,
        bankSub: null,
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
        trueName: null,
        cardNo: null,
        bankName: null,
        bankProvince: null,
        bankCity: null,
        bankSub: null,
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
      this.$confirm('是否删除该银行卡？', '提示', {
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
                message: '删除银行卡成功',
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
            trueName: nullS(formDic.trueName),
            cardNo: nullS(formDic.cardNo),
            bankName: nullS(formDic.bankName),
            bankProvince: nullS(formDic.bankProvince),
            bankCity: nullS(formDic.bankCity),
            bankSub: nullS(formDic.bankSub),
          }
          if (this.dialogStatus === 'update') {
            updateCenterBank(params)
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改银行卡成功',
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
