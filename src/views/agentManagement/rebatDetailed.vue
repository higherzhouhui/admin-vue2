<template>
  <div class="app-container">
    <div class="flex-top-center">
      <el-form :inline="true">
        <el-form-item v-if="!listQuery.date">
          <!-- <el-tag type="info">查询时间(按月):</el-tag> -->
          <el-date-picker v-model="listQuery.month" clearable size="small" type="month" placeholder="选择月"
            value-format="yyyy-MM" @change="handleSearchFilter" />
        </el-form-item>
        <el-form-item v-if="!listQuery.month">
          <!-- <el-tag type="info">查询时间(按天):</el-tag> -->
          <el-date-picker v-model="listQuery.date" clearable size="small" type="date" placeholder="选择日期"
            value-format="yyyy-MM-dd" @change="handleSearchFilter" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.agentId" size="small" class="input-with-select" placeholder="请输入代理ID" clearable
            @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
        </el-form-item>
        <!-- <el-form-item>
          <el-input
            v-model="listQuery.agentAccount"
            size="small"
            class="input-with-select"
            placeholder="请输入代理昵称"
            clearable
            maxlength="16"
            @keyup.enter.native="handleSearchFilter"
            @clear="handleSearchFilter"
          />
        </el-form-item> -->
        <!-- <el-button slot="append" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
        <el-form-item>
          <el-input v-model="listQuery.parentAgent" size="small" class="input-with-select" placeholder="请输入上级账号"
            clearable @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
        </el-form-item>

        <el-form-item>
          <el-select v-model="listQuery.status" size="small" placeholder="请选择状态" clearable @change="handleSearchFilter">
            <el-option label="待发放" value="2" />
            <el-option label="已发放" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">刷新</el-button>
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
    <!-- <el-form :inline="true">
      <el-form-item>
        <el-button size="small" icon="el-icon-s-promotion" type="primary" @click="Onekeygrant">
          一键发放
        </el-button>
      </el-form-item>
    </el-form> -->
    <el-table v-cloading="listLoading" :data="list" size="mini" :cell-style="cellStyle" fit 
      show-summary sum-text="当前页汇总" highlight-current-row>
      <el-table-column prop="rebateDate" label="日期" min-width="100" />
      <el-table-column prop="" label="代理ID" width="90">
        <template slot-scope="{ row }">
          {{ `${row.agentId}` }}
        </template>
      </el-table-column>
      <el-table-column prop="agentAccount" label="代理账号" min-width="100" />

      <!-- <el-table-column prop="outerNo" label="第三方订单号" min-width="80"  ></el-table-column> -->
      <el-table-column prop="" label="上级代理" width="100">
        <template slot-scope="{ row }">
          {{
            row.pagentAccount == null || row.pagentAccount == undefined
              ? "总代"
              : row.pagentAccount
          }}
        </template>
      </el-table-column>
      <el-table-column prop="" label="代理级别" width="100" :formatter="formatterType" />
      <el-table-column prop="lotteryAmt" label="直播彩票流水" min-width="130" sortable />
      <el-table-column prop="" label="返水点位" min-width="100">
        <template slot-scope="{ row }">
          {{ `${row.rebateRatio}%` }}
        </template>
      </el-table-column>
      <el-table-column prop="rebateAmt" label="返水金额" min-width="100" />
      <el-table-column prop="" label="状态" min-width="100">
        <template slot-scope="{ row }">
          <el-tag v-if="row.status == 2">待发放</el-tag>
          <el-tag v-if="row.status == 3" type="success"> 已发放</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" label="操作" min-width="80">
        <template slot-scope="{ row }">
          <span class="operation_btn" v-if="row.status == 2" type="primary" size="mini" @click="grant(row)">发放返水</span>
        </template>
      </el-table-column> -->
    </el-table>
    <!-- 分页 -->
    <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />

    <el-dialog title="发放时间类型" :visible.sync="dialogCreateVisible" :close-on-click-modal="false" :destroy-on-close="true"
      top="5vh" width="600px">
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form ref="dataForm" :model="createModel" label-position="top" label-width="90px" size="medium">
          <el-form-item prop="agentType" label="发放方式">
            <el-radio-group v-model="createModel.type">
              <el-radio :label="1">按月发放</el-radio>
              <el-radio :label="2">按天发放</el-radio>
            </el-radio-group>
          </el-form-item>
          <div style="display: flex; align-items: center">
            <el-form-item v-if="createModel.type === 1" prop="month" label="按月份发放">
              <el-date-picker v-model="createModel.month" type="month" clearable placeholder="选择发放月份"
                style="width: 100%" value-format="yyyy-MM" @change="createModel.date = null" />
            </el-form-item>
            <el-form-item v-else prop="date" label="按日期发放">
              <el-date-picker v-model="createModel.date" type="date" clearable placeholder="选择发放日期" style="width: 100%"
                value-format="yyyy-MM-dd" @change="createModel.month = null" />
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="(dialogCreateVisible = false), (dialogCreateLoading = false)">取消</el-button>
        <el-button size="medium" type="primary" @click="handleDataClick()">发放</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  agentLotteryRebateRecord,
  giveAllLotteryRebate,
  giveLotteryRebateById,
  agentLotteryRebateRecordExport,
} from '@/api/agentManagement/tabledetail'
import { getNowFormatDay } from '@/utils/tools'
// const NOW_DAY = getNowFormatDay('-')
export default {
  name: 'AgentManagementPlatformFee',
  data() {
    return {
      list: [],
      todayList: null,
      listLoading: true,
      downloadLoading: false,
      dialogCreateVisible: false,
      dialogCreateLoading: false,
      createModel: {
        date: null,
        month: null,
        type: 1,
      },
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        date: ''
      },
      listQueryData() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 20,
          total: 0,
          date: this.getMonth
        }
      },
    }
  },
  computed: {
    getMonth() {
      let noTime = this.$store.getters.timerDate[0]
      return getNowFormatDay('-', true, noTime)
    }
  },
  created() {
    this.listQuery.date = this.getMonth
    this.fetchData()
  },
  methods: {
    formatterType(row) {
      if (row.agentLevel === 1) {
        return '总代'
      } else if (row.agentLevel === 2) {
        return '一级代理'
      } else if (row.agentLevel === 3) {
        return '二级代理'
      } else if (row.agentLevel === 4) {
        return '三级代理'
      } else if (row.agentLevel === 5) {
        return '四级代理'
      }
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
      agentLotteryRebateRecord(this.listQuery)
        .then((res) => {
          this.todayListLoading = false
          this.listLoading = false
          if (res.code === 200) {
            // let data = [];
            // res.rows.forEach((value, index) => {
            //   let a = {
            //     demo5: 0,
            //     demo6: 0,
            //     ...value,
            //   };
            //   value.gamePlatformVOList.forEach((value_1, index_1) => {
            //     a = {
            //       ...a,
            //       [`${value_1.gameTypeName}1`]: value_1.totalProfit,
            //       [`${value_1.gameTypeName}2`]: `${value_1.platformRatio}%`,
            //       [`${value_1.gameTypeName}3`]: value_1.platformAmt,
            //     };
            //     a.demo5 += value_1.totalProfit;
            //     a.demo6 += value_1.platformAmt;
            //   });
            //   data = [...data, a];
            // });
            // console.log(res, data);
            this.list = res.rows
            this.listQuery.total = res.total
          }
        })
        .catch((err) => {
          this.list = null
          this.listQuery.total = 0
          this.listLoading = false
          this.$message.error(err)
        })
    },
    // 导出
    handleDownload() {
      if (this.list.length > 10000) {
        this.$message.error('导出限制10000条范围内')
        return
      }
      this.downloadLoading = true
      agentLotteryRebateRecordExport(this.listQuery) // 导出的接口
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
          link.download = '自彩票返水明细报表'
          document.body.appendChild(link)
          // 模拟点击事件
          link.click() // 设置点击事件
        })
        .catch((err) => {
          this.downloadLoading = false
          // console.log(err);
        })
    },
    // 一键发放
    Onekeygrant() {
      this.dialogCreateVisible = true
    },
    // 发放确定
    handleDataClick() {
      const { date, month, type } = this.createModel
      this.dialogCreateLoading = true
      console.log(this.createModel)
      giveAllLotteryRebate({
        operator: this.$store.state.user.name,
        date: type == 2 ? date : undefined,
        month: type == 1 ? month : undefined,
      })
        .then((item) => {
          // console.log("一键发放", item);
          this.dialogCreateLoading = false
          this.dialogCreateVisible = false
          this.createModel = {
            date: null,
            month: null,
            type: type,
          }
          this.fetchData()
          this.$notify({
            title: '提示',
            message: '操作成功',
            type: 'success',
            duration: 1500,
          })
        })
        .catch((err) => {
          this.dialogCreateLoading = false
          this.$message.error(err)
        })
    },
    // 单条发放
    grant(row) {
      this.$confirm(`确认发放？`, '发放返水', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false,
      }).then(() => {
        giveLotteryRebateById({
          operator: this.$store.state.user.name,
          id: row.id,
        })
          .then((item) => {
            // console.log("成功了没", item);
            this.fetchData()
            this.$notify({
              title: '提示',
              message: '操作成功',
              type: 'success',
              duration: 1500,
            })
          })
          .catch((err) => {
            this.$message.error(err)
          })
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

    // 佣金发放
    showUpdateDialogClick(row) {
      console.log('佣金发放', row)
    },
  },
}
</script>
<style scoped>
.input-with-select {
  background-color: #fff;

  /* .el-input-group__prepend {
                background-color: #fff;
              } */
}
.span_primary {
  margin-right: 10px;
  color: #fc708b;
  cursor: pointer;
}
.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
.color1 {
  color: red;
}
.color2 {
  color: #008000;
}
</style>
