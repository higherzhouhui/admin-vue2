<template>
  <div class="app-container">
    <!-- <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" /> -->
    <el-form :inline="true">
      <!-- <el-form-item>
        <span class="search_info">创建时间:</span>
        <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
          :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm" value-format="timestamp" :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter" />
      </el-form-item> -->
      <el-form-item>
        <el-input v-model="listQuery.name" size="small" style="width: 220px" placeholder="请输入贵族名称" clearable
          maxlength="12" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="listQuery.level" size="small" style="width: 220px" placeholder="请输入贵族等级" clearable
          maxlength="12" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateVipClick()">添加贵族等级</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <!-- <el-table-column label="ID" min-width="80"   >
        <template slot-scope="{ row }">
          <user-drawer :id="row.id" />  price
        </template>
      </el-table-column> -->
      <el-table-column prop="name" label="贵族名称" min-width="100" />
      <el-table-column prop="level" label="贵族等级" min-width="100" sortable />
      <el-table-column prop="price" label="开通价格" min-width="100" sortable />
      <el-table-column prop="bid" label="徽章id" min-width="100" />
      <el-table-column prop="logoUrl" label="贵族图标" min-width="100">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" min-width="50" height="50">
        </template>
      </el-table-column>
      <el-table-column prop="renewPrice" label="续费价格(金币)" min-width="130" sortable />
      <el-table-column prop="returnPrice" label="续费立返价格(金币)" min-width="160" sortable />
      <el-table-column prop="rewardPrice" label="奖励金币" min-width="100" sortable />
      <el-table-column prop="pkAddition" label="pk加成" min-width="100" sortable />
      <el-table-column prop="num" label="靓号尾数" min-width="100" />
      <el-table-column label="状态" width="150">
        <template slot-scope="{ row }">
          <el-switch v-model="row.status" :width="30" active-text="启用" :active-value="0" inactive-text="禁用"
            :inactive-value="1" @change="updateLevelStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间" width="160" :formatter="formatDate" />
      <el-table-column prop="gmtUpdate" label="更新时间" width="160" :formatter="formatDate" />
      <el-table-column prop="operator" label="创建人" min-width="60" />
      <el-table-column label="操作" width="70" fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <!-- 新建编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="150px"
          size="medium">
          <el-form-item label="贵族名称" prop="name"><el-input v-model="createModel.name" clearable placeholder="贵族名称"
              maxlength="30" /></el-form-item>
          <el-form-item label="贵族等级" prop="level"><el-input v-model="createModel.level" clearable placeholder="贵族等级"
              maxlength="10" /></el-form-item>
          <el-form-item label="开通价格" prop="price"><el-input v-model="createModel.price" clearable placeholder="开通价格"
              maxlength="10" /></el-form-item>
          <el-form-item prop="logoUrl" label="贵族图标 "><el-input v-model="createModel.logoUrl" clearable
              placeholder="续费价格(金币)" maxlength="200" /></el-form-item>
          <el-form-item prop="renewPrice" label="续费价格(金币)"><el-input v-model="createModel.renewPrice" clearable
              placeholder="续费价格(金币)" maxlength="10" /></el-form-item>
          <el-form-item prop="returnPrice" label="续费立返价格(金币)"><el-input v-model="createModel.returnPrice" clearable
              placeholder="续费立返价格(金币)" maxlength="10" /></el-form-item>
          <el-form-item prop="rewardPrice" label="奖励金币"><el-input v-model="createModel.rewardPrice" clearable
              placeholder="奖励金币" maxlength="10" /></el-form-item>
          <el-form-item prop="pkAddition" label="pk加成"><el-input v-model="createModel.pkAddition" clearable
              placeholder="pk加成" maxlength="10" /></el-form-item>
          <el-form-item prop="num" label="靓号尾数"><el-input v-model="createModel.num" clearable placeholder="尾数靓号"
              maxlength="10" /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新建弹窗 -->
    <el-dialog title="添加贵族等级信息" :visible.sync="dialogVisible" :close-on-click-modal="false" :destroy-on-close="true">
      <div v-cloading="dialogLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="150px"
          size="medium">
          <el-form-item label="贵族名称" prop="name"><el-input v-model="createModel.name" clearable placeholder="贵族名称"
              maxlength="30" /></el-form-item>
          <el-form-item label="贵族等级" prop="level"><el-input v-model="createModel.level" clearable placeholder="贵族等级"
              maxlength="10" /></el-form-item>

          <el-form-item label="徽章">
            <el-select v-model="createModel.value" placeholder="请--选--择 ">
              <el-option v-for="item in familyList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="开通价格" prop="price"><el-input v-model="createModel.price" clearable placeholder="开通价格"
              maxlength="10" /></el-form-item>
          <el-form-item prop="renewPrice" label="续费价格(金币)"><el-input v-model="createModel.renewPrice" clearable
              placeholder="续费价格(金币)" maxlength="10" /></el-form-item>
          <el-form-item prop="returnPrice" label="续费立返价格(金币)"><el-input v-model="createModel.returnPrice" clearable
              placeholder="续费立返价格(金币)" maxlength="10" /></el-form-item>
          <el-form-item prop="rewardPrice" label="奖励金币"><el-input v-model="createModel.rewardPrice" clearable
              placeholder="奖励金币" maxlength="10" /></el-form-item>
          <el-form-item prop="pkAddition" label="pk加成"><el-input v-model="createModel.pkAddition" clearable
              placeholder="pk加成" maxlength="10" /></el-form-item>
          <el-form-item prop="num" label="靓号尾数"><el-input v-model="createModel.num" clearable placeholder="尾数靓号"
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
  getCenterUusrVipLevelList,
  updateCenterUserVipLevel,
  updateUserVipLevel,
  saveUserVipLevel,
} from '@/api/vip/vip'
import { getBadgeBase } from '@/api/config/vip'
import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: 'CenterUserVipLevelController',
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
        gids: null,
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
        uid: 0,
        nickname: null,
        signature: null,
      },

      rules: {
        trueName: [
          { required: true, message: '请输入昵称', trigger: 'change' },
          { min: 1, max: 20, message: '最多为20个字符', trigger: 'change' },
        ],
        name: [
          { required: true, message: '贵族名字不能为空', trigger: 'blur' },
        ],
        level: [
          { required: true, message: '贵族等级不能为空', trigger: 'blur' },
        ],
        bid: [
          { required: true, message: '贵族徽章id不能为空', trigger: 'blur' },
        ],
        price: [
          { required: true, message: '贵族开通价格不能为空', trigger: 'blur' },
        ],
        renewPrice: [
          { required: true, message: '续费金额不能为空', trigger: 'blur' },
        ],
        rewardPrice: [
          { required: true, message: '奖励金额不能为空', trigger: 'blur' },
        ],
        pkAddition: [
          { required: true, message: 'pK加成不能为空', trigger: 'blur' },
        ],
        num: [{ required: true, message: '靓号不能为空', trigger: 'blur' }],
        returnPrice: [
          { required: true, message: '续费立返金额不能为空', trigger: 'blur' },
        ],
        logoUrl: [
          { required: true, message: '图标地址不能为空', trigger: 'blur' },
        ],
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
  computed: {
    initTimer() {
      return this.$store.getters.timerDate
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    reset() {
      this.listQuery = {
        limit: 20,
        page: 1,
      }
      this.fetchData()
    },
    // 方法区
    formatDate(row, column) {
      // 获取单元格数据
      const data = row[column.property]
      if (data == null) {
        return null
      }
      const dt = new Date(data)
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
      this.familyList = null
      var cars = []
      // 获取所有座驾配置列表
      getBadgeBase()
        .then((res) => {
          this.familyList = (res.data.list || []).map((item) => {
            return {
              value: item.bid,
              label: nullS(item.name),
            }
          })
          // 获取座驾明细列表
          return getCenterUusrVipLevelList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery,
            this.listQuery.name,
            this.listQuery.level
          )
        })
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var gname = ''
            for (const car of cars) {
              if (car.gid == item.gid) {
                gname = car.gname
              }
            }
            var statusString = ''
            switch (item.status) {
              case 0:
                statusString = '未过期'
                break
              case 1:
                statusString = '已过期'
                break
            }
            this.$set(item, 'gname', gname)
            this.$set(item, 'gmtCreateString', formatUnixTime(item.gmtCreate))
            return item
          })
          this.listLoading = false
          this.listQuery.total = res.data.total
        })
        .catch((err) => {
          this.list = null
          this.familyList = null
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
            name: nullS(formDic.name),
            level: nullS(formDic.level),
            bid: formDic.value,
            price: nullS(formDic.price),
            renewPrice: nullS(formDic.renewPrice),
            rewardPrice: nullS(formDic.rewardPrice),
            returnPrice: nullS(formDic.returnPrice),
            pkAddition: nullS(formDic.pkAddition),
            num: nullS(formDic.num),
          }

          saveUserVipLevel(params)
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
    updateLevelStatus(row) {
      this.listLoading = true
      const id = row.id
      const status = row.status
      // 请求网络
      updateCenterUserVipLevel(id, status)
        .then((res) => {
          this.listLoading = false
          this.$notify({
            title: '提示',
            message: '操作成功',
            type: 'success',
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

    // 更新贵族等级数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)

          // 请求服务器
          this.dialogCreateLoading = true
          const params = {
            id: formDic.id || 0,
            name: nullS(formDic.name),
            level: nullS(formDic.level),
            logoUrl: nullS(formDic.logoUrl),
            price: nullS(formDic.price),
            renewPrice: nullS(formDic.renewPrice),
            returnPrice: nullS(formDic.returnPrice),
            rewardPrice: nullS(formDic.rewardPrice),
            pkAddition: nullS(formDic.pkAddition),
            num: nullS(formDic.num),
          }

          updateUserVipLevel(params)
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
