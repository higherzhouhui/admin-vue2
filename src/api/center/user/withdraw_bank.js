import request from '@/utils/request'

/**
 * 主播魅力提现
 * pageSize
 * pageNum
 * startTime
 * endTime
 * uid 用户ID
 * status 0待审核1已发2驳回
 */
export function getWithdrawAnchorList(pageSize = 20, pageNum = 1, data) {
  var url = `/center/withdraw/anchor?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null') {
    url += `&uid=${data.uid}`
  }

  if (data.trueName != null && data.trueName != undefined && `${data.trueName}` != 'null') {
    url += `&trueName=${data.trueName}`
  }
  if (data.orderNo != null && data.orderNo != undefined && `${data.orderNo}` != 'null') {
    url += `&orderNo=${data.orderNo}`
  }
  if (data.cardNo != null && data.cardNo != undefined && `${data.cardNo}` != 'null') {
    url += `&cardNo=${data.cardNo}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null') {
    url += `&status=${data.status}`
  }
  if (data.familyIds != null && data.familyIds != undefined && `${data.familyIds}` != 'null' && JSON.stringify(data.familyIds) != '[]') {
    url += `&familyId=${data.familyIds}`
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

  // 处理时间
  var startDate = null;
  var endDate = null;
  if (data.withdrawValue != null && JSON.stringify(data.withdrawValue) != '[]' && Array.isArray(data.withdrawValue)) {
    console.error(JSON.stringify(data.withdrawValue));
    let values = data.withdrawValue;
    startDate = values[0];
    endDate = values[1];
  }
  if (startDate != null && startDate != undefined && `${startDate}` != 'null') {
    url += `&startDate=${startDate}`
  }
  if (endDate != null && endDate != undefined && `${endDate}` != 'null') {
    url += `&endDate=${endDate}`
  }

  return request({
    url: url,
    method: 'get'
  })
}

export function getUserFamilyList(pageSize = null, pageNum = null, bossId = null, familyName = null) {
  var url = `/center/withdraw/familyList?`
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

export function getExcelList(pageSize = 20, pageNum = 1, data) {
  var url = `/center/withdraw/family?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.familyIds != null && data.familyIds != undefined && `${data.familyIds}` != 'null' && JSON.stringify(data.familyIds) != '[]') {
    url += `&bossId=${data.familyIds}`
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

  // 处理时间
  var startDate = null;
  var endDate = null;
  if (data.withdrawValue != null && JSON.stringify(data.withdrawValue) != '[]' && Array.isArray(data.withdrawValue)) {
    console.error(JSON.stringify(data.withdrawValue));
    let values = data.withdrawValue;
    startDate = values[0];
    endDate = values[1];
  }
  if (startDate != null && startDate != undefined && `${startDate}` != 'null') {
    url += `&startDate=${startDate}`
  }
  if (endDate != null && endDate != undefined && `${endDate}` != 'null') {
    url += `&endDate=${endDate}`
  }

  return request({
    url: url,
    method: 'get'
  })
}

export function getExcelTotalList(pageSize = 20, pageNum = 1, data) {
  var url = `/center/withdraw/familyTotal?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.familyIds != null && data.familyIds != undefined && `${data.familyIds}` != 'null' && JSON.stringify(data.familyIds) != '[]') {
    url += `&bossId=${data.familyIds}`
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

export function getWithdrawAnchor(pageSize = 20, pageNum = 1, data) {
  var url = `/center/withdraw/anchor/total?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null') {
    url += `&uid=${data.uid}`
  }
  if (data.trueName != null && data.trueName != undefined && `${data.trueName}` != 'null') {
    url += `&trueName=${data.trueName}`
  }
  if (data.cardNo != null && data.cardNo != undefined && `${data.cardNo}` != 'null') {
    url += `&cardNo=${data.cardNo}`
  }
  if (data.orderNo != null && data.orderNo != undefined && `${data.orderNo}` != 'null') {
    url += `&orderNo=${data.orderNo}`
  }

  if (data.status != null && data.status != undefined && `${data.status}` != 'null') {
    url += `&status=${data.status}`
  }
  if (data.familyIds != null && data.familyIds != undefined && `${data.familyIds}` != 'null' && JSON.stringify(data.familyIds) != '[]') {
    url += `&familyId=${data.familyIds}`
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

  // 处理时间
  var startDate = null;
  var endDate = null;
  if (data.withdrawValue != null && JSON.stringify(data.withdrawValue) != '[]' && Array.isArray(data.withdrawValue)) {
    console.error(JSON.stringify(data.withdrawValue));
    let values = data.withdrawValue;
    startDate = values[0];
    endDate = values[1];
  }
  if (startDate != null && startDate != undefined && `${startDate}` != 'null') {
    url += `&startDate=${startDate}`
  }
  if (endDate != null && endDate != undefined && `${endDate}` != 'null') {
    url += `&endDate=${endDate}`
  }

  return request({
    url: url,
    method: 'get'
  })
}

/**
 * 用户金币提现
 * pageSize
 * pageNum
 * startTime
 * endTime
 * uid 用户ID
 * status 0待审核1已发2驳回
 */
export function getWithdrawUserList(pageSize = 20, pageNum = 1, data) {
  var url = `/center/withdraw/user?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null') {
    url += `&uid=${data.uid}`
  }
  if (data.trueName != null && data.trueName != undefined && `${data.trueName}` != 'null') {
    url += `&trueName=${data.trueName}`
  }
  if (data.cardNo != null && data.cardNo != undefined && `${data.cardNo}` != 'null') {
    url += `&cardNo=${data.cardNo}`
  }
  if (data.orderNo != null && data.orderNo != undefined && `${data.orderNo}` != 'null') {
    url += `&orderNo=${data.orderNo}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null') {
    url += `&status=${data.status}`
  }
  if (data.coinStatus != null && data.coinStatus != undefined && `${data.coinStatus}` != 'null') {
    url += `&coinStatus=${data.coinStatus}`
  }
  if (data.bigCoin != null && data.bigCoin != undefined && `${data.bigCoin}` != 'null') {
    url += `&bigCoin=${data.bigCoin}`
  }
  if (data.minCoin != null && data.minCoin != undefined && `${data.minCoin}` != 'null') {
    url += `&minCoin=${data.minCoin}`
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

  // 处理时间
  var startDate = null;
  var endDate = null;
  if (data.withdrawValue != null && JSON.stringify(data.withdrawValue) != '[]' && Array.isArray(data.withdrawValue)) {
    console.error(JSON.stringify(data.withdrawValue));
    let values = data.withdrawValue;
    startDate = values[0];
    endDate = values[1];
  }
  if (startDate != null && startDate != undefined && `${startDate}` != 'null') {
    url += `&startDate=${startDate}`
  }
  if (endDate != null && endDate != undefined && `${endDate}` != 'null') {
    url += `&endDate=${endDate}`
  }

  return request({
    url: url,
    method: 'get'
  })
}

export function getWithdrawUser(pageSize = 20, pageNum = 1, data) {
  var url = `/center/withdraw/user/total?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null') {
    url += `&uid=${data.uid}`
  }
  if (data.trueName != null && data.trueName != undefined && `${data.trueName}` != 'null') {
    url += `&trueName=${data.trueName}`
  }
  if (data.cardNo != null && data.cardNo != undefined && `${data.cardNo}` != 'null') {
    url += `&cardNo=${data.cardNo}`
  }
  if (data.orderNo != null && data.orderNo != undefined && `${data.orderNo}` != 'null') {
    url += `&orderNo=${data.orderNo}`
  }

  if (data.status != null && data.status != undefined && `${data.status}` != 'null') {
    url += `&status=${data.status}`
  }
  if (data.coinStatus != null && data.coinStatus != undefined && `${data.coinStatus}` != 'null') {
    url += `&coinStatus=${data.coinStatus}`
  }
  if (data.bigCoin != null && data.bigCoin != undefined && `${data.bigCoin}` != 'null') {
    url += `&bigCoin=${data.bigCoin}`
  }
  if (data.minCoin != null && data.minCoin != undefined && `${data.minCoin}` != 'null') {
    url += `&minCoin=${data.minCoin}`
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

  // 处理时间
  var startDate = null;
  var endDate = null;
  if (data.withdrawValue != null && JSON.stringify(data.withdrawValue) != '[]' && Array.isArray(data.withdrawValue)) {
    console.error(JSON.stringify(data.withdrawValue));
    let values = data.withdrawValue;
    startDate = values[0];
    endDate = values[1];
  }
  if (startDate != null && startDate != undefined && `${startDate}` != 'null') {
    url += `&startDate=${startDate}`
  }
  if (endDate != null && endDate != undefined && `${endDate}` != 'null') {
    url += `&endDate=${endDate}`
  }

  return request({
    url: url,
    method: 'get'
  })
}

/**  获取支付渠道状态
 * @param {Object} lotteryName
 * @param {Object} expect
 */
export function getAisleStatus(lotteryName, expect) {
  var url = `/center/withdraw/status`
  return request({
    url: url,
    method: 'get'
  })
}

/**
 * 金币或魅力提现审核
 * id
 * uid
 * status
 * withdrawType 1 金币提现 2 魅力提现
 */
export function checkUserStatus(id, uid, status, type) {
  return request({
    url: `/center/withdraw/user/gold`,
    method: 'post',
    data: {
      'id': id,
      'uid': uid,
      'status': status,
      'withdrawType': type
    }
  })
}




/**
 * 金币或魅力提现审核  checkAgentPayStatus
 * id
 * uid
 * status
 * withdrawType 1 金币提现 2 魅力提现
 */
export function checkAgentStatus(id, uid, status, type) {
  return request({
    url: `/center/withdraw/user/gold/agent`,
    method: 'post',
    data: {
      'id': id,
      'uid': uid,
      'status': status,
      'withdrawType': type

    }
  })
}
export function checkAgentPayStatus(id, uid, status, type) {
  return request({
    url: `/center/withdraw/user/gold/agent`,
    method: 'post',
    data: {
      'id': id,
      'uid': uid,
      'status': status,
      'withdrawType': type

    }
  })
}

export function setPayStatus(status) {
  return request({
    url: `/center/withdraw/user/gold/setPayStatus?&status=${status}`,
    method: 'get'
  })
}

export function checkLockStatus(id, status) {
  return request({
    url: `/center/withdraw/lock`,
    method: 'post',
    data: {
      'id': id,
      'status': status
    }
  })
}

export function multipleDate(date) {
  return request({
    url: `/center/withdraw/user/gold/multipleDate`,
    method: 'post',
    data: { 'date': date }
  })
}

export function updateUsesRemark(data) {
  return request({
    url: '/center/account/base/saveUserType',
    method: 'put',
    data
  })
}

export function updateUsesRemark1(data) {
  return request({
    url: '/center/withdraw/user/gold/Remark',
    method: 'put',
    data
  })
}


export function flagSureAnchorCoin(status) {
  return request({
    url: `/center/withdraw/flagSureAnchorCoin?&uid=${status}`,
    method: 'get'
  })
}