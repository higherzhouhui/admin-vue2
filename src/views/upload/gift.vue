<template>
  <div class="app-container" v-cloading="loading">
    <el-upload class="avatar-uploader" action="" :show-file-list="false" :before-upload="beforeImgUpload" :http-request="uploadImgRequest">
      <img v-if="address" :src="address" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <div style="margin: 20px 0px;">
      <el-button size="medium" @click="cleanClick">清除图片</el-button>
      <el-button size="medium" :disabled="address == null" plain type="primary" @click="handleCopy(address, $event)">复制地址</el-button>
    </div>
    <div v-if="address" class="upload-address">{{ address }}</div>
  </div>
</template>

<script>
import { beforeUploadImage, uploadFile } from '@/utils/gift';
import clip from '@/utils/clipboard'; // use clipboard directly

export default {
  name: 'TestUploadPage',
  data() {
    return {
      loading: false,
      address: null
    };
  },
  created() {},
  methods: {
    cleanClick() {
      this.address = null;
    },

    handleCopy(text, event) {
      clip(text, event);
    },

    beforeImgUpload(file) {
      console.log('-----------上传之前------------');
      const { can, msg } = beforeUploadImage(file.type, file.size);
      if (!can) {
        this.$message.error(msg);
      } else {
        this.loading = true;
      }
      return can;
    },

    uploadImgRequest(option) {
      console.log('-----------自定义上传方法------------');
      this.$store
        .dispatch('oss/getOSSInfos')
        .then(res => {
          return uploadFile(res, this.$route.path, option.file.name, option.file);
        })
        .then(url => {
          this.address = url;
          this.loading = false;
        })
        .catch(err => {
          console.error('oss失败' + JSON.stringify(err));
          this.loading = false;
          this.$message.error('上传失败，请重试');
        });
    }
  }
};
</script>
<style scoped>
.upload-address {
  padding: 0px;
  margin: 0px;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #909399;
}
</style>
