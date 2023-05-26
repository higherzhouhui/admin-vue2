import request from '@/utils/request'



export function getCenterUserTypeList(pageSize = 20, pageNum = 1, data) {
  var url =`/center_user_type/userTypeList?pageSize=${pageSize}&pageNum=${pageNum}`
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


export function getTypeList(data) {
  var url = `/center_user_type/userTypeList?`
  if (data.pageSize != null && data.pageSize != undefined && `${data.pageSize}` != 'null' && `${data.pageSize}` != '') {
    url += `&pageSize=${data.pageSize}`
  }
  if (data.pageNum != null && data.pageNum != undefined && `${data.pageNum}` != 'null' && `${data.pageNum}` != '') {
    url += `&pageNum=${data.pageNum}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  return request({
    url: url,
    method: 'get'
  })
}




// 更新类型状态
export function updateUserTypeStatus(id, status) {
  if (status === null || status === undefined || status === '') {
    status = 0
  }
  if (id === null || id === undefined || id === '') {
    id = 0
  }
  return request({
    url: `/center_user_type/updateUserType`,
    method: 'put',
    data: {
      'id': id,
      'status': status
    }
  })
}
//更新贵族信息
export function updateCenterUserType(data) {
  return request({
    url:'/center_user_type/updateUserType',
    method: 'put',
    data
  })
}

// 新增贵族等级信息
export function saveUserType(data) {
  return request({
    url: '/center_user_type/saveUserType',
    method: 'put',
    data
  })
}
