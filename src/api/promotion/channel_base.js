import request from '@/utils/request'

/**
 * 渠道列表
 * pageSize
 * pageNum
 * channel 渠道名
 * flagDelete 启用禁用
 */
export function getPromotionChannelList(data) {
  var url = '/promotion/channel?'
  if (data.pageSize != null && data.pageSize != undefined && `${data.pageSize}` != 'null') {
    url += `&pageSize=${data.pageSize}`
  }
  if (data.pageNum != null && data.pageNum != undefined && `${data.pageNum}` != 'null') {
    url += `&pageNum=${data.pageNum}`
  }
  if (data.channel != null && data.channel != undefined && `${data.channel}` != 'null' && `${data.channel}` != '') {
    url += `&channel=${data.channel}`
  }
  if (data.url != null && data.url != undefined && `${data.url}` != 'null' && `${data.url}` != '') {
    url += `&url=${data.url}`
  }
  if (data.flagDelete != null && data.flagDelete != undefined && `${data.flagDelete}` != 'null') {
    url += `&flagDelete=${data.flagDelete}`
  }

  return request({
    url: url,
    method: 'get'
  })
}

export function getPromotionChannelUrl(data) {
  var url = '/promotion/channel/urlList?'
  if (data.limit != null && data.limit != undefined && `${data.limit}` != 'null') {
    url += `&pageSize=${data.limit}`
  }
  if (data.page != null && data.page != undefined && `${data.page}` != 'null') {
    url += `&pageNum=${data.page}`
  }
  if (data.channel != null && data.channel != undefined && `${data.channel}` != 'null' && `${data.channel}` != '') {
    url += `&channel=${data.channel}`
  }
  if (data.url != null && data.url != undefined && `${data.url}` != 'null' && `${data.url}` != '') {
    url += `&url=${data.url}`
  }
  if (data.flagDelete != null && data.flagDelete != undefined && `${data.flagDelete}` != 'null') {
    url += `&flagDelete=${data.flagDelete}`
  }

  return request({
    url: url,
    method: 'get'
  })
}

// 创建渠道(请求只传渠道名字就可以,回显密码)
export function createChannelWithName(name) {
  return request({
    url: '/promotion/channel',
    method: 'post',
    data: {
      'channel': name
    }
  })
}

// 修改渠道状态(启用-禁用)
export function updateChannelFlagdelete(id, flag) {
  return request({
    url: '/promotion/channel',
    method: 'patch',
    data: {
      'id': id,
      'flagDelete': flag
    }
  })
}

// 重置密码,回显密码,只传id即可
export function resetChannelPwd(id) {
  return request({
    url: '/promotion/channel/resetPwd',
    method: 'patch',
    data: {
      'id': id
    }
  })
}

// 删除渠道
export function deletePromotionBase(id) {
  return request({
    url: '/promotion/channel/' + id,
    method: 'delete'
  })
}


export function createChannel(data) {
  return request({
    url: '/promotion/channel',
    method: 'post',
    data
  })
}
