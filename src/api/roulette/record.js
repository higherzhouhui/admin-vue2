import request from '@/utils/request'

// 记录详情
export function detailRecord(id) {
  return request({
    url: `/center/user/roulette/record/detail?id=${id}`,
    method: 'get',
  })
}

// 记录列表
export function listRecord(pageSize = 20, pageNum = 1, data,) {
  var url = `/center/user/roulette/record/list?pageSize=${pageSize}&pageNum=${pageNum}`
  var startTime = null;
  var endTime = null;
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    let values = data.pickerValue;
    startTime = values[0];
    endTime = values[1];
  }
  if (startTime != null && startTime != undefined && `${startTime}` != 'null' && `${startTime}` !=
    '') {
    url += `&startTime=${startTime}`
  }
  if (endTime != null && endTime != undefined && `${endTime}` != 'null' && `${endTime}` != '') {
    url += `&endTime=${endTime}`
  }
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  return request({
    url,
    method: 'get'
  })
}


// 修改记录状态
export function updateActivityStatus(data) {
  return request({
    url: `/center/user/roulette/record/update/status`,
    method: 'patch',
    data
  })
}
