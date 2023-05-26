<template>
  <div class="app-container">
    <div style="margin-bottom: 20px; display: flex; justify-content: space-between">
      <div style="display: flex; align-items: center">
        <el-button size="small" type="primary" icon="el-icon-edit-outline"
          @click="showCreateVipClick()">添加用户类型</el-button>
        <span style="margin-right: 10px"></span>
        <el-input size="small" style="width: 220px" v-model="listQuery.name" class="input-with-select"
          placeholder="请输入类型名称" clearable maxlength="12" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter">
          <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button>
        </el-input>

        <!--   <el-input
          size="small"
          style="width: 220px;"
          v-model= "listQuery.level"
          class="input-with-select"
          placeholder="请输入类型等级"
          clearable
          maxlength="12"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button>
        </el-input> -->

        <span style="margin-right: 10px"></span>
        <el-date-picker size="small" clearable v-model="listQuery.pickerValue" type="datetimerange"
          :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm" value-format="timestamp" :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter"></el-date-picker>
      </div>
      <el-button size="small" plain icon="el-icon-refresh" @click="fetchData()"></el-button>
    </div>

    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <!-- <el-table-column label="ID" min-width="80"   >
        <template slot-scope="{ row }">
          <user-drawer :id="row.id" />  price
        </template>
      </el-table-column> -->
      <el-table-column prop="typeName" label="类型名称" min-width="60"></el-table-column>
      <!-- <el-table-column prop="level" label="类型等级" min-width="60"  ></el-table-column> -->
      <el-table-column label="状态" width="150">
        <template slot-scope="{ row }">
          <el-switch v-model="row.status" :width="30" active-text="启用" :active-value="0" inactive-text="禁用"
            :inactive-value="1" @change="updateUserTypeStatus(row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间" width="160" :formatter="formatDate"></el-table-column>
      <el-table-column prop="gmtUpdate" label="更新时间" width="160" :formatter="formatDate"></el-table-column>
      <el-table-column prop="operator" label="创建人" min-width="60"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="{ row }">
          <el-button plain type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total"></el-pagination>

    <!-- 新建编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true" top="5vh" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
          <el-form-item label="类型名称" prop="typeName"><el-input v-model="createModel.typeName" clearable
              placeholder="类型名称" maxlength="10" /></el-form-item>
          <el-form-item label="类型等级" prop="level"><el-input v-model="createModel.level" clearable placeholder="类型等级"
              maxlength="10" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新建弹窗 -->
    <el-dialog title="添加用户类型信息" :visible.sync="dialogVisible" :close-on-click-modal="false" :destroy-on-close="true"
      width="30%">
      <div v-cloading="dialogLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
          <el-form-item label="类型名称" prop="typeName"><el-input v-model="createModel.typeName" clearable
              placeholder="类型名称" maxlength="10" /></el-form-item>
          <el-form-item label="类型等级" prop="level"><el-input v-model="createModel.level" clearable placeholder="类型等级"
              maxlength="10" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="savehandleDataClick()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCenterUserTypeList,
  updateCenterUserType,
  updateUserTypeStatus,
  saveUserType,
} from '@/api/type/type'
import { emptyS, nullS, formatUnixTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'

export default {
  name: 'CenterUserPropPlusPage',
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
        name: null,
        level: null,
        pickerValue: [],
      },

      // 弹窗数值
      dialogVisible: false,
      dialogLoading: false,

      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        update: '编辑用户',
      },

      familyList: null,

      // 表单模型
      createModel: {
        typeName: null,
        level: 0,
      },

      rules: {
        typeName: [
          { required: true, message: '类型名称不能为空', trigger: 'blur' },
        ],
        // level:[{required: true,message: "类型等级不能为空" ,trigger:'blur'}]
      },
      manageOptions: [
        { label: '否', value: 0 },
        { label: '是', value: 1 },
      ],

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
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    //方法区
    formatDate(row, column) {
      // 获取单元格数据
      let data = row[column.property]
      if (data == null) {
        return null
      }
      let dt = new Date(data)
      return (
        dt.getFullYear() +
        '-' +
        (dt.getMonth() + 1) +
        '-' +
        dt.getDate() +
        ' ' +
        dt.getHours() +
        ':' +
        dt.getMinutes() +
        ':' +
        dt.getSeconds()
      )
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getCenterUserTypeList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      )
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
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

    // 显示创建弹出窗
    showCreateVipClick() {
      this.resetCreateModel()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 创建数据
    savehandleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogLoading = true
          const params = {
            typeName: nullS(formDic.typeName),
            level: nullS(formDic.level),
          }

          saveUserType(params)
            .then((res) => {
              this.dialogLoading = false
              this.dialogVisible = false
              this.$notify({
                title: '提示',
                message: '添加贵族信息成功',
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

    // 修改贵族配置状态
    updateUserTypeStatus(row) {
      this.listLoading = true
      const id = row.id
      const status = row.status
      // 请求网络
      updateUserTypeStatus(id, status)
        .then((res) => {
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: '设置超管成功',
            type: 'success',
            duration: 1000,
          })
        })
        .catch((err) => {
          // 错误的情况下，修改内存属性
          row.status = !status
          this.listLoading = false
          this.$message.error(err)
        })
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

    //更新贵族等级数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)

          // 请求服务器
          this.dialogCreateLoading = true
          const params = {
            id: formDic.id || 0,
            typeName: nullS(formDic.typeName),
            level: nullS(formDic.level),
          }

          updateCenterUserType(params)
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

.vue-pagination {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 0px;
  padding: 0px;
}
</style>
