import request from '@/utils/request'

export function getAgentPayList(pageSize = 20, pageNum = 1, data) {
  var url = `/agent/pay/list?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.orderNo != null && data.orderNo != undefined && `${data.orderNo}` != 'null' && `${data.orderNo}` != '') {
    url += `&orderNo=${data.orderNo}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  if (data.type != null && data.type != undefined && `${data.type}` != 'null' && `${data.type}` != '') {
    url += `&type=${data.type}`
  }
  if (data.cardName != null && data.cardName != undefined && `${data.cardName}` != 'null' && `${data.cardName}` != '') {
    url += `&cardName=${data.cardName}`
  }
  if (data.timeType != null && data.timeType != undefined && `${data.timeType}` != 'null' && `${data.timeType}` != '') {
    url += `&timeType=${data.timeType}`
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