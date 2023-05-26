<template>
  <div v-show="visible" class="loading-wrap">
    <div class="loading-box">
      <i class="el-icon-loading" />
    </div>
  </div>
</template>

<script>
// import Vue from "vue";
// export default Vue.extend({
//   data() {
//     return {
//       visible: true,
//     };
//   },
// });
export default {
  data() {
    return {
      visible: true,
    };
  },
};
</script>
<style lang="scss" scoped>
.loading-wrap {
  position: absolute;
  z-index: 2000;
  background-color: rgba(255, 255, 255, 0.9);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}
.loading-box {
  position: relative;
  left: 50%;
  top: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
  i {
    font-size: 22px;
  }
}
</style>
