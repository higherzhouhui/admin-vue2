import request from '@/utils/request'

// 开播列表
export function getLiveMonitorList(pageSize = 20, pageNum = 1, uid = null) {
  var url = `/live/monitor/live?pageSize=${pageSize}&pageNum=${pageNum}`
  if (uid != null && uid != undefined && `${uid}` != 'null' && `${uid}` != '') {
    url += `&uid=${uid}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

// 拉流地址
export function getLiveMonitorUrl(pageSize = 20, pageNum = 1, uid = null) {
  return request({
    url: '/live/monitor/rtmpUrl',
    method: 'get'
  })
}

// 修改拉流地址
export function updateLiveMonitorUrl(playerUrl) {
  return request({
    url: `/live/monitor/rtmpUrl?url=${playerUrl}`,
    method: 'patch'
  })
}
