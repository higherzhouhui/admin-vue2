<template>
  <div class="page">
    <!-- 导航头 -->
    <div class="nav-container">
      <div class="input-container">
        <!-- 地址修改输入框 -->
        <el-input size="small" v-model="playerUrl" :disabled="!editUrlStatus" placeholder="请输入拉流地址" maxlength="100" clearable></el-input>
        <el-button v-if="editUrlStatus == false" size="small" style="margin-left: 20px;" plain type="primary" @click="editUrlStatus = true">修改</el-button>
        <el-button-group v-else style="display: flex">
          <el-button size="small" style="margin-left: 20px;" plain type="success" @click="affirmEditBasePlayUrl()">确认</el-button>
          <el-button size="small" plain type="danger" @click="editUrlStatus = false">取消</el-button>
        </el-button-group>
      </div>
      <!-- 数量选择框 -->
      <el-select size="small" v-model="playerNumsValue" placeholder="请选择播放器数量" @change="initPlayers()">
        <el-option v-for="item in playerNumOptions" :label="item.label" :key="item.value" :value="item.value"></el-option>
      </el-select>
    </div>

    <el-divider></el-divider>

    <!-- 播放器列表 -->
    <span v-if="playerShow">
      <el-row :gutter="20">
        <el-col :span="6" v-for="(player, idx) in playerOptions" :key="idx" class="el-col-list">
          <div class="card-container">
            <!-- 房间信息 -->
            <div class="card-header">
              <span v-if="player.anchorId > 0"><user-drawer :uid="player.anchorId" :show-text="`主播ID：${player.anchorId}`" /></span>
              <span v-else>请选择直播</span>
            </div>
            <!-- 播放器 -->
            <videoPlayer :options="player" class="vjs-custom-skin" :playsinline="true" />
            <!-- 底部按钮 -->
            <div class="card-bottom">
              <el-button size="mini" plain type="primary" icon="el-icon-plus" circle @click="openLiveListClick(idx)"></el-button>
              <span style="width: 60px;"></span>
              <el-button size="mini" plain type="danger" icon="el-icon-close" circle @click="closeLiveClick(idx)"></el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </span>

    <!-- 侧边栏房间列表 -->
    <el-drawer title="直播间列表" ref="drawer" :visible.sync="drawerVisible" direction="rtl" size="40%" :close-on-press-escape="false" :wrapperClosable="false">
      <div class="drawer-container">
        <div style="margin-bottom: 20px;display: flex;justify-content: space-between;">
          <el-input
            size="small"
            style="width: 240px;"
            v-model="drawerListQuery.uid"
            class="input-with-select"
            placeholder="请输入用户ID"
            clearable
            maxlength="20"
            @keyup.enter.native="drawerSearchFilter"
            @clear="drawerSearchFilter"
            oninput="value=value.replace(/[^\d]/g,'')"
          >
            <el-button slot="append" icon="el-icon-search" @click="drawerSearchFilter"></el-button>
          </el-input>
          <el-button size="small" plain icon="el-icon-refresh" @click="fetchLiveMonitorList()"></el-button>
        </div>
        <el-table v-cloading="drawerListLoading" :data="drawerList" size="mini">
          <el-table-column type="index" label="序号" width="60"  ></el-table-column>
          <el-table-column prop="uid" label="主播ID" min-width="60"  ></el-table-column>
          <el-table-column label="封面" width="100"  >
            <template slot-scope="{ row }">
              <el-image class="list-avatar" :src="row.avatar" fit="contain" lazy>
                <div slot="error" class="image-slot"><i class="el-icon-picture-outline"></i></div>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="nickname" label="昵称" min-width="60"  ></el-table-column>
          <el-table-column label="操作" width="80"  >
            <template slot-scope="{ row }">
              <el-button plain type="primary" size="mini" @click="drawerSelectLiveClick(row)">确定</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination class="list-pagination" background layout="prev, pager, next" :total="drawerListQuery.total" @current-change="drawerCurrentChange"></el-pagination>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getLiveMonitorList, getLiveMonitorUrl, updateLiveMonitorUrl } from '@/api/live/monitor';
import { emptyS, nullS } from '@/utils/tools';
import 'video.js/dist/video-js.css';
import 'videojs-flash';
import { videoPlayer } from 'vue-video-player';
import UserDrawer from '@/components/UserDrawer';

export default {
  name: 'LiveMonitorPage',
  components: {
    videoPlayer,
    UserDrawer
  },
  data() {
    return {
      // 拉流地址
      editUrlStatus: false,
      playerUrl: null,

      // 播放选项
      playerNumsValue: 4,
      playerNumOptions: [{ value: 4, label: '4个播放器' }, { value: 8, label: '8个播放器' }, { value: 12, label: '12个播放器' }],

      // 直播间列表
      drawerVisible: false,
      drawerListLoading: false,
      drawerList: null,
      drawerListQuery: {
        page: 1,
        limit: 20,
        total: 0,
        uid: null
      },

      // 播放器集合
      playerShow: false,
      playerSelIndex: null,
      playerOptions: []
    };
  },
  mounted() {},
  computed: {},
  created() {
    this.fetchData();
    this.initPlayers();
  },
  methods: {
    // 获取直播拉流地址
    fetchData() {
      const loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      });
      getLiveMonitorUrl()
        .then(res => {
          this.playerUrl = nullS(res.data);
          loading.close();
        })
        .catch(err => {
          loading.close();
          this.$message.error(err);
        });
    },

    // 确认修改拉流地址
    affirmEditBasePlayUrl() {
      if (emptyS(this.playerUrl)) {
        this.$message({
          message: '请输入拉流地址',
          type: 'warning'
        });
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      });
      updateLiveMonitorUrl(this.playerUrl)
        .then(res => {
          this.editUrlStatus = false;
          loading.close();
        })
        .catch(err => {
          this.editUrlStatus = false;
          this.playerUrl = null;
          loading.close();
        });
    },

    // 打开房间列表事件
    openLiveListClick(playerIdx) {
      this.playerSelIndex = playerIdx;
      this.drawerVisible = true;
      this.fetchLiveMonitorList();
    },

    // 关闭直播
    closeLiveClick(playerIdx) {
      this.$nextTick(() => {
        for (var player of this.playerOptions) {
          if (player.idx == playerIdx) {
            player.sources[0].src = '';
            player.anchorId = null;
            break;
          }
        }
      });
    },

    // 获取直播列表
    fetchLiveMonitorList() {
      this.drawerListLoading = true;
      getLiveMonitorList(this.drawerListQuery.limit, this.drawerListQuery.page, this.drawerListQuery.uid)
        .then(res => {
          this.drawerList = (res.data.list || []).map(item => {
            return item;
          });
          this.drawerListQuery.total = res.data.total;
          this.drawerListLoading = false;
        })
        .catch(err => {
          this.drawerListLoading = false;
          this.drawerList = null;
          this.drawerListQuery.total = 0;
          this.$message.error(err);
        });
    },

    // 过滤直播列表
    drawerSearchFilter() {
      this.drawerListQuery.page = 1;
      this.fetchLiveMonitorList();
    },

    // 直播列表当前页改变
    drawerCurrentChange(val) {
      this.drawerListQuery.page = val;
      this.fetchLiveMonitorList();
    },

    // 选中一个直播
    drawerSelectLiveClick(row) {
      this.drawerVisible = false;
      const rowDic = Object.assign({}, row);
      this.$nextTick(() => {
        for (var player of this.playerOptions) {
          if (player.idx == this.playerSelIndex) {
            player.anchorId = rowDic.uid;
            player.sources[0].src = rowDic.rtmpUrl;
            break;
          }
        }
      });
    },

    // 刷新播放器
    initPlayers() {
      this.playerShow = false;
      this.playerOptions = [];
      var players = [];
      for (var i = 0; i < this.playerNumsValue; i++) {
        players.push({
          idx: i,
          anchorId: null,
          height: '330',
          language: 'zh-CN',
          muted: false, // 默认静音 默认情况下将会消除任何音频
          loop: false, // 是否视频一结束就重新开始
          autoplay: true, // 如果 true,浏览器准备好时开始回放
          // preload: 'auto', // 视频预加载 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          // aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          // fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器
          controls: false,
          // controlBar: {
          //   timeDivider: false,
          //   durationDisplay: false,
          //   remainingTimeDisplay: false,
          //   currentTimeDisplay: false, // 当前时间
          //   volumeControl: false, // 声音控制键
          //   playToggle: false, // 暂停和播放键
          //   progressControl: false, // 进度条
          //   fullscreenToggle: true // 全屏按钮
          // },
          techOrder: ['flash'], //设置兼容顺序
          sources: [
            {
              type: 'rtmp/mp4',
              src: '',
              withCredentials: false
            }
          ],
          notSupportedMessage: '暂无可播放的视频' //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        });

        // players.push({
        //   idx: i,
        //   sources: [
        //     {
        //       type: 'rtmp/mp4',
        //       src: '',
        //       withCredentials: false
        //     }
        //   ],
        //   height: '400',
        //   language: 'zh-CN',
        //   techOrder: ['flash'],
        //   muted: false, // 默认静音 默认情况下将会消除任何音频
        //   autoplay: true, // 如果 true,浏览器准备好时开始回放
        //   // preload: 'auto', // 视频预加载 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        //   loop: false, // 导致视频一结束就重新开始
        //   controls: false,
        //   notSupportedMessage: '此视频暂无法播放' //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        // });
      }
      this.playerOptions = players;
      this.playerShow = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  padding: 20px 20px 0px 20px;
}

.nav-container {
  width: 100%;
  margin: 0px 0px 20px 0px;
  display: flex;
  justify-content: space-between;
}

.input-container {
  display: flex;

  &:first-child {
    width: 500px;
  }
}

.card-header {
  width: 100%;
  padding: 0px 20px 20px 20px;
  display: flex;
  justify-content: center;
}

.card-container {
  border-radius: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px 0px 20px 0px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card-bottom {
  display: flex;
  margin: 20px 0px 0px 0px;
}

.el-col-list {
  margin-bottom: 20px;
}

.drawer-container {
  padding: 0px 20px 0px 20px;
}

.list-avatar {
  width: 35px;
  height: 35px;
  margin: 0px;
  padding: 0px;
}

.list-pagination {
  margin: 20px 0px 0px 0px;
  padding: 0px;
}
</style>
