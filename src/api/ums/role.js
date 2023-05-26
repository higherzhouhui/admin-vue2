import request from '@/utils/request'
import Qs from 'qs'

// 获取所有角色
export function getRoleList() {
  return request({
    url: '/role/list',
    method: 'get'
  })
}

// 添加角色
export function createRole(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data
  })
}

// 批量删除角色
export function deleteRole(ids) {
  return request({
    // headers: {
    //   'Content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
    // },
    url: '/role/delete',
    method: 'post',
    data: Qs.stringify({
      ids: ids
    }, {
      arrayFormat: 'repeat'
    })
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: `/role/update/${data.id}`,
    method: 'post',
    data
  })
}

// 获取相应角色权限
export function getRolePermission(roleId) {
  return request({
    url: `/role/permission/${roleId}`,
    method: 'get',
    data: {
      roleId: roleId
    }
  })
}

// 修改角色权限
export function updateRolePermission(roleId, permissionIds) {
  if (JSON.stringify(permissionIds) === '[]') {
    permissionIds = null
  }
  return request({
    url: '/role/permission/update',
    method: 'post',
    data: Qs.stringify({
      roleId: roleId,
      permissionIds: permissionIds
    }, {
      arrayFormat: 'repeat'
    })
  })
}
