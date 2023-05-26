import request from '@/utils/request'

export function gatRecordList(pageSize = 20, pageNum = 1, data) {
  var url = `/usdt/recharge/usdtRechargeList?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.bankId != null && data.bankId != undefined && `${data.bankId}` != 'null' && `${data.bankId}` != '') {
    url += `&bankId=${data.bankId}`
  }
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  if (data.orderNo != null && data.orderNo != undefined && `${data.orderNo}` != 'null' && `${data.orderNo}` != '') {
    url += `&orderNo=${data.orderNo}`
  }
  if (data.thirdOrderNo != null && data.thirdOrderNo != undefined && `${data.thirdOrderNo}` != 'null' && `${data.thirdOrderNo}` != '') {
    url += `&thirdOrderNo=${data.thirdOrderNo}`
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

export function gatTotalList(pageSize = 20, pageNum = 1, data) {
  var url = `/usdt/recharge/totalUsdt?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.bankId != null && data.bankId != undefined && `${data.bankId}` != 'null' && `${data.bankId}` != '') {
    url += `&bankId=${data.bankId}`
  }
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  if (data.orderNo != null && data.orderNo != undefined && `${data.orderNo}` != 'null' && `${data.orderNo}` != '') {
    url += `&orderNo=${data.orderNo}`
  }
  if (data.thirdOrderNo != null && data.thirdOrderNo != undefined && `${data.thirdOrderNo}` != 'null' && `${data.thirdOrderNo}` != '') {
    url += `&thirdOrderNo=${data.thirdOrderNo}`
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

export function checkStatus(id, status) {
  return request({
    url: `/usdt/recharge/checkUsdtRecharge?id=${id}&status=${status}`,
    method: 'get'
  })
}

export function checkErrorStatus(id, status) {
  return request({
    url: `/usdt/recharge/checkUsdtErrorRecharge?id=${id}&status=${status}`,
    method: 'get'
  })
}

export function getBankList() {
  return request({
    url: `/bank/recharge/getBankList?type=29`,
    method: 'get'
  })
}
