import request from '@/utils/request'

export function getAnchorTypeList(pageSize = 20, pageNum = 1, data) {
  var url = `/center/user/google?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.username != null && data.username != undefined && `${data.username}` != 'null' && JSON.stringify(data.username) != '[]') {
    url += `&username=${data.username}`
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


export function createType(data) {
  return request({
    url: '/center/user/google/create/google',
    method: 'post',
    data
  })
}

export function updateType(data) {
  return request({
    url: '/center/user/google/update/',
    method: 'post',
    data
  })
}

// 修改状态(启用-禁用)
export function updateStatus(data) {
  return request({
    url: '/center/user/google/status',
    method: 'patch',
    data
  })
}

export function deleteType(id) {
  return request({
    url: '/center/user/google/delete/' + id,
    method: 'delete'
  })
}
