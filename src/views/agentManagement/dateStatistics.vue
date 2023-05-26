<template>
    <div class="app-container">
        <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="listQuery.agentId" size="small" placeholder="请输入代理ID" clearable
                    @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 送彩票表单 -->
        <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column prop="agentId" label="代理id" width="150" />
            <el-table-column prop="rechargeNum" label="存款人数" />
            <el-table-column prop="firstNum" label="首存人数" />
            <el-table-column prop="withdrawNum" label="取款人数" />
            <el-table-column prop="rechargeCoin" label="存款金额" />
            <el-table-column prop="withdrawCoin" label="取款金额" />
            <el-table-column prop="betNum" label="投注人数" />

        </el-table>
        <!-- 分页 -->
        <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
            :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        <div>
            <div v-for="(item, index) in arr" :key="index" style="display: flex;">
                <div v-for="(value, iindex) in item" :key="iindex"
                    style="width: 20px; border-radius: 50%; height: 20px; background-color: green;" :style="{ backgroundColor: value == 1 ? 'red' : value == 2 ? 'blue' : '' }
                    "></div>
            </div>
        </div>
    </div>
</template>
  
<script>
import { dailyReport } from '@/api/agentManagement/dateStatistics'
import { emptyS, nullS, formatUnixTime, getDateTime } from "@/utils/tools";
export default {
    name: "DateStatistics",
    data() {
        return {
            list: null,
            listLoading: false,
            arr: [],

            listQuery: {
                pageNum: 1,
                pageSize: 20,
                total: 0,
                agentId: null,
                pickerValue: [],
            },
        };
    },
    computed: {
        initTimer() {
            return this.$store.getters.timerDate
        }
    },
    created() {
        this.listQuery.pickerValue = this.initTimer
        this.fetchData();
    },
    methods: {
        reset() {
            this.listQuery = {
                pageNum: 1,
                pageSize: 20,
                pickerValue: this.initTimer
            }
            this.fetchData()
        },
        // 获取列表数据
        fetchData() {
            this.listLoading = true;
            if(this.listQuery.pickerValue && this.listQuery.pickerValue.length) {
                this.listQuery.startTime = this.listQuery.pickerValue[0]
                this.listQuery.endTime = this.listQuery.pickerValue[1]
            }
            dailyReport(this.listQuery).then(res => {
                this.listLoading = false;
                if (res.code === 200) {
                    this.list = res.rows;
                    this.listQuery.total = res.total;
                }
            }).catch(err => {
                this.list = null;
                this.listQuery.total = 0;
                this.listLoading = false;
                this.$message.error(err);
            })
            // this.listLoading = true;
        },

        // 过滤
        handleSearchFilter() {
            this.listQuery.pageNum = 1;
            this.fetchData();
        },

        // 每页的条数改变
        handleSizeChange(val) {
            this.listQuery.pageSize = val;
            this.listQuery.pageNum = 1;
            this.fetchData();
        },

        // 当前页改变
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.fetchData();
        },
    },
};
</script>
<style scoped>
.input-with-select {
    background-color: #fff;
    width: 300px;
    margin-right: 10px;

    /* .el-input-group__prepend {
      background-color: #fff;
    } */
}

.vue-pagination {
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 0px;
    padding: 0px;
}
</style>
  