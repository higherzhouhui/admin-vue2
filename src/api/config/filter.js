import request from '@/utils/request'

export function getFilterUserList(pageSize = 20, pageNum = 1, data) {
  var url = `/filter/user/userList?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && JSON.stringify(data.uid) != '[]') {
    url += `&uid=${data.uid}`
  }
  if (data.filterType != null && data.filterType != undefined && `${data.filterType}` != 'null' && JSON.stringify(data.filterType) != '[]') {
    url += `&filterType=${data.filterType}`
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

export function createFilterUser(data) {
  return request({
    url: '/filter/user/add',
    method: 'post',
    data
  })
}

export function updateFilterUser(data) {
  return request({
    url: '/filter/user/update',
    method: 'post',
    data
  })
}

export function deleteFilterUser(id) {
  return request({
    url: '/filter/user/' + id,
    method: 'delete'
  })
}
