<template>
  <div class="app-container" v-cloading="editorLoading">
    <div class="bar">
      <el-button size="small" type="primary" @click="submitClick(true)">发布公告</el-button>
      <el-button size="small" type="danger" @click="submitClick(false)">删除公告</el-button>
      <el-button size="small" icon="el-icon-refresh" @click="fetchData">刷新</el-button>
    </div>
    <Tinymce ref="editor" v-model="content" :height="400" id="tinymce_id" />
  </div>
</template>

<script>
import { getAppNotice, updateAppNotice } from '@/api/config/base';
import { emptyS, nullS } from '@/utils/tools';
import Tinymce from '@/components/Tinymce';

export default {
  name: 'ConfigBaseAppNoticePage',
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
      getAppNotice()
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
          this.$message.error('公告不能为空');
          return;
        }
        title = '确认发布该公告信息？';
        message = '发布公告成功';
        htmlString = nullS(this.content);
      } else {
        // 删除
        title = '确认删除该公告信息？';
        message = '删除公告成功';
        htmlString = '';
      }

      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          this.editorLoading = true;
          updateAppNotice(htmlString)
            .then(res => {
              this.$notify({
                title: '成功',
                message: message,
                type: 'success',
                duration: 1500
              });
              this.editorLoading = false;
              // 删除
              if (status === false) {
                setTimeout(_ => {
                  this.fetchData();
                }, 200);
              }
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
