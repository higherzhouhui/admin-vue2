import request from '@/utils/request'

// 封禁配置
export function getUserHandleList(pageSize = 20, pageNum = 1, flag = null, type = null) {
  var url = `/center/user/handle?pageSize=${pageSize}&pageNum=${pageNum}`
  if (flag != null && flag != undefined && `${flag}` != 'null' && `${flag}` != '') {
    url += `&flag=${flag}`
  }
  if (type != null && type != undefined && `${type}` != 'null' && `${type}` != '') {
    url += `&type=${type}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

// 新增封禁配置
export function createUserHandle(data) {
  return request({
    url: '/center/user/handle',
    method: 'post',
    data
  })
}
// 新增封禁配置
export function refreshCache(data) {
  return request({
    url: '/center/user/handle/refreshCache',
    method: 'post',
    data
  })
}
// 编辑封禁配置
// export function updateUserHandle(data) {
//   return request({
//     url: '/center/user/handle',
//     method: 'patch',
//     data
//   })
// }

// 刪除封禁配置
export function deleteUserHandle(ids) {
  return request({
    url: '/center/user/handle/' + ids,
    method: 'delete'
  })
}

export function handleBatch(params) {
  return request({
    url: '/center/user/handle/handleBatch',
    method: 'post',
    params
  })
}
export function handleUploadExcel(data) {
  return request({
    url: '/center/user/handle/uploadExcel',
    method: 'post',
    data
  })
}

