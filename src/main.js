import Vue from 'vue'
import '@/styles/theme.css'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import '@/styles/variables.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import DatePicker from './components/TimerPicker/DatePicker.vue'
import Directive from './directive/cloading/index'
import '@/icons' // icon
import '@/permission' // permission control
import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)
router.beforeEach((to, from, next) => {
  store.commit('app/SET_LOADING', true)
  next()
})
router.afterEach((to, from) => {
  setTimeout(() => {
    store.commit('app/SET_LOADING', false)
  }, 500)
})
// 日期格式化
import moment from 'moment'
Vue.prototype.$moment = moment
// set ElementUI lang to EN
Vue.use(ElementUI)
// Vue.use(ElementUI, { locale })
Vue.component('DatePicker', DatePicker)
Vue.use(Directive)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
