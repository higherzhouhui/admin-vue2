<template>
    <div class="app-container">
        <div style="display: flex;">
            <el-select style="width: 100px; margin-right: 10px; transform: translateY(4px);" size="small"
                v-model="listQuery.dataType" placeholder="请选择">
                <el-option label="展示时间" value="2"></el-option>
                <el-option label="开播时间" value="1"></el-option>
            </el-select>
            <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
        </div>
        <el-form :inline="true">
            <el-form-item>
                <el-input style="width: 330px;" size="small" placeholder="请输入标题\主播名称" v-model="listQuery.liveTitle"
                    class="input-with-select">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="listQuery.status" clearable placeholder="请选状态" class="input-with-select" size="small"
                    @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
                    <el-option label="进行中" value="1" />
                    <el-option label="未开始" value="2" />
                    <el-option label="已过期" value="-1" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <div style="margin-bottom: 20px;">
            <el-button size="small" @click="create" type="primary" icon="el-icon-plus">新增直播预告</el-button>
        </div>
        <!-- 直播预告 -->
        <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
            <el-table-column type="index" label="日期" width="50" />
            <el-table-column prop="liveTitle" label="标题名称" min-width="100" />
            <el-table-column prop="nickname" label="主播名称" />
            <el-table-column prop="uid" label="主播id" min-width="120" />
            <el-table-column prop="openBroadcastTime" label="开播时间" width="140">
                <template slot-scope="{row}">
                    {{ formatUnixTime(row.openBroadcastTime * 1000) }}
                </template>
            </el-table-column>
            <el-table-column prop="showStartTime" label="展示时间" width="280">
                <template slot-scope="{row}">
                    {{ formatUnixTime(row.showStartTime * 1000) }} - {{ formatUnixTime(row.showEndTime * 1000) }}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
                <template slot-scope="{ row }">
                    {{ row.status == 1 ? '进行中' : row.status == 2 ? '未开始' : '已过期' }}
                </template>
            </el-table-column>
            <el-table-column prop="bookingNum" label="预约人数" />
            <el-table-column prop="betNum" label="最后操作人" min-width="120">
                <template slot-scope="{row}">
                    {{ row.updateByName || row.createByName || '-' }}
                </template>
            </el-table-column>
            <el-table-column prop="betNum" label="更新时间" min-width="160">
                <template slot-scope="{row}">
                    {{ row.updateTime ? formatUnixTime(row.updateTime * 1000) : '-' }}
                </template>
            </el-table-column>
            <el-table-column prop="betNum" fixed="right" label="操作" width="140">
                <template slot-scope="{ row }">
                    <span v-if="row.status != -1" class="operation_btn" type="success" plain size="mini"
                        @click="toEdit(row)">编辑</span>
                    <span class="operation_btn" type="success" plain size="mini" @click="toEdit(row, 2)">查看</span>
                    <span v-if="row.status != -1" class="operation_btn" type="success" plain size="mini"
                        @click="del(row.id)">删除</span>
                </template>
            </el-table-column>

        </el-table>
        <!-- 新增直播预告 -->
        <el-dialog title="活动配置" :visible.sync="dialogCreateVisible" :close-on-click-modal="false" :destroy-on-close="true"
            top="5vh" width="300px">
            <el-form ref="dataForm" v-cloading="dialogCreateLoading" :model="dialogQuery" label-position="top"
                label-width="150px" size="medium" class="form">
                <el-form-item label="标题名称：" prop="liveTitle">
                    <el-input maxlength="50" :disabled="type == 2" v-model="dialogQuery.liveTitle" placeholder="请输入标题名称" />
                </el-form-item>

                <el-form-item label="主播ID：" prop="uid">
                    <el-input maxlength="20" :disabled="type == 2" v-model.number="dialogQuery.uid" placeholder="请输入直播ID" />
                    <span v-if="liveName">主播名称： {{ liveName }}</span>
                </el-form-item>
                <el-form-item label="开播时间：" prop="openBroadcastTime">
                    <el-date-picker :disabled="type == 2" style="width: 100%"
                        v-model="dialogQuery.openBroadcastTime" type="datetime" placeholder="请选择开播时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="预告展示时间：" prop="runningWater">
                    <el-date-picker :disabled="type == 2" v-model="dialogQuery.pickerValue" size="small" :clearable="false"
                        type="datetimerange" range-separator="~" style="width: 100%"
                        placeholder="请选择预告展示时间" start-placeholder="开始日期" end-placeholder="结束日期" align="right"
                        format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" value-format="timestamp" />
                    <!-- <el-date-picker style="width: 100%" v-model="dialogQuery.time2" type="datetime" placeholder="请选择预告展示时间"> -->
                    <!-- </el-date-picker> -->
                </el-form-item>
                <el-form-item label="预告详情：" prop="runningWater">
                    <img class="avatar" :src="dialogQuery.url" v-if="type == 2" alt="">
                    <el-upload v-else clearable accept=".png,.jpeg,.gif,.webp,.jpg" class="avatar-uploader" action=""
                        :show-file-list="false" :before-upload="beforeImgUpload" :http-request="uploadImgRequest">
                        <div v-cloading="loading" style="position: relative;">
                            <i @click.stop="dialogQuery.url = ''" v-if="dialogQuery.url"
                                style="position: absolute; right: 4px; top: 4px; cursor: pointer;"
                                class="el-icon-close"></i>
                            <img v-if="dialogQuery.url" :src="dialogQuery.url" class="avatar" />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" v-if="type == 1">
                <el-button size="medium" @click="dialogCreateVisible = false; type = 1; dialogQuery = {}">取消</el-button>
                <el-button size="medium" type="primary" :loading="dialogCreateLoading"
                    @click="handleDataClick()">确定</el-button>
            </div>
        </el-dialog>
        <!-- 分页 -->
        <el-pagination class="vue-pagination" background :current-page="listQuery.page"
            :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.limit"
            layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
    </div>
</template>
  
<script>
import moment from 'moment-timezone'

// 主直播预告
import { beforeUploadImage, uploadFile } from "@/utils/tools";
import { deleteByPrimaryKey, listLiveBookingConfig, save, updateById, selectByPrimaryKey } from '@/api/config/live_trailer.js'
import { emptyS, nullS, formatUnixTime, getDateTime } from "@/utils/tools";
export default {
    name: "Trailer",
    data() {
        return {
            type: 1,
            liveName: '',
            list: null,
            listLoading: false,
            dialogCreateLoading: false,
            dialogCreateVisible: false,
            dialogQuery: {
                liveTitle: null,
                url: '',
                openBroadcastTime: null,
                uid: '',
                pickerValue: []
            },
            loading: false,
            listQuery: {
                dataType: '1',
                liveTitle: '',
                page: 1,
                limit: 20,
                total: 0,
                pickerValue: [],
                status: null
            },
        };
    },
    watch: {
        dialogQuery: {
            deep: true,
            handler() {
                this.getNameById(this.dialogQuery.uid)
            }
        }
    },
    computed: {
        initTimer() {
            return this.$store.getters.timerDate
        }
    },
    created() {
        // this.listQuery.pickerValue = this.initTimer
        this.fetchData();
    },
    beforeDestroy() {
        clearTimeout(this.timer)
    },
    methods: {
        formatUnixTime(time) {
           return moment(time).format('YYYY/MM/DD HH:mm:ss')
        },
        beforeImgUpload(file) {
            console.log("-----------上传之前------------");
            const { can, msg } = beforeUploadImage(file.type, file.size);
            if (!can) {
                this.$message.error(msg);
            } else {
                this.loading = true;
            }
            return can;
        },
        uploadImgRequest(option) {
            console.log("-----------自定义上传方法------------");
            this.$store
                .dispatch("oss/getOSSInfos")
                .then((res) => {
                    console.log(
                        "上传asasds",
                        res,
                        this.$route.path,
                        option.file.name,
                        option.file
                    );
                    return uploadFile(
                        res,
                        'common',
                        option.file.name,
                        option.file
                    );
                })
                .then((url) => {
                    console.log("上传图片完成url", url);
                    this.dialogQuery.url = url;
                    this.loading = false;
                })
                .catch((err) => {
                    console.error("oss失败" + JSON.stringify(err));
                    this.loading = false;
                    this.$message.error("上传失败，请重试");
                });
        },
        create() {
            this.type = 1;
            this.dialogQuery = {}
            this.liveName = ''
            this.dialogCreateVisible = true
        },
        reset() {
            this.listQuery = {
                page: 1,
                limit: 20,
                pickerValue: [],
                dataType: '1'
            }
            this.fetchData()
        },
        // 获取列表数据
        fetchData() {
            this.listLoading = true;
            if (this.listQuery.pickerValue && this.listQuery.pickerValue.length) {
                this.listQuery.startTime = this.listQuery.pickerValue[0] / 1000
                this.listQuery.endTime = this.listQuery.pickerValue[1] / 1000
            } else {
                delete this.listQuery.startTime
                delete this.listQuery.endTime
            }
            listLiveBookingConfig(this.listQuery).then(res => {
                this.listLoading = false;
                if (res.code === 200) {
                    this.list = res.data.list || [];
                    this.listQuery.total = res.data.total;
                }
            }).catch(err => {
                this.list = null;
                this.listQuery.total = 0;
                this.listLoading = false;
                this.$message.error(err);
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
        toEdit(data, type = 1) {
            this.liveName = ''
            let info = JSON.parse(JSON.stringify(data))
            info.pickerValue = [info.showStartTime * 1000, info.showEndTime * 1000]
            info.openBroadcastTime *= 1000
            this.dialogQuery = info
            this.type = type
            this.dialogCreateVisible = true
        },
        verify() {
            let bol = true
            let msg = ''
            let { pickerValue, liveTitle, uid, openBroadcastTime, url } = this.dialogQuery;
            if (!liveTitle) {
                msg = '请输入活动名称'
                bol = false
            } else if (!uid) {
                msg = '请输入主播ID'
                bol = false
            } else if (!openBroadcastTime) {
                msg = '请选择开播时间'
                bol = false
            } else if (!pickerValue || !pickerValue.length) {
                msg = '请选择预告展示时间'
                bol = false
            } else if (!url) {
                msg = '请上传预告详情图'
                bol = false
            } else if(openBroadcastTime > pickerValue[1] || openBroadcastTime < pickerValue[0]) {
                msg = '开播时间必须在预告展示时间区间'
                bol = false
            }
            if (msg) { this.$message.error(msg) }
            return bol
        },
        // 新增
        handleDataClick() {
            if (!this.verify()) return
            let { pickerValue, liveTitle, uid, openBroadcastTime, url, id } = this.dialogQuery;
            let methods = id ? updateById : save
            let params = {
                liveTitle,
                id,
                uid,
                openBroadcastTime: openBroadcastTime / 1000,
                url,
                createByName: this.$store.state.user.name,
                updateByName: this.$store.state.user.name,
                createTime: Date.now() / 1000,
                updateTime: Date.now() / 1000
            }
            if (pickerValue && pickerValue.length) {
                params.showStartTime = pickerValue[0] / 1000
                params.showEndTime = pickerValue[1] / 1000
            }
            methods(params).then((item) => {
                if (item.code === 200) {
                    this.dialogCreateVisible = false
                    this.dialogQuery = {}
                    this.type = 1
                    this.fetchData();
                }
            })
                .catch((err) => {
                    this.$message({
                        type: "error",
                        message: err,
                    });
                });
        },
        getNameById(uid) {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                selectByPrimaryKey(uid).then(rt => {
                    if (rt.code == 200) {
                        this.liveName = rt.data.nickname
                    }
                })
            }, 500)

        },
        // 删除
        del(id) {
            this.$confirm("确认删除该条数据吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
                .then(() => {
                    deleteByPrimaryKey(id)
                        .then((item) => {
                            if (item.code === 200) {
                                this.$notify({
                                    title: "提示",
                                    message: "删除成功",
                                    type: "success",
                                    duration: 1500,
                                });
                                this.fetchData();
                            }
                        })
                        .catch((err) => {
                            this.$message({
                                type: "error",
                                message: err,
                            });
                        });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消了该操作",
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
  