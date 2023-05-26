import request from '@/utils/request'

export function userProfitStatis(data) {
  var url = `/game/report/userProfitStatis`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  var startTime = null
  var endTime = null
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    const values = data.pickerValue
    startTime = values[0]
    endTime = values[1]
  }
  if (startTime != null && startTime != undefined && `${startTime}` != 'null') {
    url += `&startTime=${startTime}`
  }
  if (endTime != null && endTime != undefined && `${endTime}` != 'null') {
    url += `&endTime=${endTime}`
  }
  const index = url.indexOf('&')
  if (index !== -1) {
    url = url.slice(0, index) + '?' + url.slice(index + 1)
  }
  return request({
    url: url,
    method: 'get'
  })
}

// 合计
export function userProfitStatisInfo(data) {
  var url = `/game/report/userProfitStatisInfo`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  var startTime = null
  var endTime = null
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    const values = data.pickerValue
    startTime = values[0]
    endTime = values[1]
  }
  if (startTime != null && startTime != undefined && `${startTime}` != 'null') {
    url += `&startTime=${startTime}`
  }
  if (endTime != null && endTime != undefined && `${endTime}` != 'null') {
    url += `&endTime=${endTime}`
  }
  const index = url.indexOf('&')
  if (index !== -1) {
    url = url.slice(0, index) + '?' + url.slice(index + 1)
  }
  return request({
    url: url,
    method: 'get',
  })
}
