import request from '@/utils/request'
import { stitchUrl } from '@/utils/tools'
/**
 * 直播记录表
 * status
 * familyIds
 * startTime
 * endTime
 * pageSize
 * pageNum
 */
export function getUserLiveRecordList(pageSize = 20, pageNum = 1, datas) {
  var url = `/live/record?pageSize=${pageSize}&pageNum=${pageNum}`
  if (datas.status != null && datas.status != undefined && `${datas.status}` != 'null' && `${datas.status}` != '') {
    url += `&status=${datas.status}`
  }
  if (datas.uid != null && datas.uid != undefined && `${datas.uid}` != 'null' && `${datas.uid}` != '') {
    url += `&uid=${datas.uid}`
  }
  if (datas.familyIds != null && datas.familyIds != undefined && `${datas.familyIds}` != 'null' && JSON.stringify(datas
      .familyIds) != '[]') {
    url += `&familyIds=${datas.familyIds}`
  }
  // 处理时间
  var startTime = null;
  var endTime = null;
  if (datas.pickerValue != null && JSON.stringify(datas.pickerValue) != '[]' && Array.isArray(datas.pickerValue)) {
    let values = datas.pickerValue;
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

export function getUserLiveRecord(pageSize = 20, pageNum = 1, datas) {
  var url = `/live/record/total?pageSize=${pageSize}&pageNum=${pageNum}`
  if (datas.status != null && datas.status != undefined && `${datas.status}` != 'null' && `${datas.status}` != '') {
    url += `&status=${datas.status}`
  }
  if (datas.uid != null && datas.uid != undefined && `${datas.uid}` != 'null' && `${datas.uid}` != '') {
    url += `&uid=${datas.uid}`
  }
  if (datas.familyIds != null && datas.familyIds != undefined && `${datas.familyIds}` != 'null' && JSON.stringify(datas
      .familyIds) != '[]') {
    url += `&familyIds=${datas.familyIds}`
  }
  // 处理时间
  var startTime = null;
  var endTime = null;
  if (datas.pickerValue != null && JSON.stringify(datas.pickerValue) != '[]' && Array.isArray(datas.pickerValue)) {
    // console.error(JSON.stringify(datas.pickerValue));
    let values = datas.pickerValue;
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

export function cancelPk(uid) {
  return request({
    url: '/live/record/cancel/pk?uid=' + uid,
    method: 'get'
  })
}

export function finishClick(data) {
  return request({
    url: '/live/record/finishClick',
    method: 'patch',
    data
  })
}



export function getUserFamilyList(pageSize = null, pageNum = null, bossId = null, familyName = null) {
  var url = `/live/record/familyList?`
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

export function getStreamPushInfo(data) {
  const url = stitchUrl('/live/record/getStreamPushInfo', data)
  return request({
    url,
    method: 'get'
  })
}
