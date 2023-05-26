import request from '@/utils/request'

/**
 * 分享兑换金币明细
 * pageSize
 * pageNum
 * startTime
 * endTime
 * uid
 */
export function getPromotionExchangeLogList(pageSize = 20, pageNum = 1, data) {
  var url = `/promotion/exchange/log?pageSize=${pageSize}&pageNum=${pageNum}`
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
  return request({
    url: url,
    method: 'get'
  })
}

export function getPromotionExchangeLog(pageSize = 20, pageNum = 1, data) {
  var url = `/promotion/exchange/total?pageSize=${pageSize}&pageNum=${pageNum}`
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
  return request({
    url: url,
    method: 'get'
  })
}

/**
 * 分享兑换金币审核
 * id
 * uid
 * status
 */
export function checkStatus(id, uid, status) {
  return request({
    url: `/promotion/exchange/check`,
    method: 'post',
    data: {
      'id': id,
      'uid': uid,
      'status': status
    }
  })
}
