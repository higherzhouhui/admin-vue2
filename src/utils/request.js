import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import {
  getTokenHeader,
  getToken
} from '@/utils/auth'
import { addPending, removePending, pending } from './pending'
import { handleRequestConfig } from './tools'
let bigListJson = {}
// create an axios instance
const service = axios.create({
  // url = base url + request url
  //  baseURL: process.env.NODE_ENV === 'development' ? 'http://47.74.7.80:8080/' : 'http://47.74.7.80:8080/',//s18
  //  baseURL: process.env.NODE_ENV === 'development' ? 'http://47.74.7.80:8080/' : 'http://127.0.0.1:8080/',//s18
  baseURL: process.env.VUE_APP_BASE_API || '/liveAdmin',
  //  baseURL: process.env.NODE_ENV === 'development' ? 'http://192.168.50.79:8080/' : '',//didi
  //  baseURL: process.env.NODE_ENV === 'development' ? 'http://8.214.38.122:8080/' : 'http://8.214.38.122:8080/',//生产
  // baseURL: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8080/' : 'http://127.0.0.1:8080/',//本地
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 1000000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      const tokenHeader = getTokenHeader()
      const token = getToken()
      config.headers[tokenHeader] = token
    }
    handleRequestConfig(config)
    removePending(config)
    addPending(config)
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    removePending(response)
    const res = response.data
    if (res.code == 8000) {
      Message.warning(res.message || res.msg)
      if (bigListJson[response.config.url]) {
        try {
          return JSON.parse(bigListJson[response.config.url])
        } catch (error) { }
      }
    }
    if (res.data) {
      try {
        bigListJson[response.config.url] = JSON.stringify(res)
      } catch (error) { }
    }

    // console.warn('------------接收返回成功数据------------')
    // console.warn(JSON.stringify(response))

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000 &&
      res.code !== 200 &&
      res.code !== 0 &&
      res.code !== '20000' &&
      res.code !== '200' &&
      res.code !== '0') {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (res.code === 50008 ||
      //   res.code === 50012 ||
      //   res.code === 50014) {
      //   // to re-login
      //   MessageBox.confirm('您已经注销，您可以取消以停留在此页面，或再次登录',
      //     'Confirm logout', {
      //       confirmButtonText: '重新登录',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }).then(() => {
      //     store.dispatch('user/resetToken').then(() => {
      //       location.reload()
      //     })
      //   })
      // }
      if (res instanceof Blob) { // 如果返回的是文件流的形式，直接return res
        return res
      } else {
        let message = res.message || res.msg || '网络错误，请刷新重试'
        if (res.code === 502 || res.code === 503) {
          message = '正在升级中，请稍后...'
        }
        return Promise.reject(message)
      }
      // return Promise.reject(res.message || '错误')
    } else {
      return res
    }
  },
  error => {
    // 如果是请求被取消了，不抛出异常
    if (error.message) {
      if (pending.has(error.message)) {
        return Promise.resolve({ data: { row: [], list: [] } })
      }
    }
    console.error('------------接收返回错误数据------------')
    var msg = '请求失败'
    const res = error.response
    if (res.status === 503 || res.status === 502) {
      return Promise.reject('服务器端错误(正在维护中)！')
    }
    const resData = error.response.data
    if (res != null && resData != null) {
      if (Object.prototype.toString.call(resData) === '[object String]') {
        if (msg != '') {
          msg = resData + ''
        }
      } else if (Object.prototype.toString.call(resData) === '[object Object]') {
        if (JSON.stringify(resData) != '{}') {
          if (resData.hasOwnProperty('message')) {
            msg = resData.message + ''
          }
        }
      }
    }
    return resData
  }
)

export default service
