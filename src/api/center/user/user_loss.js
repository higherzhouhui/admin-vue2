import request from '@/utils/request'

export function getUserLossList(pageSize = 20, pageNum = 1, data) {
  var url = `center/user/loss/info?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && JSON.stringify(data.uid) != '[]') {
    url += `&uid=${data.uid}`
  }
  if (data.orderField != null && data.orderField != undefined && `${data.orderField}` != 'null' && JSON.stringify(data.orderField) != '[]') {
    url += `&orderField=${data.orderField}`
  }
  if (data.orderType != null && data.orderType != undefined && `${data.orderType}` != 'null' && JSON.stringify(data.orderType) != '[]') {
    url += `&orderType=${data.orderType}`
  }
  // 处理时间
  var startTime = null
  var endTime = null
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    // console.info(JSON.stringify(data.pickerValue))
    const values = data.pickerValue
    startTime = values[0]
    endTime = values[1]
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

