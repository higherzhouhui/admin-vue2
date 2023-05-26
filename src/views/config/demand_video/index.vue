<template>
    <div class="app-container">
        <DatePicker v-model="listQuery.pickerValue" @change="handleSearchFilter" />
        <el-form :inline="true">
            <el-form-item>
                <el-input v-model="listQuery.videoId" size="small" placeholder="请输入视频ID" clearable
                    @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
            </el-form-item>
            <el-form-item>
                <el-input v-model="listQuery.title" size="small" placeholder="请输入视频标题" clearable
                    @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
            </el-form-item>
            <el-form-item>
                <el-input v-model="listQuery.uid" size="small" placeholder="请输入发布人ID" clearable
                    @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
            </el-form-item>
            <el-form-item>
                <el-input v-model="listQuery.nickname" size="small" placeholder="请输入发布人昵称" clearable
                    @keyup.enter.native="handleSearchFilter" @clear="handleSearchFilter" />
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
                <el-button size="small" @click="initDialogQuery(); dialogCreateVisible = true"
                    type="primary">添加视频</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="small" @click=" dialogCreateVisible2 = true; plData = {} ">批量导入</el-button>
            </el-form-item>
        </el-form>
        <!-- 送彩票表单 -->
        <el-table v-cloading=" listLoading " :data=" list " highlight-current-row size="mini">
            <el-table-column type="index" label="日期" width="50" />
            <el-table-column prop="videoId" label="视频ID" min-width="180" />
            <el-table-column prop="rechargeNum" label="视频标题" min-width="220">
                <template slot-scope="{row}">
                    {{ row.title }} <span class="operation_btn" @click=" player(row.videoUrl) ">播放</span>
                </template>
            </el-table-column>
            <el-table-column prop="uid" label="发布人ID" min-width="100" />
            <el-table-column prop="nickname" label="发布人昵称" min-width="120" />
            <el-table-column prop="validPlayCount" label="有效播放次数" min-width="120">
                <template slot-scope="{row}">
                    {{ row.validPlayCount || 0 }}
                </template>
            </el-table-column>
            <el-table-column prop="likes" label="赞数">
                <template slot-scope="{row}">
                    {{ row.likes || 0 }}
                </template>
            </el-table-column>
            <el-table-column prop="betNum" label="创建时间" min-width="160">
                <template slot-scope="{row}">
                    {{ formatUnixTime(row.createTime) }}
                </template>
            </el-table-column>
            <el-table-column prop="betNum" fixed="right" label="操作" width="100">
                <template slot-scope="{ row }">
                    <span class="operation_btn" type="success" @click=" editInfo(row) " plain size="mini">编辑</span>
                    <span class="operation_btn" type="success" @click=" del(row.id) " plain size="mini">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination class="vue-pagination" background :current-page=" listQuery.pageNum "
            :page-sizes=" [10, 20, 50, 100, 500, 1000, 5000, 10000] " :page-size=" listQuery.pageSize "
            layout="total, sizes, prev, pager, next, jumper" :total=" listQuery.total " @size-change=" handleSizeChange "
            @current-change=" handleCurrentChange " />
        <!-- 新增直播预告 -->
        <el-dialog :title="dialogQuery.id?'编辑视频' : '添加视频'" :visible.sync=" dialogCreateVisible " :close-on-click-modal=" false "
            :destroy-on-close=" true " top="5vh" width="300px">
            <el-form ref="dataForm" v-cloading=" dialogCreateLoading " :model=" dialogQuery " label-position="top"
                label-width="150px" size="medium" class="form">
                <el-form-item label="发布人ID：" prop="uid">
                    <el-input maxlength="20" v-model.number=" dialogQuery.uid " placeholder="请输入发布人ID" />
                </el-form-item>
                <el-form-item label="视频标题：" prop="title">
                    <el-input maxlength="100" show-word-limit v-model=" dialogQuery.title " placeholder="请输入视频标题" />
                </el-form-item>
                <el-form-item label="视频地址：" prop="videoUrl">
                    <el-input maxlength="140" v-model=" dialogQuery.videoUrl " placeholder="请输入视频地址" />
                </el-form-item>
                <el-form-item label="初始播放数：" prop="validPlayCount">
                    <el-input maxlength="10" v-model.number=" dialogQuery.validPlayCount " placeholder="请输入初始播放数" />
                </el-form-item>
                <el-form-item label="初始赞数：" prop="likes">
                    <el-input maxlength="10" v-model.number=" dialogQuery.likes " placeholder="请输入初始赞数" />
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="medium" @click=" dialogCreateVisible = false ">取消</el-button>
                <el-button size="medium" type="primary" :loading=" dialogCreateLoading "
                    @click=" dialogCreate() ">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="视频播放" :visible.sync=" palayerVisible " :close-on-click-modal=" false " :destroy-on-close=" true "
            top="5vh" width="400px">
            <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline=" true "
                :options=" playerOptions "></video-player>
        </el-dialog>
        <el-dialog title="批量导入" :visible.sync=" dialogCreateVisible2 " :close-on-click-modal=" false "
            :destroy-on-close=" true " top="5vh" width="200px">
            <div style="display: flex; align-items: center;">
                <el-upload clearable accept=".excel,.xlsx,.mp4" action="" :show-file-list=" false "
                    :before-upload=" beforeImgUpload " :http-request=" uploadImgRequest ">
                    <el-button :loading=" loading " size="small" type="primary">点击上传</el-button>
                </el-upload> <span style="margin-left: 10px;">{{ plData.name }}</span>
            </div>

            <div style="margin-top: 10px;">
                导入模板.xslx <a class="operation_btn"
                    href="https://fbstest.oss-ap-southeast-1.aliyuncs.com/common/common_1682588046000_84458.xlsx">下载</a>
            </div>
            <div slot="footer">
                <el-button size="medium" @click=" dialogCreateVisible2 = false ">取消</el-button>
                <el-button size="medium" type="primary" :loading=" dialogCreateLoading "
                    @click=" dialogplCreate() ">确定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
  
<script>
// 点播管理
import { beforeUploadImage, uploadFile } from "@/utils/tools";
import { getVideoList, deleteVideo, createVideo, updateVideo, importVideo } from '@/api/config/demand_video'
import { emptyS, nullS, formatUnixTime, getDateTime } from "@/utils/tools";

export default {
    name: "Trailer",
    data() {
        return {
            list: null,
            loading: false,
            listLoading: false,
            dialogCreateLoading: false,
            palayerVisible: false,
            dialogQuery: {
                likes: '',
                uid: '',
                title: '',
                videoUrl: '',
                validPlayCount: ''
            },
            dialogCreateVisible: false,
            dialogCreateVisible2: false,
            listQuery: {
                pageNum: 1,
                pageSize: 20,
                total: 0,
                nickname: '',
                uid: '',
                title: '',
                videoId: ''
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
            },
            plData: {
                videoUrl: '',
                name: ''
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
        formatUnixTime,
        initDialogQuery() {
            this.dialogQuery = {
                likes: '',
                uid: '',
                title: '',
                videoUrl: '',
                validPlayCount: ''
            }
        },
        player(url) {
            this.playerOptions.sources[0].src = url;
            this.palayerVisible = true;
        },
        beforeImgUpload(file) {
            console.log("-----------上传之前------------");
            const { can, msg } = beforeUploadImage(file.type, file.size);
            if (!can) {
                this.$message.error(msg);
            } else {
                this.$set(this.plData, 'name', file.name)
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
                    this.plData.videoUrl = url;
                    this.loading = false;
                })
                .catch((err) => {
                    console.error("oss失败" + JSON.stringify(err));
                    this.loading = false;
                    this.$message.error("上传失败，请重试");
                });
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
            getVideoList(this.listQuery).then(res => {
                this.listLoading = false;
                if (res.code === 200) {
                    this.list = res.data.list;
                    this.listQuery.total = res.data.total;
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
        editInfo(info) {
            this.initDialogQuery()
            this.dialogQuery = info;
            this.dialogCreateVisible = true
        },
        dialogplCreate() {
            if (this.loading) {
                return this.$message.error('文件还在上传中')
            }
            if (!this.plData.videoUrl) {
                return this.$message.error('请上传文件')
            }
            const formData = new FormData()
            formData.append('file', this.plData.videoUrl)
            importVideo(formData).then(rt => {
                if (rt.code == 200) {
                    this.$notify({
                        title: "提示",
                        message: '上传成功',
                        type: "success",
                        duration: 1500,
                    });
                    this.dialogCreateVisible2 = false
                } else {
                    this.$message.error(rt.message || '上传失败')
                }
            }).catch(err => {
                this.$message.error(err || '上传失败')
            })

        },
        vility() {
            let { likes, uid, title, videoUrl, validPlayCount } = this.dialogQuery
            let bol = true
            let msg = ''
            if (likes && isNaN(likes * 1)) {
                msg = '请填写正确的点赞数';
                bol = false
            } else if (validPlayCount && isNaN(validPlayCount * 1)) {
                msg = '请填写正确的有效播放次数';
                bol = false
            } else if (!uid || isNaN(uid * 1)) {
                msg = '请填写正确的发布人ID';
                bol = false
            } else if (!title) {
                msg = '请填写视频标题';
                bol = false
            } else if (!videoUrl) {
                msg = '请填写视频地址';
                bol = false
            }
            if(msg) this.$message.error(msg)
            return bol
        },
        dialogCreate() {
            if(!this.vility()) return 
            let isEdit = !!this.dialogQuery.id
            let methods = isEdit ? updateVideo : createVideo
            let { id, likes, uid, title, videoUrl, validPlayCount } = this.dialogQuery
            methods({ id, likes, uid, title, videoUrl, validPlayCount, type: 1 }).then(rt => {
                if (rt.code == 200) {
                    this.$notify({
                        title: "提示",
                        message: `${isEdit ? '编辑成功' : '新增成功'}`,
                        type: "success",
                        duration: 1500,
                    });
                    this.dialogCreateVisible = false
                    this.fetchData()
                } else {
                    this.$message.error(rt.message || '保存失败')
                }
            }).catch(err => {
                this.$message.error(err || '保存失败')
            })
        },
        del(id) {
            this.$confirm("确认删除？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            })
                .then(() => {
                    deleteVideo({ id }).then(rt => {
                        if (rt.code == 200) {
                            this.$notify({
                                title: "提示",
                                message: "删除成功",
                                type: "success",
                                duration: 1500,
                            });
                            this.fetchData();
                        } else {
                            this.$message.error(rt.message || '删除失败')
                        }
                    })
                        .catch(err => {
                            this.$message.error(err || '删除失败')
                        })

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
<style>
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
  