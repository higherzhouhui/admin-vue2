<template>
    <div class="app-container">
        <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
        <el-form :inline="true">
            <el-form-item>
                <el-select v-model="listQuery.status" size="small" placeholder="请选择游戏名称" clearable
                    @change="handleSearchFilter">
                    <el-option v-for="(item, index) in gameMap" :label="item.label" :value="item.value" :key="index" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="listQuery.status" size="small" placeholder="请选择统计周期" clearable
                    @change="handleSearchFilter">
                    <el-option v-for="(item, index) in timeMap" :label="item.label" :value="item.value" :key="index" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <el-form :inline="true">
            <el-form-item>
                <el-button size="small" type="primary" @click="oneClickRelease()">
                    一键发放</el-button>
            </el-form-item>
        </el-form>
        <!-- 送彩票表单 -->
        <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column type="activityId" label="统计周期" width="90" />
            <el-table-column prop="handsel" label="游戏名称" min-width="100">
                <template slot-scope="{ row }">
                    <el-tag size="medium" type="primary">{{ gameMap[row.status].label }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="uid" label="下注人数" min-width="120" />
            <el-table-column prop="uid" label="下注笔数" min-width="120" />
            <el-table-column prop="uid" label="下注金额（金币）" min-width="120" />
            <el-table-column prop="uid" label="人均下注金额（金币）" min-width="120" />
        </el-table>
        <!-- 分页 -->
        <el-pagination class="vue-pagination" background :current-page="listQuery.page"
            :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
            layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </div>
</template>
  
<script>
import { emptyS, nullS, formatUnixTime, getDateTime } from "@/utils/tools";
export default {
    name: "ChRecharge",
    filters: {
        statusFilter(status) {
            const map = { 0: "info", 2: "success", 3: "danger" };
            return map[status];
        },
    },
    data() {
        return {
            gameMap: [
                { value: '1', label: '一分快三' },
                { value: 2, label: '五分快三' },
                { value: 3, label: '骰宝' },
                { value: 4, label: '赛车' },
                { value: 5, label: '彩蝶' },
                { value: 6, label: '鱼虾蟹' },
                { value: 7, label: 'PK10' },
                { value: 8, label: '5D' },
                { value: 9, label: 'Mark6' },
            ],
            timeMap: [
                { value: 1, label: '天' },
                { value: 2, label: '时' },
                { value: 3, label: '分' },
            ],
            list: null,
            listLoading: false,
            listQuery: {
                activityId: null,
                page: 1,
                limit: 20,
                total: 0,
                cpName: null,
                uid: null,
                status: null,
                type: null,
                pickerValue: [],
                status: null
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
                page: 1,
                limit: 20,
                pickerValue: this.initTimer
            }
            this.fetchData()
        },
        // 获取列表数据
        fetchData() {
            // this.listLoading = true;
        },

        // 过滤
        handleSearchFilter() {
            this.listQuery.page = 1;
            this.fetchData();
        },

        // 每页的条数改变
        handleSizeChange(val) {
            this.listQuery.limit = val;
            this.listQuery.page = 1;
            this.fetchData();
        },

        // 当前页改变
        handleCurrentChange(val) {
            this.listQuery.page = val;
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
  