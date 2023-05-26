<template>
  <div :class="{ 'has-logo': showLogo }">
    <!-- <logo v-if="showLogo" :collapse="isCollapse" /> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        ref="menus"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="horizontal"
        :menu-trigger="this.$store.state.app.sidebar.opened ? 'click' : 'hover'"
        :default-openeds="activeOpenMenu"
        @close="handleClose"
      >
        <sidebar-item
          v-for="(route,index) in routes"
          :key="index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
    <div v-cloading="true" class="zhanwei" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem },
  data() {
    return {
      oepn: ['/user']
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    routes() {
      return this.$router.options.routes
    },
    keepOpen() {
      return this.$store.state.settings.keepOpen
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    activeOpenMenu() {
      const route = this.$route
      const routeArray = route.fullPath.split('/')
      if (routeArray && routeArray.length > 0) {
        return [`/${routeArray[1]}`]
      }
      return ['/user']
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {
    keepOpen(e) {
      if (e) {
        const route = this.$route
        const routeArray = route.fullPath.split('/')
        let path = ['/user']
        if (routeArray && routeArray.length > 0) {
          path = [`/${routeArray[1]}`]
        }
        this.$refs.menus.open(path)
        this.$store.dispatch('settings/changeSetting', {
          key: 'keepOpen',
          value: false
        })
      }
    }
  },
  methods: {
    handleClose(index, path) {
      if (this.$store.state.app.sidebar.opened) {
        // 禁止关闭
        this.$refs.menus.open(path)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.zhanwei {
  position: fixed;
  width: 150px;
  height: 100vh;
  top: 60px;
  left: 100px;
  background: #fff;
  z-index: -1;
}
</style>
