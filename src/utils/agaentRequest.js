import axios from 'axios'
import {
  Message
} from 'element-ui'
import store from '@/store'
import {
  getTokenHeader,
  getToken
} from '@/utils/auth'
import { addPending, removePending, pending } from './pending'
import { handleRequestConfig } from './tools'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_AGAENT,
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
    // console.warn('------------接收返回成功数据------------')
    // console.warn(JSON.stringify(response))
    // if the custom code is not 20000, it is judged as an error.
    if (res.code === 200 || res.code === 0) {
      return res
    } else {
      if (res instanceof Blob) { // 如果返回的是文件流的形式，直接return res
        return res
      } else {
        let message = res.message || res.msg || '网络错误，请刷新重试'
        if (res.code === 502 || res.code === 503) {
          message = '正在升级中，请稍后...'
        }
        Message.error(message)
        return res
      }
    }
  },
  error => {
    // 如果是请求被取消了，不抛出异常
    if (error.message) {
      if (pending.has(error.message)) {
        return Promise.resolve({ data: { row: [], list: [] }})
      }
    }
    console.error('------------接收返回错误数据------------')
    console.error(JSON.stringify(error))
    console.log(error.response.data.status)
    var msg = '请求失败'
    const res = error.response
    const resData = error.response.data
    if (res != null && resData != null) {
      if (Object.prototype.toString.call(resData) === '[object String]') {
        if (msg !== '') {
          msg = resData + ''
        }
      } else if (Object.prototype.toString.call(resData) === '[object Object]') {
        if (JSON.stringify(resData) !== '{}') {
          // eslint-disable-next-line no-prototype-builtins
          if (resData.hasOwnProperty('message')) {
            msg = resData.message + ''
          }
        }
      }
    }
    Message.error(msg || '网络错误，请刷新！')
    return Promise.reject(msg)
  }
)

export default service
