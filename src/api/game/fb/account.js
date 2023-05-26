import request from '@/utils/request'

export function getAccountList(pageSize = 20, pageNum = 1, data) {
  var url = `/fb/account?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.fbAccountId != null && data.fbAccountId != undefined && `${data.fbAccountId}` != 'null' && `${data.fbAccountId}` != '') {
    url += `&fbAccountId=${data.fbAccountId}`
  }
  var startTime = null;
  var endTime = null;
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    console.error(JSON.stringify(data.pickerValue));
    let values = data.pickerValue;
    startTime = values[0];
    endTime = values[1];
  }
  if (startTime != null && startTime != undefined && `${startTime}` != 'null') {
    url += `&startTime=${startTime}`
  }
  if (endTime != null && endTime != undefined && `${endTime}` != 'null') {
    url += `&endTime=${endTime}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

export function createAccount(data) {
  return request({
    url: '/fw/account',
    method: 'post',
    data
  })
}

export function autoUp(data) {
  return request({
    url: '/fw/account/auto',
    method: 'post',
    data
  })
}

export function updateAccount(data) {
  return request({
    url: '/fw/account',
    method: 'patch',
    data
  })
}

export function deleteAccount(id) {
  return request({
    url: '/fw/account/' + id,
    method: 'delete'
  })
}
