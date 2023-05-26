<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreatDialogClick()">添加角色</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-refresh" @click="fetchData()">刷新</el-button>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" width="80" label="序号" />
      <el-table-column prop="name" label="名称" min-width="80" />
      <el-table-column prop="description" label="描述" min-width="80" />
      <el-table-column prop="createTimeString" label="创建时间" width="160" />
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <el-tag size="medium" :type="scope.row.status | statusFilter">{{ scope.row.status == 1 ? '启用' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" plain type="primary" size="mini" @click="showEditDialogClick(row)">编辑</span>
          <span class="operation_btn" plain type="danger" size="mini" @click="showDeleteDialogClick(row)">删除</span>
          <span class="operation_btn" plain type="warning" size="mini" @click="showPermissionDialogClick(row)">权限</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :destroy-on-close="true">
      <div v-cloading="dialogLoading" style="width: 100%;height: 100%;">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top" size="medium">
          <el-form-item label="名称" prop="name"><el-input v-model="temp.name" placeholder="请输入规格名" maxlength="30" /></el-form-item>
          <el-form-item label="描述">
            <el-input v-model="temp.description" type="textarea" placeholder="请输入描述" maxlength="50" :autosize="{ minRows: 2, maxRows: 4 }" show-word-limit />
          </el-form-item>
          <el-form-item label="状态"><el-switch v-model="temp.status" active-text="启用" :active-value="1" inactive-text="禁用" :inactive-value="0" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogFormVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleRoleDatasClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 权限 -->
    <el-dialog title="角色权限" :visible.sync="dialogPermissionVisible" :close-on-click-modal="false" :destroy-on-close="true">
      <div v-cloading="dialogPermissionLoading">
        <div class="search">
          <el-input
            v-model="filterText"
            size="medium"
            placeholder="输入关键字进行过滤"
          />
        </div><el-tree
          ref="routesTree"
          node-key="id"
          show-checkbox
          default-expand-all
          :highlight-current="true"
          :props="defaultPermissionProps"
          :filter-node-method="filterNode"
          :data="rolePermissionDatas"
          :default-checked-keys="rolePermissionCheckedKeys"
        />
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogPermissionVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="modifyRolePermissionClick()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, createRole, updateRole, deleteRole, getRolePermission, updateRolePermission } from '@/api/ums/role'
import { getPermissionList } from '@/api/ums/permission'
import { emptyS, nullS, formatUnixTime, listCompareBy } from '@/utils/tools'

export default {
  name: 'SystemRolePage',
  filters: {
    statusFilter(status) {
      const map = { 0: 'danger', 1: 'success' }
      return map[status]
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
      filterText: '',
      // 弹窗数值
      dialogFormVisible: false,
      dialogLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '添加角色',
        update: '编辑角色'
      },

      // 表单数据
      temp: {
        id: null,
        name: null,
        description: null,
        status: 0
      },

      // 验证规则
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'change' }, { min: 1, max: 30, message: '长度在1~30个字符', trigger: 'change' }]
      },

      // 角色权限弹窗
      dialogPermissionVisible: false,
      dialogPermissionLoading: false,
      defaultPermissionProps: {
        children: 'children',
        label: 'label'
      },
      permissionRoleId: null,
      rolePermissionDatas: null,
      rolePermissionCheckedKeys: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.routesTree.filter(val)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 重新设置表单数据
    resetTempModel() {
      this.temp = {
        id: null,
        name: null,
        description: null,
        status: 0
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getRoleList()
        .then(res => {
          this.list = res.data.map(item => {
            this.$set(item, 'createTimeString', formatUnixTime(item.createTime))
            return item
          })
          this.listLoading = false
        })
        .catch(err => {
          this.list = null
          this.listLoading = false
          this.$message.error(err)
        })
    },

    // 显示添加角色弹窗
    showCreatDialogClick() {
      this.resetTempModel()
      this.dialogLoading = false
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示编辑角色弹窗
    showEditDialogClick(row) {
      this.resetTempModel()
      this.dialogLoading = false
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      const formRow = Object.assign({}, row)
      this.temp = {
        id: formRow.id || 0,
        name: nullS(formRow.name),
        description: nullS(formRow.description),
        status: formRow.status || 0
      }
    },

    // 显示删除角色弹窗
    showDeleteDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }

      this.$confirm('是否删除该角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          deleteRole([row.id])
            .then(res => {
              this.listLoading = false
              this.$notify({
                title: '提示',
                message: '删除角色成功',
                type: 'success',
                duration: 1500
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
        .catch(() => {})
    },

    // 显示修改权限弹窗
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
        .then(res => {
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
                children: []
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
                    label: `${item.name}`
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

          // 请求网络获取当前id的权限表
          return getRolePermission(row.id)
        })
        .then(res => {
          const defaultKeys = defaultRoutes.map(item => item.id)
          this.rolePermissionCheckedKeys = []
          for (const item of res.data || []) {
            if (item != null && item.pid != null && item.pid > 0 && defaultKeys.indexOf(item.id) != -1) {
              // 包含该元素
              this.rolePermissionCheckedKeys.push(item.id)
            }
          }
          this.dialogPermissionLoading = false
        })
        .catch(err => {
          this.rolePermissionDatas = null
          this.rolePermissionCheckedKeys = []
          this.dialogPermissionLoading = false
          this.$message.error(err)
        })
    },

    // 创建/修改 角色
    handleRoleDatasClick() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const formDic = Object.assign({}, this.temp)
          const params = {
            name: nullS(formDic.name),
            description: nullS(formDic.description),
            status: formDic.status || 0
          }
          // 请求服务器
          this.dialogLoading = true
          if (this.dialogStatus === 'create') {
            createRole(params)
              .then(res => {
                this.dialogLoading = false
                this.dialogFormVisible = false
                this.$notify({
                  title: '提示',
                  message: '创建角色成功',
                  type: 'success',
                  duration: 1500
                })
                setTimeout(_ => {
                  this.fetchData()
                }, 200)
              })
              .catch(err => {
                this.dialogLoading = false
                this.$message.error(err)
              })
          } else {
            params['id'] = ormDic.id || 0
            updateRole(params)
              .then(res => {
                this.dialogLoading = false
                this.dialogFormVisible = false
                this.$notify({
                  title: '提示',
                  message: '修改角色成功',
                  type: 'success',
                  duration: 1500
                })
                setTimeout(_ => {
                  this.fetchData()
                }, 200)
              })
              .catch(err => {
                this.dialogLoading = false
                this.$message.error(err)
              })
          }
        }
      })
    },

    // 修改角色权限
    modifyRolePermissionClick() {
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
      var cds = childNodes.map(item => item.id)
      // 权限
      const permissionIds = mls.concat(cds)
      // 请求服务器修改
      updateRolePermission(this.permissionRoleId, permissionIds)
        .then(res => {
          this.dialogPermissionLoading = false
          this.dialogPermissionVisible = false
          this.$notify({
            title: '提示',
            message: '修改该角色权限成功',
            type: 'success',
            duration: 1500
          })
        })
        .catch(err => {
          this.dialogPermissionLoading = false
          this.$message.error(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  padding: 0 10px;
  position: sticky;
  top: -10px;
  z-index: 9;
}
.span_primary {
  margin-right: 10px;
  color: #FC708B;
  cursor: pointer;
}
</style>
