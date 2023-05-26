import request from '@/utils/request'

// 广告类别配置列表
export function getAdvertTypeList(pageSize = 20, pageNum = 1) {
  var url = `/advert/type?pageSize=${pageSize}&pageNum=${pageNum}`
  return request({
    url: url,
    method: 'get'
  })
}

// 新增广告类别配置
export function createAdvertType(data) {
  return request({
    url: '/advert/type',
    method: 'post',
    data
  })
}

// 编辑广告类别配置
export function updateAdvertType(data) {
  return request({
    url: '/advert/type',
    method: 'patch',
    data
  })
}

// 刪除广告类别配置
export function deleteAdvertType(id) {
  return request({
    url: '/advert/type/' + id,
    method: 'delete'
  })
}
