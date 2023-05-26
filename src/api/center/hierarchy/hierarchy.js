import request from '@/utils/request'

export function getOrderList(pageSize = 20, pageNum = 1, data) {
  var url = `/center/Hierarchy/list?pageSize=${pageSize}&pageNum=${pageNum}`
 if (data.type != null && data.type != undefined && `${data.type}` != 'null' && JSON.stringify(data.type) != '[]') {
    url += `&type=${data.type}`
  }
  if (data.name != null && data.name != undefined && `${data.name}` != 'null' && JSON.stringify(data.name) != '[]') {
    url += `&name=${data.name}`
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

export function createHierarchyUser(data) {
  return request({
    url: '/center/Hierarchy/add',
    method: 'post',
    data
  })
}

export function updateHierarchyUser(data) {
  return request({
    url: '/center/Hierarchy/update',
    method: 'post',
    data
  })
}

export function deleteHierarchyUser(id) {
  return request({
    url: '/center/Hierarchy/dele/' + id,
    method: 'delete'
  })
}
