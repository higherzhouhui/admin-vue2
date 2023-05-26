<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form inline="true">
      <!-- <el-form-item>
        <span class="search_info">创建时间</span>
        <el-date-picker v-model="listQuery.pickerValue" size="small" clearable type="datetimerange"
          :picker-options="pickerOptions" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
          align="right" format="yyyy-MM-dd HH:mm" value-format="timestamp" :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter" />
      </el-form-item> -->
      <el-form-item>
        <el-select v-model="listQuery.status" size="small" placeholder="请选择状态" clearable @change="handleSearchFilter">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-input v-model="listQuery.uid" size="small" style="width: 220px" placeholder="请输入用户ID" clearable
          oninput="value=value.replace(/[^\d]/g,'')" @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateVipClick()">新增贵族</el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="用户ID" min-width="120">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="levelId" label="贵族等级" min-width="100" sortable />
      <el-table-column prop="name" label="贵族名字" min-width="100" />
      <el-table-column prop="goldCoin" label="购买贵族消耗的金币" min-width="160" sortable />
      <el-table-column prop="statusString1" label="购买类型" min-width="100" />
      <el-table-column prop="statusString" label="是否过期" min-width="100" />
      <el-table-column prop="roomHideString" label="进房是否隐身" min-width="120" />
      <el-table-column prop="rankHideString" label="榜单是否隐身" min-width="120" />
      <el-table-column prop="chatHideString" label="聊天是否隐身" min-width="120" />
      <el-table-column prop="vipUid" label="靓号" min-width="100" />
      <!--   <el-table-column prop="vipGroup" label="群组" min-width="60"  ></el-table-column> -->
      <el-table-column prop="gmtCreate" label="创建时间" width="160" :formatter="formatDate" />
      <el-table-column prop="endTime" label="结束时间" width="160" :formatter="formatDate" />
      <el-table-column prop="gmtUpdate" label="更新时间" width="160" :formatter="formatDate" />
      <el-table-column prop="operator" label="操作人" min-width="60" />
      <el-table-column label="操作" width="70" fixed="right">
        <template slot-scope="{ row }">
          <span class="operation_btn" type="primary" size="mini" @click="showUpdateDialogClick(row)">编辑</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page" :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 新建编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
          <!--  <el-form-item label="贵族名称">
                <el-select v-model="createModel.value" placeholder="请--选--择 ">
                  <el-option v-for="item in familyList" :label="item.label" :key="item.label" :value="item.value" />
                </el-select>
              </el-form-item> -->

          <el-form-item prop="vipUid" label="靓号"><el-input v-model="createModel.vipUid" clearable placeholder="靓号"
              maxlength="10" /></el-form-item>
          <!--
              <el-form-item prop="vipGroup" label="群组"><el-input v-model="createModel.vipGroup" clearable placeholder="群组" maxlength="10" /></el-form-item> -->
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="updateUserVipClick()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新增弹窗 -->
    <el-dialog title="新增贵族信息" :visible.sync="dialogVisible" :close-on-click-modal="false" :destroy-on-close="true">
      <div v-cloading="dialogLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="120px"
          size="medium">
          <el-form-item label="贵族用户id" prop="uid"><el-input v-model="createModel.uid" clearable placeholder="贵族用户id"
              maxlength="10" /></el-form-item>

          <el-form-item label="贵族名称">
            <el-select v-model="createModel.value" placeholder="请--选--择 ">
              <el-option v-for="item in familyList" :key="item.label" :label="item.label" :value="item.value"
                :v-model="createModel.name" />
            </el-select>
          </el-form-item>

          <el-form-item prop="vipUid" label="靓号"><el-input v-model="createModel.vipUid" clearable placeholder="靓号"
              maxlength="10" /></el-form-item>
          <!--
          <el-form-item prop="vipGroup" label="群组"><el-input v-model="createModel.vipGroup" clearable placeholder="群组" maxlength="10" /></el-form-item> -->
        </el-form>
      </div>

      <div slot="footer">
        <el-button size="medium" @click="dialogVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="saveUserVipClick()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCenterUusrVipList,
  saveUserVip,
  updateUserVip,
  getCenterUusrVipLevelList,
} from '@/api/vip/vip'
import { getPropList } from '@/api/config/vip'

import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: 'CenterUserVipController',
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
        status: null,
        uid: null,
        gids: null,
        pickerValue: [],
      },
      goldMedalOptions: [
        { value: 0, label: '未隐身' },
        { value: 1, label: '隐身' },
      ],
      statusOptions: [
        { label: '使用中', value: 0 },
        { label: '已过期', value: 1 },
      ],
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

      rules: {
        uid: [{ required: true, message: '贵族用户id', trigger: 'blur' }],
        level: [
          { required: true, message: '贵族名称不能为空', trigger: 'blur' },
        ],
        // vipUid: [{ required: true, message: '靓号不能为空', trigger: 'blur' }],
        vipGroup: [
          { required: true, message: '群组不能为空', trigger: 'blur' },
        ],
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

      familyList: null,

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
    this.listQuery.pickerValue = this.initTimer
    this.fetchData()
  },
  methods: {
    reset() {
      this.listQuery = {
        page: 1,
        pickerValue: this.initTimer,
        limit: 20,
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
      getPropList({ status: 0 })
        .then((res) => {
          this.familyList = (res.data.list || []).map((item) => {
            return {
              value: item.id,
              label: nullS(item.name),
            }
          })

          // 获取贵族列表
          return getCenterUusrVipList(
            this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
          )
          console.log(
            '数据类型' + this.listQuery.limit,
            this.listQuery.page,
            this.listQuery
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

            var statusString1 = ''
            switch (item.status) {
              case 0:
                statusString1 = '金币购买  '
                break
              case 1:
                statusString1 = '充值赠送'
                break
              case 2:
                statusString1 = '后台增加'
                break
            }

            var roomHideString = ''
            if (item.roomHide == 1) {
              roomHideString = '隐身'
            } else {
              roomHideString = '不隐身'
            }

            var rankHideString = ''
            if (item.rankkHide == 1) {
              rankHideString = '隐身'
            } else {
              rankHideString = '不隐身'
            }

            var chatHideString = ''
            if (item.roomHide == 1) {
              chatHideString = '隐身'
            } else {
              chatHideString = '不隐身'
            }
            this.$set(item, 'statusString1', statusString)
            this.$set(item, 'gname', gname)
            this.$set(item, 'statusString', statusString)
            this.$set(item, 'roomHideString', roomHideString)
            this.$set(item, 'rankHideString', rankHideString)
            this.$set(item, 'chatHideString', chatHideString)
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

    // 更新贵族等级数据  updateUserVipClick
    updateUserVipClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)

          // 请求服务器
          this.dialogCreateLoading = true
          const params = {
            uid: formDic.uid,
            vipUid: formDic.vipUid,
            /*   name:formDic.name,
               levelId: formDic.value,

            /*    vipGroup: formDic.vipGroup */
          }
          updateUserVip(params)
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

    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        id: 0,
        uid: 0,
        nickname: null,
        signature: null,
      }
    },

    // 显示创建弹出窗 showCreateVipClick
    showCreateVipClick() {
      this.resetCreateModel()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 保存贵族用户    //
    saveUserVipClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogLoading = true
          const params = {
            uid: formDic.uid,
            levelId: formDic.value,
            vipUid: formDic.vipUid,
            /*    vipGroup: formDic.vipGroup */
          }

          saveUserVip(params)
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
