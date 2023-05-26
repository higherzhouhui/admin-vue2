<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showAddRootDialogClick()">添加目录</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-refresh" @click="reset">
          刷新
        </el-button>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="listData" row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" size="mini"
      :header-cell-style="{background:'green',color:'#fff'}">
      <el-table-column type="index" width="60" label="序号" />
      <el-table-column prop="sort" label="排序" width="80" align="left" />
      <el-table-column prop="pid" label="菜单ID" width="80" />
      <el-table-column label="链接" min-width="80">
        <template slot-scope="{ row }">
          <span>{{ row.pid == 0 ? `/${row.uri}` : `${row.uri}` }}</span>
        </template>
      </el-table-column>
      <el-table-column label="页面Key" min-width="200">
        <template slot-scope="{ row }">
          <span>{{ row.pid == 0 ? '' : `${row.pageKey}` }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="redirect" label="重定向" min-width="80" />
      <el-table-column label="组件路径" min-width="80">
        <template slot-scope="{ row }">
          <span>{{ row.pid == 0 ? '@/layout' : `@/views/${row.uri}` }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="菜单名称" min-width="80" />
      <el-table-column label="图标" width="60">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="展示" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.hidden == 0 ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="缓存" width="60">
        <template slot-scope="scope">
          <span>{{ scope.row.noCache == null ? '' : scope.row.noCache == 0 ? '是' : '否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="80">
        <template slot-scope="scope">
          <el-tag size="medium" :type="scope.row.type | typeFilter">{{ scope.row.typeString }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-tag size="medium"
            :type="scope.row.status | statusFilter">{{ scope.row.status == 1 ? '启用 ' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="{ row }">
          <span v-if="row.pid == 0 || row.pid == null" class="operation_btn" plain type="primary" size="mini"
            icon="el-icon-plus" @click="showAddSubDialogClick(row)">+菜单</span>
          <span class="operation_btn" plain type="primary" size="mini" icon="el-icon-edit"
            @click="showEditDialogClick(row)">编辑</span>
          <span class="operation_btn" plain type="danger" size="mini" @click="deleteBtnClick(row)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑 目录/菜单 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div v-cloading="dialogLoading">
        <el-form ref="dataForm" :model="tempDatas" :rules="rules" label-width="80px" label-position="top" size="medium">
          <el-form-item label="排序" prop="sort"><el-input v-model.number="tempDatas.sort" clearable placeholder="请输入排序号" maxlength="5" /></el-form-item>
          <el-form-item label="链接" prop="uri"><el-input v-model="tempDatas.uri" clearable placeholder="请输入资源路径" maxlength="100" /></el-form-item>
          <span v-if="dialogStatus != 'createRoot' && dialogStatus != 'updateRoot'">
            <el-form-item label="页面Key"><el-input v-model="tempDatas.pageKey" clearable placeholder="请输入路由代码"
                maxlength="200" /></el-form-item>
            <el-form-item label="权限值"><el-input v-model="tempDatas.value" clearable placeholder="请输入权限值"
                maxlength="50" /></el-form-item>
          </span>
          <span v-if="dialogStatus == 'createRoot' || dialogStatus == 'updateRoot'">
            <el-form-item label="重定向"><el-input v-model="tempDatas.redirect" clearable placeholder="请输入重定向地址"
                maxlength="100" /></el-form-item>
          </span>
          <el-form-item label="名称"><el-input v-model="tempDatas.name" clearable placeholder="请输入名称"
              maxlength="30" /></el-form-item>
          <el-form-item label="图标"><el-input v-model="tempDatas.icon" clearable placeholder="请输入图标名"
              maxlength="30" /></el-form-item>
          <div class="iconWrapper">
            <span v-for="(item, index) in icons" :key="index" class="iconStyle" @click="chooseIcon(item)">
              <svg-icon :icon-class="item" />
              <span>{{ item }}</span>
            </span>
          </div>
          <span v-if="dialogStatus != 'createRoot' && dialogStatus != 'createSub'">
            <el-form-item label="权限">
              <el-select v-model="tempDatas.type" placeholder="请选择权限">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </span>
          <el-form-item label="是否展示"><el-switch v-model="tempDatas.hidden" active-text="是" :active-value="0"
              inactive-text="否" :inactive-value="1" /></el-form-item>
          <el-form-item v-if="dialogStatus != 'createRoot' && dialogStatus != 'updateRoot'" label="是否缓存">
            <el-switch v-model="tempDatas.noCache" active-text="是" :active-value="0" inactive-text="否"
              :inactive-value="1" />
          </el-form-item>
          <el-form-item label="启用状态">
            <el-switch v-model="tempDatas.status" active-text="启用" :active-value="1" inactive-text="禁用"
              :inactive-value="0" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogFormVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="affirmBtnClick()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  createPermission,
  updatePermission,
  deletePermission,
} from '@/api/ums/permission'
import { emptyS, nullS, listCompareBy } from '@/utils/tools'

export default {
  name: 'SystemPermissionPage',
  filters: {
    statusFilter(status) {
      const map = { 0: 'info', 1: 'success' }
      return map[status]
    },
    typeFilter(status) {
      const map = { 0: '', 1: 'success', 2: 'warning' }
      return map[status]
    },
  },
  data() {
    return {
      listData: [],
      listLoading: true,

      // 弹窗数值
      dialogLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      dialogTitleMap: {
        createRoot: '添加目录',
        updateRoot: '修改目录',
        createSub: '添加菜单',
        updateSub: '修改菜单',
      },

      tempDatas: {
        id: 0,
        pid: 0,
        sort: 0,
        pageKey: null,
        uri: null,
        name: null,
        icon: null,
        redirect: null,
        value: null,
        hidden: 0,
        noCache: 0,
        status: 1,
        type: 0,
      },
      typeOptions: [
        { label: '目录', value: 0 },
        { label: '菜单', value: 1 },
      ],

      // 验证规则
      rules: {
        sort: [
          { required: true, message: '请输入排序号' },
          { type: 'number', message: '请输入正确的排序号' },
        ],
        uri: [
          { required: true, message: '请填写资源路径', trigger: 'change' },
          { min: 1, max: 100, message: '长度在1~100个字符', trigger: 'change' },
        ],
      },
      icons: [
        'baobiao',
        'caiwu',
        'daili',
        'huodong',
        'quanxian',
        'shouye',
        'tuiguang',
        'yonghu',
        'youxi',
        'yunying',
        'zhibo',
        'caipiao',
        'mbaobiao',
        'advert',
        'anchor',
        'announcement',
        'chart',
        'clipboard',
        'code',
        'component',
        'config',
        'dashboard',
        'documentation',
        'drag',
        'edit',
        'education',
        'email',
        'example',
        'excel',
        'finance',
        'form',
        'guide',
        'homepage',
        'icon',
        'international',
        'link',
        'list',
        'lock',
        'mainpage',
        'message',
        'money',
        'nested',
        'order',
        'people',
        'peoples',
        'permission',
        'play',
        'product',
        'promotion',
        'sandglass',
        'shopping',
        'size',
        'skill',
        'system',
        'table',
        'theme',
        'tree',
        'tree-table',
        'user',
      ],
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    reset() {
      this.listQuery = {
        page: 1,
        limit: 0,
      }
      this.fetchData()
    },
    // 重新设置表单数据
    resetTempDatas() {
      this.tempDatas = {
        id: 0,
        pid: 0,
        sort: 0,
        pageKey: null,
        uri: null,
        name: null,
        icon: null,
        redirect: null,
        value: null,
        hidden: 0,
        noCache: 0,
        status: 1,
        type: 0,
      }
    },

    // 获取列表
    fetchData() {
      this.listLoading = true
      getPermissionList()
        .then((res) => {
          const routes = res.data || []
          // 根节点的链表
          var rootRoutes = []
          for (const route of routes) {
            if (route.pid <= 0) {
              var typeString = ''
              if (route.type == 0) {
                typeString = '目录'
              } else if (route.type == 1) {
                typeString = '菜单'
              } else if (route.type == 2) {
                typeString = '按钮'
              }
              // 加入链表
              rootRoutes.push({
                id: route.id || 0,
                pid: 0,
                sort: route.sort || 0,
                pageKey: null,
                uri: nullS(`${route.uri}`),
                name: nullS(`${route.name}`),
                icon: nullS(`${route.icon}`),
                redirect: nullS(`${route.redirect}`),
                value: nullS(`${route.value}`),
                hidden: route.hidden,
                noCache: null,
                status: route.status,
                type: route.type,
                typeString: typeString,
                children: [],
              })
            }
          }

          // 处理子节点
          for (const route of routes) {
            if (route.pid > 0) {
              // 在根节点链表中查询是否存在对应的根节点
              for (var rt of rootRoutes) {
                if (rt.id == route.pid) {
                  var typeString = ''
                  if (route.type == 0) {
                    typeString = '目录'
                  } else if (route.type == 1) {
                    typeString = '菜单'
                  } else if (route.type == 2) {
                    typeString = '按钮'
                  }
                  rt.children.push({
                    id: route.id || 0,
                    pid: route.pid || 0,
                    sort: route.sort || 0,
                    pageKey: nullS(`${route.pageKey}`),
                    uri: nullS(`${route.uri}`),
                    name: nullS(`${route.name}`),
                    icon: nullS(`${route.icon}`),
                    redirect: null,
                    value: nullS(`${route.value}`),
                    hidden: route.hidden,
                    noCache: route.noCache,
                    status: route.status,
                    type: route.type,
                    typeString: typeString,
                  })
                  break
                }
              }
            }
          }

          // 对子目录排序
          for (var rt of rootRoutes) {
            // child 排序
            if (rt.children && rt.children.length > 0) {
              rt.children = rt.children.sort(listCompareBy('sort'))
            }
          }
          // 对根目录排序
          this.listData = rootRoutes.sort(listCompareBy('sort'))
          this.listLoading = false
        })
        .catch((err) => {
          this.listData = null
          this.listLoading = false
          this.$message.error(err)
        })
    },

    // 显示添加目录
    showAddRootDialogClick() {
      this.resetTempDatas()
      this.tempDatas.type = 0
      this.dialogFormVisible = true
      this.dialogStatus = 'createRoot'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示添加菜单
    showAddSubDialogClick(row) {
      this.resetTempDatas()
      this.tempDatas.type = 1
      this.tempDatas.pid = row.id // 把ID给到PID
      this.dialogFormVisible = true
      this.dialogStatus = 'createSub'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 显示编辑目录/菜单
    showEditDialogClick(row) {
      this.resetTempDatas()
      const formDatas = Object.assign({}, row)
      this.dialogStatus = formDatas.pid > 0 ? 'updateSub' : 'updateRoot'
      this.tempDatas = formDatas
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    chooseIcon(icon) {
      this.tempDatas.icon = icon
    },
    // 确认按钮
    affirmBtnClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogLoading = true
          // 组建数据
          const fromDic = Object.assign({}, this.tempDatas)
          const id = fromDic.id || 0
          var pid = fromDic.pid || 0
          var notifyMsg = ''
          if (this.dialogStatus === 'createRoot') {
            notifyMsg = '创建目录成功'
          } else if (this.dialogStatus === 'createSub') {
            notifyMsg = '创建菜单成功'
          } else if (this.dialogStatus === 'updateRoot') {
            notifyMsg = '修改目录成功'
          } else if (this.dialogStatus === 'updateSub') {
            notifyMsg = '修改菜单成功'
          }
          const params = {
            id: id,
            pid: pid,
            sort: fromDic.sort,
            uri: emptyS(fromDic.uri) ? null : nullS(fromDic.uri),
            redirect: emptyS(fromDic.redirect) ? null : nullS(fromDic.redirect),
            pageKey: emptyS(fromDic.pageKey) ? null : nullS(fromDic.pageKey),
            name: emptyS(fromDic.name) ? null : nullS(fromDic.name),
            icon: emptyS(fromDic.icon) ? null : nullS(fromDic.icon),
            value: emptyS(fromDic.value) ? null : nullS(fromDic.value),
            type: fromDic.type,
            hidden: fromDic.hidden,
            noCache: fromDic.noCache,
            status: fromDic.status,
          }

          if (
            this.dialogStatus === 'createRoot' ||
            this.dialogStatus === 'createSub'
          ) {
            createPermission(params)
              .then((res) => {
                this.dialogLoading = false
                this.dialogFormVisible = false
                this.$notify({
                  title: '提示',
                  message: notifyMsg,
                  type: 'success',
                  duration: 1500,
                })
                setTimeout(() => {
                  this.fetchData()
                }, 200)
              })
              .catch((err) => {
                this.dialogLoading = false
                this.$message.error(err)
              })
          } else if (
            this.dialogStatus === 'updateRoot' ||
            this.dialogStatus === 'updateSub'
          ) {
            updatePermission(params)
              .then((res) => {
                this.dialogLoading = false
                this.dialogFormVisible = false
                this.$notify({
                  title: '提示',
                  message: notifyMsg,
                  type: 'success',
                  duration: 1500,
                })
                setTimeout(() => {
                  this.fetchData()
                }, 200)
              })
              .catch((err) => {
                this.dialogLoading = false
                this.$message.error(err)
              })
          }
        }
      })
    },

    // 删除按钮
    deleteBtnClick(row) {
      if (row.id == null || row.id < 1) {
        this.$message.error('参数错误')
        return
      }
      var message = ''
      if (row.pid != null && row.pid > 0) {
        message = '是否删除该菜单？'
      } else {
        message = '是否删除该目录？该操作会删除该目录下所有的菜单，请谨慎操作！'
      }

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.dialogLoading = true
          deletePermission([row.id])
            .then((res) => {
              this.dialogLoading = false
              this.dialogFormVisible = false
              this.$notify({
                title: '提示',
                message: '删除成功',
                type: 'success',
                duration: 1500,
              })
              setTimeout(() => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.dialogLoading = false
              this.$message.error(err)
            })
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.iconWrapper {
  margin: 10px 0;
}
.iconStyle {
  margin: 0 8px 6px 0;
  svg {
    font-size: 16px;
  }
  text-align: center;
  cursor: pointer;
  display: inline-block;
}
.span_primary {
  margin-right: 10px;
  color: #fc708b;
  cursor: pointer;
}
</style>
