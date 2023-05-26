<template>
  <div class="app-container">
    <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
    <el-form :inline="true">
      <!-- <el-form-item>
        <span class="search_info">创建时间:</span>
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
          value-format="timestamp"
          @change="handleSearchFilter"
        />
      </el-form-item> -->
      <el-form-item>
        <el-input
          v-model="listQuery.srcId"
          size="small"
          style="width: 240px"
          placeholder="请输入送礼者ID"
          clearable
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.uid"
          size="small"
          style="width: 240px"
          placeholder="请输入收礼者ID"
          clearable
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.orderId"
          style="width: 200px"
          size="small"
          placeholder="请输入订单号"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="listQuery.goldCoin"
          size="small"
          style="width: 240px"
          placeholder="请输入超过多少金币"
          clearable
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        />
      </el-form-item>

      <el-form-item>
        <el-select v-model="listQuery.status" style="width: 200px" size="small" placeholder="请选择支付状态" clearable @change="handleSearchFilter">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <!-- 多选礼物 -->
      <!--        <el-select size="small" style="width: 300px;" v-model="listQuery.gid" multiple filterable clearable placeholder="请输入或选择礼物" @clear="handleSearchFilter">
          <el-option v-for="item in propOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
        </el-select> -->
      <!--   <el-button plain size="small" slot="suffix" icon="el-icon-search" @click="handleSearchFilter"></el-button> -->
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchFilter"
        >搜索</el-button>
        <el-button
          size="small"
          icon="el-icon-refresh"
          @click="refreshData()"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column
        prop="gname"
        label="礼物名称"
        min-width="120"
      />
      <el-table-column label="礼物封面" width="80">
        <template slot-scope="{ row }">
          <el-image class="vue-img-preview" :src="row.cover" fit="contain" lazy>
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="trn"
        label="订单号"
        min-width="160"
      />
      <el-table-column
        prop="num"
        label="送出数量"
        min-width="100"
        sortable
      />
      <el-table-column
        prop="goldCoin"
        label="金币"
        min-width="70"
        sortable
      />
      <el-table-column label="送礼者" min-width="200">
        <template slot-scope="{ row }">
          <user-drawer
            :uid="row.srcUid"
            :show-text="`${row.bName} (${row.srcUid})`"
          />
        </template>
      </el-table-column>
      <el-table-column label="收礼者" min-width="200">
        <template slot-scope="{ row }">
          <user-drawer
            :uid="row.uid"
            :show-text="`${row.aName} (${row.uid})`"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="anchorCoin"
        label="主播获得魅力"
        min-width="140"
        sortable
      />
      <el-table-column
        prop="bossCoin"
        label="家族长获得魅力"
        min-width="140"
        sortable
      />
      <el-table-column
        prop="payStatusString"
        label="支付状态"
        width="160"
      />
      <el-table-column
        prop="pushStatusString"
        label="发放方式"
        width="160"
      />
      <el-table-column
        prop="gmtCreateString"
        label="创建时间"
        width="160"
      />
    </el-table>

    <el-table
      v-cloading="todayListLoading"
      :data="todayList"
      highlight-current-row
      size="mini"
    >
      <el-table-column prop="" label="" width="60" />
      <el-table-column prop="" label="" width="80" />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column prop="" label="" min-width="60" />
      <el-table-column
        prop="sendTotal"
        label="送出的总金币"
        min-width="140"
      />
      <el-table-column prop="" label="" min-width="100" />
      <el-table-column
        prop="anchorTotal"
        label="主播获得的总魅力值"
        min-width="140"
      />
      <el-table-column
        prop="bossTotal"
        label="家族长获得的总魅力值"
        min-width="140"
      />
      <el-table-column prop="" label="" width="160" />
    </el-table>

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
import {
  getLiveUserReceiveLogList,
  getReceiveLogTotal
} from '@/api/live/receive_log'
import { getPropList } from '@/api/config/prop'
import { emptyS, nullS, formatUnixTime, getDateTime } from '@/utils/tools'
import UserDrawer from '@/components/UserDrawer'
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
  name: 'LiveUserReceiveLogPage',
  filters: {},
  components: {
    UserDrawer
  },
  data() {
    return {
      list: [],
      todayList: [],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        gid: null,
        uid: null,
        srcId: null,
        goldCoin: null,
        pickerValue: [],
        orderId: null
      },
      // 道具选择
      propOptions: [],
      statusOptions: [
        { label: '全部', value: '' },
        { label: '扣款失败', value: -1 },
        { label: '支付成功未分配给主播', value: 0 },
        { label: '成功', value: 1 },
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
    initTimer() {
      return this.$store.getters.timerDate
    }
  },
  created() {
    this.listQuery.pickerValue = this.initTimer
    // const curr_timestamp = Date.parse(new Date());
    // 设置默认时间
    // const curr_0_timestamp = new Date(
    //   new Date().toLocaleDateString()
    // ).getTime();
    // const curr_24_timestamp = curr_0_timestamp + 24 * 3599 * 1000;
    // this.listQuery.pickerValue = [curr_0_timestamp, curr_24_timestamp];
    // 获取数据
    this.fetchData()
  },
  methods: {
    // 刷新
    refreshData() {
      // const curr_0_timestamp = new Date(
      //   new Date().toLocaleDateString()
      // ).getTime();
      // const curr_24_timestamp = curr_0_timestamp + 24 * 3600 * 1000;
      this.listQuery = {
        page: 1,
        limit: 20,
        total: 0,
        gid: null,
        uid: null,
        srcId: null,
        orderId: null,
        pickerValue: this.initTimer
      }
      this.fetchData()
    },

    // 获取列表数据
    fetchData() {
      this.todayListLoading = true
      this.listLoading = true
      this.propOptions = []

      // 读取道具列表
      // getPropList({})
      //   .then(res => {
      //     this.propOptions = (res.data.list || []).map(item => {
      //       return {
      //         label: nullS(item.gname),
      //         cover: nullS(item.cover),
      //         value: item.gid || 0
      //       };
      //     });
      //     return ;
      //   })
      getReceiveLogTotal(
        this.listQuery
      )
        .then((res) => {
          var totallist = []
          if (
            res.data != null &&
            res.data != undefined &&
            JSON.stringify(res.data) != '{}'
          ) {
            totallist.push(res.data)
          }
          this.todayList = totallist
          this.todayListLoading = false
        }).catch((err) => {
          this.todayList = []
          this.todayListLoading = false
          this.$message.error(err)
        })
      getLiveUserReceiveLogList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery
      ).then((res) => {
        this.listLoading = false
        this.list = (res.data != null ? res.data.list : []).map((item) => {
          this.$set(item, 'gmtCreateString', formatUnixTime(item.gmtCreate))
          // 支付状态-1 支付扣款失败， 0 支付成功未分配金额给主播，1 支付成功已分配给主播
          let payStatusString = '扣款失败'
          if (item.status == -1) {
            payStatusString = '扣款失败'
          } else if (item.status == 0) {
            payStatusString = '支付成功未分配给主播'
          } else if (item.status == 1) {
            payStatusString = '成功'
          }
          this.$set(item, 'payStatusString', payStatusString)
          // 收益发放方式0 系统默认发放收益，1 定时任务发放收益
          let pushStatusString = '系统默认发放'
          if (item.pushStatus == 0) {
            pushStatusString = '系统默认发放'
          } else if (item.pushStatus == 1) {
            pushStatusString = '定时任务发放'
          }
          this.$set(item, 'pushStatusString', pushStatusString)
          // for (let prop of this.propOptions) {
          //   if (prop.value == item.gid) {
          //     this.$set(item, 'cover', prop.cover);
          //     this.$set(item, 'gname', prop.label);
          //     break;
          //   }
          // }
          return item
        })
        this.listQuery.total = res.data != null ? res.data.total : 0
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
  margin: 20px 0px;
  padding: 0px;
}

.vue-img-preview {
  width: 60px;
  height: 60px;
  margin: 0px;
  padding: 0px;
  border-radius: 3px;
}
</style>
