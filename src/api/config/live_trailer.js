import request from '@/utils/request'

// 删除数据
export function deleteByPrimaryKey(id) {
  var url = `/live/booking/config/deleteByPrimaryKey/${id}`
  return request({
    url: url,
    method: 'get'
  })
}

// 获取列表
export function listLiveBookingConfig(data) {
  return request({
    url: '/live/booking/config/listLiveBookingConfig',
    method: 'post',
    data
  })
}

// 添加数据
export function save(data) {
  return request({
    url: '/live/booking/config/save',
    method: 'post',
    data
  })
}

// 更新数据
 export function updateById(data) {
  return request({
    url: '/live/booking/config/updateById',
    method: 'post',
    data
  })
}

export function selectByPrimaryKey(uid) {
    return request({
      url: `/center/user/base/selectByPrimaryKey?uid=${uid}`,
      method: 'get',
    })
  }