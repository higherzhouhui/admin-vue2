import request from '@/utils/request'
import Qs from 'qs'

/**
 * 主播列表
 * goldMedal 是否金牌主播 (单选)
 * uid 主播ID(手输)
 * familyId 家族ID(可多选)
 */
export function getUserAnchorList(pageSize = 20, pageNum = 1, goldMedal = null, uid = null, familyId = null) {
  var url = `/center/user/anchor?pageSize=${pageSize}&pageNum=${pageNum}`
  if (goldMedal != null && goldMedal != undefined && `${goldMedal}` != 'null' && `${goldMedal}` != '') {
    url += `&goldMedal=${goldMedal}`
  }
  if (uid != null && uid != undefined && `${uid}` != 'null' && `${uid}` != '') {
    url += `&uid=${uid}`
  }
  if (familyId != null && familyId != undefined && `${familyId}` != 'null' && JSON.stringify(familyId) != '[]') {
    url += `&familyId=${familyId}`
  }
  return request({
    url: url,
    method: 'get'
  })
}


export function getUserFamilyList(pageSize = null, pageNum = null, bossId = null, familyName = null) {
  var url = `/center/user/anchor/familyList?`
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


// 部分更新主播状态
export function updateUserAnchor(data) {
  return request({
    url: '/center/user/anchor',
    method: 'patch',
    data
  })
}

// 修改主播标签
export function updateUserAnchorTags(id, tags) {
  if (JSON.stringify(tags) === '[]') {
    tags = null
  }
  const params = Qs.stringify({
    tags: tags,
    id: id
  }, {
    arrayFormat: 'brackets'
  })
  return request({
    url: '/center/user/anchor/tag?' + params,
    method: 'patch'
  })
}

// 认证列表
export function getUserAnchorAuthList(pageSize = 20, pageNum = 1, data) {
  var url = `/center/user/anchor/authAnchor?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null') {
    url += `&status=${data.status}`
  }
  // 处理时间
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

// 主播认证
export function updateUserAnchorAuth(tags, data) {
  var uri = '/center/user/anchor/auth?'
  if (JSON.stringify(tags) === '[]') {
    tags = null
    uri += 'tags='
  } else {
    const query = Qs.stringify({
      tags: tags
    }, {
      arrayFormat: 'brackets'
    })
    uri += query
  }
  return request({
    url: uri,
    method: 'patch',
    data
  })
}

// 取消主播认证
// export function cancelAnchorAuth(ids) {
//   return request({
//     url: '/center/user/anchor/' + ids,
//     method: 'delete'
//   })
// }

// 新版主播取消认证
export function cancelAnchorAuth(id) {
  return request({
    url: '/center/user/anchor/unAuth/' + id,
    method: 'patch'
  })
}


// 主播认证
export function handleBatch(data) {
 return request({
   url: '/center/user/anchor/handle',
   method: 'post',
   data
 })
}


export function getTypeList() {
  var url = `/center/anchor/type/subsidy/typeList`
  return request({
    url: url,
    method: 'get'
  })
}

// 修改直播间标签
export function updateAnchor(data) {
  return request({
    url: '/center/user/anchor/updateAnchor',
    method: 'post',
    data
  })
 }