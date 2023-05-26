<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" :dateType="4" />
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
          format="yyyy-MM-dd HH:mm"
          :default-time="['00:00:00', '23:59:59']"
          value-format="yyyyMMdd"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <!-- 状态 -->
        <el-select
          v-model="listQuery.status"
          size="small"
          placeholder="请选择状态"
          clearable
          @change="handleSearchFilter"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchFilter"
        >搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          icon="el-icon-refresh"
          @click="refreshData"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-cloading="listLoading"
      :data="list"
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60"   />
      <el-table-column label="主播ID" min-width="80"  >
        <template slot-scope="{ row }">
          <user-drawer :uid="row.uid" />
        </template>
      </el-table-column>
      <el-table-column
        prop="nickname"
        label="主播昵称"
        min-width="80"
         
      />
      <el-table-column label="主播头像" width="80"  >
        <template slot-scope="{ row }">
          <el-image
            class="vue-img-preview"
            :src="row.avatar"
            fit="contain"
            lazy
            @click="reloadAvatar(row)"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="rankValue"
        label="贡献值"
        min-width="100"
         
        sortable
      />
    </el-table>
  </div>
</template>

<script>
import { getPkList } from '@/api/live/pk'

import { emptyS, nullS, formatUnixTime, getNowFormatDay } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
// const NOW_TIME_START = getNowFormatDay()

export default {
  name: 'LiveDayRankController',
  filters: {},
  components: {
    UserDrawer
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        status: 1,
        pickerValue: []
      },

      statusOptions: [
        { value: 1, label: '日榜' },
        { value: 2, label: '周榜' },
        { value: 3, label: '月榜' }
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
    getMonth() {
      let noTime = this.$store.getters.timerDate[0]
      return getNowFormatDay('', true, noTime)
    }
  },
  created() {
    this.listQuery.pickerValue = [this.getMonth, this.getMonth]
    this.fetchData()
  },
  methods: {
    // 刷新
    refreshData() {
      this.listQuery = {
        status: 1,
        page: 1,
        limit: 20,
        pickerValue: [this.getMonth, this.getMonth]
      }
      setTimeout(() => {
        this.fetchData()
      }, 80)
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      this.familyList = null
      getPkList(this.listQuery)
        .then((res) => {
          this.list = (res.data.list || []).map((item) => {
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
