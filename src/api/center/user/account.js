import request from '@/utils/request'

export function getAccountList(pageSize = 20, pageNum = 1, data, uid) {
  var url = `/center/account/base?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.phone != null && data.phone != undefined && `${data.phone}` != 'null' && `${data.phone}` != '') {
    url += `&phone=${data.phone}`
  }
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.ip != null && data.ip != undefined && `${data.ip}` != 'null' && `${data.ip}` != '') {
    url += `&ip=${data.ip}`
  }
  if (data.udid != null && data.udid != undefined && `${data.udid}` != 'null' && `${data.udid}` != '') {
    url += `&udid=${data.udid}`
  }
  if (data.LoginIp != null && data.LoginIp != undefined && `${data.LoginIp}` != 'null' && `${data.LoginIp}` != '') {
    url += `&LoginIp=${data.LoginIp}`
  }
  if (data.loginId != null && data.loginId != undefined && `${data.loginId}` != 'null' && `${data.loginId}` != '') {
    url += `&loginId=${data.loginId}`
  }
  var startTime = null;
  var endTime = null;
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    console.error(JSON.stringify(data.pickerValue));
    let values = data.pickerValue;
    startTime = values[0];
    endTime = values[1];
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


// 新增贵族信息
export function saveUserType(data) {
  return request({
    url: '/center/account/base/saveUserType',
    method: 'put',
    data
  })
}
