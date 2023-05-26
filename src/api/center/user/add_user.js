import request from '@/utils/request'

export function getUserList(pageSize = 20, pageNum = 1, data, channel, type, date, fromValue) {
  var url = `/center/account/base/userAddList?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.parentChannel != null && data.parentChannel != undefined && `${data.parentChannel}` != 'null' && `${data.parentChannel}` != '') {
    url += `&parentChannel=${data.parentChannel}`
  }
  if (data.fromValue != null && data.fromValue != undefined && `${data.fromValue}` != 'null' && `${data.fromValue}` != '') {
    url += `&fromValue=${data.fromValue}`
  }
  if (data.agentId != null && data.agentId != undefined && `${data.agentId}` != 'null' && `${data.agentId}` != '') {
    url += `&agentId=${data.agentId}`
  }
  if (data.pickerValue[0] != null && data.pickerValue[0] != undefined && `${data.pickerValue[0]}` != 'null' && `${data.pickerValue[0]}` != '') {
    url += `&startTime=${data.pickerValue[0]}`
  }
  if (data.pickerValue[1] != null && data.pickerValue[1] != undefined && `${data.pickerValue[1]}` != 'null' && `${data.pickerValue[1]}` != '') {
    url += `&endTime=${data.pickerValue[1]}`
  }

  if (channel != null && channel != undefined && `${channel}` != 'null' && `${channel}` != '') {
    url += `&channel=${channel}`
  }

  if (type != null && type != undefined && `${type}` != 'null' && `${type}` != '') {
    url += `&type=${type}`
  }
  if (date != null && date != undefined && `${date}` != 'null' && `${date}` != '') {
    url += `&date=${date}`
  }

  return request({
    url: url,
    method: 'get'
  })
}
