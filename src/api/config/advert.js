import request from '@/utils/request'

// 广告配置列表
export function getAdvertList(pageSize = 20, pageNum = 1, status = null, pids = null) {
  var url = `/advert/base?pageSize=${pageSize}&pageNum=${pageNum}`
  if (status != null && status != undefined && `${status}` != 'null' && `${status}` != '') {
    url += `&status=${status}`
  }
  if (pids != null && pids != undefined && `${pids}` != 'null' && JSON.stringify(pids) != '[]') {
    url += `&pids=${pids}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

// 新增广告配置
export function createAdvert(data) {
  return request({
    url: '/advert/base',
    method: 'post',
    data
  })
}

// 编辑广告配置
export function updateAdvert(data) {
  return request({
    url: '/advert/base',
    method: 'patch',
    data
  })
}

// 刪除广告配置
export function deleteAdvert(ids) {
  return request({
    url: '/advert/base/' + ids,
    method: 'delete'
  })
}
// 手动刷新
export function refreshAdvertList() {
  return request({
    url: '/advert/base/refreshADList',
    method: 'post'
  })
}
