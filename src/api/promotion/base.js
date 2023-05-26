import request from '@/utils/request'

/**
 * 用户列表
 */
export function getPromotionUserBaseList(pageSize = 20, pageNum = 1, data) {
  var url = `/promotion/user/base?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.puid != null && data.puid != undefined && `${data.puid}` != 'null' && `${data.puid}` != '') {
    url += `&puid=${data.puid}`
  }
  if (data.filterType != null && data.filterType != undefined && `${data.filterType}` != 'null' && `${data.filterType}` != '') {
    url += `&filterType=${data.filterType}`
  }
  if (data.bindType != null && data.bindType != undefined && `${data.bindType}` != 'null' && `${data.bindType}` != '') {
    url += `&bindType=${data.bindType}`
  }
  if (data.channel != null && data.channel != undefined && `${data.channel}` != 'null' && `${data.channel}` != '') {
    url += `&channel=${data.channel}`
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
