import request from '@/utils/request'

/**
 * 短信验证码记录
 * pageSize
 * pageNum
 * phone
 * type
 * startTime
 * endTime
 */
export function getSmsPlusList(pageSize = 20, pageNum = 1, data) {
  var url = `/center/sms/plus?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.phone != null && data.phone != undefined && `${data.phone}` != 'null' && `${data.phone}` != '') {
    url += `&phone=${data.phone}`
  }
  if (data.type != null && data.type != undefined && `${data.type}` != 'null' && `${data.type}` != '') {
    url += `&type=${data.type}`
  }
  if (data.smsType != null && data.smsType != undefined && `${data.smsType}` != 'null' && `${data.smsType}` != '') {
    url += `&smsType=${data.smsType}`
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
