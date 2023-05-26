<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <div style="margin-bottom: 20px; display: flex; justify-content: space-between">
      <div style="display: flex; align-items: center">
        <!-- <span style="margin-right: 10px" /> -->
        <!-- <el-date-picker
          v-model="listQuery.pickerValue"
          size="small"
          clearable
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd HH:mm"
          value-format="timestamp"
          :default-time="['00:00:00', '23:59:59']"
          @change="handleSearchFilter"
        /> -->
        <!-- <span style="margin-right: 10px" /> -->
        <el-input v-model="listQuery.uid" size="small" style="width: 220px" class="input-with-select"
          placeholder="请输入用户ID" clearable maxlength="12" oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
        <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
        <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
      </div>
    </div>
    <el-form :inline="true">
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreatePropClick()">添加座驾</el-button>
      </el-form-item>
    </el-form>

    <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="用户ID" min-width="80">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column prop="gname" label="座驾名称" min-width="60" />
      <el-table-column prop="num" label="道具数量" min-width="60" />
      <el-table-column prop="gmtCreateString" label="创建时间" width="160" />
      <el-table-column prop="endTimeString" label="结束时间" width="160" />
    </el-table>

    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.page" :page-sizes="[10, 20, 50]"
      :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange" />

    <!-- 新建 弹窗 -->
    <el-dialog title="添加座驾" :visible.sync="dialogVisible" :close-on-click-modal="false" :destroy-on-close="true">
      <div v-cloading="dialogLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" size="medium">
          <el-form-item label="用户id" prop="uid"><el-input v-model.number="createModel.uid" clearable placeholder="请输入用户id"
              maxlength="10" /></el-form-item>
          <el-form-item label="数量" prop="num"><el-input v-model.number="createModel.num" clearable placeholder="请输入数量"
              maxlength="10" /></el-form-item>
          <el-form-item label="座驾时长(小时)" prop="hours"><el-input v-model.number="createModel.hours" clearable
              placeholder="请输入座驾时长" maxlength="10" /></el-form-item>
          <el-form-item label="座驾id" prop="gid">
            <el-select v-model="createModel.gid" placeholder="请选择座驾">
              <el-option v-for="item in gidOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogVisible = false">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getProps, createProp } from '@/api/center/prop/prop'
import { getPropList } from '@/api/config/prop'
import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
const { NOW_TIME_START, NOW_TIME_END } = getDateTime()

export default {
  name: 'CenterUserPropPage',
  filters: {},
  components: {
    UserDrawer
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
        pickerValue: []
      },

      // 弹窗数值
      dialogVisible: false,
      dialogLoading: false,

      // 表单模型
      createModel: {
        uid: null,
        num: 1,
        hours: 1,
        git: null
      },

      // 验证规则
      rules: {
        uid: [
          { required: true, message: '请输入用户ID' },
          { type: 'number', message: '请输入正确的用户ID' }
        ],
        num: [
          { required: true, message: '请输入数量' },
          { type: 'number', message: '请输入正确的数量' }
        ],
        hours: [
          { required: true, message: '请输入座驾时长' },
          { type: 'number', message: '请输入座驾时长' }
        ],
        gid: [{ required: true, message: '请选择座驾' }]
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
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
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
        limit: 20,
        pickerValue: this.initTimer
      }
      this.fetchData()
    },
    // 重新设置表单数据
    resetCreateModel() {
      this.createModel = {
        num: 1,
        hours: 1,
        git: null
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.gidOptions = []
      var gidTypes = []
      var cars = []
      // 获取所有座驾配置列表
      getPropList({ type: 1 })
        .then((res) => {
          for (const item of res.data.list || []) {
            if (item.type == 1) {
              cars.push({
                gid: item.gid || 0,
                gname: nullS(item.gname)
              })
            }
          }
          gidTypes = res.data.list || []
          this.gidOptions = gidTypes.map((item) => {
            return {
              value: item.gid || 0,
              label: nullS(item.gname)
            }
          })
          // 获取座驾明细列表
          return getProps(
            this.listQuery.limit,
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
            this.$set(item, 'gname', gname)
            this.$set(item, 'endTimeString', formatUnixTime(item.endTime))
            this.$set(item, 'gmtCreateString', formatUnixTime(item.gmtCreate))
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
    showCreatePropClick() {
      this.resetCreateModel()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 创建数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // if (nullS(formDic.hours)) {
          //   this.$message.error('座驾时长不能为空');
          //   return;
          // }
          // 请求服务器
          this.dialogLoading = true
          createProp({
            uid: formDic.uid,
            num: formDic.num || 1,
            hours: formDic.hours || 1,
            gid: formDic.gid || 1
          })
            .then((res) => {
              this.dialogLoading = false
              this.dialogVisible = false
              this.$notify({
                title: '提示',
                message: '添加座驾成功',
                type: 'success',
                duration: 1500
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
    }
  }
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
