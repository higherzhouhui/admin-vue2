import request from '@/utils/request'



/**
 * 用户统计
 * pageSize
 * pageNum
 * startTime
 * endTime
 * channel
 */
export function getStatHistoryList(data) {
    var url = `/center/user/stat_user/statList?pageNum=2`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
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

export function getTotal(data) {
  var url = '/stat/total?'
  if (data.pageSize != null && data.pageSize != undefined && `${data.pageSize}` != 'null') {
    url += `&pageSize=${data.pageSize}`
  }
  if (data.pageNum != null && data.pageNum != undefined && `${data.pageNum}` != 'null') {
    url += `&pageNum=${data.pageNum}`
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
