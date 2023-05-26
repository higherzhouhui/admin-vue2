import axios from 'axios'
import qs from 'qs'
export const pending = new Map()

/**
 * 添加请求
 * @param config
 */
export const addPending = (config) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data)
  ].join('&')

  config.cancelToken = new axios.CancelToken((cancel) => {
    // 確認暫存中沒有相同的key後，把這次請求的cancel函式存起來
    if (!pending.has(url)) pending.set(url, cancel)
  })
}

/**
 * 移除请求
 * @param config
 */
export const removePending = (config) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data)
  ].join('&')
  if (pending.has(url)) {
    const cancel = pending.get(url)
    cancel(url)
    pending.delete(url)
  }
}

/**
 * 清空pending中的请求
 */
export const clearPending = () => {
  pending.forEach((url) => {
    const cancel = (url) => pending.get(url)
    cancel(url)
  })
  pending.clear()
}
