import request from '@/utils/request'

/**
 * 用户登陆记录
 * pageSize
 * pageNum
 * uid
 * startTime
 * endTime
 */
export function getUserLoginLogList(pageSize = 20, pageNum = 1, data) {
  var url = `/user/login/log?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.ip != null && data.ip != undefined && `${data.ip}` != 'null' && `${data.ip}` != '') {
    url += `&ip=${data.ip}`
  }
  if (data.udid != null && data.udid != undefined && `${data.udid}` != 'null' && `${data.udid}` != '') {
    url += `&udid=${data.udid}`
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
