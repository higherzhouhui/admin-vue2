import request from '@/utils/request'

/**
 * 房间排序列表
 */
export function getLiveRoomSortList(uid = null, type = null) {
  var url = '/live/room/sort'
  if (uid != null && uid != undefined && `${uid}` != 'null' && `${uid}` != '') {
    url += `&uid=${uid}`
  }
  if (type != null && type != undefined && `${type}` != 'null' && `${type}` != '') {
    url += `&type=${type}`
  }

  return request({
    url: url,
    method: 'get'
  })
}

// 新增房间排序
export function createLiveRoomSort(data) {
  return request({
    url: '/live/room/sort',
    method: 'post',
    data
  })
}

// 刪除房间排序
export function deleteLiveRoomSort(data) {
  return request({
    url: '/live/room/sort',
    method: 'delete',
    data
  })
}
