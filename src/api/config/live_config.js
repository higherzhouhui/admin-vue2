import request from '@/utils/request'

// 栏目列表
export function getColumnList(pageSize = 20, pageNum = 1) {
  var url = `/liveConfig/list?pageSize=${pageSize}&pageNum=${pageNum}`
  return request({
    url: url,
    method: 'get'
  })
}

// 新增栏目配置  不知道
export function createColumn(data) {
  return request({
    url: '/liveConfig/abb',
    method: 'post',
    data
  })
}

// 编辑栏目配置
export function updateColumn(data) {
  return request({
    url: '/liveConfig/compile',
    method: 'patch',
    data
  })
}

// 刪除栏目配置
 export function deleteColumn(ids) {
  return request({
    url: '/liveConfig/' + ids,
    method: 'delete'
  })
}
