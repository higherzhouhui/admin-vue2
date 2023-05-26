import request from '@/utils/request'

/**
 * 实时用户统计(今日)
 */
export function getOntimeUser(data) {
  var url = '/liveOnlineTotal/totalLiveOnlineTotalVO'
  return request({
    url: url,
    method: 'get'
  })
}

/**
 * 历史用户统计
 */
export function getHistoryOntimeUser(data) {
  var url = '/liveOnlineTotal/totalLiveOnlineTotalVOList'
  return request({
    url: url,
    method: 'post',
    data
  })
}
