import request from '@/utils/request'

export function getBankList(pageSize = 20, pageNum = 1, data) {
  var url = `/bank/recharge/bankCardList?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.cardNo != null && data.cardNo != undefined && `${data.cardNo}` != 'null' && JSON.stringify(data.cardNo) != '[]') {
    url += `&cardNo=${data.cardNo}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null') {
    url += `&status=${data.status}`
  }
  if (data.trueName != null && data.trueName != undefined && `${data.trueName}` != 'null') {
    url += `&trueName=${data.trueName}`
  }
  if (data.type != null && data.type != undefined && `${data.type}` != 'null') {
    url += `&type=${data.type}`
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

export function createBank(data) {
  return request({
    url: '/bank/recharge/add',
    method: 'post',
    data
  })
}

export function updateBank(data) {
  return request({
    url: '/bank/recharge/update/bank',
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

export function deleteBank(bankId) {
  return request({
    url: '/bank/recharge/delete/' + bankId,
    method: 'delete'
  })
}
