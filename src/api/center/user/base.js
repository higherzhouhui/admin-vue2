import request from '@/utils/request'

/**
 * 用户列表
 */
export function getCenterBaseUserList(pageSize = 20, pageNum = 1, uid = null, phone = null, nickname = null, manage = null,trueName = null) {
  var url = `/center/user/base?pageSize=${pageSize}&pageNum=${pageNum}`
  if (uid != null && uid != undefined && `${uid}` != 'null' && `${uid}` != '') {
    url += `&uid=${uid}`
  }
  if (manage != null && manage != undefined && `${manage}` != 'null' && `${manage}` != '') {
    url += `&manage=${manage}`
  }
  if (phone != null && phone != undefined && `${phone}` != 'null' && `${phone}` != '') {
    url += `&phone=${phone}`
  }
  if (nickname != null && nickname != undefined && `${nickname}` != 'null' && `${nickname}` != '') {
    url += `&nickname=${nickname}`
  }
  if (trueName != null && trueName != undefined && `${trueName}` != 'null' && `${trueName}` != '') {
    url += `&trueName=${trueName}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

// 更新用户的超管状态
export function updateCenterBaseUserManager(uid, idx) {
  if (idx === null || idx === undefined || idx === '') {
    idx = 0
  }
  if (uid === null || uid === undefined || uid === '') {
    idx = 0
  }
  return request({
    url: '/center/user/base',
    method: 'patch',
    data: {
      'uid': uid,
      'manage': idx
    }
  })
}

// 修改违规用户头像
export function updateAvatar(uid) {
  return request({
    url: '/center/user/base/update/',
    method: 'patch',
    data: {
      'uid': uid
    }
  })
}

export function updateUser(data) {
  return request({
    url: '/center/user/base',
    method: 'put',
    data
  })
}

export function unPromotion(data) {
  var url = `/center/user/base/no/promotion?1=1`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  return request({
    url: url,
    method: 'get'
  })
}
export function getRecordList(data) {
  var url = `/ch/online/record/list`
  return request({
    url: url,
    method: 'post',
    data
  })
}
