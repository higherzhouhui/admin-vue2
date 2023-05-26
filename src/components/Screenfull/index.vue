<template>
  <div class="full" @click="click">
    <span>{{ isFullscreen ? '退出全屏' : '全屏体验更佳' }}</span><svg-icon class="fullIcon" :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" />
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
      if (!screenfull.isEnabled) {
        this.$message({
          message: 'you browser can not support full screen!',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.isEnabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.fullIcon {
  color: rgba(255,255,255,0.6);
  width: 20px;
  height: 20px;
}
.full {
  display: flex;
  align-items: center;
  cursor: pointer;
  span {
    font-size: 14px;
    margin-right: 8px;
    color: rgba(255,255,255,0.6);
  }
}
</style>
