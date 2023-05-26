<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
        <el-date-picker
          v-model="listQuery.pickerValue"
          size="small"
          clearable
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          value-format="timestamp"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          placeholder="请输入用户ID"
          clearable
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        >
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.channel"
          size="small"
          placeholder="请输入渠道名称"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        >
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.puid"
          size="small"
          placeholder="请输入用户puid"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        >
          <!--  <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        </el-input>
      </el-form-item>
      <!--   <el-select size="medium" v-model="listQuery.filterType" placeholder="请选择过滤条件" clearable @change="handleSearchFilter">
          <el-option v-for="item in filterTypeOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
        </el-select> -->
      <el-form-item>
        <el-select
          v-model="listQuery.bindType"
          size="small"
          placeholder="请选择来源条件"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in bindTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="nowrap">
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchFilter"
        >搜索</el-button>
        <el-button
          size="small"
          icon="el-icon-refresh"
          @click="reloadData()"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          @click="showCreateDialogClick()"
        >解绑用户</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column label="用户ID" min-width="80">
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="昵称"
        min-width="120"
      />
      <el-table-column
        prop="puid"
        label="上级(puid)"
        min-width="80"
      />
      <el-table-column label="过滤条件" width="120">
        <template slot-scope="{ row }">
          <el-tag size="medium">{{ row.filterTypeString }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户来源" width="120">
        <template slot-scope="{ row }">
          <el-tag size="medium">{{ row.bindString }}</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="balance" label="金额(元)" min-width="80"  ></el-table-column> -->
      <el-table-column
        prop="udid"
        label="手机唯一标识"
        min-width="170"
      />
      <el-table-column
        prop="model"
        label="手机型号"
        min-width="120"
      />
      <el-table-column label="手机注册系统" width="120">
        <template slot-scope="{ row }">
          <el-tag size="medium">{{ row.osString || '其他' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="ip" min-width="80" />
      <el-table-column
        prop="payMoney"
        label="用户总充值金额"
        min-width="80"
      />
      <el-table-column
        prop="createTimeString"
        label="创建时间"
        width="160"
      />
      <el-table-column
        prop="updateTimeString"
        label="更新时间"
        width="160"
      />
    </el-table>

    <!-- 新建/编辑 消息公告 -->
    <el-dialog
      :title="dialogTitleMap[dialogStatus]"
      :visible.sync="dialogCreateVisible"

      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="35%"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="createModel"
          :rules="rules"
          label-position="top"
          size="medium"
        >
          <el-form-item
            label="用户ID"
            prop="uid"
          ><el-input
            v-model="createModel.uid"
            clearable
            placeholder="请输入用户ID"
            maxlength="200"
          /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button
          size="medium"
          @click="dialogCreateVisible = false"
        >取消</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="handleDataClick()"
        >确定</el-button>
      </div>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { getPromotionUserBaseList } from '@/api/promotion/base'
import { unPromotion } from '@/api/center/user/base'
import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: 'PromotionUserBaseController',
  filters: {
    sexFilter(status) {
      const map = { 0: 'info', 1: '', 2: 'danger' }
      return map[status]
    }
  },
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
        phone: null,
        manage: null,
        nickname: null,
        channel: null,
        pickerValue: []
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
      },
      // 弹窗数值
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogStatus: '',
      dialogTitleMap: {
        create: '解绑用户'
      },

      // 表单模型
      createModel: {
        uid: 0
      },

      rules: {
        uid: [
          { required: true, message: '请输入用户ID', trigger: 'change' },
          { min: 1, max: 200, message: '最多为200个字符', trigger: 'change' }
        ]
      },
      bindTypeOptions: [
        { label: '未绑定', value: 0 },
        { label: '用户推广', value: 1 },
        { label: '渠道推广', value: 2 }
      ]
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
        puid: null,
        channel: null,
        pickerValue: this.initTimer
      }
      setTimeout(() => {
        this.fetchData()
      }, 80)
    },

    resetCreateModel() {
      this.createModel = {
        uid: 0
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      // 请求服务器
      getPromotionUserBaseList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      )
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
            var filterTypeString = ''
            switch (item.filterType) {
              case 0:
                filterTypeString = '正常'
                break
              case 1:
                filterTypeString = 'ip过滤'
                break
              case 2:
                filterTypeString = 'udid过滤'
                break
              case 3:
                filterTypeString = '渠道绑定率过滤'
                break
              default:
                break
            }
            var bindString = ''
            switch (item.bindType) {
              case 0:
                bindString = '未绑定'
                break
              case 1:
                bindString = '用户推广'
                break
              case 2:
                bindString = '渠道推广'
                break
              default:
                break
            }
            var osString = ''
            switch (item.os) {
              case 1:
                osString = '安卓用户端'
                break
              case 2:
                osString = '苹果用户端'
                break
              case 3:
                osString = '安卓主播端'
                break
              case 4:
                osString = '苹果主播端'
                break
              default:
                break
            }
            this.$set(item, 'filterTypeString', filterTypeString)
            this.$set(item, 'bindString', bindString)
            this.$set(item, 'osString', osString)
            this.$set(
              item,
              'createTimeString',
              formatUnixTime(item.createTime)
            )
            this.$set(
              item,
              'updateTimeString',
              formatUnixTime(item.updateTime)
            )
            return item
          })
          this.listQuery.total = res.data.total
          this.listLoading = false
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },

    // 显示创建弹出窗
    showCreateDialogClick() {
      this.resetCreateModel()
      this.dialogCreateVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          if (formDic.uid == null || formDic.uid < 0) {
            this.$message.error('参数错误')
            return
          }

          this.$confirm('是否解绑用户？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false
          }).then(() => {
            // 请求网络
            this.listLoading = true
            unPromotion({
              uid: formDic.uid
            })
              .then((res) => {
                this.dialogCreateLoading = false
                this.dialogCreateVisible = false
                this.$notify({
                  title: '提示',
                  message: '解绑成功',
                  type: 'success',
                  duration: 1500
                })
                setTimeout((_) => {
                  this.fetchData()
                }, 200)
              })
              .catch((err) => {
                this.dialogCreateLoading = false
                this.$message.error(err)
              })
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
