import request from '@/utils/request'

// 获取道具列表
export function getPropList(data) {
  var url = `/center_user_vip_level/levelList?`
  if (data.pageSize != null && data.pageSize != undefined && `${data.pageSize}` != 'null' && `${data.pageSize}` != '') {
    url += `&pageSize=${data.pageSize}`
  }
  if (data.pageNum != null && data.pageNum != undefined && `${data.pageNum}` != 'null' && `${data.pageNum}` != '') {
    url += `&pageNum=${data.pageNum}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  if (data.isShow != null && data.isShow != undefined && `${data.isShow}` != 'null' && `${data.isShow}` != '') {
    url += `&isShow=${data.isShow}`
  }
  if (data.isDiscard != null && data.isDiscard != undefined && `${data.isDiscard}` != 'null' && `${data.isDiscard}` !=
    '') {
    url += `&isDiscard=${data.isDiscard}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

// 新增道具
export function createProp(data) {
  return request({
    url: '/prop',
    method: 'post',
    data
  })
}

// 更新直播间的道具
export function updateLiveProp(data) {
  return request({
    url: '/user/prop/msg',
    method: 'post',
    data
  })
}



// 编辑道具
export function updateProp(data) {
  return request({
    url: '/prop',
    method: 'patch',
    data
  })
}

// 刪除道具
export function deleteProp(ids) {
  return request({
    url: `/prop/${ids}`,
    method: 'delete'
  })
}

//获取徽章   
export function getBadgeBase() {
  return request({
    url: `/badge`,
    method: 'get'
  })
}
