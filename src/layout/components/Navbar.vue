<template>
  <div class="navbar">
    <div class="left-menu">
      <Logo class="headerLogo" />
      <hamburger v-if="!sidebar.opened" id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
        @toggleClick="toggleSideBar" />
      <search-menu />
      <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
      <Mark />
    </div>
    <div class="right-menu">
      <TimeZone />
      <div class="themeWrapper">
        <theme-picker class="themePicker" @change="themeChange" />
        <img src="@/assets/imgs/theme.png" alt="color" class="yifuIcon" />
      </div>
      <!-- <template v-if="device !== 'mobile'">
        <screenfull id="screenfull" class="screenfull" />
      </template> -->
      <el-dropdown class="avatar-container  hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <div>
            <img v-if="avatar" :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar">
            <img v-else src="@/icons/img/logo.png" alt="logo">
          </div>
          <div class="desc">
            <div class="userName">{{ this.$store.state.user.name }}</div>
            <div class="role">{{ this.$store.state.user.roles[0] }}</div>
          </div>

          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/"><el-dropdown-item>主页</el-dropdown-item></router-link>
          <el-dropdown-item divided><span style="display:block;" @click="logout">退出登录</span></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import TimeZone from '@/components/TimeZone'
import SearchMenu from '@/components/SearchMenu'
import Logo from '@/layout/components/Sidebar/Logo'
import ThemePicker from '@/components/ThemePicker'
import Mark from '@/components/mark'
import { webSocket } from '@/utils/socket'

export default {
  components: {
    Hamburger,
    TimeZone,
    SearchMenu,
    Logo,
    ThemePicker,
    Mark
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device'])
  },
  created() {
    this.themeChange(localStorage.getItem('theme') || '#fc708b')
    webSocket()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // methods
    themeChange(val) {
      this.$store.dispatch('settings/changeSetting', {
        key: 'theme',
        value: val
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)

    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

.navbar {
  height: $navbarHeight;
  position: relative;
  background: var(--theme);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;

  .left-menu {
    display: flex;
    align-items: center;
  }

  .headerLogo {
    display: inline-block;
  }

  .hamburger-container {
    height: 100%;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    color: #fff;
    margin-right: 12px;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;

    &:focus {
      outline: none;
    }

    .themePicker {
      height: auto;
      margin-top: 2px;
    }

    .themeWrapper {
      display: flex;
      align-items: center;
      margin: 0 36px;
      position: relative;

      .title {
        color: rgba(255, 255, 255, 0.6);
        font-size: 14px;
      }

      .yifuIcon {
        position: absolute;
        width: 26px;
        height: 26px;
        right: 0;
        z-index: 1;
      }
    }

    .screenfull {
      margin: 0 12px;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      cursor: pointer;

      .avatar-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;

        img {
          height: 40px;
          object-fit: contain;
          margin-right: 6px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          object-fit: cover;
        }

        .desc {
          font-size: 12px;
          color: #fff;

          .userName {
            font-size: 14px;
            font-weight: 500;
          }

          .role {
            font-size: 12px;
            opacity: 0.8;
            margin-top: 6px;
          }
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          font-size: 14px;
          color: #fff;
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
