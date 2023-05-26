import request from '@/utils/request'

export function getUrlList(pageSize = 20, pageNum = 1, data) {
  var url = `/promotion/promote/url/urlList?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.urlName != null && data.urlName != undefined && `${data.urlName}` != 'null' && JSON.stringify(data.urlName) != '[]') {
    url += `&urlName=${data.urlName}`
  }
  if (data.url != null && data.url != undefined && `${data.url}` != 'null' && JSON.stringify(data.url) != '[]') {
    url += `&url=${data.url}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && JSON.stringify(data.status) != '[]') {
    url += `&status=${data.status}`
  }
  // 处理时间
  var startTime = null;
  var endTime = null;
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    console.error(JSON.stringify(data.pickerValue));
    let values = data.pickerValue;
    startTime = values[0];
    endTime = values[1];
  }
  if (startTime != null && startTime != undefined && `${startTime}` != 'null' && `${startTime}` !=
    '') {
    url += `&startTime=${startTime}`
  }
  if (endTime != null && endTime != undefined && `${endTime}` != 'null' && `${endTime}` != '') {
    url += `&endTime=${endTime}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

export function getPromoteUrlList(data) {
  var url = `/promotion/promote/url/urlList?`
  if (data.pageSize != null && data.pageSize != undefined && `${data.pageSize}` != 'null' && `${data.pageSize}` != '') {
    url += `&pageSize=${data.pageSize}`
  }
  if (data.pageNum != null && data.pageNum != undefined && `${data.pageNum}` != 'null' && `${data.pageNum}` != '') {
    url += `&pageNum=${data.pageNum}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

export function createUrl(data) {
  return request({
    url: '/promotion/promote/url/add',
    method: 'post',
    data
  })
}

export function updateUrl(data) {
  return request({
    url: '/promotion/promote/url/update/url',
    method: 'post',
    data
  })
}

// 修改状态(启用-禁用)
export function updateStatus(data) {
  return request({
    url: '/bank/recharge/status',
    method: 'patch',
    data
  })
}

export function deleteUrl(id) {
  return request({
    url: '/promotion/promote/url/delete/' + id,
    method: 'delete'
  })
}
