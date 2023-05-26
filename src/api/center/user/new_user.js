import request from '@/utils/request'

export function getUserList(pageSize = 20, pageNum = 1,data,channel,type,date) {
  var url = `/center/account/base/newUser?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (channel != null && channel != undefined && `${channel}` != 'null' && `${channel}` != '') {
    url += `&channel=${channel}`
  }

  if (data.pChannel != null && data.pChannel != undefined && `${data.pChannel}` != 'null' && `${data.pChannel}` != '') {
    url += `&pChannel=${data.pChannel}`
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
