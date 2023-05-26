import request from '@/utils/request'

/**
 * 房间付费记录
 * pageSize
 * pageNum
 * startTime
 * endTime
 * uid
 * anchorId
 * liveId
 */
export function getLiveChargeRoomLogList(pageSize = 20, pageNum = 1, data) {
  var url = `/live/charge/room?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.anchorId != null && data.anchorId != undefined && `${data.anchorId}` != 'null' && `${data.anchorId}` != '') {
    url += `&anchorId=${data.anchorId}`
  }
  if (data.liveId != null && data.liveId != undefined && `${data.liveId}` != 'null' && `${data.liveId}` != '') {
    url += `&liveId=${data.liveId}`
  }
  if (data.orderId != null && data.orderId != undefined && `${data.orderId}` != 'null' && `${data.orderId}` != '') {
    url += `&orderId=${data.orderId}`
  }
  if (data.type != null && data.type != undefined && `${data.type}` != 'null' && `${data.type}` != '') {
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

export function getLiveChargeRoomLog(pageSize = 20, pageNum = 1, data) {
  var url = `/live/charge/room/total?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.anchorId != null && data.anchorId != undefined && `${data.anchorId}` != 'null' && `${data.anchorId}` != '') {
    url += `&anchorId=${data.anchorId}`
  }
  if (data.liveId != null && data.liveId != undefined && `${data.liveId}` != 'null' && `${data.liveId}` != '') {
    url += `&liveId=${data.liveId}`
  }
  if (data.orderId != null && data.orderId != undefined && `${data.orderId}` != 'null' && `${data.orderId}` != '') {
    url += `&orderId=${data.orderId}`
  }
  if (data.type != null && data.type != undefined && `${data.type}` != 'null' && `${data.type}` != '') {
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
