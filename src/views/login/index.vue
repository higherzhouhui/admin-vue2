<template>
  <div class="login-container">
    <div class="top-login">
      <img src="@/icons/img/logo.png" alt="" />
      FBSLive管理后台
    </div>
    <div class="section">
      <img src="@/assets/imgs/login_form.png" alt="" class="" />
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on"
        label-position="left">
        <div class="title-container">
          <h3 class="title">欢迎使用FBSLive管理后台</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container"><svg-icon icon-class="user" /></span>
          <el-input ref="username" v-model="loginForm.username" placeholder="用户名" name="username" type="text"
            tabindex="1" auto-complete="on" />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container"><svg-icon icon-class="password" /></span>
          <el-input ref="password" v-model="loginForm.password" placeholder="密码" name="password" tabindex="2"
            show-password />
          <!-- <span class="show-pwd" @click="showPwd"><svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" /></span> -->
        </el-form-item>

        <el-form-item prop="code">
          <span class="svg-container"><svg-icon icon-class="code" /></span>
          <el-input ref="code" v-model="loginForm.code" placeholder="验证码" name="password" tabindex="3" maxlength="6"
            @keyup.enter.native="handleLogin" />
        </el-form-item>
        <div style="text-align: right;">
          <el-link href="https://newactivity.fbslive.com/course.html" target="_blank">google密钥获取教程</el-link>
        </div>
        <el-button :loading="loading" type="primary" class="login-btn"
          @click.native.prevent="handleLogin">登录</el-button>
      </el-form>
    </div>
    <theme-picker class="themePicker" />
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker'

export default {
  name: 'Login',
  components: {
    ThemePicker,
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 1 || value.length > 12) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不少于6位'))
      } else {
        callback()
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length < 1 || value.length > 6) {
        callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
        code: '',
      },
      loginRules: {
        username: [
          { required: true, trigger: 'change', validator: validateUsername },
        ],
        password: [
          { required: true, trigger: 'change', validator: validatePassword },
        ],
        code: [{ required: true, trigger: 'change', validator: validateCode }],
      },
      loading: false,
      passswordType: 'password',
      redirect: undefined,
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true,
    },
  },
  created() {
    this.$store.dispatch('settings/changeSetting', {
      key: 'theme',
      value: localStorage.getItem('theme') || '#fc708b',
    })
  },
  methods: {
    // showPwd() {
    //   if (this.passwordType === 'password') {
    //     this.passwordType = ''
    //   } else {
    //     this.passwordType = 'password'
    //   }
    //   this.$nextTick(() => {
    //     this.$refs.password.focus()
    //   })
    // },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router
                .push({
                  path: this.redirect || '/',
                })
                .catch((err) => {})
            })
            .catch((err) => {
              this.loading = false
              this.$message.error(err)
            })
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 8px;
      color: #333;
      height: 47px;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #edeef5 inset !important;
        background: #c6cbcf;
        // -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #edeef5;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';

$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  background: url(../../assets/imgs/login_bg.jpg) no-repeat;
  background-size: 100% 100%;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 426px;
    padding: 0px 29px;
    margin-left: 127px;
    overflow: hidden;
    background: #fff;
    border-radius: 20px;
    margin-top: -120px;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    svg {
      fill: var(--theme);
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 28px;
      color: #62678d;
      margin: 32px 0 48px;
      text-align: center;
      font-weight: bold;
      text-shadow: 0px 0px 22px $light_gray;
      line-height: 1;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .login-btn {
    background: var(--theme);
    color: #fff;
    border: none;
    width: 100%;
    height: 51px;
    border-radius: 1000px;
    margin: 19px 0 51px;
    opacity: 0.9;
    font-size: 14px;
    font-weight: bold;
  }

  .login-btn:hover {
    opacity: 1;
  }
}

.top-login {
  padding: 40px;
  color: var(--theme);
  font-size: 42px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 96px;
    height: 96px;
    margin-right: 21px;
  }
}
.section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 176px);
  min-height: 665px;
}
.themePicker {
  display: none;
}
</style>
