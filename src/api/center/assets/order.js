import request from '@/utils/request'

/**
 * 订单列表
 * pageSize
 * pageNum
 * startTime
 * endTime
 * uid 用户ID
 * orderNo 订单号
 * outerNo 第三方订单号
 */
export function getOrderList(pageSize = 20, pageNum = 1, data) {
  var url = `/pay/order/list?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null') {
    url += `&uid=${data.uid}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null') {
    url += `&status=${data.status}`
  }
  if (data.remark != null && data.remark != undefined && `${data.remark}` != 'null') {
    url += `&remark=${data.remark}`
  }
  if (data.orderNo != null && data.orderNo != undefined && `${data.orderNo}` != 'null') {
    url += `&orderNo=${data.orderNo}`
  }
  if (data.outerNo != null && data.outerNo != undefined && `${data.outerNo}` != 'null') {
    url += `&outerNo=${data.outerNo}`
  }
  // if (data.anchorFlag != null && data.anchorFlag != undefined && `${data.anchorFlag}` != 'null') {
  //   url += `&anchorFlag=${data.anchorFlag}`
  // }
  if (data.channelName != null && data.channelName != undefined && `${data.channelName}` != 'null') {
    url += `&channelName=${data.channelName}`
  }
  // 处理时间
  var startTime = null;
  var endTime = null;
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    // console.error(JSON.stringify(data.pickerValue));
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

export function getOrder(pageSize = 20, pageNum = 1, data) {
  var url = `/pay/order/total?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null') {
    url += `&uid=${data.uid}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null') {
    url += `&status=${data.status}`
  }
  if (data.orderNo != null && data.orderNo != undefined && `${data.orderNo}` != 'null') {
    url += `&orderNo=${data.orderNo}`
  }
  if (data.outerNo != null && data.outerNo != undefined && `${data.outerNo}` != 'null') {
    url += `&outerNo=${data.outerNo}`
  }
  if (data.remark != null && data.remark != undefined && `${data.remark}` != 'null') {
    url += `&remark=${data.remark}`
  }

  if (data.channelName != null && data.channelName != undefined && `${data.channelName}` != 'null') {
    url += `&channelName=${data.channelName}`
  }
  // 处理时间
  var startTime = null;
  var endTime = null;
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    // console.error(JSON.stringify(data.pickerValue));
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
