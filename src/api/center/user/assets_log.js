import request from '@/utils/request'

/**
 * 资产变更记录列表
 * pageSize
 * pageNum
 * uid
 */
export function getUserAssetsLogList(pageSize = 20, pageNum = 1, data) {
  var url = `/center/user/assetslog?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null') {
    url += `&uid=${data.uid}`
  }
  if (data.remark != null && data.remark != undefined && `${data.remark}` != 'null') {
    url += `&remark=${data.remark}`
  }
  if (data.operator != null && data.operator != undefined && `${data.operator}` != 'null') {
    url += `&operator=${data.operator}`
  }
  if (data.type != null && data.type != undefined && `${data.type}` != 'null') {
    url += `&type=${(data.simultType || '')}`
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

export function getTotalList(pageSize = 20, pageNum = 1, data) {
  var url = `/center/user/assetslog/total?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null') {
    url += `&uid=${data.uid}`
  }
  if (data.remark != null && data.remark != undefined && `${data.remark}` != 'null') {
    url += `&remark=${data.remark}`
  }
  if (data.operator != null && data.operator != undefined && `${data.operator}` != 'null') {
    url += `&operator=${data.operator}`
  }
  if (data.type != null && data.type != undefined && `${data.type}` != 'null') {
    url += `&type=${(data.simultType || '')}`
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

// 人工存款
export function createUserAssets(data) {
  return request({
    url: '/center/user/assetslog',
    method: 'post',
    data
  })
}

// 人工提款
export function createWithdrawUserAssets(data) {
  return request({
    url: '/center/user/assetslog/withdraw',
    method: 'post',
    data
  })
}

// 彩金类型
export function getTypeOfFunds() {
  return request({
    url: '/center/assets/plus/allTypes',
    method: 'post'
  })
}
// 查询所有资金类型
export function anchorAllTypes() {
  return request({
    url: '/anchor/assets/plus/allTypes',
    method: 'post'
  })
}


// 提现所需流水
export function getUserWithdrawGold(data) {
  return request({
    url: '/center/user/assetslog/getUserWithdrawGold',
    method: 'post',
    data
  })
}
// 是否继续操作
export function getUserflagGoOn(data) {
  return request({
    url: '/center/user/assetslog/flagGoOn',
    method: 'post',
    data
  })
}
