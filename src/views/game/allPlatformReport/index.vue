<template>
  <div class="app-container">
    <div style="border-bottom: 1px solid #eee; margin-bottom: 8px">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" :dateType="2" />

        <!-- <el-form :inline="true">
          <el-form-item>
            <el-tag type="info">日期:</el-tag>
            <el-date-picker v-model="listQuery.pickerValue" size="small" clearable :picker-options="pickerOptions"
              type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right"
              :default-time="['00:00:00', '23:59:59']" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
              @change="handleSearchFilter" />
          </el-form-item>
          <el-form-item>
            重置
            <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
            重置
            <el-button size="small" icon="el-icon-refresh" @click="resets">重置</el-button>
            导出
          </el-form-item>
        </el-form> -->
        <el-button style="transform: translateY(-10px);" size="small" :loading="downloadLoading" type="primary" icon="el-icon-document"
          @click="handleDownload">
          导出Excel
        </el-button>
      </div>
    </div>
    <el-table v-cloading="listLoading" :data="list" size="mini" :cell-style="cellStyle" fit highlight-current-row
       show-summary sum-text="当前页汇总：">
      <el-table-column prop="typeName" label="游戏类型" />
      <el-table-column prop="typeDetail" label="游戏厂商" min-width="80">
        <template slot-scope="{ row }">
          <div v-for="items in row.profitStatisDetailVOS" :key="`${items.typeName}-${items.typeDetail}`"
            class="content-column">
            {{ items.typeDetail }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="profit" label="输赢" min-width="120">
        <template slot-scope="{ row }">
          <div v-for="items in row.profitStatisDetailVOS" :key="`${items.typeName}-${items.typeDetail}`"
            class="content-column">
            {{ items.profit }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="totalProfit" label="输赢总和" min-width="120" sortable />
      <el-table-column prop="Nums" label="投注人数" min-width="120" sortable />
      <!--     :formatter="formatterType" -->
      <!-- <el-table-column
          prop="trueRmbString"
          label="游戏名称"
          min-width="80"
           
        /> -->
      <el-table-column prop="betValidAmt" label="流水" min-width="120">
        <template slot-scope="{ row }">
          <div v-for="items in row.profitStatisDetailVOS" :key="`${items.typeName}-${items.typeDetail}`"
            class="content-column">
            {{ items.betValidAmt }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="totalBetValidAmt" label="流水总和" min-width="120" sortable />
      <!-- <el-table-column
        prop="totalBetValidAmt"
        label="投注有效流水"
        min-width="100"
         
      />
      <el-table-column
        prop="totalProfit"
        label="输赢金额"
        min-width="80"
         
      >
        <template slot-scope="{ row }">
          <div
            :class="
              Number(row.totalProfit) > 0
                ? 'color2'
                : Number(row.totalProfit) < 0
                ? 'color1'
                : ''
            "
          >
            {{ row.totalProfit }}
          </div>
        </template>
      </el-table-column> -->
    </el-table>
  </div>
</template>

<script>
import {
  platformProfitStatis,
  platformProfitStatisExport,
} from '@/api/agentManagement/tabledetail'
import { getNowFormatDay } from '@/utils/tools'

const NOW_TIME_START = getNowFormatDay('-')
export default {
  name: 'AgentManagementAotalWinLose',
  data() {
    return {
      list: [],
      todayList: [],
      listLoading: true,
      downloadLoading: false,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        pickerValue: [`${NOW_TIME_START} 00:00:00`, `${NOW_TIME_START} 23:59:59`],
      },
      listQueryData() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 20,
          total: 0,
          pickerValue: [`${this.getMonth} 00:00:00`, `${this.getMonth} 23:59:59`],
        }
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
    }
  },
  computed: {
    getMonth() {
      let noTime = this.$store.getters.timerDate[0]
      return getNowFormatDay('-', true, noTime)
    }
  },
  created() {
    this.listQuery.pickerValue = [`${this.getMonth} 00:00:00`, `${this.getMonth} 23:59:59`]
    this.fetchData()
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
    // 重置刷新
    resets() {
      this.listQueryData()
      this.fetchData()
    },
    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.todayListLoading = true
      platformProfitStatis({
        startDate:
          this.listQuery.pickerValue != null &&
          this.listQuery.pickerValue[0] !== undefined
            ? this.listQuery.pickerValue[0]
            : null,
        endDate:
          this.listQuery.pickerValue != null &&
          this.listQuery.pickerValue[0] !== undefined
            ? this.listQuery.pickerValue[1]
            : null,
      })
        .then((res) => {
          // Nums
          if (
            res.data.platformProfitStatisVOS &&
            res.data.platformProfitStatisVOS[0] != undefined
          ) {
            res.data.platformProfitStatisVOS.forEach((value, index, array) => {
              let nums = 0
              value.profitStatisDetailVOS.forEach((value_2, index_2) => {
                nums += Number(value_2.num)
              })
              value.Nums = nums
            })
          }

          this.listLoading = false
          this.list = res.data.platformProfitStatisVOS
          // this.listQuery.total = res.total;
        })
        .catch((err) => {
          this.list = []
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
      const data = {
        startDate:
          this.listQuery.pickerValue[0] !== undefined
            ? this.listQuery.pickerValue[0]
            : null,
        endDate:
          this.listQuery.pickerValue[0] !== undefined
            ? this.listQuery.pickerValue[1]
            : null,
      }
      this.downloadLoading = true
      platformProfitStatisExport(data) // 导出的接口
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
          link.download = '平台总输赢报表'
          document.body.appendChild(link)
          // 模拟点击事件
          link.click() // 设置点击事件
        })
        .catch((err) => {
          this.downloadLoading = false
          console.log(err)
        })
    },

    // 过滤
    handleSearchFilter() {
      console.log(this.listQuery)

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

    // 切换
    Check(data) {
      console.log('这是什么数据', data)
      this.selectTime.forEach((item) => {
        if (item.name === data.name) {
          item.Check = true
        } else {
          item.Check = false
        }
      })
    },
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
  },
}
</script>
<style lang="scss" scoped>
.input-with-select {
  background-color: #fff;
  width: auto;
  /* .el-input-group__prepend {
      background-color: #fff;
    } */
}
::v-deep .el-table tr td {
  padding: 0;
}
::v-deep .el-table .cell {
  padding: 0;
}
.el-form-item {
  margin-bottom: 8px;
}
.content-column {
  line-height: 24px;
  border-top: 1px solid #eee;
}
.content-column:first-child {
  border: 0;
}
.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}

.Check1 {
  background: linear-gradient(128deg, #eb9bff 0%, #e067ff 37%, #5e29e0 100%);
  border-radius: 5px;
  border: none;
  font-size: 14px;
  color: #fff;
}
.Check2 {
  background: #f5f7fe;
  border-radius: 5px;
  border: none;

  font-size: 14px;
  color: #333333;
  &:hover {
    background: #d3d4da;
    color: #514b4b;
  }
}

.color1 {
  color: #008000;
}
.color2 {
  color: red;
}
.el-date-editor .el-range-separator {
  width: 16px;
}
</style>
