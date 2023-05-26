import request from '@/utils/request'

// 直播间广告配置列表
export function getLiveAdvertList(pageSize = 20, pageNum = 1, status = null) {
  var url = `/live/advert/base?pageSize=${pageSize}&pageNum=${pageNum}`
  if (status != null && status != undefined && `${status}` != 'null' && `${status}` != '') {
    url += `&status=${status}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

// 新增直播间广告配置
export function createLiveAdvert(data) {
  return request({
    url: '/live/advert/base',
    method: 'post',
    data
  })
}

// 编辑直播间广告配置
export function updateLiveAdvert(data) {
  return request({
    url: '/live/advert/base',
    method: 'patch',
    data
  })
}

// 刪除直播间广告配置
export function deleteLiveAdvert(ids) {
  return request({
    url: '/live/advert/base/' + ids,
    method: 'delete'
  })
}
