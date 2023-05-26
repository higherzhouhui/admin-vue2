import request from '@/utils/request'

export function getShareList(status = null) {
  var url = `/config/share?`
  if (status != null && status != undefined && `${status}` != 'null' && `${status}` != '') {
    url += `&status=${status}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

// 新增分享链接地址
export function createShare(data) {
  return request({
    url: '/config/share',
    method: 'post',
    data
  })
}

// 部分分享链接地址
export function updateShare(data) {
  return request({
    url: '/config/share',
    method: 'patch',
    data
  })
}

// 删除家族
export function deleteShare(id) {
  return request({
    url: '/config/share/' + id,
    method: 'delete'
  })
}

// 更新分享链接状态
export function updateShareStatus(id, status) {
  if (id === null || id === undefined || id === '') {
    id = 0
  }
  if (status === null || status === undefined || status === '') {
    status = 0
  }
  return request({
    url: '/config/share',
    method: 'patch',
    data: {
      'id': id,
      'status': status
    }
  })
}
