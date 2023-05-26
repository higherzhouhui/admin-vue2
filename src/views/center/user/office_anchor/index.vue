<template>
  <div class="app-container">
    <el-form :inline="true">
      <!-- <el-form-item>
        <el-button
          size="small"
          type="success"
          icon="el-icon-plus"
          @click="showCreateDialogClick()"
          >新增</el-button
        >
      </el-form-item> -->
      <!-- 主播类型 -->
      <!-- <el-form-item>
        <el-input
          v-model="listQuery.liveId"
          size="small"
          placeholder="请输入主播ID"
          clearable
          oninput="value=value.replace(/[^\d]/g,'')"
          @keyup.enter.native="handleSearchFilter"
          @clear="handleSearchFilter"
        >
        </el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button
          size="small"
          plain
          icon="el-icon-refresh"
          @click="fetchData()"
        >刷新</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-cloading="listLoading"
      :data="list"
      highlight-current-row
      size="mini"
    >
      <el-table-column type="index" label="序号" width="60" />
      <el-table-column
        label="主播ID"
        prop="anchorId"
      />
      <el-table-column
        label="直播间标题"
        prop="nickname"
      />
      <!-- <el-table-column prop="nickname" label="主播昵称"   />
      <el-table-column prop="avatar" label="头像"   /> -->
      <el-table-column prop="livePicUrl" label="直播间视频封面">
        <template slot-scope="{ row }">
          <el-image
            class="vue-img-preview"
            fit="contain"
            lazy
            :src="row.livePicUrl"
            :preview-src-list="[row.livePicUrl]"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="rq"
        label="人气值"
        min-width="100"

      /> -->
      <el-table-column prop="liveStatus" label="直播">
        <template slot-scope="{ row }">
          {{ row.liveStatus == 1 ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="loopVideoUrl"
        label="轮播视频地址"

        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="isAutoLive"
        label="是否官方自动开播直播间"

        width="200"
      >
        <template slot-scope="{ row }">
          {{ row.isAutoLive == 1 ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="180">
        <template slot-scope="{ row }">
          <span
            class="operation_btn"
            type="primary"
            size="mini"
            @click="showCreateDialogClick(row)"
          >设置官方直播间</span>
          <span
            v-if="row.liveId"
            class="operation_btn"
            type="danger"
            size="mini"
            @click="stopClick(row)"
          >停止</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      class="vue-pagination"
      background
      :current-page="listQuery.page"
      :page-sizes="[10, 20, 50, 100, 500, 1000, 5000, 10000]"
      :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listQuery.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      :title="'设置官方直播间'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <div v-cloading="dialogCreateLoading" style="width: 100%; height: 100%">
        <el-form
          ref="dataForm"
          :model="createModel"
          :rules="rules"
          label-position="top"
          size="medium"
        >
          <el-form-item
            label="直播间名称"
            prop="title"
          ><el-input
            v-model="createModel.title"
            clearable
            placeholder="请输入直播间名称"
            maxlength="50"
          /></el-form-item>

          <el-form-item label="直播间封面" prop="livePicUrl">
            <el-upload
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :before-upload="beforeImgUpload"
              :http-request="(params) => uploadImgRequest(params, 'livePicUrl')"
            >
              <img
                v-if="createModel.livePicUrl"
                :src="createModel.livePicUrl"
                class="avatar"
              >
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
            {{ createModel.livePicUrl }}
          </el-form-item>
          <el-form-item
            label="直播间视频地址(多个使用 “ , ” 隔开)"
            prop="videoUrl"
          ><el-input
            v-model="createModel.videoUrl"
            clearable
            placeholder="请输入视频地址"
          /></el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button size="medium" @click="dialogVisible = false">取消</el-button>
        <el-button
          size="medium"
          type="primary"
          @click="handleDataClick()"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPlatformRoomList,
  addPlatformRoom,
  stopPlatformRoom
} from '@/api/center/user/office_anchor'
import { emptyS, nullS, beforeUploadImage, uploadResourceFiles } from '@/utils/tools'

import UserDrawer from '@/components/UserDrawer'
import { file } from '@babel/types'

export default {
  name: 'CenterUserAnchorPage',
  filters: {
    goldMedalFilter(status) {
      const map = { 0: 'info', 1: 'warning', 2: '' }
      return map[status]
    }
  },
  components: {
    UserDrawer
  },
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        total: 0,
        liveId: ''
      },
      createModel: {
        title: '',
        videoUrl: '',
        livePicUrl: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入直播间名称', trigger: 'change' },
          { min: 1, max: 50, message: '最多为50个字符', trigger: 'change' }
        ],
        videoUrl: [
          {
            required: true,
            message: '请输入视频地址(多个使用|隔开)',
            trigger: 'change'
          }
        ],
        livePicUrl: [
          {
            required: true,
            message: '请输入直播间封面',
            trigger: 'change'
          }
        ]
      },
      // 弹窗数值
      dialogId: null,
      dialogVisible: false,
      dialogCreateLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    showCreateDialogClick({ nickname, loopVideoUrl, livePicUrl }) {
      this.dialogVisible = true
      this.createModel = {
        title: nickname,
        videoUrl: loopVideoUrl,
        livePicUrl
      }
    },

    // 获取列表数据
    fetchData() {
      this.listLoading = true
      getPlatformRoomList(
        this.listQuery.limit,
        this.listQuery.page,
        this.listQuery.liveId
      )
        .then((res) => {
          this.listLoading = false
          this.list = [res.data]
          this.listQuery.total = 1
        })
        .catch((res) => {
          this.listLoading = false
        })
    },
    handleDataClick() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const formDic = Object.assign({}, this.createModel)
          // 请求服务器
          this.dialogCreateLoading = true
          const params = {
            title: formDic.title,
            videoUrl: formDic.videoUrl,
            livePicUrl: formDic.livePicUrl
          }
          addPlatformRoom(params)
            .then((res) => {
              this.dialogCreateLoading = false
              this.dialogVisible = false
              this.$notify({
                title: '提示',
                message: '创建官方直播间成功',
                type: 'success',
                duration: 1500
              })
              this.createModel = {
                title: '',
                videoUrl: '',
                livePicUrl: ''
              }
              setTimeout((_) => {
                this.fetchData()
              }, 200)
            })
            .catch((err) => {
              this.dialogCreateLoading = false
              this.$message.error(err)
            })
        }
      })
    },
    stopClick({ liveId }) {
      this.$confirm('是否停止官方直播间播放', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        stopPlatformRoom({}).then((res) => {
          this.$notify({
            title: '提示',
            message: '停止官方直播间成功',
            type: 'success',
            duration: 1500
          })
          setTimeout((_) => {
            this.fetchData()
          }, 200)
        })
      })
    },
    // 上传图片

    beforeImgUpload(file) {
      console.log('-----------上传之前------------')
      const { can, msg } = beforeUploadImage(file.type, file.size)
      if (!can) {
        this.$message.error(msg)
      } else {
        this.dialogCreateLoading = true
      }
      return can
    },

    uploadImgRequest(option, content) {
      console.log('-----------自定义上传方法------------')
      this.$store
        .dispatch('oss/getOSSInfos')
        .then((res) => {
          return uploadResourceFiles({
            ossParams: res,
            fileName: option.file.name,
            file: option.file,
            dir: 'live'
          })
        })
        .then((url) => {
          this.$set(this.createModel, content, url)
          this.dialogCreateLoading = false
        })
        .catch((err) => {
          console.error('oss失败' + JSON.stringify(err))
          this.dialogCreateLoading = false
          this.$message.error('上传失败，请重试')
        })
    },
    // 过滤
    handleSearchFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },

    // 每页的条数改变
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.listQuery.page = 1
      this.fetchData()
    },

    // 当前页改变
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.fetchData()
    }
  }
}
</script>
<style scoped>
.input-with-select {
  background-color: #fff;
  width: 220px;
  margin-right: 10px;
}

.vue-pagination {
  margin: 20px 0px;
  padding: 0px;
}
.vue-img-preview {
  height: 150px;
  object-fit: contain;
}
</style>
