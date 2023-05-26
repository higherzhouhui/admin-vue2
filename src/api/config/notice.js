import request from '@/utils/request'
import { stitchUrl } from '@/utils/tools'
// 消息公告列表
export function getNoticeList(pageSize = 20, pageNum = 1, type = null) {
  var url = `/notice?pageSize=${pageSize}&pageNum=${pageNum}`
  if (type != null && type != undefined && `${type}` != 'null' && `${type}` != '') {
    url += `&type=${type}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

// 新增消息公告
export function createNotice(data) {
  return request({
    url: '/notice',
    method: 'post',
    data
  })
}

// 编辑消息公告
export function updateNotice(data) {
  return request({
    url: '/notice',
    method: 'patch',
    data
  })
}

// 刪除消息公告
export function deleteNotice(ids) {
  return request({
    url: '/notice/' + ids,
    method: 'delete'
  })
}

// 查询
export function sysTemNoticeList(params) {
  const url = stitchUrl('/systemNotice/list', params)
  return request({
    url,
    method: 'get'
  })
}
// 查询typelist
export function sysTemTypeList() {
  return request({
    url: '/systemNotice/getTypeList',
    method: 'get'
  })
}
// 新增
export function addSysTemNotice(data) {
  const url = stitchUrl('/systemNotice/save', data)
  return request({
    url,
    method: 'post',
    data
  })
}

// 发送
export function sendSysTemNotice(data) {
  const url = stitchUrl('/systemNotice/send', data)
  return request({
    url,
    method: 'post',
    data
  })
}

// 更新
export function updateSysTemNotice(data) {
  const url = stitchUrl('/systemNotice/update', data)
  return request({
    url,
    method: 'post',
    data
  })
}

// 删除
export function deleteSysTemNotice(data) {
  const url = stitchUrl('/systemNotice/del', data)
  return request({
    url,
    method: 'post',
    data
  })
}

