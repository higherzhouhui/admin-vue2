import request from '@/utils/request'
import Qs from 'qs'

// 获取所有权限列表
export function getPermissionList() {
  return request({
    url: '/permission/list',
    method: 'get'
  })
}

// 添加权限
export function createPermission(data) {
  return request({
    url: '/permission/create',
    method: 'post',
    data
  })
}

// 修改权限
export function updatePermission(data) {
  return request({
    url: `/permission/update/${data.id}`,
    method: 'post',
    data
  })
}

// 根据id批量删除权限
export function deletePermission(ids) {
  return request({
    url: '/permission/delete',
    method: 'post',
    data: Qs.stringify({
      ids: ids
    }, {
      arrayFormat: 'repeat'
    })
  })
}
