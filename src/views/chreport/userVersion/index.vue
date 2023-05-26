<template>
    <div class="app-container">
        <div>
            <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="listQuery.softVersion" size="small" class="input-with-select" placeholder="请输入版本号"
                        clearable maxlength="16" @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
                </el-form-item>
                <el-form-item>
                    <el-select v-model="listQuery.os" size="small" placeholder="请选择设备" clearable
                        @change="handleSearchFilter">
                        <el-option :label="item.label" v-for="(item, index) in typeList" :key="index" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" icon="el-icon-search" type="primary" @click="handleSearchFilter">搜索</el-button>
                    <!-- 重置 -->
                    <el-button size="small" icon="el-icon-refresh" @click="resets">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table v-cloading="listLoading" :data="list" size="mini">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="mergeDay" label="统计日期" />
            <el-table-column prop="softVersion" label="版本号" />
            <el-table-column prop="os" label="设备类型">
                <template slot-scope="{row}">
                    {{ row.os | getPlat }}
                </template>
            </el-table-column>
            <el-table-column prop="loginNum" label="登录人数" />

        </el-table>

        <!-- 分页 -->
        <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
            :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </div>
</template>
    
<script>
import { report } from '@/api/chreport/userVersion'
const typeList = [
    { value: 1, label: '安卓' },
    { value: 2, label: '苹果' },
    { value: 3, label: '安卓主播' },
    { value: 4, label: '苹果主播' },
    { value: 5, label: 'H5' },
    { value: 6, label: 'WEB' }]
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
                softVersion: null,
                os: null
            },
            typeList,
            totalList: {},
            downloadLoading: false,
            currentTotal: [], //当前页收益
            allPageTotal: [],
            allEl: null,
            listQueryData() {
                this.listQuery = {
                    pageNum: 1,
                    pageSize: 20,
                    pickerValue: this.initTimer,
                    softVersion: null,
                    os: null
                };
            },
        }
    },
    filters: {
        getPlat(value) {
            // 1安卓 2苹果 3安卓主播 4苹果主播 5 H5 6 web
            let name = '其他'
            typeList.some(item => {
                if (item.value == value) {
                    name = item.label
                    return true
                }
            })
            return name
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
        resets() {
            this.listQueryData();
            this.fetchData();
        },
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
                const res = await report(this.listQuery)
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