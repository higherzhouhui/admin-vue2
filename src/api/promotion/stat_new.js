import request from '@/utils/request'

/**
 * 渠道用户统计(今日)
 * channel 渠道标识
 * type 0渠道 1渠道下的链接id
 */
export function getStatToday(channel = null, type = null) {
  var url = '/statNew/statToday?'
  if (channel != null && channel != undefined && `${channel}` != 'null' && `${channel}` != '') {
    url += `&channel=${channel}`
  }
  if (type != null && type != undefined && `${type}` != 'null' && `${type}` != '') {
    url += `&type=${type}`
  }
  return request({
    url: url,
    method: 'get',
    timeout: 1000 * 60 * 5
  })
}

/**
 * 渠道用户统计(历史)
 * pageSize
 * pageNum
 * startTime
 * endTime
 * channel
 */
export function getStatHistoryList(data) {
  var url = '/statNew/statHistory?'
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
  var startTime = null
  var endTime = null
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    console.error(JSON.stringify(data.pickerValue))
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
  return request({
    url: url,
    method: 'get'
  })
}

export function getTotal(data) {
  var url = '/statNew/total?'
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
  var startTime = null
  var endTime = null
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    console.error(JSON.stringify(data.pickerValue))
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
  return request({
    url: url,
    method: 'get'
  })
}

export function testNewJob() {
  var url = '/test/testNewJob'
  return request({
    url: url,
    method: 'get'
  })
}
