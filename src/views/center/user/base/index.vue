<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" placeholder="请输入用户ID" clearable
          oninput="value=value.replace(/[^\d]/g,'')" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter">
          <!--   <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.nickname" size="small" placeholder="请输入用户昵称" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.trueName" size="small" placeholder="请输入用户姓名" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.phone" size="small" placeholder="请输入手机号" clearable
          oninput="value=value.replace(/[^\d]/g,'')" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="listQuery.manage" size="small" placeholder="请选择是否为超管" clearable
          @change="handleSearchFilter">
          <el-option v-for="item in manageOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-refresh" @click="reloadData()">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="list" size="mini">
      <el-table-column type="expand" width="40">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="省">
              <span>{{ props.row.province || '无' }}</span>
            </el-form-item>
            <el-form-item label="市">
              <span>{{ props.row.city || '无' }}</span>
            </el-form-item>
            <el-form-item label="具体位置">
              <span>{{ props.row.address || '无' }}</span>
            </el-form-item>
            <el-form-item label="个性签名">
              <span>{{ props.row.signature || '无' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="用户ID" min-width="125">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column label="头像" width="80">
        <template slot-scope="{ row }">
          <el-image class="vue-img-preview" :src="row.avatar" fit="contain" lazy @click="reloadAvatar(row)">
            <div slot="error" class="image-slot"><i class="el-icon-picture-outline" /></div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="用户昵称" min-width="80" />
      <el-table-column prop="trueName" label="用户姓名" min-width="80" />
      <el-table-column label="性别" width="80">
        <template slot-scope="{ row }">
          <el-tag size="medium" :type="row.sex | sexFilter">{{ row.sexString }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" min-width="80" />
      <el-table-column prop="signature" label="个性签名" min-width="150" />
      <el-table-column label="超管" width="120">
        <template slot-scope="{ row }">
          <el-switch v-model="row.manage" :width="30" active-text="是" :active-value="1" inactive-text="否"
            :inactive-value="0" @change="changeUserManager(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="createTimeString" label="创建时间" width="140" />
      <el-table-column prop="updateTimeString" label="更新时间" width="140" />
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" plain type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <!-- 新建/编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true" top="5vh" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%;height: 100%;">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
          <el-form-item label="昵称" prop="nickname"><el-input v-model="createModel.nickname" clearable placeholder="昵称"
              maxlength="10" /></el-form-item>
          <el-form-item label="个性签名" prop="signature"><el-input v-model="createModel.signature" clearable
              placeholder="请输入个性签名" maxlength="10" /></el-form-item>
          <!--    <el-form-item label="设置登陆密码" prop="pwd"><el-input v-model="createModel.pwd" clearable placeholder="请输入登陆密码" maxlength="10" /></el-form-item> -->
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
  getCenterBaseUserList,
  updateCenterBaseUserManager,
  updateAvatar,
  updateUser,
} from '@/api/center/user/base'
import { emptyS, nullS, formatUnixTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'

export default {
  name: 'CenterUserBaseController',
  filters: {
    sexFilter(status) {
      const map = { 0: 'info', 1: '', 2: 'danger' }
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
        uid: null,
        phone: null,
        manage: null,
        nickname: null,
        trueName: null,
      },

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        update: '编辑用户',
      },

      // 表单模型
      createModel: {
        uid: 0,
        nickname: null,
        signature: null,
      },

      rules: {
        trueName: [
          { required: true, message: '请输入昵称', trigger: 'change' },
          { min: 1, max: 20, message: '最多为20个字符', trigger: 'change' },
        ],
      },
      manageOptions: [
        { label: '否', value: 0 },
        { label: '是', value: 1 },
      ],
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
        uid: null,
        phone: null,
        manage: null,
        nickname: null,
        signature: null,
        trueName: null,
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
        nickname: null,
        signature: null,
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      // 请求服务器
      getCenterBaseUserList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery.uid,
        this.listQuery.phone,
        this.listQuery.nickname,
        this.listQuery.manage,
        this.listQuery.trueName
      )
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var sexString = ''
            switch (item.sex) {
              case 0:
                sexString = '无'
                break
              case 1:
                sexString = '男'
                break
              case 2:
                sexString = '女'
                break
              default:
                break
            }
            this.$set(item, 'sexString', sexString)
            this.$set(item, 'createTimeString', formatUnixTime(item.createTime))
            this.$set(item, 'updateTimeString', formatUnixTime(item.updateTime))
            return item
          })
          this.listQuery.total = res.data.total
          this.listLoading = false
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
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

    // 创建/更新 数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)

          // 请求服务器
          this.dialogCreateLoading = true
          const params = {
            uid: formDic.uid || 0,
            nickname: nullS(formDic.nickname),
            signature: nullS(formDic.signature),
            pwd: formDic.pwd,
          }
          updateUser(params)
            .then((res) => {
              this.dialogCreateLoading = false
              this.dialogCreateVisible = false
              this.$notify({
                title: '提示',
                message: '修改成功',
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
      })
    },

    // 修改违规头像
    reloadAvatar(row) {
      if (row.uid == null || row.uid < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('是否清除用户头像？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          updateAvatar(row.uid)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '修改头像成功',
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

    // 更改用户超管状态
    changeUserManager(row) {
      this.listLoading = true
      const uid = row.uid
      const mgr = row.manage
      // 请求网络
      updateCenterBaseUserManager(uid, mgr)
        .then((res) => {
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: mgr === 0 ? '取消超管成功' : '设置超管成功',
            type: 'success',
            duration: 1000,
          })
        })
        .catch((err) => {
          // 错误的情况下，修改内存属性
          row.manage = !mgr
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
