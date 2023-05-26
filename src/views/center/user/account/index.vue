<template>
  <div class="app-container">
    <!--  <el-button size="small" type="primary" icon="el-icon-edit-outline" @click="showUpdateTypeClick()">编辑用户类型</el-button> -->
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" placeholder="请输入用户ID" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.phone" size="small" placeholder="请输入手机号" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.ip" size="small" placeholder="请输入注册IP" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.LoginIp" size="small" placeholder="请输入登陆IP" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.udid" size="small" placeholder="请输入UIID" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="用户ID" min-width="125">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="anchorFlag" label="主播标识" min-width="100">
        <template slot-scope="{ row }">
          <el-tag :type="row.anchorFlag == 1 ? 'success' : 'primary'">{{ row.anchorFlag == 1 ? "主播" : "用户" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="account" label="手机号" min-width="100" />
      <el-table-column prop="ip" label="注册IP" min-width="130" />
      <el-table-column prop="loginIp" label="登陆IP" min-width="130" />
      <el-table-column prop="udid" label="UDID" min-width="220" />
      <el-table-column prop="loginTimeString" label="登陆时间" min-width="160" />
      <!--  <el-table-column prop="accountTypeString" label="用户类型" min-width="60"  ></el-table-column>
        <el-table-column prop="typeDetail" label="类型详情" min-width="60"  ></el-table-column> -->
      <el-table-column prop="createTimeString" label="创建时间" width="160" />
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <!-- 新增弹窗 -->
    <el-dialog title="编辑用户类型" :visible.sync="dialogVisible" :close-on-click-modal="false" :destroy-on-close="true"
      width="30%">
      <div v-cloading="dialogLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
          <el-form-item label="用户ID" prop="uid"><el-input v-model="createModel.uid" clearable placeholder="用户ID"
              maxlength="10" /></el-form-item>

          <el-form-item label="用户类型">
            <el-select v-model="createModel.accountType" placeholder="请--选--择 ">
              <el-option v-for="item in typeList" :key="item.label" :label="item.label" :value="item.value"
                :v-model="createModel.accountType" />
            </el-select>
          </el-form-item>
          <el-form-item prop="typeDetail" label="描述"><el-input v-model="createModel.typeDetail" clearable
              placeholder="描述" /></el-form-item>
        </el-form>
      </div>

      <div slot="footer">
        <el-button size="medium" @click="dialogVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="saveUserTypeClick()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAccountList, saveUserType } from '@/api/center/user/account'
// import { getTypeList} from '@/api/type/type';
import { formatUnixTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'

export default {
  name: 'CenterUserAccountController',
  filters: {
    statusFilter(status) {
      const map = { 0: 'info', 2: 'success', 3: 'danger' }
      return map[status]
    },
  },
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
        phone: null,
        uid: null,
        ip: null,
        udid: null,
        LoginIp: null,
        pickerValue: [],
        loginId: this.$store.state.user.uid,
      },
      // 表单模型
      createModel: {
        uid: 0,
        accountType: null,
        typeDetail: null,
      },

      rules: {
        uid: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
        accountType: [
          { required: true, message: '用户类型不能为空', trigger: 'blur' },
        ],
      },
      typeList: null,
      // 弹窗数值
      dialogVisible: false,
      dialogLoading: false,
    }
  },
  created() {
    this.fetchData()
    console.log(this.listQuery)
  },
  methods: {
    reset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        phone: null,
        uid: null,
        ip: null,
        udid: null,
        LoginIp: null,
        pickerValue: [],
      }
      this.fetchData()
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      //  this.typeList = null;
      // getTypeList({ status: 0 })
      //   .then(res => {
      //     this.typeList = (res.data.list || []).map(item => {
      //       return {
      //         value: item.id,
      //         label: nullS(item.typeName)
      //       };
      //   })
      //   return
      getAccountList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        // getAccountList(this.listQuery.limit, this.listQuery.page, this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            // var accountTypeString = '暂无类型';
            // for (let accountTypeDetial of this.typeList) {
            //   console.log(accountTypeDetial);
            //   if (accountTypeDetial.value == item.accountType) {
            //     accountTypeString = accountTypeDetial.label;
            //     break;
            //   }
            // }
            //    this.$set(item, 'accountTypeString', accountTypeString);
            this.$set(item, 'loginTimeString', formatUnixTime(item.loginTime))
            this.$set(item, 'createTimeString', formatUnixTime(item.gmtCreate))
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

    // 保存贵族用户    //
    saveUserTypeClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogLoading = true
          const params = {
            uid: formDic.uid,
            accountType: formDic.accountType,
            typeDetail: formDic.typeDetail,
            /*    vipGroup: formDic.vipGroup */
          }

          saveUserType(params)
            .then((res) => {
              this.dialogLoading = false
              this.dialogVisible = false
              this.$notify({
                title: '提示',
                message: '添加用户类型成功',
                type: 'success',
                duration: 1500,
              })
              setTimeout((_) => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.dialogLoading = false
              this.$message.error(err)
            })
        }
      })
    },
    showUpdateTypeClick() {
      this.resetCreateModel()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        uid: 0,
        typeDetail: null,
      }
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

.vue-pagination {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0px;
  padding: 0px;
}
</style>
