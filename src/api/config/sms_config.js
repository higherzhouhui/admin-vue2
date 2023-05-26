import request from '@/utils/request'

export function getSmsList(pageSize = 20, pageNum = 1, data) {
  var url = `/center/sms/list?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.id != null && data.id != undefined && `${data.id}` != 'null' && JSON.stringify(data.id) != '[]') {
    url += `&id=${data.id}`
  }
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && JSON.stringify(data.uid) != '[]') {
    url += `&uid=${data.uid}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && JSON.stringify(data.status) != '[]') {
    url += `&status=${data.status}`
  }
  if (data.merchantCode != null && data.merchantCode != undefined && `${data.merchantCode}` != 'null' && JSON.stringify(data.merchantCode) != '[]') {
    url += `&merchantCode=${data.merchantCode}`
  }
  if (data.smsName != null && data.smsName != undefined && `${data.smsName}` != 'null' && JSON.stringify(data.smsName) != '[]') {
    url += `${data.smsName.length > 0 ? `&smsName=${data.smsName}` : ''}`
  }
  // 处理时间
  var startTime = null
  var endTime = null
  /* if (data.merchantCode != null && JSON.stringify(data.merchantCode) != '[]' && Array.isArray(data.merchantCode)) {
     console.error(JSON.stringify(data.pickerValue))
     const values = data.pickerValue
     startTime = values[0]
     endTime = values[1]
   } */
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

export function createSms(data) {
  return request({
    url: '/center/sms/add',
    method: 'post',
    data
  })
}

export function updateSms(data) {
  return request({
    url: '/center/sms/update',
    method: 'post',
    data
  })
}
export function updateStatus1(id, status, merchantCode) {
  return request({
    url: '/center/sms/updateStatus',
    method: 'patch',
    data: {
      'id': id,
      'status': status,
      'merchantCode': merchantCode,
    }
  })
}

export function deleteSms(id) {
  return request({
    url: '/center/sms/del?id=' + id,
    method: 'delete',

  })
}
