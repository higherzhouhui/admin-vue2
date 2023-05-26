<template>
    <div class="app-container">
        <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="listQuery.agentId" size="small" placeholder="请输入视频标题" clearable
                    @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
            </el-form-item>
            <el-form-item>
                <el-input v-model="listQuery.agentId" size="small" placeholder="请输入发布人ID" clearable
                    @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
            </el-form-item>
            <el-form-item>
                <el-input v-model="listQuery.agentId" size="small" placeholder="请输入发布人昵称" clearable
                    @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
            </el-form-item>
            <el-form-item>
                <el-select style="width: 185px;" size="small" v-model="listQuery.keyes" placeholder="请选择状态"
                    @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter">
                    <el-option label="未审核" value="1"></el-option>
                    <el-option label="通过" value="2"></el-option>
                    <el-option label="驳回" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-search" @click="handleSearchFilter">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="small" icon="el-icon-refresh" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table v-cloading="listLoading" :data="list" highlight-current-row size="mini">
            <el-table-column type="index" label="日期" width="50" />
            <el-table-column prop="agentId" label="视频ID" width="150" />
            <el-table-column prop="rechargeNum" label="视频标题">
                <template slot-scope="{row}">
                    {{ row.name }} <span class="operation_btn" @click="player">播放</span>
                </template>
            </el-table-column>
            <el-table-column prop="firstNum" label="发布人ID" />
            <el-table-column prop="withdrawNum" label="发布人昵称" />
            <el-table-column prop="rechargeCoin" label="有效播放次数" />
            <el-table-column prop="withdrawCoin" label="赞数" />
            <el-table-column prop="betNum" label="创建时间" />
            <el-table-column prop="betNum" fixed="right" label="操作" width="100">
                <template slot-scope="{ row }">
                    <span class="operation_btn" type="success" plain size="mini">通过</span>
                    <span class="operation_btn" type="success" @click="del" plain size="mini">驳回</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination class="vue-pagination" background :current-page="listQuery.pageNum"
            :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]" :page-size="listQuery.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="listQuery.total" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" />
        <!-- 视频播放 -->
        <el-dialog title="视频播放" :visible.sync="palayerVisible" :close-on-click-modal="false" :destroy-on-close="true"
            top="5vh" width="400px">
            <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true"
                :options="playerOptions"></video-player>
        </el-dialog>

    </div>
</template>
  
<script>
// 点播审核
import { dailyReport } from '@/api/agentManagement/dateStatistics'
import { emptyS, nullS, formatUnixTime, getDateTime } from "@/utils/tools";

export default {
    name: "Trailer",
    data() {
        return {
            src: 'https://fbstest.oss-ap-southeast-1.aliyuncs.com/common/common_1682317892000_42595.mp4',
            list: null,
            listLoading: false,
            palayerVisible: false,
            dialogQuery: {
                name: ''
            },
            listQuery: {
                pageNum: 1,
                pageSize: 20,
                total: 0,
                agentId: null,
                pickerValue: [],
            },
            playerOptions: {
                playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                autoplay: true, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [{
                    type: "video/mp4",//这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
                    src: '' //url地址
                }],
                // width: document.documentElement.clientWidth, //播放器宽度
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                flash: { hls: { withCredentials: false } },
                html5: { hls: { withCredentials: false } },
                controlBar: {
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: false,
                    fullscreenToggle: true  //全屏按钮
                }
            }
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
        player() {
            this.playerOptions.sources[0].src = this.src;
            this.palayerVisible = true;
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
            this.listLoading = true;
            if (this.listQuery.pickerValue && this.listQuery.pickerValue.length) {
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
        dialogCreate() {

        },
        del() {
            this.$confirm("确认驳回？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
                .then(() => {
                    this.$notify({
                        title: "提示",
                        message: "驳回成功",
                        type: "success",
                        duration: 1500,
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "取消了该操作",
                    }); s
                });
        }
    },
};
</script>
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
}}
</style>
  