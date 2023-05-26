<template>
  <div class="app-container">
    <!--  <el-button size="medium" type="primary" icon="el-icon-edit-outline" @click="showChangeDialogClick()">设置用户流水</el-button>
        <el-button size="medium" type="primary" icon="el-icon-edit-outline" @click="showChangeActivityDialogClick()">清除用户活动流水</el-button> -->

    <el-form :inline="true">
      <!-- <el-form-item>
        <router-link to="/user/center/user/assets/index">
          <el-button
            size="small"
            type="success"
            icon="el-icon-plus"
          >
            绑定/修改代理ID
          </el-button>

        </router-link>
      </el-form-item> -->
      <el-form-item>
        <!-- <el-tag type="info">用户ID:</el-tag> -->
        <el-input
          v-model="listQuery.uid"
          size="small"
          style="width: 130px"
          class="input-with-select"
          placeholder="请输入用户ID"
          clearable
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <!-- <el-tag type="info">手机号:</el-tag> -->
        <el-input
          v-model="listQuery.phone"
          size="small"
          style="width: 130px"
          class="input-with-select"
          placeholder="请输入手机号"
          clearable
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <!-- <el-tag type="info">原代理ID:</el-tag> -->
        <el-input
          v-model="listQuery.oldAgentId"
          size="small"
          style="width: 140px"
          class="input-with-select"
          placeholder="原代理账号"
          clearable
          maxlength="10"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <!-- <el-tag type="info">当前代理ID:</el-tag> -->
        <el-input
          v-model="listQuery.newAgentId"
          size="small"
          style="width: 170px"
          class="input-with-select"
          placeholder="当前代理账号"
          clearable
          maxlength="10"
          type="number"
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
        >刷新</el-button>
        <!-- 重置 -->
        <el-button size="small" icon="el-icon-refresh" @click="resets" >
        重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
     >
      <el-table-column type="index" label="序号" width="60"   />
      <el-table-column label="用户ID" min-width="90" prop="uid"   />
      <el-table-column
        prop="phone"
        label="手机号"
        min-width="90"
         
      />
      <el-table-column
        prop="channelUrl"
        label="渠道下载地址"
        min-width="100"
         
      />
      <el-table-column
        prop="oldAgentId"
        label="原代理ID"
        min-width="60"
         
      />
      <el-table-column
        prop="newAgentId"
        label="当前代理ID"
        min-width="100"
         
      />
      <el-table-column
        prop="status"
        label="状态"
        min-width="60"
         
      >
        <template slot-scope="{ row }">
          <el-tag :type="row.status ? 'success' : 'danger'">{{ row.status ? '成功' : '失败' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateUserName"
        label="修改人"
        min-width="60"
         
      />
      <el-table-column
        label="备注"
        min-width="120"
         
      >
        <template slot-scope="{ row }">
          <div style="max-height: 150px; overflow: auto;">{{ row.remakes }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间"
        min-width="100"
         
      >
        <template slot-scope="{ row }">
          {{ handleTimeZoneShow(row.updateTime) }}
        </template>
      </el-table-column>
    </el-table>

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
  queryUpdateAgentList
} from '@/api/agentManagement/agentManagement'
import { formatUnixTime } from '@/utils/tools'

export default {
  name: 'AgentManagementModifyrecordAgentid',
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        total: 0,
        uid: null,
        agentId: null
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 刷新
    resets() {
      this.list = null
      this.listQuery = {
        pageNum: 1,
        pageSize: 20,
        total: 0
      }
      this.fetchData()
    },
    // 重新设置表单数据
    resetChangeModel() {
      this.changeModel = {
        uid: null,
        turnover: null
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      const obj = {}
      Object.keys(this.listQuery).map(item => {
        if (this.listQuery[item]) {
          obj[item] = this.listQuery[item]
        }
      })
      this.listQuery = { ...obj }
      queryUpdateAgentList(this.listQuery).then(res => {
        this.listLoading = false
        this.list = res.rows
        this.listQuery.total = res.total
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
    handleTimeZoneShow(time) {
      return formatUnixTime(time)
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
</style>
