import request from '@/utils/request'

/**
 * 分享明细
 */
export function getPromotionBaseInfo(uid) {
  return request({
    url: `/allTagInfo/promotionBaseInfo?uid=${uid}`,
    method: 'get'
  })
}

/**
 * 用户资产
 */
export function getUserAssetsInfo(uid) {
  return request({
    url: `/allTagInfo/userAssetsInfo?uid=${uid}`,
    method: 'get'
  })
}

/**
 * 用户信息
 */
export function getUserBase(uid) {
  return request({
    url: `/allTagInfo/userBase?uid=${uid}`,
    method: 'get'
  })
}

/**
 * 主播明细
 */
export function getAnchorBaseInfo(uid) {
  return request({
    url: `/allTagInfo/anchorBaseInfo?uid=${uid}`,
    method: 'get'
  })
}

// 用户封禁 解封(Type 0 为解封 1为封禁
export function updateUserHandleStatus(uid, type) {
  return request({
    url: `/allTagInfo/userHandle?uid=${uid}&type=${type}`,
    method: 'patch'
  })
}

// 提现封禁 解封(handleType 0 为解封 1为封禁)
export function updateWihtdrawHandleStatus(uid, type) {
  return request({
    url: `/allTagInfo/wihtdrawHandle?uid=${uid}&type=${type}`,
    method: 'patch'
  })
}
