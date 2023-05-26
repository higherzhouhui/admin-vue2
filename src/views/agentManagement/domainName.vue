<template>
  <div class="app-container">
    <el-button size="small" type="primary" icon="el-icon-plus" style="margin-bottom: 20px;"
      @click="showCreateDialogClick()">新增</el-button>
    <el-table v-cloading="listLoading" :data="list" size="mini" :cell-style="cellStyle" fit highlight-current-row>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="groupName" label="分组名称" min-width="80" />

      <!-- <el-table-column prop="outerNo" label="第三方订单号" min-width="80"  ></el-table-column> -->
      <el-table-column prop="defaultDoMainName" label="通用推广域名(默认)" min-width="120" />
      <el-table-column prop="subName" label="网关IP/CNAME域名(默认)" min-width="140" />
      <el-table-column label="状态" width="80">
        <template slot-scope="{ row }">
          <el-tag size="medium"
            :type="row.groupStatus === 1 ? 'success' : 'danger'">{{ row.groupStatus === 1 ? "正常" : "禁用" }}</el-tag>
          <!-- <div>{{ row.groupStatus === 1 ? "正常" : "禁用" }}</div> -->
        </template>
      </el-table-column>
      <el-table-column label="所有域名" min-width="120">
        <template slot-scope="{ row }">
          <div v-for="(item, index) in (row.otherDoMain || '').split('|')" :key="index">{{ item }}</div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="{ row }">
          <span class="operation_btn" type="primary" plain size="mini" @click="showUpdateDialogClick(row)">编辑</span>
          <span v-if="row.groupStatus === 1" class="operation_btn" type="danger" plain size="mini"
            @click="showDeleteDialogClick(row, 0)">禁用</span>
          <span v-if="row.groupStatus === 0" class="operation_btn" type="success" plain size="mini"
            @click="showDeleteDialogClick(row, 1)">启用</span>
          <span class="operation_btn" type="success" plain size="mini" @click="
              extension = true;
              resetExtensionData();
              platformDomainLists(row);
            ">分组域名配置</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <!-- 新建编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
          <el-form-item prop="groupName" label="分组名称"><el-input v-model="createModel.groupName" clearable
              placeholder="请输入分组名称" maxlength="20" /></el-form-item>
          <el-form-item prop="groupStatus" label="是否启用">
            <el-radio-group v-model="createModel.groupStatus">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="(dialogCreateVisible = false), (dialogCreateLoading = false)">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 分组域名配置 弹窗 -->
    <el-dialog title="推广域名配置" :visible.sync="extension" :close-on-click-modal="false" :destroy-on-close="true" top="5vh"
      width="500px">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm2" :model="extensionData" :rules="rules2" label-position="top" label-width="150px"
          size="medium">
          <el-form-item prop="groupName" label="分组名称"><el-input v-model="extensionData.groupName"
              disabled /></el-form-item>
          <el-form-item prop="newDefaultDoMainId" label="通用推广域名">
            <el-select v-model="extensionData.newDefaultDoMainId" clearable placeholder="请选择通用推广域名" style="width: 100%">
              <el-option v-for="item in currency" :key="item.domainId" :label="item.domainName"
                :value="item.domainId" />
            </el-select>
          </el-form-item>
          <el-form-item prop="newCnameId" label="网关IP/cname域名">
            <el-select v-model="extensionData.newCnameId" clearable placeholder="请选择网关IP/cname域名" style="width: 100%">
              <el-option v-for="item in gateway" :key="item.domainId" :label="item.domainName" :value="item.domainId" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="(extension = false), (dialogCreateLoading = false)">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick2()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  groupList,
  update,
  platformDomainList,
  subGroupConfig,
} from '@/api/agentManagement/domainName'
// import { getInfo } from '@/api/ums/admin'
import UserDrawer from '@/components/UserDrawer'

export default {
  name: 'AgentManagementDomainName',
  filters: {
    statusFilter(status) {
      const map = { 0: 'info', 1: 'success', 2: 'danger' }
      return map[status]
    },
    wayFilter(status) {
      const map = { 1: 'success', 2: '' }
      return map[status]
    },
  },
  components: {
    UserDrawer,
  },
  data() {
    return {
      list: [],
      todayList: null,
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
      },
      // 状态选择
      statusOptions: [
        { label: '未支付', value: 0 },
        { label: '已支付', value: 1 },
      ],
      // 验证表单
      rules: {
        groupName: [
          { required: true, message: '请输入分组名称', trigger: 'change' },
        ],
        groupStatus: [
          { required: true, message: '请选择是否启用', trigger: 'change' },
        ],
      },
      rules2: {
        newDefaultDoMainId: [
          { required: true, message: '请选择通用推广域名', trigger: 'change' },
        ],
        newCnameId: [
          {
            required: true,
            message: '请选择网关IP/cname域名',
            trigger: 'change',
          },
        ],
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      // 表单模型
      createModel: {
        id: null,
        name: null,
        demo: null,
      },

      resetCreateModel() {
        this.createModel = {
          id: null,
          name: null,
          demo: null,
        }
      },

      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogChangeVisible: false,
      dialogChangeLoading: false,

      dialogStatus: '',
      dialogTitleMap: {
        update: '编辑域名分组',
        create: '新增域名分组',
      },

      // 推广域名
      extension: false,
      extensionData: {},
      resetExtensionData() {
        this.extensionData = {}
      },
      currency: [],
      gateway: [],
      datas: {},
      operator: this.$store.state.user.name,
    }
  },
  created() {
    this.fetchData()
    // getInfo().then((item) => {
    //   if (item.code === 200) {
    //     this.operator = item.data.name
    //   }
    // })
  },
  methods: {
    cellStyle(row, column, rowIndex, columnIndex) {
      // 根据报警级别显示颜色
      // console.log(row);
      // console.log(row.column);
      if (row.column.label === '商户名称') {
        return 'color:#42b983'
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.todayListLoading = true
      // this.listQuery.limit, this.listQuery.page, this.listQuery
      groupList(this.listQuery)
        .then((res) => {
          this.listLoading = false
          this.todayListLoading = false
          this.list = res.rows
          this.listQuery.total = res.total
        })

        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },

    // 推广域名
    platformDomainLists(row) {
      this.datas = row
      this.extensionData = {
        groupName: row.groupName,
        newDefaultDoMainId: row.defaultDoMainId ? row.defaultDoMainId * 1 : '',
        newCnameId: row.subId ? row.subId * 1 : '',
      }
      platformDomainList({}).then((item) => {
        console.log(item)
        let demo1 = []
        let demo2 = []
        if (item.code === 200) {
          item.rows.forEach((value, index) => {
            if (value.domainType == 1) {
              demo1 = [...demo1, value]
            }
            if (value.domainType == 2) {
              demo2 = [...demo2, value]
            }
          })
        }
        console.log(demo1, demo2)
        // 3是禁用，过滤掉
        this.currency = demo1.filter((item) => {
          return item.domainStatus !== 3
        })
        this.gateway = demo2
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
    // 显示封禁弹窗
    showDeleteDialogClick(row, indexData) {
      if (row.groupId == null || row.groupId < 0) {
        this.$message.error('参数错误')
        return
      }
      if (indexData === 0) {
        this.$confirm('是否禁用该分组？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showClose: false,
        })
          .then(() => {
            update({
              operator: this.operator,
              groupId: row.groupId,
              groupStatus: 0,
            }).then((item) => {
              if (item.code === 200) {
                this.$message({
                  type: 'success',
                  message: '禁用成功',
                })
                this.fetchData()
              }
            })
          })
          .catch(() => {})
      } else {
        update({
          operator: this.operator,
          groupId: row.groupId,
          groupStatus: 1,
        }).then((item) => {
          if (item.code === 200) {
            this.$message({
              type: 'success',
              message: '启用成功',
            })
            this.fetchData()
          }
        })
      }
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogCreateLoading = true
          const params = {
            groupName: formDic.groupName,
            groupStatus: formDic.groupStatus,
            operator: this.operator,
          }
          const params2 = {
            groupId: formDic.groupId,
            groupName: formDic.groupName,
            groupStatus: formDic.groupStatus,
            operator: this.operator,
          }
          if (this.dialogStatus === 'create') {
            update(params)
              .then((item) => {
                this.dialogCreateLoading = false
                if (item.code === 200) {
                  this.$message({
                    type: 'success',
                    message: '新增成功',
                  })
                  this.dialogCreateVisible = false
                  this.fetchData()
                }
              })
              .catch((err) => {
                this.dialogCreateLoading = false
                this.$message({
                  type: 'error',
                  message: err,
                })
              })
          } else {
            update(params2)
              .then((item) => {
                this.dialogCreateLoading = false
                if (item.code === 200) {
                  this.$message({
                    type: 'success',
                    message: '编辑成功',
                  })
                  this.dialogCreateVisible = false
                  this.fetchData()
                }
              })
              .catch((err) => {
                this.dialogCreateLoading = false
                this.$message({
                  type: 'error',
                  message: err,
                })
              })
          }
        }
      })
    },
    // 推广域名配置
    handleDataClick2() {
      this.$refs['dataForm2'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.extensionData, this.datas)
          // console.log(formDic, this.extensionData, this.datas);
          // 请求服务器
          this.dialogCreateLoading = true
          // console.log(formDic);
          subGroupConfig({ ...formDic, operator: this.operator })
            .then((item) => {
              this.dialogCreateLoading = false
              if (item.code === 200) {
                this.$message({
                  type: 'success',
                  message: '配置成功',
                })
                this.datas = {}
                this.fetchData()
                this.extension = false
              }
            })
            .catch((err) => {
              this.dialogCreateLoading = false
              this.$message({
                type: 'error',
                message: err,
              })
            })
        }
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
    // 显示新建弹出窗
    showCreateDialogClick() {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
  },
}
</script>
<style scoped>
.span_primary {
  margin-right: 10px;
  color: #fc708b;
  cursor: pointer;
}
.input-with-select {
  background-color: #fff;

  /* .el-input-group__prepend {
    background-color: #fff;
  } */
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
</style>
