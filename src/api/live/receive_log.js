import request from '@/utils/request'
import Qs from 'qs'

/**
 * 收礼记录表
 * gid 礼物ID
 * srcId 送礼者ID
 * uid 收礼者ID
 * pickerValue [开始时间,结束时间]
 */
export function getLiveUserReceiveLogList(pageSize = 20, pageNum = 1, data) {
  var url = `/receive/log?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.gid != null && data.gid != undefined && `${data.gid}` != 'null' && JSON.stringify(data.gid) != '[]') {
    url += `&gid=${data.gid}`
  }
  if (data.srcId != null && data.srcId != undefined && `${data.srcId}` != 'null' && `${data.srcId}` != '') {
    url += `&srcId=${data.srcId}`
  }
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.goldCoin != null && data.goldCoin != undefined && `${data.goldCoin}` != 'null' && `${data.goldCoin}` != '') {
    url += `&goldCoin=${data.goldCoin}`
  }
  if (data.orderId != null && data.orderId != undefined && `${data.orderId}` != 'null' && `${data.orderId}` != '') {
    url += `&orderId=${data.orderId}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  // 处理时间
  var startTime = null;
  var endTime = null;
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
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


export function getReceiveLogTotal(data) {
  var url = `/receive/log/total?pageSize=99999&pageNum=1`
  if (data.gid != null && data.gid != undefined && `${data.gid}` != 'null' && JSON.stringify(data.gid) != '[]') {
    url += `&gid=${data.gid}`
  }
  if (data.srcId != null && data.srcId != undefined && `${data.srcId}` != 'null' && `${data.srcId}` != '') {
    url += `&srcId=${data.srcId}`
  }
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.goldCoin != null && data.goldCoin != undefined && `${data.goldCoin}` != 'null' && `${data.goldCoin}` != '') {
    url += `&goldCoin=${data.goldCoin}`
  }
  if (data.orderId != null && data.orderId != undefined && `${data.orderId}` != 'null' && `${data.orderId}` != '') {
    url += `&orderId=${data.orderId}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  // 处理时间
  var startTime = null;
  var endTime = null;
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
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
