import request from '@/utils/request'

export function getPaymentList(pageSize = 20, pageNum = 1, data) {
  var url = `/center/payment/list?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.name != null && data.name != undefined && `${data.name}` != 'null' && JSON.stringify(data.name) != '[]') {
    url += `&name=${data.name}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && JSON.stringify(data.status) != '[]') {
    url += `&status=${data.status}`
  }
  if (data.merchantCode != null && data.merchantCode != undefined && `${data.merchantCode}` != 'null' && JSON.stringify(data.merchantCode) != '[]') {
    url += `&merchantCode=${data.merchantCode}`
  }
  if (data.smsName != null && data.smsName != undefined && `${data.smsName}` != 'null' && JSON.stringify(data.smsName) != '[]') {
    url += `&smsName=${data.smsName}`
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

export function createPayment(data) {
  return request({
    url: '/center/payment/add',
    method: 'post',
    data
  })
}

export function updatePayment(data) {
  return request({
    url: '/center/payment/update',
    method: 'post',
    data
  })
}
export function updateStatus1(id,status,name) {
  return request({
    url: '/center/payment/updateStatus',
    method: 'patch',
    data: {
      'id': id,
      'status': status,
      'name': name,
    }
  })
}

export function deletePayment(id) {
  return request({
    url: '/center/payment/del?id='+id,
     method: 'delete',

  })
}
