import request from '@/utils/request'

// 主播标签管理
export function getAnchorTagList(pageSize = null, pageNum = null, status = null, type = null) {
  var url = `/tag?`
  if (pageSize != null && pageSize != undefined && `${pageSize}` != 'null' && `${pageSize}` != '') {
    url += `&pageSize=${pageSize}`
  }
  if (pageNum != null && pageNum != undefined && `${pageNum}` != 'null' && `${pageNum}` != '') {
    url += `&pageNum=${pageNum}`
  }
  if (status != null && status != undefined && `${status}` != 'null' && `${status}` != '') {
    url += `&status=${status}`
  }
  if (type != null && type != undefined && `${type}` != 'null' && `${type}` != '') {
    url += `&type=${type}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

// 新增主播标签
export function createAnchorTag(data) {
  return request({
    url: '/tag',
    method: 'post',
    data
  })
}

// 编辑主播标签
export function updateAnchorTag(data) {
  return request({
    url: '/tag',
    method: 'patch',
    data
  })
}

export function refreshAnchorList() {
  return request({
    url: '/tag/refreshAnchorTagList',
    method: 'post'
  })
}
