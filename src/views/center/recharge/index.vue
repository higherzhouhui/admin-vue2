<template>
    <div class="app-container">
        <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="listQuery.activityConfigId" size="small" placeholder="请输入活动ID" clearable
                    @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
            </el-form-item>
            <el-form-item>
                <el-input v-model="listQuery.uid" size="small" placeholder="请输入用户ID" clearable
                    @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
            </el-form-item>
            <!-- <el-form-item>
                <el-select v-model="listQuery.distributionMethod" size="small" placeholder="请选择发放方式" clearable
                    @change="handleSearchFilter">
                    <el-option :label="'自动发放'" :value="1" />
                    <el-option :label="'手动发放'" :value="2" />
                </el-select>
            </el-form-item> -->
            <el-form-item>
                <el-select v-model="listQuery.status" size="small" placeholder="请选择状态" clearable
                    @change="handleSearchFilter">
                    <el-option :label="'待发放'" :value="3" />
                    <el-option :label="'待领取'" :value="2" />
                    <el-option :label="'已领取'" :value="1" />
                    <el-option :label="'已过期'" :value="-1" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- <el-form :inline="true">
            <el-form-item>
                <el-button size="small" type="primary" @click="oneClickRelease()">
                    一键发放</el-button>
            </el-form-item>
        </el-form> -->
        <!-- 送彩票表单 -->
        <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column prop="activityConfigId" label="活动id" width="90" />
            <el-table-column prop="activityName" label="活动名称" min-width="120" />
            <el-table-column prop="distributionMethod" label="发放方式" min-width="100">
                <template slot-scope="{ row }">
                    <el-tag size="medium" type="primary">
                        <!-- {{ 
                        ['自动发放', '手动发放'][row.distributionMethod - 1] 
                        }} -->
                        自动发放
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="uid" label="用户id" min-width="120" />
            <el-table-column prop="userName" label="用户名" min-width="120" />
            <el-table-column prop="rechargeAmount" label="充值金额" min-width="160" />
            <el-table-column prop="level" label="用户等级" min-width="80" />
            <el-table-column prop="nobleLevel" label="贵族" min-width="50" >
                <template slot-scope="{ row }">
                    {{ row.nobleLevel || '-' }}
                </template>
            </el-table-column>
            <el-table-column prop="deliveryWinningsAmount" label="派送彩金" min-width="130" />
            <el-table-column prop="handsel" label="状态" min-width="100">
                <template slot-scope="{ row }">
                    <el-tag size="medium" type="primary">{{ ['已过期', '', '已领取', '待领取', '待发放'][ parseInt(row.status) + 1] }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="150">
                <template slot-scope="{ row }">
                    {{ formatUnixTime(row.createTime) }}
                </template>
            </el-table-column>
            <el-table-column prop="distributionTime" label="发放时间" width="150" >
                <template slot-scope="{ row }">
                    {{ formatUnixTime(row.distributionTime) }}
                </template>
            </el-table-column>
            <el-table-column :label="'操作'" width="100" fixed="right">
                <template slot-scope="{ row }">
                    <!-- <span class="operation_btn" plain type="primary" size="mini"
                        @click="oneClickRelease(row.id)">手动发放</span> -->
                </template>
            </el-table-column>
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
import {
    listPromotionRechargeRecord,
} from '@/api/center/recharge'
export default {
    name: "CenterRechargeIndex",
    filters: {
        statusFilter(status) {
            const map = { 0: "info", 2: "success", 3: "danger" };
            return map[status];
        },
    },
    data() {
        return {
            list: null,
            listLoading: false,
            listQuery: {
                activityConfigId: null,
                page: 1,
                limit: 20,
                total: 0,
                distributionMethod: null,
                uid: null,
                status: null,
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
        formatUnixTime,
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
            this.listLoading = true;
            if (this.listQuery.pickerValue.length) {
                this.listQuery.startTime = this.listQuery.pickerValue[0]
                this.listQuery.endTime = this.listQuery.pickerValue[1]
            }
            listPromotionRechargeRecord({
                ...this.listQuery
            })
                .then((res) => {
                    this.listLoading = false
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
        // 一键发放
        oneClickRelease(id) {
            this.$confirm(`确认${id ? "" : "一键"}发送奖励吗？`, "发送奖励", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                showClose: false,
            })
                .then(async () => {
                    this.$notify({
                        title: '提示',
                        message: '派发成功',
                        type: 'success',
                        duration: 1500
                    })
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消彩金发放",
                    });
                });
        }
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
  