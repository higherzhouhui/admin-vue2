<template>
  <el-color-picker
    v-model="theme"
    :predefine="[
      '#fc708b',
      '#409EFF',
      '#389E0D',
      '#FAAD14',
      '#212121',
      '#11a983',
      '#13c2c2',
      '#6959CD',
      '#f5222d',
      '#F80085',
    ]"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
  />
</template>

<script>
// import { chalkCss } from './chalk.js' // 就是 getCSSString 接口中获取的 css，这里我将版本号固定并且把 css 缓存到本地，记得处理 \ 转义问题

const version = require('element-ui/package.json').version // element-ui version from node_modules
const ORIGINAL_THEME = 'var(--theme)' // default color  chalk.js 中的 primary color，根据此颜色计算出一系列颜色进行正则替换

export default {
  name: 'ThemePicker',
  data() {
    return {
      chalk: '', // content of theme-chalk css
      theme: ''
    }
  },
  computed: {
    defaultTheme() {
      return this.$store.state.settings.theme
    }
  },
  watch: {
    defaultTheme: {
      handler: function(val, oldVal) {
        this.theme = val
      },
      immediate: true
    },
    async theme(val) {
      this.changeCss(val)
    }
  },
  created() {
    this.changeCss(this.$store.state.settings.theme)
  },
  methods: {
    updateStyle(style, oldCluster, newCluster) {
      let newStyle = style
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
      })
      return newStyle
    },

    getCSSString(url, variable) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest()
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '')
            resolve()
          }
        }
        xhr.open('GET', url)
        xhr.send()
      })
    },

    getThemeCluster(theme) {
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        if (tint === 0) {
          // when primary color is in its rgb space
          return [red, green, blue].join(',')
        } else {
          red += Math.round(tint * (255 - red))
          green += Math.round(tint * (255 - green))
          blue += Math.round(tint * (255 - blue))

          red = red.toString(16)
          green = green.toString(16)
          blue = blue.toString(16)

          return `#${red}${green}${blue}`
        }
      }

      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        red = Math.round((1 - shade) * red)
        green = Math.round((1 - shade) * green)
        blue = Math.round((1 - shade) * blue)

        red = red.toString(16)
        green = green.toString(16)
        blue = blue.toString(16)

        return `#${red}${green}${blue}`
      }

      const clusters = [theme]
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
      }
      clusters.push(shadeColor(theme, 0.1))
      return clusters
    },
    themeColorObj(val) {
      const theme = val
      const handleSpecial = (specialColor) => {
        let newColor = specialColor
        if (specialColor.length > 2) {
          newColor = specialColor.slice(0, 2)
        }
        if (specialColor.length < 2) {
          newColor = specialColor + specialColor
        }
        return newColor
      }
      const shadeColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)

        red += Math.round(tint * (255 - red))
        green += Math.round(tint * (255 - green))
        blue += Math.round(tint * (255 - blue))

        red = handleSpecial(red.toString(16))
        green = handleSpecial(green.toString(16))
        blue = handleSpecial(blue.toString(16))
        return `#${red}${green}${blue}`
      }
      const color = theme.replace('#', '')
      const menuText = '#333333'
      // const menuActiveText = shadeColor(color, 0)
      const menuBg = '#F8F9FB'
      const menuHover = shadeColor(color, 0.8)
      const subMenuBg = shadeColor(color, 0.99)
      const subMenuHover = shadeColor(color, 0.8)
      const menuActiveBg = '#fff'
      const subMenuActiveBg = shadeColor(color, 0.01)
      const subMenuActiveText = theme
      return {
        '--theme': theme,
        '--menuText': menuText,
        '--menuActiveText': theme,
        '--menuBg': menuBg,
        '--menuHover': menuHover,
        '--subMenuBg': subMenuBg,
        '--subMenuHover': subMenuHover,
        '--subMenuActiveText': subMenuActiveText,
        '--subMenuText': menuActiveBg,
        '--subMenuHoverText': theme,
        '--subMenuActiveBg': subMenuActiveBg,
        '--menuActiveBg': menuActiveBg
      }
    },
    async changeCss(val) {
      // const oldVal = this.chalk ? this.theme : ORIGINAL_THEME
      // if (typeof val !== 'string') return
      // const themeCluster = this.getThemeCluster(val.replace('#', ''))
      // const originalCluster = this.getThemeCluster(oldVal.replace('#', ''))

      // const $message = this.$message({
      //   message: 'theme is changing',
      //   customClass: 'theme-message',
      //   type: 'success',
      //   duration: 0,
      //   iconClass: 'el-icon-loading'
      // })

      // const getHandler = (variable, id) => {
      //   return () => {
      //     const originalCluster = this.getThemeCluster(
      //       ORIGINAL_THEME.replace('#', '')
      //     )
      //     const newStyle = this.updateStyle(
      //       this[variable],
      //       originalCluster,
      //       themeCluster
      //     )
      //     let styleTag = document.getElementById(id)
      //     if (!styleTag) {
      //       styleTag = document.createElement('style')
      //       styleTag.setAttribute('id', id)
      //       document.head.appendChild(styleTag)
      //     }
      //     styleTag.innerText = newStyle
      //   }
      // }

      // if (!this.chalk) {
      //   // const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`
      //   const url = `@/styles/theme.css`
      //   await this.getCSSString(url, 'chalk')
      //   // this.chalk = chalkCss.replace(/@font-face{[^}]+}/, '') // 本地缓存，如果需要获取线上的就用上面那种方式，优点：切换无延迟，缺点：需要手动维护 css string
      // }

      // const chalkHandler = getHandler('chalk', 'chalk-style')

      // chalkHandler()

      // const styles = [].slice
      //   .call(document.querySelectorAll('style'))
      //   .filter((style) => {
      //     const text = style.innerText
      //     return (
      //       new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
      //     )
      //   })
      // styles.forEach((style) => {
      //   const { innerText } = style
      //   if (typeof innerText !== 'string') return
      //   style.innerText = this.updateStyle(
      //     innerText,
      //     originalCluster,
      //     themeCluster
      //   )
      // })

      // this.$emit('change', val)
      // $message.close()
      const reg1 = new RegExp('\"', 'g')
      const reg2 = new RegExp(',', 'g')
      const style = JSON.stringify(this.themeColorObj(val)).replace(reg1, '').replace('{', '').replace('}', '').replace(reg2, ';')
      document.querySelector('body').setAttribute('style', style)
      localStorage.setItem('theme', val)
    }
  }
}
</script>

<style>
.theme-message,
.theme-picker-dropdown {
  z-index: 99999 !important;
}
.theme-picker {
  opacity: 0;
  z-index: 3;
}
.theme-picker .el-color-picker__trigger {
  height: 26px !important;
  width: 26px !important;
  padding: 2px;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
