import request from '@/utils/request'

// 房间定时公告列表
export function getKindlyNoticeList(pageSize = 20, pageNum = 1, data) {

  var url = `kindlyNotice?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.status != null && data.status != undefined && `${data.status}` != 'null') {
    url += `&status=${data.status}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

// 新增房间定时公告
export function createKindlyNotice(data) {
  return request({
    url: '/kindlyNotice',
    method: 'post',
    data
  })
}

// 编辑房间定时公告
export function updateKindlyNotice(data) {
  return request({
    url: '/kindlyNotice',
    method: 'put',
    data
  })
}

// 刪除房间定时公告
export function deleteKindlyNotice(id) {
  return request({
    url: '/kindlyNotice/' + id,
    method: 'delete'
  })
}
