import request from '@/utils/request'

// app公告信息
export function getAppNotice() {
  return request({
    url: '/base/appNotice',
    method: 'get'
  })
}

// app公告信息修改
export function updateAppNotice(msg) {
  return request({
    url: '/base/appNotice',
    method: 'patch',
    data: {
      appNotice: msg
    }
  })
}

export function getContent() {
  return request({
    url: '/base/coin',
    method: 'get'
  })
}

export function updateContent(msg) {
  return request({
    url: '/base/coin',
    method: 'patch',
    data: {
      content: msg
    }
  })
}

// 基础url配置
export function getBaseConfigUrl() {
  return request({
    url: '/base/baseConfigUrl',
    method: 'get'
  })
}

// 基础url配置修改
export function updateBaseConfigUrl(data) {
  return request({
    url: '/base/baseConfigUrl',
    method: 'patch',
    data
  })
}

// 开屏广告
export function getHomeAdvert() {
  return request({
    url: '/base/homeAdvert',
    method: 'get'
  })
}

// 开屏广告修改
export function updateHomeAdvert(data) {
  return request({
    url: '/base/homeAdvert',
    method: 'patch',
    data
  })
}
