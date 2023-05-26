import request from '@/utils/request'

// 家族管理
export function getUserFamilyList(pageSize = null, pageNum = null, bossId = null, familyName = null) {
  var url = `/center/user/family?`
  if (pageSize != null && pageSize != undefined && `${pageSize}` != 'null' && `${pageSize}` != '') {
    url += `&pageSize=${pageSize}`
  }
  if (pageNum != null && pageNum != undefined && `${pageNum}` != 'null' && `${pageNum}` != '') {
    url += `&pageNum=${pageNum}`
  }
  if (bossId != null && bossId != undefined && `${bossId}` != 'null' && `${bossId}` != '') {
    url += `&bossId=${bossId}`
  }
  if (familyName != null && familyName != undefined && `${familyName}` != 'null' && `${familyName}` != '') {
    url += `&familyName=${familyName}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

// 新增家族
export function createUserFamily(data) {
  return request({
    url: '/center/user/family',
    method: 'post',
    data
  })
}

// 部分更新主播状态
export function updateUserFamily(data) {
  return request({
    url: '/center/user/family',
    method: 'patch',
    data
  })
}

// 删除家族
export function deleteUserFamily(id) {
  return request({
    url: '/center/user/family/' + id,
    method: 'delete'
  })
}
