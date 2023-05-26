<template>
  <div class="app-container">
    <el-form :inline="true" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" placeholder="请输入用户ID" clearable
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-reset" @click="handleSearresetchFilter">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form-item>
      <el-button size="small" type="primary" @click="addRoutesAll">
        批量分层
      </el-button>
    </el-form-item>
    <el-table v-cloading="listLoading" :data="list" size="mini" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column label="用户ID" min-width="60">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="用户昵称" min-width="100" />
      <el-table-column prop="userLevel" label="用户等级" min-width="100" />

      <el-table-column prop="handsel1" label="入款次数" min-width="100" sortable>
        <template slot-scope="{ row }">
          <span>{{ `${row.orders1 + row.orders2}` }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rental" label="入款总额" min-width="100" sortable />
      <el-table-column prop="income" label="最大存款金额" min-width="130" sortable />

      <el-table-column prop="countWothdraw" label="出款次数" min-width="110" sortable />
      <el-table-column prop="cash" label="出款总数" min-width="100" sortable />
      <el-table-column prop="gmtCreateString" label="注册时间" width="150" />
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="{ row }">
          <el-button plain type="primary" size="mini" @click="addRoutes1(row)">分层</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <!-- <el-popover
    ref="popover4"
    placement="right"
    width="400"
    trigger="click">
    <el-table :data="gridData">
      <el-table-column width="150" property="date" label="日期"></el-table-column>
      <el-table-column width="100" property="name" label="姓名"></el-table-column>
      <el-table-column width="300" property="address" label="地址"></el-table-column>
    </el-table>
  </el-popover> -->

    <!-- 新建/编辑 弹窗 -->
    <!-- <el-dialog
    :title="dialogTitleMap[dialogStatus]"
    :visible.sync="dialogCreateVisible"
     
    :close-on-click-modal="false"
    :destroy-on-close="true"
    top="5vh"
    width="35%"
  >
    <div v-cloading="dialogCreateLoading" style="width: 100%;height: 100%;">
      <el-form ref="dataForm" :model="createModel" :rules="rules" label-width="80px" label-position="left" size="medium">
        <el-form-item label="用户层级:">
          <el-select v-model="createModel.openWay" placeholder="请选择用户层级">
            <el-option v-for="item in HierarchicalUser" :label="item.label" :key="item.value" :value="item.value" />
          </el-select>
        </el-form-item>

      </el-form>
    </div>
    <div slot="footer">
      <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
      <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
    </div>
  </el-dialog>
 -->

    <!-- 新建编辑 弹窗 -->
    <el-dialog v-if="dialogCreateVisible" :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible"
      :close-on-click-modal="false" :destroy-on-close="true" top="5vh" width="35%">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-width="80px" label-position="top"
          size="medium">
          <el-form-item prop="remark" label="用户呢称:"><el-input v-model="createModel.nickname" clearable placeholder="备注"
              maxlength="20" /></el-form-item>
          <el-form-item label="用户层级:">
            <el-select v-model="createModel.value" placeholder="请选择用户层级">
              <el-option v-for="item in HierarchicalUser" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 批量分层 -->
    <el-dialog v-if="dialogAddRoutesAll" title="批量分层" :visible.sync="dialogAddRoutesAll" :close-on-click-modal="false"
      :destroy-on-close="true" width="35%">
      <div style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-width="80px" label-position="top"
          size="medium">
          <el-form-item label="用户层级:">
            <el-select v-model="createModel.value" placeholder="请选择用户层级">
              <el-option v-for="item in HierarchicalUser" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogAddRoutesAll = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleAddRoutesAll()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getHierarchyList,
  getHierarchicalUser,
  updateHierarchy,
  updateBatchHierarchy,
} from '@/api/center/user/dlized'
import { emptyS, nullS, formatUnixTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'

export default {
  name: 'CenterHandselController',
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
      value3: true,
      value4: true,
      message: null,
      lotteryCode: null,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        cpName: null,
        uid: null,
        status: null,
        type: null,
        pickerValue: [],

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
      },

      // 表单模型
      createModel: {
        id: null,
        name: null,
        inComeTime: null,
        inComeTotal: null,
        userNumber: null,
        type: null,
        value: null,
        remark: null,
      },

      rules: {
        uid: [{ required: true, message: '请输入用户ID', trigger: 'change' }],
        bid: [
          { required: true, message: '贵族徽章id不能为空', trigger: 'blur' },
        ],
      },
      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogChangeVisible: false,
      dialogChangeLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        update: '修改用户层级',
        create: '添加用户层级',
      },
      statusOptions: [
        { value: 40, label: '今存明送' },
        { value: 41, label: '工资存放' },
      ],
      multipleSelection: [], // 多选数据
      dialogAddRoutesAll: false, // 批量分层是否显示
    }
  },
  created() {
    this.fetchData()
  },
  HierarchicalUser: null,
  methods: {
    reset() {
      this.listQuery = {}
      this.fetchData()
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = []
      if (val.length > 0) {
        val.forEach((item) => {
          this.multipleSelection.push(item.uid)
        })
      }
      console.log(this.multipleSelection)
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.todayListLoading = true
      this.HierarchicalUser = null
      var id = this.$route.query.tt
      // this.dialogCreateLoading = true;
      getHierarchicalUser()
        .then((res) => {
          this.HierarchicalUser = (res.data.list || []).map((item) => {
            return {
              value: item.id,
              label: nullS(item.name),
            }
          })
          return getHierarchyList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery,
            id
          )
        })
        // getHierarchyList(this.listQuery.limit, this.listQuery.page, this.listQuery,id)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var rental = item.ordersRental / 100 + item.bankRental
            var income = ''
            if (item.maxPayOrder / 100 >= item.maxBankRental) {
              income = (item.maxPayOrder / 100).toLocaleString()
            } else if (item.maxBankRental >= item.maxPayOrder / 100) {
              income = item.maxBankRental.toLocaleString()
            }
            this.$set(item, 'gmtCreateString', formatUnixTime(item.gmtCreate))
            this.$set(item, 'income', income)
            this.$set(item, 'rental', rental.toLocaleString())
            this.$set(item, 'cash', item.rentalWothdraw.toLocaleString())

            return item
          })
          console.log(this.list)
          this.dialogCreateLoading = false
          this.listLoading = false
          this.listQuery.total = res.data.total
        })
        .catch((err) => {
          this.list = null
          this.HierarchicalUser = null
          this.dialogCreateLoading = false
          this.listQuery.total = 0
          this.listLoading = false
        })
    },
    // 创建数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          const params = {
            id: formDic.value,
            nickname: formDic.nickname,
            uid: formDic.uid,
          }
          updateHierarchy(params)
            .then((res) => {
              this.dialogCreateLoading = false
              this.dialogCreateVisible = false
              this.dialogVisible = false
              this.$notify({
                title: '提示',
                message: '修改用户层级成功',
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
    // 重置
    resetCreateModel() {
      this.createModel = {
        id: 0,
        uid: 0,
        nickname: null,
        signature: null,
      }
    },
    // 显示编辑弹出窗
    addRoutes1(row) {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'update'
      this.createModel = Object.assign({}, row)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 批量分层 按钮
    addRoutesAll() {
      if (this.multipleSelection.length == 0) {
        this.$message.error('请先选用户！')
        return
      }
      this.resetCreateModel()
      this.dialogAddRoutesAll = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 批量分成确定
    handleAddRoutesAll() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          const params = {
            id: formDic.value,
            uidList: this.multipleSelection.join(','),
          }
          updateBatchHierarchy(params)
            .then((res) => {
              this.dialogAddRoutesAll = false
              this.$notify({
                title: '提示',
                message: '修改用户层级成功',
                type: 'success',
                duration: 1500,
              })
              setTimeout((_) => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.dialogAddRoutesAll = false
              this.$message.error(err)
            })
        }
      })
    },
    lotteryResultCode(lotteryName, expect) {
      this.lotteryCode = null
      getLotteryCode(lotteryName, expect).then((res) => {
        if (
          res.data != null &&
          res.data != undefined &&
          JSON.stringify(res.data) != '{}'
        ) {
          this.lotteryCode = res.data
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
  width: 300px;
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
