<template>
  <div class="app-container">
    <el-form :inline="true" @submit.native.prevent>
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          class="input-with-select"
          placeholder="请输入用户ID"
          clearable
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-search"
          type="primary"
          @click="handleSearchFilter"
        >搜索</el-button>
        <!-- 重置 -->
        <el-button size="small" icon="el-icon-refresh" @click="resets">重置</el-button>
        <!-- 导出 -->
        <!-- <el-button
          size="small"
          :loading="downloadLoading"
          type="success"
          icon="el-icon-document"
          @click="handleDownload"
        >
          导出Excel
        </el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
      :cell-style="cellStyle"
      fit
      highlight-current-row
    >
      <el-table-column type="index" label="序号" width="60"   />
      <el-table-column
        prop="uid"
        label="用户ID"
        min-width="120"
         
      >
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column
        prop="os"
        label="设备类型"
        min-width="80"
         
      >
        <template slot-scope="{ row }">
          <span>{{
            row.os == 1
              ? "安卓"
              : row.os == 2
                ? "苹果"
                : row.os == 3
                  ? "安卓"
                  : row.os == 4
                    ? "苹果"
                    : row.os == 5
                      ? "h5"
                      : row.os == 6
                        ? "web"
                        : "其他"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="用户昵称"
        min-width="80"
         
      />
      <el-table-column
        prop="userType"
        label="用户标签"
        min-width="80"
         
      >
        <template slot-scope="{ row }">
          {{ labelOptionListF(row) }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="outerNo" label="第三方订单号" min-width="80"  ></el-table-column> -->
      <el-table-column
        prop="udid"
        label="设备编号"
        min-width="130"
         
      />
      <el-table-column
        prop="ip"
        label="IP地址"
        min-width="100"
         
      />
      <el-table-column
        prop="gmtCreate"
        label="时间"
        min-width="120"
         
      >
        <template slot-scope="{ row }">
          {{ formatMyTime(row.gmtCreate) }}
        </template>
      </el-table-column></el-table>
    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.pageNum"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import {
  queryUserLoginLogList
  //   addCommissionModifyTable,
  //   commissionModifyRecordExport,
} from '@/api/center/user/assetsEquipmentLogin'
import { formatUnixTime } from '@/utils/tools'
import { getUserCategoryList } from '@/api/center/assets/assets'
import UserDrawer from '@/components/UserDrawer'

export default {
  name: 'AgentManagementAdjustment',
  components: {
    UserDrawer
  },
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
        uid: null,
        ip: null
      },
      listQueryData() {
        this.listQuery = {
          pageNum: 1,
          pageSize: 20,
          total: 0,
          uid: null,
          ip: null
        }
      },
      // 状态选择
      statusOptions: [
        { label: '未支付', value: 0 },
        { label: '已支付', value: 1 }
      ],

      dialogStatus: '',
      dialogTitleMap: {
        update: '编辑代理',
        create: '代理佣金调整'
      },
      operator: null,
      labelOptionList: []
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
    formatMyTime(time) {
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
    // 用户标签
    labelOptionListF(row) {
      let a = ''
      this.labelOptionList.forEach((value, index, array) => {
        if (value.code == row.userType) {
          a = value.categoryName
        }
      })
      return a
    },
    // 重置刷新
    resets() {
      this.listQueryData()
      this.fetchData()
    },
    // 获取列表数据
    async fetchData() {
      this.listLoading = true
      this.todayListLoading = true
      if (!this.labelOptionList.length) {
        const res = await getUserCategoryList({})
        this.labelOptionList = res.data || []
      }
      queryUserLoginLogList(this.listQuery)
        .then((res) => {
          this.listLoading = false
          this.todayListLoading = false
          this.list = res.data.list
          this.listQuery.total = res.data.total
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
      // commissionModifyRecordExport(this.listQuery) // 导出的接口
      //   .then((result) => {
      //     this.downloadLoading = false
      //     console.log(result)
      //     const link = document.createElement('a') // 创建a标签
      //     const blob = new Blob([result], {
      //       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      //     }) // 设置文件流
      //     link.style.display = 'none'
      //     // 设置连接
      //     link.href = URL.createObjectURL(blob) // 将文件流转化为blob地址
      //     link.download = '佣金调整明细报表'
      //     document.body.appendChild(link)
      //     // 模拟点击事件
      //     link.click() // 设置点击事件
      //   })
      //   .catch((err) => {
      //     this.downloadLoading = false
      //     console.log(err)
      //   })
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
        showClose: false
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
    }
  }
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
