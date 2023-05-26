import request from '@/utils/request'

export function listSignIn(pageSize = 20, pageNum = 1, data) {
  var url = `/signIn/activity/list?pageSize=${pageSize}&pageNum=${pageNum}`
  return request({
    url: url,
    method: 'get'
  })
}

export function addSignIn(data) {
  return request({
    url: '/signIn/activity/add',
    method: 'post',
    data
  })
}

export function detailSignIn(activityId) {
  return request({
    url: `/signIn/activity/get/${activityId}`,
    method: 'get'
  })
}

export function updateStateSignIn(activityId) {
  return request({
    url: `/signIn/activity/updateState/${activityId}`,
    method: 'post',
  })
}
export function delActivity(activityId) {
  return request({
    url: `/signIn/activity/del/${activityId}`,
    method: 'post',
  })
}

export function listRecord(pageSize = 20, pageNum = 1, data) {
  var url = `/signIn/record/coinList?pageSize=${pageSize}&pageNum=${pageNum}`
  var startTime = null;
  var endTime = null;
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    console.error(JSON.stringify(data.pickerValue));
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
  if (data.creditedFlag != null && data.creditedFlag != undefined && `${data.creditedFlag}` != 'null' && `${data.creditedFlag}` != '') {
    url += `&creditedFlag=${data.creditedFlag}`
  }
  return request({
    url: url,
    method: 'get'
  })
}