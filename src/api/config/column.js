import request from '@/utils/request'

// 栏目列表
export function getColumnList(pageSize = 20, pageNum = 1) {
  var url = `/column?pageSize=${pageSize}&pageNum=${pageNum}`
  return request({
    url: url,
    method: 'get'
  })
}

// 新增栏目配置
export function createColumn(data) {
  return request({
    url: '/column',
    method: 'post',
    data
  })
}

// 编辑栏目配置
export function updateColumn(data) {
  return request({
    url: '/column',
    method: 'patch',
    data
  })
}

// 刪除栏目配置
export function deleteColumn(ids) {
  return request({
    url: '/column/' + ids,
    method: 'delete'
  })
}
