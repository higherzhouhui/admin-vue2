<template>
  <div class="app-container">
    <el-form :inline="true">
      <!-- 搜索框 -->
      <el-form-item>
        <el-input v-model="listQuery.searchContent" size="small" placeholder="请输入账号" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">添加用户</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-edit-outline"
          @click="showChangeDialogClick()"
        >编辑用户充值金额</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" width="60" label="序号" />
      <el-table-column label="头像" width="120">
        <template slot-scope="scope">
          <el-avatar size="medium" shape="square" :src="scope.row.icon || require('@/icons/img/logo.png')"
            fit="contain" />
        </template>
      </el-table-column>
      <el-table-column prop="username" label="账号" min-width="80" />
      <el-table-column prop="nickName" label="账号昵称" min-width="80" />
      <el-table-column prop="secretkey" label="google密钥" min-width="80" />
      <el-table-column prop="note" label="备注" min-width="80" />
      <el-table-column prop="goldCoin" label="单次充值限制金额" min-width="80" />
      <el-table-column prop="loginTimeString" label="最后登录" width="160" />
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <el-tag size="medium" :type="scope.row.status | statusFilter">{{
            scope.row.status == 1 ? "启用" : "禁用"
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="{ row }">
          <el-dropdown trigger="hover">
            <span class="el-dropdown-link">
              <span class="operation_btn" type="primary" size="mini"> 操作 </span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div @click="showUpdateDialogClick(row)">编辑</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="showDeleteDialogClick(row)">删除</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="showRoleDialogClick(row)">角色</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="showPermissionDialogClick(row)">权限</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page" :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 新建/编辑 账号 -->
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
          <!-- 更新时不显示 -->
          <span v-if="dialogStatus === 'create'">
            <el-form-item label="账号" prop="username"><el-input v-model="createModel.username" clearable
                placeholder="请输入账号" maxlength="20" show-word-limit /></el-form-item>
            <el-form-item label="验证码" prop="code"><el-input v-model="createModel.code" clearable placeholder="请输入验证码"
                minlength="4" maxlength="6" /></el-form-item>
          </span>
          <el-form-item label="密码" prop="password"><el-input v-model="createModel.password" placeholder="请输入密码"
              maxlength="20" show-password /></el-form-item>
          <el-form-item label="昵称"><el-input v-model="createModel.nickName" clearable placeholder="请输入账号昵称"
              maxlength="20" show-word-limit /></el-form-item>
          <el-form-item label="限制金额"><el-input v-model="createModel.goldCoin" clearable placeholder="请输入单次限定充值金额"
              maxlength="20" show-word-limit /></el-form-item>
          <el-form-item label="备注">
            <el-input v-model="createModel.note" type="textarea" placeholder="请输入备注" maxlength="100"
              :autosize="{ minRows: 2, maxRows: 4 }" show-word-limit />
          </el-form-item>
          <el-form-item label="头像">
            <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload"
              :http-request="uploadImgRequest">
              <img v-if="createModel.icon" :src="createModel.icon" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            <div class="uploadFileDesc" v-html="getImageLibary('avatar', true)" />
          </el-form-item>
          <span v-if="dialogStatus === 'update'">
            <el-form-item label="状态">
              <el-switch v-model="createModel.status" active-text="启用" :active-value="1" inactive-text="禁用"
                :inactive-value="0" />
            </el-form-item>
          </span>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogRoleVisible" :close-on-click-modal="false" :destroy-on-close="true">
      <div v-cloading="dialogRoleLoading" style="width: 100%; height: 100%">
        <el-checkbox v-for="role in roles" :key="role.id" v-model="role.value" :label="role.name"
          style="margin: 10px" />
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogRoleVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="updateAdminRolesClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 角色权限 -->
    <el-dialog
      title="角色权限"
      :visible.sync="dialogPermissionVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div
        v-cloading="dialogPermissionLoading"
      >
        <div class="search">
          <el-input v-model="filterText" size="medium" placeholder="输入关键字进行过滤" />
        </div>
        <el-tree ref="routesTree" node-key="id" show-checkbox default-expand-all :highlight-current="true"
          :filter-node-method="filterNode" :data="rolePermissionDatas" :props="defaultPermissionProps"
          :default-checked-keys="rolePermissionCheckedKeys" />
      </div>
      <div slot="footer">
        <el-button @click="dialogPermissionVisible = false">取消</el-button>
        <el-button type="primary" @click="modifyPermissionClick()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 添加用户限制金额 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogChangeVisible" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div v-cloading="dialogChangeLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="changeModel" :rules="rules" label-position="top" size="medium">
          <el-form-item label="用户名" prop="chinese"><el-input v-model="changeModel.username" clearable
              placeholder="请输入用户名" maxlength="200" /></el-form-item>
          <el-form-item label="金币" prop="chinese"><el-input v-model="changeModel.goldCoin" clearable
              placeholder="请输入限制金币数量" maxlength="200" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogChangeVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="
            handleChangeDataClick(changeModel.username, changeModel.goldCoin)
          ">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAdminList,
  registerAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminRole,
  updateAdminRole,
  getAdminPermission,
  updateAdminPermission,
  updateGoldCoin,
} from '@/api/ums/admin'
import { getRoleList } from '@/api/ums/role'
import { getPermissionList } from '@/api/ums/permission'
import {
  getImageLibary,
  nullS,
  formatUnixTime,
  listCompareBy,
  beforeUploadImage,
  uploadResourceFiles,
} from '@/utils/tools'

export default {
  name: 'SystemUserPage',
  filters: {
    statusFilter(status) {
      const map = { 0: 'info', 1: 'success' }
      return map[status]
    },
  },
  data() {
    return {
      list: [],
      listLoading: true,
      getImageLibary: getImageLibary,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        searchContent: null,
      },
      filterText: '',

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogChangeVisible: false,
      dialogChangeLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '新建用户',
        update: '编辑用户',
        change: '添加限制金额',
      },

      // 表单模型
      createModel: {
        id: 0,
        username: null,
        password: null,
        code: null,
        nickName: null,
        note: null,
        icon: null,
        status: 0,
        goldCoin: 0,
      },

      // 表单模型
      changeModel: {
        username: null,
        goldCoin: 0,
      },

      // 验证规则
      rules: {
        username: [
          { required: true, message: '请输入正确的账号', trigger: 'change' },
        ],
        password: [
          { required: true, message: '请输入正确的密码', trigger: 'change' },
          {
            min: 6,
            max: 20,
            message: '密码长度为6~20个字符',
            trigger: 'change',
          },
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          {
            min: 4,
            max: 6,
            message: '验证码长度为4~6个字符',
            trigger: 'change',
          },
        ],
      },

      // 分配角色
      dialogRoleVisible: false,
      dialogRoleLoading: false,
      currentAdminId: 0,
      roles: [],

      // 角色权限
      dialogPermissionVisible: false,
      dialogPermissionLoading: false,
      defaultPermissionProps: {
        children: 'children',
        label: 'label',
      },
      permissionRoleId: null,
      rolePermissionDatas: null,
      rolePermissionCheckedKeys: [],
    }
  },
  watch: {
    filterText(val) {
      this.$refs.routesTree.filter(val)
    },
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
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        username: null,
        password: null,
        code: null,
        nickName: null,
        note: null,
        icon: null,
        status: 0,
        goldCoin: 0,
      }
    },

    // 重新设置表单数据
    resetChangeModel() {
      this.changeModel = {
        username: null,
        goldCoin: 0,
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getAdminList(
        this.listQuery.page,
        this.listQuery.limit,
        nullS(this.listQuery.searchContent)
      )
        .then((res) => {
          this.list = res.data.list.map((item) => {
            this.$set(item, 'loginTimeString', formatUnixTime(item.loginTime))
            return item
          })
          this.listLoading = false
          this.listQuery.total = res.data.total
        })
        .catch((err) => {
          this.listLoading = false
          this.list = null
          this.listQuery.total = 0
          this.$message.error(err)
        })
    },

    // 显示创建账号弹出窗
    showCreateDialogClick() {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示编辑账号弹出窗
    showUpdateDialogClick(row) {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'update'
      this.createModel = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 显示编辑用户单次充值限制金额弹出窗
    showChangeDialogClick() {
      this.resetChangeModel()
      this.dialogChangeVisible = true
      this.dialogStatus = 'change'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 删除账号
    showDeleteDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }

      this.$confirm('是否删除该账号？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteAdmin(row.id)
            .then((res) => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除账号成功',
                type: 'success',
                duration: 1500,
              })
              setTimeout(() => {
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

    // 创建账号
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogCreateLoading = true
          registerAdmin({
            nickName: nullS(formDic.nickName),
            username: nullS(formDic.username),
            password: nullS(formDic.password),
            code: nullS(formDic.code),
            icon: nullS(formDic.icon),
            note: nullS(formDic.note),
            goldCoin: formDic.goldCoin || 0,
          })
            .then((res) => {
              this.dialogCreateLoading = false
              this.dialogCreateVisible = false
              this.$notify({
                title: '提示',
                message: '创建账号成功',
                type: 'success',
                duration: 1500,
              })
              this.fetchData()
            })
            .catch((err) => {
              this.dialogCreateLoading = false
              this.$message.error(err)
            })
        }
      })
    },

    // 更编辑账号
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogCreateLoading = true
          updateAdmin({
            id: formDic.id || 0,
            nickName: nullS(formDic.nickName),
            icon: nullS(formDic.icon),
            note: nullS(formDic.note),
            password: nullS(formDic.password),
            status: formDic.status || 0,
            goldCoin: formDic.goldCoin || 0,
          })
            .then((res) => {
              this.dialogCreateLoading = false
              this.dialogCreateVisible = false
              this.$notify({
                title: '提示',
                message: '更新账号信息成功',
                type: 'success',
                duration: 1500,
              })
              this.fetchData()
            })
            .catch((err) => {
              this.dialogCreateLoading = false
              this.$message.error(err)
            })
        }
      })
    },

    // 获取用户的角色
    showRoleDialogClick(row) {
      this.roles = []
      this.currentAdminId = row.id
      this.dialogRoleVisible = true
      this.dialogRoleLoading = true
      // 请求服务器
      getRoleList()
        .then((res) => {
          this.roles = (res.data || []).map((item) => {
            return {
              name: nullS(item.name),
              id: item.id || 0,
              value: false,
            }
          })
          return getAdminRole(row.id)
        })
        .then((res) => {
          const listIds = (res.data || []).map((item) => item.id || 0)
          this.roles = this.roles.map((item) => {
            if (listIds.indexOf(item.id) != -1) {
              item.value = true
            }
            return item
          })
          this.dialogRoleLoading = false
        })
        .catch((err) => {
          this.dialogRoleLoading = false
          this.$message.error(err)
        })
    },

    // 更新用户角色
    updateAdminRolesClick() {
      if (this.currentAdminId == null || this.currentAdminId <= 0) {
        return
      }
      this.dialogRoleLoading = true
      const roles = this.roles.filter((item) => item.value == true)
      const roleIds = roles.map((item) => item.id || 0)
      // 请求服务器
      updateAdminRole(this.currentAdminId, roleIds)
        .then((res) => {
          this.dialogRoleLoading = false
          this.dialogRoleVisible = false
          this.$notify({
            title: '提示',
            message: '更新用户角色成功',
            type: 'success',
            duration: 1500,
          })
        })
        .catch((err) => {
          this.dialogRoleLoading = false
          this.$message.error(err)
        })
    },

    // 显示权限弹窗
    showPermissionDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      this.filterText = ''

      this.rolePermissionDatas = null
      this.permissionRoleId = null
      this.rolePermissionCheckedKeys = []
      this.dialogPermissionVisible = true
      this.dialogPermissionLoading = true
      this.permissionRoleId = row.id

      var defaultRoutes = []
      getPermissionList()
        .then((res) => {
          var routes = res.data || []
          defaultRoutes = routes

          // 获取所有根节点
          var rootRoutes = []
          for (const item of routes) {
            if (parseInt(`${item.pid}`) <= 0) {
              // 添加到根节点
              rootRoutes.push({
                id: parseInt(`${item.id}`),
                pid: parseInt(`${item.pid}`),
                sort: parseInt(`${item.sort}`),
                label: `${item.name}`,
                children: [],
              })
            }
          }

          // 子节点加入根节点
          for (const item of routes) {
            if (parseInt(`${item.pid}`) > 0) {
              for (var rt of rootRoutes) {
                // 如果根节点id = 当前子节点的根节点id
                if (rt.id == parseInt(`${item.pid}`)) {
                  // 将当前子节点添加到根节点上
                  rt.children.push({
                    id: parseInt(`${item.id}`),
                    pid: parseInt(`${item.pid}`),
                    sort: parseInt(`${item.sort}`),
                    label: `${item.name}`,
                  })
                  break
                }
              }
            }
          }

          // 排序
          for (var rt of rootRoutes) {
            // child 排序
            if (rt.children && rt.children.length > 0) {
              rt.children = rt.children.sort(listCompareBy('sort'))
            }
          }
          // 外层根节点排序
          this.rolePermissionDatas = rootRoutes.sort(listCompareBy('sort'))

          // 获取用户所有权限
          return getAdminPermission(row.id)
        })
        .then((res) => {
          const defaultKeys = defaultRoutes.map((item) => item.id)
          this.rolePermissionCheckedKeys = []
          for (const item of res.data || []) {
            if (
              item != null &&
              item.pid != null &&
              item.pid > 0 &&
              defaultKeys.indexOf(item.id) != -1
            ) {
              // 包含该元素
              this.rolePermissionCheckedKeys.push(item.id)
            }
          }
          this.dialogPermissionLoading = false
        })
        .catch((err) => {
          this.rolePermissionDatas = null
          this.rolePermissionCheckedKeys = []
          this.dialogPermissionLoading = false
          this.$message.error(err)
        })
    },

    // 修改用户权限
    modifyPermissionClick() {
      this.dialogPermissionLoading = true
      var childNodes = this.$refs.routesTree.getCheckedNodes(false, false)
      // 目录
      var mls = []
      for (const node of childNodes) {
        if (mls.indexOf(node.pid) == -1) {
          // 没有目录
          for (const item of this.rolePermissionDatas || []) {
            if (item.id == node.pid) {
              mls.push(node.pid)
              break
            }
          }
        }
      }
      // 菜单
      var cds = childNodes.map((item) => item.id)
      // 权限
      const permissionIds = mls.concat(cds)
      // 请求服务器修改
      updateAdminPermission(this.permissionRoleId, permissionIds)
        .then((res) => {
          this.dialogPermissionLoading = false
          this.dialogPermissionVisible = false
          this.$notify({
            title: '提示',
            message: '修改用户权限成功',
            type: 'success',
            duration: 1500,
          })
        })
        .catch((err) => {
          this.dialogPermissionLoading = false
          this.$message.error(err)
        })
    },

    // 编辑用户单次充值限制金额
    handleChangeDataClick(username, goldCoin) {
      const params = {
        username: username,
        goldCoin: goldCoin,
      }
      // 请求服务器
      this.dialogChangeVisible = true
      if (this.dialogStatus === 'change') {
        updateGoldCoin(params)
          .then((res) => {
            this.dialogChangeLoading = false
            this.dialogChangeVisible = false
            this.$notify({
              title: '提示',
              message: '修改用户单次充值限制金额成功',
              type: 'success',
              duration: 1500,
            })
            this.fetchData()
          })
          .catch((err) => {
            this.dialogChangeLoading = false
            this.$message.error(err)
          })
      }
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

    // 过滤
    handleSearchFilter() {
      this.listQuery.page = 1
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

    uploadImgRequest(option) {
      console.log('-----------自定义上传方法------------')
      this.$store
        .dispatch('oss/getOSSInfos')
        .then((res) => {
          return uploadResourceFiles({
            ossParams: res,
            fileName: option.file.name,
            file: option.file,
            dir: 'avatar',
          })
        })
        .then((url) => {
          this.createModel.icon = url
          this.dialogCreateLoading = false
        })
        .catch((err) => {
          console.error('oss失败' + JSON.stringify(err))
          this.dialogCreateLoading = false
          this.$message.error('上传失败，请重试')
        })
    },
  },
}
</script>

<style scoped>
.input-with-select {
  background-color: #fff;
  width: 240px;
  margin-right: 10px;

  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
.search {
  padding: 0 10px;
  position: sticky;
  top: -10px;
  z-index: 9;
}
.span_primary {
  margin-right: 10px;
  color: #fc708b;
  cursor: pointer;
}
</style>
