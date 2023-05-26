import request from '@/utils/request'

// 渠道链接列表
export function getPromotionChannelUrlList(data) {
  var url = '/promotion/channel/url?'
  if (data.pageSize != null && data.pageSize != undefined && `${data.pageSize}` != 'null') {
    url += `&pageSize=${data.pageSize}`
  }
  if (data.pageNum != null && data.pageNum != undefined && `${data.pageNum}` != 'null') {
    url += `&pageNum=${data.pageNum}`
  }
  if (data.channelId != null && data.channelId != undefined && `${data.channelId}` != 'null') {
    url += `&channelId=${data.channelId}`
  }

  return request({
    url: url,
    method: 'get'
  })
}

export function getAllPromotionChannelUrlList(data) {
  var url = '/promotion/channel/url/all?statu=1'
  if (data.channelId != null && data.channelId != undefined && `${data.channelId}` != 'null') {
    url += `&channelId=${data.channelId}`
  }

  return request({
    url: url,
    method: 'get'
  })
}

// 创建渠道链接(单独传渠道id一个就可以)
export function createChannelUrl(id,url) {
  return request({
    url: '/promotion/channel/url',
    method: 'post',
    data: {
      'id': id,
      'url':url
    }
  })
}

// 修改渠道链接状态
// filterUdid(过滤udid),filterIp(过滤ip)为开启-关闭 bindRate(渠道绑定率) 0-100整数
export function updateChannelUrlInfos(data) {
  return request({
    url: '/promotion/channel/url',
    method: 'patch',
    data
  })
}

// 删除渠道url
export function deletePromotionUrl(id) {
  return request({
    url: '/promotion/channel/url/' + id,
    method: 'delete'
  })
}

export function updateChannel(data) {
  return request({
    url: '/promotion/channel/url/url',
    method: 'post',
    data
  })
}



// 渠道链接列表
export function getPromoteUrlList() {
  var url = '/promotion/channel/url/urlList'
  return request({
    url: url,
    method: 'get'
  })
}
