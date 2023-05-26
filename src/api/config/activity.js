import request from '@/utils/request'

// 活动配置列表
export function getActivityList(data) {
  var url = `/activityType/list?`
  if (data.pageSize != null && data.pageSize != undefined && `${data.pageSize}` != 'null' && JSON.stringify(data.pageSize) != '[]') {
    url += `pageSize=${data.pageSize}`
  }
  if (data.pageNum != null && data.pageNum != undefined && `${data.pageNum}` != 'null' && JSON.stringify(data.pageNum) != '[]') {
    url += `&pageNum=${data.pageNum}`
  }
  if (data.distributeType != null && data.distributeType != undefined && `${data.distributeType}` != 'null' && JSON.stringify(data.distributeType) != '[]') {
    url += `&distributeType=${data.distributeType}`
  }
  if (data.activityStatus != null && data.activityStatus != undefined && `${data.activityStatus}` != 'null' && JSON.stringify(data.activityStatus) != '[]') {
    url += `&activityStatus=${data.activityStatus}`
  }
  if (data.activityName != null && data.activityName != undefined && `${data.activityName}` != 'null' && JSON.stringify(data.activityName) != '[]') {
    url += `&activityName=${data.activityName}`
  }
  return request({
    url: url,
    method: 'post'
  })
}

// 新增活动配置
export function createActivity(data) {
  return request({
    url: '/activityType/add',
    method: 'post',
    data
  })
}

// 编辑活动配置
export function editActivity(data) {
  return request({
    url: '/activityType/update',
    method: 'post',
    data
  })
}

// 更新活动状态
export function updateActivity(data) {
  var url = `/activityType/updateStatus?`
  if (data.activityStatus != null && data.activityStatus != undefined && `${data.activityStatus}` != 'null' && JSON.stringify(data.activityStatus) != '[]') {
    url += `activityStatus=${data.activityStatus}`
  }
  if (data.id != null && data.id != undefined && `${data.id}` != 'null' && JSON.stringify(data.id) != '[]') {
    url += `&id=${data.id}`
  }
  return request({
    url: url,
    method: 'post'
  })
}

// 更新活动状态
export function getDistributeType() {
  var url = `/activityType/getDistributeType`
  return request({
    url: url,
    method: 'get'
  })
}
// 手动刷新列表
export function refreshActivityList() {
  var url = `/activityType/refreshActivityList`
  return request({
    url: url,
    method: 'post'
  })
}
