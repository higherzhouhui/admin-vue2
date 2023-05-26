import request from '@/utils/request'

export function agentUserList(pageSize = 20, pageNum = 1, data) {
  var url = `/agent/user/agentUserList?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.username != null && data.username != undefined && `${data.username}` != 'null' && JSON.stringify(data.username) != '[]') {
    url += `&username=${data.username}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null') {
    url += `&status=${data.status}`
  }
  if (data.phoneNum != null && data.phoneNum != undefined && `${data.phoneNum}` != 'null') {
    url += `&phoneNum=${data.phoneNum}`
  }
  if (data.lastWechat != null && data.lastWechat != undefined && `${data.lastWechat}` != 'null') {
    url += `&lastWechat=${data.lastWechat}`
  }
  if (data.lastQq != null && data.lastQq != undefined && `${data.lastQq}` != 'null') {
    url += `&lastQq=${data.lastQq}`
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

export function agentUserListTotal(pageSize = 20, pageNum = 1, data) {
  var url = `/agent/user/userTotal?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.username != null && data.username != undefined && `${data.username}` != 'null' && JSON.stringify(data.username) != '[]') {
    url += `&username=${data.username}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null') {
    url += `&status=${data.status}`
  }
  if (data.phoneNum != null && data.phoneNum != undefined && `${data.phoneNum}` != 'null') {
    url += `&phoneNum=${data.phoneNum}`
  }
  if (data.lastWechat != null && data.lastWechat != undefined && `${data.lastWechat}` != 'null') {
    url += `&lastWechat=${data.lastWechat}`
  }
  if (data.lastQq != null && data.lastQq != undefined && `${data.lastQq}` != 'null') {
    url += `&lastQq=${data.lastQq}`
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

export function createUser(data) {
  return request({
    url: '/agent/user/create',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/agent/user/update',
    method: 'post',
    data
  })
}

// 修改状态(启用-禁用)
export function updateStatus(id, status) {
  return request({
    url: '/agent/user',
    method: 'patch',
    data: {
      'id': id,
      'status': status
    }
  })
}

export function deleteUser(id) {
  return request({
    url: '/agent/user/' + id,
    method: 'delete'
  })
}


export function updateGoldCoin(params) {
  return request({
    url: '/agent/user/updateGoldCoin',
    method: 'post',
    params
  })
}
