import request from '@/utils/request'

// 客服列表
export function getCustomerServiceList(pageSize = 20, pageNum = 1) {
  var url = `/cservice?pageSize=${pageSize}&pageNum=${pageNum}`
  return request({
    url: url,
    method: 'get'
  })
}

// 新增客服配置
export function createCustomerService(data) {
  return request({
    url: '/cservice',
    method: 'post',
    data
  })
}

// 编辑客服配置
export function updateCustomerService(data) {
  return request({
    url: '/cservice',
    method: 'patch',
    data
  })
}

// 刪除客服配置
export function deleteCustomerService(ids) {
  return request({
    url: '/cservice/' + ids,
    method: 'delete'
  })
}
