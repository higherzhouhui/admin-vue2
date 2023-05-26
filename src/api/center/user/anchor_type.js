import request from '@/utils/request'

export function getAnchorTypeList(pageSize = 20, pageNum = 1, data) {
  var url = `/center/anchor/type/typeList?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.typeName != null && data.typeName != undefined && `${data.typeName}` != 'null' && JSON.stringify(data.typeName) != '[]') {
    url += `&typeName=${data.typeName}`
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

export function createType(data) {
  return request({
    url: '/center/anchor/type/add',
    method: 'post',
    data
  })
}

export function updateType(data) {
  return request({
    url: '/center/anchor/type/update/type',
    method: 'post',
    data
  })
}

// 修改状态(启用-禁用)
export function updateStatus(data) {
  return request({
    url: '/center/anchor/type/status',
    method: 'patch',
    data
  })
}

export function deleteType(id) {
  return request({
    url: '/center/anchor/type/delete/' + id,
    method: 'delete'
  })
}
