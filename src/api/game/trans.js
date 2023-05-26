import request from '@/utils/request'

export function getTransList(pageSize = 20, pageNum = 1, data) {
  var url = `/game/trans?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.type != null && data.type != undefined && `${data.type}` != 'null' && `${data.type}` != '') {
    url += `&type=${data.type}`
  }
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  if (data.orderId != null && data.orderId != undefined && `${data.orderId}` != 'null' && `${data.orderId}` != '') {
    url += `&orderId=${data.orderId}`
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

export function getTransTotal(pageSize = 20, pageNum = 1, data) {
  var url = `/game/trans/total?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.type != null && data.type != undefined && `${data.type}` != 'null' && `${data.type}` != '') {
    url += `&type=${data.type}`
  }
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  if (data.orderId != null && data.orderId != undefined && `${data.orderId}` != 'null' && `${data.orderId}` != '') {
    url += `&orderId=${data.orderId}`
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

export function getTransAll(data) {
  var url = `/game/trans/all?status=1`
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

export function updateTrans(data) {
  return request({
    url: '/game/trans',
    method: 'patch',
    data
  })
}

export function createTrans(uid) {
  return request({
    url: '/game/account/setStatement/' + uid,
    method: 'get'
  })
}

export function queryOrder(data) {
  return request({
    url: '/game/trans/order',
    method: 'post',
    data
  })
}

export function getAllGame(data) {
  var url = '/game/trans/game/all?status=1'
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

export function setStatement(data) {
  return request({
    url: '/game/account/statement',
    method: 'post',
    data
  })
}
