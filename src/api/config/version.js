import request from '@/utils/request'

// 版本信息列表
export function getVersionList(pageSize = 20, pageNum = 1, os = null, isUpdate = null) {
  var url = `/version?pageSize=${pageSize}&pageNum=${pageNum}`
  if (os != null && os != undefined && `${os}` != '') {
    url += `&os=${os}`
  }
  if (isUpdate != null && isUpdate != undefined && `${isUpdate}` != '') {
    url += `&isUpdate=${isUpdate}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

// 新增版本信息
export function createVersion(data) {
  return request({
    url: '/version',
    method: 'post',
    data
  })
}

// 编辑版本信息
export function updateVersion(data) {
  return request({
    url: '/version',
    method: 'patch',
    data
  })
}

// 刪除版本信息
export function deleteVersion(ids) {
  return request({
    url: '/version/' + ids,
    method: 'delete'
  })
}
