import request from '@/utils/request'

/**
 * 分享提现明细
 * pageSize
 * pageNum
 * startTime
 * endTime
 * uid
 */
export function getPromotionWithdrawLogList(pageSize = 20, pageNum = 1, data) {
  var url = `/promotion/withdraw/log?pageSize=${pageSize}&pageNum=${pageNum}`
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
  //
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.orderNo != null && data.orderNo != undefined && `${data.orderNo}` != 'null') {
    url += `&orderNo=${data.orderNo}`
  }
  
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }

  // 处理时间
  var startDate = null;
  var endDate = null;
  if (data.withdrawValue != null && JSON.stringify(data.withdrawValue) != '[]' && Array.isArray(data.withdrawValue)) {
    console.error(JSON.stringify(data.withdrawValue));
    let values = data.withdrawValue;
    startDate = values[0];
    endDate = values[1];
  }
  if (startDate != null && startDate != undefined && `${startDate}` != 'null') {
    url += `&startDate=${startDate}`
  }
  if (endDate != null && endDate != undefined && `${endDate}` != 'null') {
    url += `&endDate=${endDate}`
  }




  return request({
    url: url,
    method: 'get'
  })
}

export function getPromotionWithdrawLog(pageSize = 20, pageNum = 1, data) {
  var url = `/promotion/withdraw/total?pageSize=${pageSize}&pageNum=${pageNum}`
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
  //
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.orderNo != null && data.orderNo != undefined && `${data.orderNo}` != 'null') {
    url += `&orderNo=${data.orderNo}`
  }
  
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }

  // 处理时间
  var startDate = null;
  var endDate = null;
  if (data.withdrawValue != null && JSON.stringify(data.withdrawValue) != '[]' && Array.isArray(data.withdrawValue)) {
    console.error(JSON.stringify(data.withdrawValue));
    let values = data.withdrawValue;
    startDate = values[0];
    endDate = values[1];
  }
  if (startDate != null && startDate != undefined && `${startDate}` != 'null') {
    url += `&startDate=${startDate}`
  }
  if (endDate != null && endDate != undefined && `${endDate}` != 'null') {
    url += `&endDate=${endDate}`
  }


  return request({
    url: url,
    method: 'get'
  })
}

/**
 * 分享提现审核
 * id
 * uid
 * status
 */
export function checkStatus(id, uid, status) {
  return request({
    url: `/promotion/withdraw/check`,
    method: 'post',
    data: {
      'id': id,
      'uid': uid,
      'status': status
    }
  })
}

/**
 * 金币或魅力提现审核  checkAgentPayStatus
 * id
 * uid
 * status
 * withdrawType 1 金币提现 2 魅力提现 3分享提现
 */
export function checkShareAgentStatus(id, uid, status, type) {
  return request({
    url: `/promotion/withdraw/ShareUser/agent`,
    method: 'post',
    data: {
      'id': id,
      'uid': uid,
      'status': status,
      'withdrawType': type

    }
  })
}



export function checkAgentStatus(id, uid, status) {
  return request({
    url: `/promotion/withdraw/check/agent`,
    method: 'post',
    data: {
      'id': id,
      'uid': uid,
      'status': status
    }
  })
}
