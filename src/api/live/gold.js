import request from '@/utils/request'

/**
 * 获取主播补贴列表
 * pageSize
 * pageNum
 * startTime
 * endTime
 * uid 用户ID
 */
export function getGoldSubsidyList(pageSize = 20, pageNum = 1, data) {
  var url = `/subsidy/list?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null') {
    url += `&uid=${data.uid}`
  }
  if (data.familyIds != null && data.familyIds != undefined && `${data.familyIds}` != 'null' && JSON.stringify(data.familyIds) != '[]') {
    url += `&familyIds=${data.familyIds}`
  }
  if (data.nickname != null && data.nickname != undefined && `${data.nickname}` != 'null') {
    url += `&nickName=${data.nickname}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null') {
    url += `&status=${data.status}`
  }
  if (data.goldMedal != null && data.goldMedal != undefined && `${data.goldMedal}` != 'null') {
    url += `&goldMedal=${data.goldMedal}`
  }
  // 处理时间
  var startTime = null;
  var endTime = null;
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    // console.error(JSON.stringify(data.pickerValue));
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

  return request({
    url: url,
    method: 'get'
  })
}

export function getGoldSubsidy(pageSize = 20, pageNum = 1, data) {
  var url = `/subsidy/total?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null') {
    url += `&uid=${data.uid}`
  }
  if (data.familyIds != null && data.familyIds != undefined && `${data.familyIds}` != 'null' && JSON.stringify(data.familyIds) != '[]') {
    url += `&familyIds=${data.familyIds}`
  }
  if (data.nickname != null && data.nickname != undefined && `${data.nickname}` != 'null') {
    url += `&nickName=${data.nickname}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null') {
    url += `&status=${data.status}`
  }
  if (data.goldMedal != null && data.goldMedal != undefined && `${data.goldMedal}` != 'null') {
    url += `&goldMedal=${data.goldMedal}`
  }
  // 处理时间
  var startTime = null;
  var endTime = null;
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    // console.error(JSON.stringify(data.pickerValue));
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

  return request({
    url: url,
    method: 'get'
  })
}




export function getUserFamilyList(pageSize = null, pageNum = null, bossId = null, familyName = null) {
  var url = `/subsidy/familyList?`
  if (pageSize != null && pageSize != undefined && `${pageSize}` != 'null' && `${pageSize}` != '') {
    url += `&pageSize=${pageSize}`
  }
  if (pageNum != null && pageNum != undefined && `${pageNum}` != 'null' && `${pageNum}` != '') {
    url += `&pageNum=${pageNum}`
  }
  if (bossId != null && bossId != undefined && `${bossId}` != 'null' && `${bossId}` != '') {
    url += `&bossId=${bossId}`
  }
  if (familyName != null && familyName != undefined && `${familyName}` != 'null' && `${familyName}` != '') {
    url += `&familyName=${familyName}`
  }
  return request({
    url: url,
    method: 'get'
  })
}