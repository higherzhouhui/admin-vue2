import request from '@/utils/request'

export function getBankFilterList(pageSize = 20, pageNum = 1, data) {
  var url = `/user/bank/filter/userBankList?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.cardNo != null && data.cardNo != undefined && `${data.cardNo}` != 'null' && JSON.stringify(data.cardNo) != '[]') {
    url += `&cardNo=${data.cardNo}`
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

export function createBankFilter(data) {
  return request({
    url: '/user/bank/filter/bankFilter/add',
    method: 'post',
    data
  })
}

export function updateBankFilter(data) {
  return request({
    url: '/user/bank/filter/bankFilter/update',
    method: 'post',
    data
  })
}

export function deleteBankFilter(id) {
  return request({
    url: '/user/bank/filter/bankFilter/delete/' + id,
    method: 'delete'
  })
}
