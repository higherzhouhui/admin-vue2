<template>
  <div class="searchMenuContainer">
    <el-input
      v-model="searchValue"
      size="mini"
      placeholder="请输入要搜索的菜单"
      class="search-input"
      @focus="handleFocus"
      @keyup.down.native="keyDown"
      @keyup.up.native="keyUp"
      @keyup.enter.native="keyEnter"
    />
    <el-button icon="el-icon-search" size="mini" />
    <div v-if="searchResult.length" class="result">
      <div
        v-for="(item, index) in searchResult"
        :key="index"
        class="resultList"
      >
        <div :class="{activeList: currentIndex === index}" @click="router(item.href)">{{ item.title }}</div>
      </div>
    </div>
    <div v-if="searchResult.length" class="wholeScreen" @click="handleClear" />
  </div>
</template>
<script>
export default {
  name: 'SearchMenu',
  data() {
    return {
      searchValue: '',
      searchResult: [],
      currentIndex: -1
    }
  },
  watch: {
    searchValue: function() {
      this.onchangeValue()
    }
  },
  methods: {
    onchangeValue() {
      const requestData = [...this.$store.state.permission.dynamicRoutes]
      this.searchResult = []
      this.currentIndex = -1
      if (this.searchValue) {
        this.search(requestData)
      }
    },
    handleFocus() {
      this.onchangeValue()
    },
    search(requestData) {
      if (requestData instanceof Array) {
        requestData.map((item) => {
          if (item.hidden) {
            return
          }
          if (item.children) {
            this.search(item.children)
          } else {
            if (item.meta && item.meta.title.includes(this.searchValue)) {
              if (!item.children) {
                let chref = ''
                // 目前只支持2级目录，todo:有3级的时候再来做兼容
                this.$store.state.permission.dynamicRoutes.map((pitem) => {
                  if (pitem.id === item.pid && item.pid) {
                    chref = pitem.path + '/'
                  }
                })
                this.searchResult.push({
                  title: item.meta.title,
                  href: item.path[0] === '/' ? item.path : chref + item.path
                })
              }
            }
          }
        })
      }
    },
    router(href) {
      this.$router.push(href || '/')
      setTimeout(() => {
        this.searchValue = ''
        this.searchResult = []
      }, 300)
    },
    handleClear() {
      this.searchResult = []
    },
    keyDown() {
      this.currentIndex = this.currentIndex + 1
      if (this.currentIndex === this.searchResult.length) {
        this.currentIndex = -1
      }
    },
    keyUp() {
      if (this.currentIndex === -1) {
        this.currentIndex = this.searchResult.length - 1
        return
      }
      this.currentIndex = this.currentIndex - 1
    },
    keyEnter() {
      this.router(this.searchResult[this.currentIndex].href || '/')
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/styles/variables.scss";
.searchMenuContainer {
  color: var(--theme);
  display: flex;
  position: relative;
  z-index: 99;
  margin-left: 20px;
  .result {
    position: absolute;
    width: 100%;
    left: 0;
    top: 100%;
    background: #fff;
    padding: 5px;
    border-radius: 6px;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
    overflow: auto;
    z-index: 99;
  }

  .resultList {
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    cursor: pointer;
    color: var(--theme);
    opacity: 0.8;
    &:hover {
      color: var(--theme);
      background: var(--subMenuHover);
    }
  }
  .activeList {
      color: var(--theme);
      background: var(--subMenuHover);
  }
}
::v-deep .el-input__inner {
  width: 300px;
  background-color: transparent;
  border: 1px solid #fff;
  color: #fff!important;
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
}

::v-deep .el-button {
  position: absolute;
  right: 0;
  background-color: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
}

.wholeScreen {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: -1;
}
</style>
