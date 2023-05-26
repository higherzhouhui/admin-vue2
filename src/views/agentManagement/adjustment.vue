<template>
  <div class="app-container">
    <div class="flex-top-center">
      <el-form :inline="true">
        <el-form-item>
          <!-- <el-tag type="info">查询时间:</el-tag> -->
          <el-date-picker v-model="listQuery.month" clearable size="small" type="month" placeholder="选择月"
            style="width: 125px" value-format="yyyy-MM" @change="handleSearchFilter" />
        </el-form-item>
        <el-form-item>
          <!-- <el-tag type="info">代理ID:</el-tag> -->
          <el-input v-model="listQuery.agentId" size="small" class="input-with-select" placeholder="请输入代理ID"
            style="width: 125px" clearable maxlength="16" @keyup.enter.native="handleSearchFilter"
            @clear="handleSearchFilter" />
        </el-form-item>
        <el-form-item>
          <!-- <el-tag type="info">代理账号:</el-tag>  -->
          <el-input v-model="listQuery.agentAccount" size="small" class="input-with-select" placeholder="请输入代理账号"
            style="width: 150px" clearable maxlength="16" @keyup.enter.native="handleSearchFilter"
            @clear="handleSearchFilter" />
        </el-form-item>
        <!-- <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        <el-form-item>
          <!-- <el-tag type="info">上级账号:</el-tag> -->
          <el-input v-model="listQuery.parentAgent" size="small" class="input-with-select" placeholder="请输入上级账号"
            style="width: 150px" clearable maxlength="16" @keyup.enter.native="handleSearchFilter"
            @clear="handleSearchFilter" />
        </el-form-item>
        <el-form-item>
          <!-- <el-tag type="info">类型:</el-tag> -->
          <!-- <el-tag type="info">调整类型:</el-tag> -->
          <el-select v-model="listQuery.modifyType" size="small" style="width: 150px" clearable placeholder="请选择调整类型"
            @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
            <!-- <el-option
              label="全部"
              value="0"
            /> -->
            <el-option label="补发佣金" :value="1" />
            <el-option label="扶持调整" :value="2" />
            <el-option label="其他扶持" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
          <!-- 重置 -->
          <el-button size="small" icon="el-icon-refresh" @click="resets">
            重置
          </el-button>
        </el-form-item>

      </el-form>
      <!-- 导出 -->
      <el-button size="small" :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">
        导出Excel
      </el-button>
    </div>
    <el-form>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-plus" @click="showCreateDialogClick()">新增
        </el-button>
      </el-form-item>
    </el-form>
    <el-table v-cloading="listLoading" :data="list" size="mini" :cell-style="cellStyle" fit
      highlight-current-row>
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column prop="agentIdX" label="代理ID" min-width="120">
        <template slot-scope="{ row }">
          <span>{{ row.agentId }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="agentAccount" label="代理账号" min-width="80" />
      <el-table-column prop="pagentAccount" label="上级账号" min-width="120">
        <template slot-scope="{ row }">
          {{
            row.pagentAccount == null || row.pagentAccount == undefined
            ? "总代"
            : row.pagentAccount
          }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="outerNo" label="第三方订单号" min-width="80"  ></el-table-column> -->
      <el-table-column prop="modifyAmt" label="调整佣金" sortable min-width="100" />
      <el-table-column prop="modifyType" label="调整类型" min-width="100" :formatter="formatterType" />
      <el-table-column prop="modifyMonth" label=" 调整时间" min-width="130" />
      <el-table-column prop="createTime" label="操作时间" min-width="140">
        <template slot-scope="{ row }">
          {{ handleTimeZoneShow(row.createTime) }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="name" label="最后处理时间" min-width="120"   /> -->
      <el-table-column prop="modifyUserName" label="操作人" min-width="100" />
      <el-table-column prop="remark" label="备注" min-width="100" />
    </el-table>
    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <!-- 新建编辑 弹窗 -->
    <el-dialog :title="dialogTitleMap[dialogStatus]" :visible.sync="dialogCreateVisible" :close-on-click-modal="false"
      :destroy-on-close="true" top="5vh" width="600px">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" :rules="rules" label-position="top" label-width="80px"
          size="medium">
          <el-form-item prop="agentAccount" label="代理账号">
            <el-input v-model="createModel.agentAccount" clearable placeholder="请输入代理账号" maxlength="16" />
          </el-form-item>
          <el-form-item prop="modifyAmt" label="调整佣金">
            <el-input v-model="createModel.modifyAmt" clearable placeholder="单笔最大调整金额50000" maxlength="20"
              type="number" />
            <!-- <div style="color: red">单笔最大可调整金额：50000</div> -->
          </el-form-item>
          <el-form-item prop="modifyType" label="调整类型">
            <el-select v-model="createModel.modifyType" placeholder="请选择调整类型" clearable style="width: 100%">
              <el-option label="补发佣金" value="1" />
              <el-option label="扶持调整" value="2" />
              <el-option label="其他调整" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item prop="modifyMonth" label="调整时间">
            <el-date-picker v-model="createModel.modifyMonth" type="date" clearable placeholder="选择调整日期"
              style="width: 100%;" format="yyyy-MM" value-format="yyyy-MM" />
          </el-form-item>
          <el-form-item prop="remark" label="备注">
            <el-input v-model="createModel.remark" type="textarea" clearable placeholder="请输入备注" maxlength="100" />
          </el-form-item>
          <!-- <el-form-item prop="operator" label="操作人">
            <el-input v-model="createModel.operator" clearable placeholder="请输入操作人" maxlength="16" />
          </el-form-item> -->
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium"
          @click="(dialogCreateVisible = false), ( this.dialogCreateLoading = false)">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  commissionModifyRecordTable,
  addCommissionModifyTable,
  commissionModifyRecordExport,
} from '@/api/agentManagement/tabledetail'
import { formatUnixTime, getNowFormatDay } from '@/utils/tools'
// const NOW_MONTH = getNowFormatDay('-', false)
export default {
  name: 'AgentManagementAdjustment',
  data() {
    return {
      list: [],
      todayList: null,
      listLoading: true,
      downloadLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        account: '',
        month: ''
      },
      listQueryData() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 20,
          total: 0,
          account: '',
          month: this.getMonth
        }
      },
      // 状态选择
      statusOptions: [
        { label: '未支付', value: 0 },
        { label: '已支付', value: 1 },
      ],
      // 验证表单
      rules: {
        agentAccount: [
          { required: true, message: '代理账号不能为空', trigger: 'change' },
        ],
        modifyAmt: [
          { required: true, message: '调整金额不能为空', trigger: 'change' },
          { validator: this.validatemodifyAmt, trigger: 'change' },
        ],
        modifyType: [
          { required: true, message: '调整类型不能为空', trigger: 'change' },
        ],
        modifyMonth: [
          { required: true, message: '调整时间不能为空', trigger: 'change' },
        ],
      },

      // 表单模型
      createModel: {
        agentAccount: '',
        modifyAmt: '',
        modifyMonth: '',
        modifyType: '',
        operator: '',
        remark: '',
      },

      resetCreateModel() {
        this.createModel = {
          agentAccount: '',
          modifyAmt: '',
          modifyMonth: '',
          modifyType: '',
          operator: '',
          remark: '',
        }
      },

      dialogCreateVisible: false,
      dialogCreateLoading: false,
      dialogChangeVisible: false,
      dialogChangeLoading: false,

      dialogStatus: '',
      dialogTitleMap: {
        update: '编辑代理',
        create: '代理佣金调整',
      },
      operator: null,
    }
  },
  computed: {
    getMonth() {
      let noTime = this.$store.getters.timerDate[0]
      return getNowFormatDay('-', false, noTime)
    }
  },
  created() {
    this.listQuery.month = this.getMonth
    this.fetchData()
    console.log(this.$store.state.user.name)
    // getInfo().then((item) => {
    //   if (item.code === 200) {
    //     this.operator = item.data.name
    //   }
    // })
  },
  methods: {
    handleTimeZoneShow(time) {
      return formatUnixTime(time)
    },
    cellStyle(row, column, rowIndex, columnIndex) {
      // 根据报警级别显示颜色
      // console.log(row);
      // console.log(row.column);
      if (row.column.label === '商户名称') {
        return 'color:#42b983'
      }
    },
    // 重置刷新
    resets() {
      this.listQueryData()
      this.fetchData()
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.todayListLoading = true
      commissionModifyRecordTable({
        ...this.listQuery,
        modifyType:
          this.listQuery.modifyType * 1
            ? this.listQuery.modifyType * 1
            : undefined,
      })
        .then((res) => {
          this.listLoading = false
          this.todayListLoading = false
          this.list = res.rows
          this.listQuery.total = res.total
        })
        .catch((err) => {
          this.list = []
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },
    // 过滤
    handleSearchFilter() {
      this.listQuery.pageNum = 1
      this.fetchData()
    },
    // 导出
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      this.downloadLoading = true
      commissionModifyRecordExport(this.listQuery) // 导出的接口
        .then((result) => {
          this.downloadLoading = false
          console.log(result)
          const link = document.createElement('a') // 创建a标签
          const blob = new Blob([result], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          }) // 设置文件流
          link.style.display = 'none'
          // 设置连接
          link.href = URL.createObjectURL(blob) // 将文件流转化为blob地址
          link.download = '佣金调整明细报表'
          document.body.appendChild(link)
          // 模拟点击事件
          link.click() // 设置点击事件
        })
        .catch((err) => {
          this.downloadLoading = false
          console.log(err)
        })
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
    showDeleteDialogClick(row) {
      if (row.id == null || row.id < 0) {
        this.$message.error('参数错误')
        return
      }
      this.$confirm('是否删除该用户层级？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      })
        .then(() => {
          // 请求网络
          this.listLoading = true
          // deleteHierarchyUser([row.id])
          //   .then(res => {
          //     this.listLoading = false
          //     this.$notify({
          //       title: '提示',
          //       message: '删除用户ID成功',
          //       type: 'success',
          //       duration: 1500
          //     })
          //     setTimeout(_ => {
          //       this.fetchData()
          //     }, 200)
          //   })
          //   .catch(err => {
          //     this.listLoading = false
          //     this.$message.error(err)
          //   })
        })
        .catch(() => {})
    },

    // 创建/更新 数据
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dialogCreateLoading = true
          addCommissionModifyTable({
            ...this.createModel,
            modifyType: this.createModel.modifyType * 1,
            operator: this.$store.state.user.name,
          })
            .then((res) => {
              this.dialogCreateLoading = false
              if (res.code === 200) {
                this.dialogCreateVisible = false
                this.fetchData()
                this.$message({
                  type: 'success',
                  message: '新增成功',
                })
              } else {
                this.$message({
                  type: 'erroe',
                  message: res.msg,
                })
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
      this.dialogCreateLoading = false
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    formatterType(row) {
      if (row.modifyType === 1) {
        return '补发佣金'
      } else if (row.modifyType === 2) {
        return '扶持调整'
      } else if (row.modifyType === 3) {
        return '其他调整'
      }
    },
    validatemodifyAmt(rule, value, callback) {
      if (value > 50000 || value < -50000) {
        return callback(new Error('单笔金额不能超过50000'))
      }
      // if (value < 0) {
      //   return callback(new Error('不能小于0'))
      // }
      return callback()
    },
  },
}
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
  width: auto;
  /* .el-input-group__prepend {
      background-color: #fff;
    } */
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}

.form_item_font {
  color: red;
}

.support {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  white-space: nowrap;
}

.support_center {
  width: 100px;
  height: 42px;
}

.PlatformFee {
  border-radius: 10px;
  border: 1px solid rgb(180, 166, 166);
  padding: 10px;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  grid-template-areas: 1fr 1fr;
  white-space: nowrap;
}

.PlatformFee_div {
  display: flex;
  align-items: center;
}
</style>
