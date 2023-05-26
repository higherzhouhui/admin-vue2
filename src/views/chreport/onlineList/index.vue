<template>
    <div class="app-container">
        <div>
            <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
        </div>


        <el-table v-cloading="listLoading" :data="list" size="mini">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="onlineUserNum" label="在线人数" />
            <el-table-column prop="reportDate" label="统计时间" />
        </el-table>

        <!-- 分页 -->
        <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
            :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </div>
</template>
    
<script>
import { dayStatis } from '@/api/report/onlineList'
import { getDateTime } from '@/utils/tools'
// const { NOW_TIME_START, NOW_TIME_END } = getDateTime()
export default {
    name: 'ChReportLiveprofitIndex',
    data() {
        return {
            list: [],
            listLoading: true,
            listQuery: {
                pageNum: 1,
                pageSize: 20,
                pickerValue: [],
            },
            totalList: {},
            downloadLoading: false,
            currentTotal: [], //当前页收益
            allPageTotal: [],
            allEl: null,
        }
    },
    created() {
        this.listQuery.pickerValue = this.initTimer
        this.fetchData()
    },

    computed: {
        initTimer() {
            return this.$store.getters.timerDate
        }
    },
    methods: {
        // 过滤
        handleSearchFilter() {
            this.listQuery.pageNum = 1
            this.fetchData()
        },
        // 获取列表数据
        async fetchData() {
            this.listLoading = true
            // 请求服务器
            try {
                if (this.listQuery.pickerValue && this.listQuery.pickerValue.length) {
                    this.listQuery.startTime = this.listQuery.pickerValue[0]
                    this.listQuery.endTime = this.listQuery.pickerValue[1]
                } else {
                    delete this.listQuery.startTime
                    delete this.listQuery.endTime
                }
                const res = await dayStatis(this.listQuery)
                this.list = res.data.list
                this.listQuery.total = res.data.total || 0
                this.listLoading = false
            } catch (error) {
                this.list = null
                this.listQuery.total = 0
                this.listLoading = false
                this.$message.error(error)
            }
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
        }

    },
}
</script>