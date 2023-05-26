import request from '@/utils/request'

export function getAssetsList(pageSize = 20, pageNum = 1, data) {
  var url = `/center/assets?pageSize=${pageSize}&pageNum=${pageNum}`
  let params = {
    uid: undefined,
    goldCoin: undefined,
    anchorCoin: undefined,
    nickName: undefined,
    agentId: undefined,
    account: undefined,
    familyIds: undefined,
    pChannelUrl: undefined,
    channelName: undefined,
    startTime: undefined,
    endTime: undefined,
    onlineFlag: undefined
  }
  if (data.userId != null && data.userId != undefined && `${data.userId}` != 'null') {
    params.userId = data.userId
  }
  if (data.onlineFlag != null && data.onlineFlag != undefined && `${data.onlineFlag}` != 'null') {
    params.onlineFlag = data.onlineFlag
  }
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && data.uid != '') {
    params.uid = data.uid
  }
  if (data.agentId != null && data.agentId != undefined && `${data.agentId}` != 'null' && data.agentId != '') {
    params.agentId = data.agentId
  }
  if (data.nickName != null && data.nickName != undefined && `${data.nickName}` != 'null' && data.nickName != '') {
    params.nickName = data.nickName
  }
  if (data.channelName != null && data.channelName != undefined && `${data.channelName}` != 'null' && data.channelName != '') {
    params.channelName = data.channelName
  }
  if (data.pChannelUrl != null && data.pChannelUrl != undefined && `${data.pChannelUrl}` != 'null' && data.pChannelUrl != '') {
    params.pChannelUrl = data.pChannelUrl
  }
  if (data.account != null && data.account != undefined && `${data.account}` != 'null' && data.account != '') {
    params.account = data.account
  }
  if (data.familyIds != null && data.familyIds != undefined && `${data.familyIds}` != 'null' && data.familyIds != '') {
    params.familyIds = data.familyIds
  }
  if (data.agentLevel != null && data.agentLevel != undefined && `${data.agentLevel}` != 'null' && data.agentLevel != '') {
    params.agentLevel = data.agentLevel
  }

  if (data.goldCoin != null && data.goldCoin != undefined && `${data.goldCoin}` != 'null') {
    params.goldCoin = data.goldCoin
  }
  if (data.anchorCoin != null && data.anchorCoin != undefined && `${data.anchorCoin}` != 'null') {
    params.anchorCoin = data.anchorCoin
  }
  if (data.userType != null && data.userType != undefined && `${data.userType}` != 'null') {
    params.userType = data.userType * 1
  }
  // 更新时间
  if (data.pickerValue && data.pickerValue.length > 0) {
    const values = data.pickerValue
    params.startTime = values[0]
    params.endTime = values[1]
  } else {
    params.startTime = undefined
    params.endTime = undefined
  }
  // 注册时间
  if (data.registerTime && data.registerTime.length > 0) {
    const values = data.registerTime
    params.registerStartTime = values[0]
    params.registerEndTime = values[1]
  } else {
    params.registerStartTime = undefined
    params.registerEndTime = undefined
  }
  // 注册时间
  if (data.firstDepositTime && data.firstDepositTime.length > 0) {
    const values = data.firstDepositTime
    params.firstDepositStartTime = values[0]
    params.firstDepositEndTime = values[1]
  } else {
    params.firstDepositStartTime = undefined
    params.firstDepositEndTime = undefined
  }


  return request({
    url: url,
    method: 'post',
    data: params
  })
}

export function getUser_report_List(pageSize = 20, pageNum = 1, data) {
  var url = `/center/assets/userReportList?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null') {
    url += `&uid=${data.uid}`
  }
  if (data.goldCoin != null && data.goldCoin != undefined && `${data.goldCoin}` != 'null') {
    url += `&goldCoin=${data.goldCoin}`
  }
  if (data.minCoin != null && data.minCoin != undefined && `${data.minCoin}` != 'null') {
    url += `&minCoin=${data.minCoin}`
  }
  if (data.bigCoin != null && data.bigCoin != undefined && `${data.bigCoin}` != 'null') {
    url += `&bigCoin=${data.bigCoin}`
  }
  if (data.anchorCoin != null && data.anchorCoin != undefined && `${data.anchorCoin}` != 'null') {
    url += `&anchorCoin=${data.anchorCoin}`
  }
  if (data.nickName != null && data.nickName != undefined && `${data.nickName}` != 'null') {
    url += `&nickName=${data.nickName}`
  }

  if (data.account != null && data.account != undefined && `${data.account}` != 'null') {
    url += `&account=${data.account}`
  }
  if (data.familyIds != null && data.familyIds != undefined && `${data.familyIds}` != 'null' && JSON.stringify(data.familyIds) != '[]') {
    url += `&familyIds=${data.familyIds}`
  }
  if (data.orderBy != null && data.orderBy != undefined && `${data.orderBy}` != 'null') {
    url += `&orderBy=${data.orderBy}`
  }
  if (data.bindType != null && data.bindType != undefined && `${data.bindType}` != 'null') {
    url += `&bindType=${data.bindType}`
  }
  if (data.channel != null && data.channel != undefined && `${data.channel}` != 'null') {
    url += `&channel=${data.channel}`
  }
  if (data.pChannel != null && data.pChannel != undefined && `${data.pChannel}` != 'null') {
    url += `&pChannel=${data.pChannel}`
  }
  if (data.orderField != null && data.orderField != undefined && `${data.orderField}` != 'null') {
    url += `&orderField=${data.orderField}`
  }
  var startTime = null
  var endTime = null
  var registerStartTime = null
  var registerEndTime = null
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    console.error(JSON.stringify(data.pickerValue))
    const values = data.pickerValue
    startTime = values[0]
    endTime = values[1]
  }
  if (data.pickerValue2 != null && JSON.stringify(data.pickerValue2) != '[]' && Array.isArray(data.pickerValue2)) {
    console.error(JSON.stringify(data.pickerValue2))
    const values = data.pickerValue2
    registerStartTime = values[0]
    registerEndTime = values[1]
  }
  if (startTime != null && startTime != undefined && `${startTime}` != 'null') {
    url += `&startTime=${startTime}`
  }
  if (endTime != null && endTime != undefined && `${endTime}` != 'null') {
    url += `&endTime=${endTime}`
  }
  if (registerStartTime != null && registerStartTime != undefined && `${registerStartTime}` != 'null') {
    url += `&registerStartTime=${registerStartTime}`
  }
  if (registerEndTime != null && registerEndTime != undefined && `${registerEndTime}` != 'null') {
    url += `&registerEndTime=${registerEndTime}`
  }

  return request({
    url: url,
    method: 'get'
  })
}

export function getUser_report_ListNew(pageSize = 20, pageNum = 1, data) {
  var url = `/ch/center/assets/userReportList?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null') {
    url += `&uid=${data.uid}`
  }
  if (data.agentId != null && data.agentId != undefined && `${data.agentId}` != 'null') {
    url += `&agentId=${data.agentId}`
  }
  if (data.goldCoin != null && data.goldCoin != undefined && `${data.goldCoin}` != 'null') {
    url += `&goldCoin=${data.goldCoin}`
  }
  if (data.minCoin != null && data.minCoin != undefined && `${data.minCoin}` != 'null') {
    url += `&minCoin=${data.minCoin}`
  }
  if (data.bigCoin != null && data.bigCoin != undefined && `${data.bigCoin}` != 'null') {
    url += `&bigCoin=${data.bigCoin}`
  }
  if (data.anchorCoin != null && data.anchorCoin != undefined && `${data.anchorCoin}` != 'null') {
    url += `&anchorCoin=${data.anchorCoin}`
  }
  if (data.nickName != null && data.nickName != undefined && `${data.nickName}` != 'null') {
    url += `&nickName=${data.nickName}`
  }

  if (data.account != null && data.account != undefined && `${data.account}` != 'null') {
    url += `&account=${data.account}`
  }
  if (data.familyIds != null && data.familyIds != undefined && `${data.familyIds}` != 'null' && JSON.stringify(data.familyIds) != '[]') {
    url += `&familyIds=${data.familyIds}`
  }
  if (data.orderBy != null && data.orderBy != undefined && `${data.orderBy}` != 'null') {
    url += `&orderBy=${data.orderBy}`
  }
  if (data.bindType != null && data.bindType != undefined && `${data.bindType}` != 'null') {
    url += `&bindType=${data.bindType}`
  }
  if (data.channel != null && data.channel != undefined && `${data.channel}` != 'null') {
    url += `&channel=${data.channel}`
  }
  if (data.pChannel != null && data.pChannel != undefined && `${data.pChannel}` != 'null') {
    url += `&pChannel=${data.pChannel}`
  }
  if (data.orderField != null && data.orderField != undefined && `${data.orderField}` != 'null') {
    url += `&orderField=${data.orderField}`
  }
  var startTime = null
  var endTime = null
  var registerStartTime = null
  var registerEndTime = null
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    console.error(JSON.stringify(data.pickerValue))
    const values = data.pickerValue
    startTime = values[0]
    endTime = values[1]
  }
  if (data.pickerValue2 != null && JSON.stringify(data.pickerValue2) != '[]' && Array.isArray(data.pickerValue2)) {
    console.error(JSON.stringify(data.pickerValue2))
    const values = data.pickerValue2
    registerStartTime = values[0]
    registerEndTime = values[1]
  }

  if (startTime != null && startTime != undefined && `${startTime}` != 'null') {
    url += `&startTime=${startTime}`
  }
  if (endTime != null && endTime != undefined && `${endTime}` != 'null') {
    url += `&endTime=${endTime}`
  }
  if (registerStartTime != null && registerStartTime != undefined && `${registerStartTime}` != 'null') {
    url += `&registerStartTime=${registerStartTime}`
  }
  if (registerEndTime != null && registerEndTime != undefined && `${registerEndTime}` != 'null') {
    url += `&registerEndTime=${registerEndTime}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

export function getUserFamilyList(pageSize = null, pageNum = null, bossId = null, familyName = null) {
  var url = `/center/assets/familyList?`
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

// 新增贵族信息
export function updateCashPassword(data) {
  return request({
    url: '/center/assets/updateCashPassword',
    method: 'put',
    data
  })
}

export function changeUserTurnover(params) {
  return request({
    url: '/center/assets/changeNeed',
    method: 'post',
    params
  })
}

export function changeUserActivityTurnover(params) {
  return request({
    url: '/center/assets/changeActivity',
    method: 'post',
    params
  })
}

export function updateUsesRemark(data) {
  return request({
    url: '/center/account/base/saveUserType',
    method: 'put',
    data
  })
}

// 获取用户层级列表
export function getHierarchyList() {
  var url = `/center/Hierarchy/list`
  return request({
    url: url,
    method: 'get'
  })
}

export function updateUser(data) {
  return request({
    url: '/center/user/base/updateUserType',
    method: 'post',
    data
  })
}

export function updateUserAgentId(data) {
  return request({
    url: '/center/user/base/updateUserAgentId',
    method: 'post',
    data
  })
}

export function getTestUserAssetsList(data) {
  if (data.queryParam) {
    return request({
      url: `/center/assets/queryUserAssetsVOs?queryParam=${data.queryParam}`,
      method: 'get'
    })
  } else {
    return request({
      url: '/center/assets/queryTestUserAssetsVOs',
      method: 'post',
      data
    })
  }
}

export function getnormalUserToTestUser(queryParam) {
  return request({
    url: `/center/assets/queryUserAssetsVOs?queryParam=${queryParam}`,
    method: 'get'
  })
}

export function updateOnlineFlag(data) {
  return request({
    url: `center/user/base/updateOnlineFlag`,
    method: 'post',
    data
  })
}

export function getUserCategoryList(data) {
  return request({
    url: '/center/assets/userCategoryList',
    method: 'post',
    data
  })
}

export function queryKycList(data) {
  return request({
    url: '/kyc/queryKycList',
    method: 'post',
    data
  })
}

export function updateKyc(data) {
  return request({
    url: '/kyc/updateKyc',
    method: 'post',
    data
  })
}

export function updateRead(id) {
  return request({
    url: `/kyc/updateRead?id=${id}`,
    method: 'get'
  })
}
