import request from '@/utils/request'

export function agentBalanceList(pageSize = 20, pageNum = 1, data) {
  var url = `/agent/user/agentUserAddBalanceList?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.aid != null && data.aid != undefined && `${data.aid}` != 'null') {
    url += `&aid=${data.aid}`
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

export function agentTotalList(pageSize = 20, pageNum = 1, data) {
  var url = `/agent/user/agentUserTotal?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.aid != null && data.aid != undefined && `${data.aid}` != 'null') {
    url += `&aid=${data.aid}`
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

export function addBalance(data) {
  return request({
    url: '/agent/user/recharge',
    method: 'post',
    data
  })
}
