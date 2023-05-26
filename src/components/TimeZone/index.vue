<template>
  <div class="timeZoneContainer">
    <!-- <svg-icon icon-class="timezone" class="" /> -->
    <span>时区设置：</span><el-select v-model="currentZone" size="mini" style="width: 120px; border: 1px solid #fff; border-radius: 5px;" @change="changeCurrentZone">
      <el-option v-for="(item, index) in timeZoneList" :key="index" :value="item.value" :label="item.label" />
    </el-select>
  </div>
</template>
<script>
export default {
  name: 'TimeZone',

  data() {
    return {
      currentZone: localStorage.getItem('currentTimeZone') || '0',
      timeZoneList: [
        { value: '-7', label: 'GMT' },
        { value: '0', label: 'GMT+7' },
        { value: '1', label: 'GMT+8' },
        { value: '2', label: 'GMT+9' }
      ]
    }
  },
  methods: {
    changeCurrentZone(val) {
      const coption = this.timeZoneList.filter(item => {
        return item.value === val
      }) || this.timeZoneList
      this.$confirm(`是否确认切换时区为${coption[0].label}？(切换后页面将刷新)`, '切换时区', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      })
        .then(() => {
          localStorage.setItem('currentTimeZone', val)
          this.$message({
            type: 'success',
            message: '时区切换成功，即将刷新！'
          })
          setTimeout(() => {
            location.reload()
          }, 800)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消切换时区'
          })
          this.currentZone = localStorage.getItem('currentTimeZone') || '0'
        })
    }
  }
}
</script>

<style scoped lang="scss">
.timeZoneContainer {
  display: flex;
  align-items: center;
    span {
        font-size: 14px;
        color: rgba(255,255,255,0.6);
    }
    display: flex;
    margin-right: 20px;
}
::v-deep .el-input__inner {
  background: transparent;
  border: none;
  color: #fff;
}
</style>

