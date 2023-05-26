<template>
  <div class="app-container" v-cloading="editorLoading">
    <div class="bar">
      <div class="bar-title-v"><span class="bar-title">编辑分享文案信息</span></div>
      <el-button plain type="primary" @click="submitClick(true)">编辑分享文案</el-button>
    </div>
    <Tinymce ref="editor" v-model="content" :height="400" id="tinymce_id" />
  </div>
</template>

<script>
import { getShareContent, updateShareContent } from '@/api/promotion/content';
import { emptyS, nullS } from '@/utils/tools';
import Tinymce from '@/components/Tinymce';

export default {
  name: 'CreateShareContent',
  components: { Tinymce },
  filters: {},
  data() {
    return {
      editorLoading: true,
      content: ''
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    // 加载数据
    fetchData() {
      this.editorLoading = true;
      getShareContent()
        .then(res => {
          this.editorLoading = false;
          this.content = nullS(res.data);
        })
        .catch(err => {
          this.editorLoading = false;
          this.$message.error(err);
        });
    },

    // 点击按钮
    submitClick(status) {
      var htmlString = '';
      var title = '';
      var message = '';
      if (status === true) {
        // 发布
        if (emptyS(`${this.content}`)) {
          this.$message.error('分享文案不能为空');
          return;
        }
        title = '确认发布该分享文案？';
        message = '发布分享文案成功';
        htmlString = nullS(this.content);
      }
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          this.editorLoading = true;
          updateShareContent(htmlString)
            .then(res => {
              this.$notify({
                title: '成功',
                message: message,
                type: 'success',
                duration: 1500
              });
              this.editorLoading = false;
            })
            .catch(err => {
              this.editorLoading = false;
              this.$message.error(err);
            });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.bar {
  margin: 0px 0px 40px 0px;

  .bar-title-v {
    margin-bottom: 40px;

    .bar-title {
      color: #303133;
      font-size: 26px;
      font-weight: 400;
      line-height: 30px;
    }
  }
}
</style>
