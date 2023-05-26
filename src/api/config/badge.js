import request from '@/utils/request'

// 徽章配置列表
export function getBadgeList(pageSize = 20, pageNum = 1) {
  var url = `/badge?pageSize=${pageSize}&pageNum=${pageNum}`
  return request({
    url: url,
    method: 'get'
  })
}

// 新增徽章配置
export function createBadge(data) {
  return request({
    url: '/badge',
    method: 'post',
    data
  })
}

// 编辑徽章配置
export function updateBadge(data) {
  return request({
    url: '/badge',
    method: 'patch',
    data
  })
}

// 刪除徽章配置
export function deleteBadge(ids) {
  return request({
    url: '/badge/' + ids,
    method: 'delete'
  })
}
