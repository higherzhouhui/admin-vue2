<template>
    <div class="app-container">
        <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="listQuery.uid" size="small" placeholder="请输入用户ID" clearable
                    @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
            </el-form-item>
            <el-form-item>
                <el-select v-model="listQuery.awardStatus" size="small" placeholder="请选择开奖状态" clearable
                    @change="handleSearchFilter">
                    <el-option :label="'未开奖'" :value="0" />
                    <el-option :label="'未中奖'" :value="1" />
                    <el-option :label="'已中奖'" :value="2" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="listQuery.payMethod" size="small" placeholder="请选择派奖方式" clearable
                    @change="handleSearchFilter">
                    <el-option :label="'未派发'" :value="0" />
                    <el-option :label="'正常派发'" :value="1" />
                    <el-option :label="'人工派发'" :value="2" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="listQuery.issue" size="small" placeholder="请输入彩票期号" clearable
                    @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
                <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <el-form :inline="true">
            <el-form-item>
                <el-button size="small" type="primary" @click="showResultCard()">
                    开奖号码</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="small" @click="showCreateDialogClick()">活动配置</el-button>
            </el-form-item>
        </el-form>
        <!-- 送彩票表单 -->
        <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
            <el-table-column type="index" label="序号" width="50" />
            <el-table-column prop="uid" label="用户id" min-width="120" />
            <el-table-column prop="playNum" label="投注详情" min-width="200" />
            <el-table-column prop="issue" label="彩票期号" min-width="130" />
            <el-table-column prop="openResult" label="开奖号码" min-width="130" />
            <el-table-column prop="realProfitAmount" label="派彩金额" min-width="100" />
            <el-table-column prop="awardStatus" label="中奖状态" min-width="100">
                <template slot-scope="{ row }">
                    {{ row.awardStatus == 1 ? '未中奖' : row.awardStatus == 2 ? '已中奖' : "未开奖" }}
                </template>
            </el-table-column>
            <el-table-column prop="payMethod" label="派奖方式" min-width="100">
                <template slot-scope="{ row }">
                    {{ ['未派发', '正常派发', '人工派发'][row.payMethod] }}
                </template>
            </el-table-column>
            <el-table-column prop="trn" label="交易编号" min-width="150" />
            <el-table-column prop="trnAward" label="派奖交易编号" min-width="150" />
            <el-table-column prop="createTime" label="创建时间" width="150">
                <template slot-scope="{ row }">
                    {{ formatUnixTime(row.createTime) }}
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="150">
                <template slot-scope="{ row }">
                    {{ formatUnixTime(row.updateTime) }}
                </template>
            </el-table-column>
        </el-table>
        <!-- 活动配置 -->
        <el-dialog title="活动配置" :visible.sync="dialogCreateVisible" :close-on-click-modal="false" :destroy-on-close="true"
            top="5vh" width="300px">
            <el-form ref="dataForm" v-cloading="dialogCreateLoading" :model="dialogQuery" label-position="top"
                label-width="150px" size="medium" class="form">
                <el-form-item label="投注单价：" prop="price">
                    <el-input v-model="dialogQuery.price" placeholder="请输入投注单价">
                        <span slot="suffix">金币</span>
                    </el-input>
                </el-form-item>
                <el-form-item label="观看直播时长：" prop="timer">
                    <el-input v-model="dialogQuery.timer" placeholder="请输入观看直播时长">
                        <span slot="suffix">分钟</span>
                    </el-input>
                </el-form-item>
                <el-form-item label="存款：" prop="deposit">
                    <el-input v-model="dialogQuery.deposit" placeholder="请输入存款">
                        <span slot="suffix">金币</span>
                    </el-input>
                </el-form-item>
                <el-form-item label="投注流水：" prop="runningWater">
                    <el-input v-model="dialogQuery.runningWater" placeholder="请输入投注流水">
                        <span slot="suffix">金币</span>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="medium" @click="dialogCreateVisible = false">取消</el-button>
                <el-button size="medium" type="primary" :loading="dialogCreateLoading"
                    @click="handleDataClick()">确定</el-button>
            </div>
        </el-dialog>
        <!-- 开奖号码 -->
        <el-dialog title="开奖号码" :visible.sync="dialogOpenVisible" :close-on-click-modal="false" :destroy-on-close="true"
            top="5vh" width="500px">
            <el-button size="small" type="primary" @click="addResultSetting">设置开奖号码</el-button>
            <el-table height="250" style="margin-top: 10px;" :data="list2" highlight-current-row size="mini">
                <el-table-column type="index" label="序号" width="50" />
                <el-table-column prop="issue" label="开奖期数" width="120" />
                <el-table-column prop="result" label="开奖号码" width="120" />

                <el-table-column prop="createTimeString" label="创建时间" width="160">
                    <template slot-scope="{ row }">
                        {{ formatUnixTime(row.createTime) }}
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="vue-pagination" background :current-page="listQuery2.pageNum" :page-sizes="10"
                :page-size="listQuery2.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listQuery2.total"
                @size-change="handleSizeChange2" @current-change="handleCurrentChange2" />
        </el-dialog>
        <!-- 设置开奖号码 -->
        <el-dialog title="设置开奖号码" class="open-box" :visible.sync="dialogSetVisible" :close-on-click-modal="false"
            :destroy-on-close="true" top="5vh" width="300px">
            <el-form ref="dataForm" v-cloading="dialogCreateLoading" :model="settingQuery" label-position="top"
                label-width="150px" size="medium" class="form">
                <el-form-item label="开奖期号：" prop="price">
                    <el-input :disabled="true" v-model="settingQuery.designated" placeholder="请输入开奖期数" />
                </el-form-item>
                <el-form-item class="open-item" label="开奖号码：" prop="timer">
                    <el-input style="width: 40px;" maxlength="1" v-model="settingQuery.num1" />
                    <el-input style="width: 40px;" maxlength="1" v-model="settingQuery.num2" />
                    <el-input style="width: 40px;" maxlength="1" v-model="settingQuery.num3" />
                    <el-input style="width: 40px;" maxlength="1" v-model="settingQuery.num4" />
                    <el-input style="width: 40px;" maxlength="1" v-model="settingQuery.num5" />
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="medium" @click="dialogSetVisible = false">取消</el-button>
                <el-button size="medium" type="primary" @click="handleDataClick2()">确定</el-button>
            </div>
        </el-dialog>
        <!-- 分页 -->
        <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
            :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </div>
</template>
  
<script>
import {
    getList,
    add,
    lotteryResultAdd,
    lotteryResultList,
    getBetList,
    getIssue,
    edit

} from "@/api/center/gift";
import { emptyS, nullS, formatUnixTime, getDateTime } from "@/utils/tools";
// const {NOW_TIME_START, NOW_TIME_END} = getDateTime()

export default {
    name: "activity",
    data() {
        return {
            dialogCreateLoading: false,
            list: null,
            list2: null,
            listLoading: false,
            dialogCreateVisible: false,
            dialogOpenVisible: false,
            dialogSetVisible: false,
            dialogQuery: {
                price: null,
                timer: null,
                runningWater: null,
                deposit: null
            },
            settingQuery: {
                num1: null,
                num2: null,
                num3: null,
                num4: null,
                num5: null,
                designated: null
            },
            listQuery2: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            listQuery: {
                pageNum: 1,
                pageSize: 20,
                total: 0,
                issue: null,
                uid: null,
                awardStatus: null,
                pickerValue: [],
                payMethod: null
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
        setInitSetting(info) {
            if (!info || !info.length) {
                return this.method = add
            } else {
                this.method = edit
                info.forEach(item => {
                    let { ruleCode, value } = item
                    if (ruleCode == 1) {
                        this.dialogQuery.price = value
                    } else if (ruleCode == 4) {
                        this.dialogQuery.timer = value
                    } else if (ruleCode == 5) {
                        this.dialogQuery.deposit = value
                    } else if (ruleCode == 6) {
                        this.dialogQuery.runningWater = value
                    }
                })
            }

        },
        // 新增开奖结果
        addResultSetting() {
            this.dialogSetVisible = true
            getIssue().then(rt => {
                if (rt.code == 200 && rt.data) {
                    this.settingQuery = {
                        num1: null,
                        num2: null,
                        num3: null,
                        num4: null,
                        num5: null,
                        designated: rt.data
                    }
                }
            })
        },
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
            this.listLoading = true
            if (this.listQuery.pickerValue.length) {
                this.listQuery.startTime = this.listQuery.pickerValue[0]
                this.listQuery.endTime = this.listQuery.pickerValue[1]
            }
            getList(this.listQuery).then(rt => {
                if (rt.code == 200 && rt.data) {
                    this.list = rt.data.list || []
                    this.listQuery.total = rt.data.total
                }
                this.listLoading = false
            }).catch(err => {
                this.list = []
                this.listQuery.total = 0
                this.listLoading = false
                this.$message.error(err || '获取失败')
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
        handleSizeChange2(val) {
            this.listQuery2.pageSize = val;
            this.listQuery2.pageNum = 1;
            this.showResultCard()
        },

        // 当前页改变
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.fetchData();
        },
        handleCurrentChange2(val) {
            this.listQuery2.pageNum = val;
            this.showResultCard()
        },
        // 查看开奖号码
        showResultCard() {
            lotteryResultList(this.listQuery2).then(rt => {
                if (rt.code == 200 && rt.data) {
                    this.list2 = rt.data.list || []
                    this.dialogOpenVisible = true
                    this.listQuery2.total = rt.data.total
                }
            }).catch(err => {
                this.list2 = []
                this.listQuery2.total = 0
                this.$message.error(err || '获取失败')
            })
        },
        // 活动配置
        showCreateDialogClick() {
            getBetList().then(rt => {
                this.setInitSetting(rt.data)
                this.dialogCreateVisible = true
            }).catch(err => {
                this.$message.error(err || '获取失败')
            })

        },
        validateValues() {
            if (!this.dialogQuery.price) {
                this.$message({
                    type: "warning",
                    message: "请输入投注单价",
                });
                return false;
            }
            if (!this.dialogQuery.timer) {
                this.$message({
                    type: "warning",
                    message: "请输入观看直播时长",
                });
                return false;
            }
            if (!this.dialogQuery.runningWater) {
                this.$message({
                    type: "warning",
                    message: "请输入投注流水",
                });
                return false;
            }
            if (!this.dialogQuery.deposit) {
                this.$message({
                    type: "warning",
                    message: "请输入存款",
                });
                return false;
            }
            return true;
        },
        validateValues2() {
            let { num1, num2, num3, num4, num5 } = this.settingQuery
            if (!num1 || !num2 || !num3 || !num4 || !num5 || isNaN(num1 * num2 * num3 * num4 * num5)) {
                this.$message({
                    type: "warning",
                    message: "请输入正确/完整的中奖号码",
                });
                return false;
            }
            return true
        },
        handleDataClick() {
            if (!this.validateValues()) return
            let { price, timer, deposit, runningWater } = this.dialogQuery
            let params = [{
                ruleCode: 1,
                value: price,
                title: '投注单价',
                titleVi: 'đơn cược'
            }, {
                ruleCode: 4,
                value: timer,
                title: '观看直播',
                titleVi: 'xem live'
            }, {
                ruleCode: 5,
                value: deposit,
                title: '存款',
                titleVi: 'gửi tiền'
            }, {
                ruleCode: 6,
                value: runningWater,
                title: '投注流水',
                titleVi: 'vòng cược'
            }]
            this.method(params).then(rt => {
                if (rt.code == 200) {
                    this.$notify({
                        title: '提示',
                        message: '配置成功',
                        type: 'success',
                        duration: 1500
                    })
                    this.dialogCreateVisible = false
                } else {
                    this.$message.error(rt.message || '保存失败')
                }
            }).catch(err => {
                this.$message.error(err || '保存失败')
            })

        },
        // 设置开奖号码
        handleDataClick2() {
            if (!this.validateValues2()) return
            let { num1, num2, num3, num4, num5 } = this.settingQuery
            let num = `${num1},${num2},${num3},${num4},${num5}`
            let param = {
                result: num
            }
            this.$confirm(`确认开奖号码为[${num}]吗？`, "设置开奖号码", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                showClose: false,
            })
                .then(async () => {
                    lotteryResultAdd(param).then(rt => {
                        if (rt.code == 200) {
                            this.dialogSetVisible = false
                            this.$notify({
                                title: '提示',
                                message: '添加成功',
                                type: 'success',
                                duration: 1500
                            })
                            // this.listQuery2.pageNum = 1;
                            this.showResultCard()
                        } else {
                            this.$message.error(rt.message || '保存失败')
                        }
                    }).catch(err => {
                        this.$message.error(err || '保存失败')
                    })
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消设置",
                    });
                });
        }
    },
    watch: {
        dialogQuery: {
            deep: true,
            handler() {
                let { deposit, price, timer, runningWater } = this.dialogQuery
                if (isNaN(deposit * 1)) { this.dialogQuery.deposit = null }
                if (isNaN(price * 1)) { this.dialogQuery.price = null }
                if (isNaN(timer * 1)) { this.dialogQuery.timer = null }
                if (isNaN(runningWater * 1)) { this.dialogQuery.runningWater = null }
            }
        }
    }
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
<style>
.open-box .open-item input {
    padding: 0 !important;
    text-align: center;
    width: 40px;
}
</style>
  