import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
Vue.use(Router)
import { getDateTime } from '@/utils/tools'
/* Layout */
import Layout from '@/layout'
import { close } from '@/utils/socket'

// 404 page must be placed at the end !!!
export const errorRoutes = [{
  path: '/404',
  component: () => import('@/views/error-page/404'),
  hidden: true
}, {
  path: '/401',
  component: () => import('@/views/error-page/401'),
  hidden: true
}, {
  path: '*',
  redirect: '/404',
  hidden: true
}]

// 所有权限通用路由表
// 如首页和登录页和一些不用权限的公用页面
export const constantRoutes = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path*',
    component: () => import('@/views/redirect/index')
  }]
}, {
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},

// ------ 主页 ------
{
  path: '/',
  redirect: '/home/dashboard/index'
}
  // {
  //   path: '/home',
  //   component: Layout,
  //   id: 10001,
  //   hidden: true,
  //   meta: {
  //     title: '主页',
  //     icon: 'mainpage'
  //   },
  //   children: [
  //     {
  //       path: '/home/dashboard/index',
  //       component: () => import('@/views/dashboard/index'),
  //       pid: 10001,
  //       meta: {
  //         title: '首页',
  //         noCache: true, // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
  //         affix: true
  //       }
  //     },
  //     {
  //       path: '/home/uploadImg',
  //       component: () => import('@/views/login/test'),
  //       name: 'TestUploadPage',
  //       meta: {
  //         title: '上传图片',
  //         noCache: true
  //       }
  //     }
  //   ]
  // }

  // {
  //   path: '/test_upload',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   children: [{
  //     path: '/test',
  //     component: () => import('@/views/login/test'),
  //     name: 'TestUploadPage',
  //     meta: {
  //       title: '上传图片',
  //       icon: 'guide',
  //       noCache: true
  //     }
  //   }]
  // }
]

// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRoutes = []

// 实例化vue的时候只挂载constantRouter
const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

router.beforeEach((to, from, next) => {
  const { NOW_TIME_START, NOW_TIME_END } = getDateTime()
  store.dispatch('user/setDate', { NOW_TIME_START, NOW_TIME_END })
  if (to.path === '/login') {
    try {
      close()
    } catch (error) {
    }
  }
  next()
})




// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  router.options.routes = null
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
