<template>
  <div class="app-container page" v-cloading="loading">
    <el-form class="form-container" :model="advertModel" ref="advertForm" :rules="rules" label-position="top">
      <el-form-item label="广告图片">
        <div class="img-container">
          <img class="img-iphone" src="../../../../assets/imgs/iphone_exterior.png" />
          <el-image class="advert" fit="contain" :src="advertModel.imgUrl" :preview-src-list="[advertModel.imgUrl]">
            <div slot="error" class="image-slot"><span class="error-slot-title">暂无图片</span></div>
          </el-image>
        </div>
      </el-form-item>
      <div class="uploadFileDesc" v-html="getImageLibary('openApp', true)" />
      {{ advertModel.imgUrl }}
      <el-form-item label="跳转地址" prop="jumpUrl">
        <el-input v-model="advertModel.jumpUrl" placeholder="请输入广告跳转地址" maxlength="500" clearable show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div class="actions">
      <el-button @click="advertModel.imgUrl = null" size="small" type="danger">清空图片</el-button>
      <span style="margin-right: 20px;"></span>
      <el-upload action="" :multiple="false" :show-file-list="false" :before-upload="beforeImgUpload" :http-request="uploadImgRequest">
        <el-button size="small" type="primary">上传图片</el-button>
      </el-upload>
      <span style="margin-right: 20px;"></span>
      <el-button style="margin: 0px" type="success" size="small" @click="submitForm()">保存配置</el-button>
    </div>
  </div>
</template>

<script>
import { getHomeAdvert, updateHomeAdvert } from '@/api/config/base';
import { getImageLibary, nullS, beforeUploadImage, uploadResourceFiles } from '@/utils/tools';

export default {
  name: 'ConfigBaseHomeAdvertPage',
  data() {
    return {
      loading: false,
      getImageLibary: getImageLibary,
      advertModel: {
        imgUrl: null,
        jumpUrl: null
      },
      // 验证规则
      rules: {
        // jumpUrl: [{ required: true, message: '请输入广告跳转地址', trigger: 'change' }, { min: 1, max: 100, message: '最多为100个字符', trigger: 'change' }]
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 获取数据
    fetchData() {
      this.loading = true;
      getHomeAdvert()
        .then(res => {
          const formDic = res.data || {};
          this.advertModel = {
            imgUrl: nullS(formDic.imgUrl),
            jumpUrl: nullS(formDic.jumpUrl)
          };
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err);
        });
    },

    // 提交表单
    submitForm() {
      this.$refs['advertForm'].validate(valid => {
        if (valid) {
          this.$confirm('确定使用该配置吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false
          })
            .then(() => {
              const formDic = Object.assign({}, this.advertModel); // copy obj
              this.loading = true;
              // 请求服务器
              updateHomeAdvert({
                imgUrl: nullS(formDic.imgUrl),
                jumpUrl: nullS(formDic.jumpUrl)
              })
                .then(() => {
                  this.loading = false;
                  this.$notify({
                    title: '成功',
                    message: '修改配置成功',
                    type: 'success',
                    duration: 1500
                  });
                })
                .catch(err => {
                  this.loading = false;
                  this.$message.error(err);
                });
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },

    // 上传图片

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
          return uploadResourceFiles({
            ossParams: res,
            fileName: option.file.name,
            file: option.file,
            dir: 'openApp'
          })
        })
        .then(url => {
          this.advertModel.imgUrl = url;
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

<style lang="scss" scoped>
.page {
  background: url(../../../../assets/imgs/bg_1.svg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.form-container {
  background-color: transparent;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  padding: 20px 60px 20px 60px;
}

.img-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img-iphone {
  position: relative;
  width: 220px;
  height: 450px;
  z-index: 100;
  object-fit: contain;
  pointer-events: none;
}

.advert {
  cursor: pointer;
  overflow: hidden;
  position: absolute;
  width: 195px;
  height: 350px;
}

.error-slot-title {
  color: #909399;
  font-size: 20px;
  font-weight: 400;
}

.actions {
  display: flex;
  margin-top: 15px;
}
.tips{
  width: 100%;
  text-align: center;
  color: red;
  font-size: 12px;
  margin-top: 10px;
}
</style>
