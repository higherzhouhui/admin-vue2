import request from '@/utils/request'
import Qs from 'qs'

// 登录系统
export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

// 登出功能
export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

// 获取管理员信息
export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get'
  })
}

// 获取用户所有权限
export function getPermission(uid) {
  return request({
    url: `/admin/permission/${uid}`,
    method: 'get'
  })
}

// 获取用户列表
export function getAdminList(pageNum = 1, pageSize = 5, name = '') {
  return request({
    url: '/admin/list' + `?pageNum=${pageNum}&pageSize=${pageSize}&name=${name}`,
    method: 'get'
  })
}

// 用户注册
export function registerAdmin(data) {
  return request({
    url: `/admin/register`,
    method: 'post',
    data
  })
}

// 删除指定用户信息
export function deleteAdmin(id) {
  return request({
    url: `/admin/delete/${id}`,
    method: 'post'
  })
}

// 修改指定用户信息
export function updateAdmin(data) {
  return request({
    url: `/admin/update/${data.id}`,
    method: 'post',
    data
  })
}

// 获取指定用户的角色
export function getAdminRole(adminId) {
  return request({
    url: `/admin/role/${adminId}`,
    method: 'get'
  })
}

// 给用户分配角色
export function updateAdminRole(adminId, roleIds) {
  if (JSON.stringify(roleIds) === '[]') {
    roleIds = null
  }
  return request({
    url: '/admin/role/update',
    method: 'post',
    data: Qs.stringify({
      adminId: adminId,
      roleIds: roleIds
    }, {
      arrayFormat: 'repeat'
    })
  })
}

// 获取用户所有权限（包括+-权限）
export function getAdminPermission(adminId) {
  return request({
    url: `/admin/permission/${adminId}`,
    method: 'get'
  })
}

// 给用户分配+-权限
export function updateAdminPermission(adminId, permissionIds) {
  if (JSON.stringify(permissionIds) === '[]') {
    permissionIds = null
  }
  return request({
    url: '/admin/permission/update',
    method: 'post',
    data: Qs.stringify({
      adminId: adminId,
      permissionIds: permissionIds
    }, {
      arrayFormat: 'repeat'
    })
  })
}

export function updateGoldCoin(params) {
  return request({
    url: '/admin/updateGoldCoin',
    method: 'post',
    params
  })
}
