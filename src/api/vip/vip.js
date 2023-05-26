import request from '@/utils/request'

/**
 * 添加座驾明细
 * pageSize
 * pageNum
 * startTime
 * endTime
 * uid
 * gids
 */
export function getCenterUusrVipList(pageSize = 20, pageNum = 1, data) {
     var url =`/center_user/vip?pageSize=${pageSize}&pageNum=${pageNum}`
  // 处理时间
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
  //
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }

  return request({
    url: url,
    method: 'get'
  })
}

export function getCenterUusrVipLevelList(pageSize = 20, pageNum = 1, data) {
  var url =`/center_user_vip_level/levelList?pageSize=${pageSize}&pageNum=${pageNum}`
  // 处理时间
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
  //
  if (data.level != null && data.level != undefined && `${data.level}` != 'null' && `${data.level}` != '') {
    url += `&level=${data.level}`
  }
  if (data.name != null && data.name != undefined && `${data.name}` != 'null' && `${data.name}` != '') {
    url += `&name=${data.name}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }


  return request({
    url: url,
    method: 'get'
  })
}


export function getCenterUusrVipPlusList(pageSize = 20, pageNum = 1, data) {
  var url =`/center_user_vip_plus/plusList?pageSize=${pageSize}&pageNum=${pageNum}`
  // 处理时间
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
  //
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.orderId != null && data.orderId != undefined && `${data.orderId}` != 'null' && `${data.orderId}` != '') {
    url += `&orderId=${data.orderId}`
  }

  return request({
    url: url,
    method: 'get'
  })
}

// 更新貴族状态
export function updateCenterUserVipLevel(id, status) {
  if (status === null || status === undefined || status === '') {
    status = 0
  }
  if (id === null || id === undefined || id === '') {
    id = 0
  }
  return request({
    url: `/center_user_vip_level/updateVipLevel`,
    method: 'put',
    data: {
      'id': id,
      'status': status
    }
  })
}
//更新贵族信息
export function updateUserVipLevel(data) {
  return request({
    url:'/center_user_vip_level/updateVipLevel',
    method: 'put',
    data
  })
}

// 新增贵族等级信息
export function saveUserVipLevel(data) {
  return request({
    url: '/center_user_vip_level/saveUserVipLevel',
    method: 'put',
    data
  })
}

// 新增贵族信息
export function saveUserVip(data) {
  return request({
    url: '/center_user/saveUserVip',
    method: 'put',
    data
  })
}
// 新增贵族信息
export function updateUserVip(data) {
  return request({
    url: '/center_user/updateUserVip',
    method: 'put',
    data
  })
}
// 新增贵族信息
export function updateUserVipGroup(data) {
  return request({
    url: '/center_user_vip_level/updateUserVipGroup',
    method: 'put',
    data
  })
}

//获取群组信息
export function getUserGroup() {
  return request({
    url: '/center_user_vip_level/getUserGroup',
    method: 'put',
  })
}
