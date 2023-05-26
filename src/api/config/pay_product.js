import request from '@/utils/request'

// 支付产品列表
export function getPayProductList(data) {
  var url = `/config/product?`
  if (data.pageSize != null && data.pageSize != undefined && `${data.pageSize}` != 'null' && `${data.pageSize}` != '') {
    url += `&pageSize=${data.pageSize}`
  }
  if (data.pageNum != null && data.pageNum != undefined && `${data.pageNum}` != 'null' && `${data.pageNum}` != '') {
    url += `&pageNum=${data.pageNum}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

// 新增支付产品
export function addPayProduct(data) {
  return request({
    url: '/config/product',
    method: 'post',
    data
  })
}

// 编辑支付产品列表
export function updatePayProduct(data) {
  return request({
    url: '/config/product',
    method: 'patch',
    data
  })
}

// 删除支付产品
export function deletePayProduct(id) {
  return request({
    url: '/config/product/' + id,
    method: 'delete'
  })
}
