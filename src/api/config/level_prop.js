import request from '@/utils/request'

// 获取道具列表
export function getPropList(data) {
  var url = `/level/prop?`
  if (data.pageSize != null && data.pageSize != undefined && `${data.pageSize}` != 'null' && `${data.pageSize}` != '') {
    url += `&pageSize=${data.pageSize}`
  }
  if (data.pageNum != null && data.pageNum != undefined && `${data.pageNum}` != 'null' && `${data.pageNum}` != '') {
    url += `&pageNum=${data.pageNum}`
  }
  if (data.type != null && data.type != undefined && `${data.type}` != 'null' && `${data.type}` != '') {
    url += `&type=${data.type}`
  }

  return request({
    url: url,
    method: 'get'
  })
}

// 新增道具
export function createProp(data) {
  return request({
    url: '/level/prop',
    method: 'post',
    data
  })
}

// 更新直播间的道具
export function updateLiveProp(data) {
  return request({
    url: '/level/prop/msg',
    method: 'post',
    data
  })
}



// 编辑道具
export function updateProp(data) {
  return request({
    url: '/level/prop',
    method: 'patch',
    data
  })
}

// 刪除道具
export function deleteProp(ids) {
  return request({
    url: `/level/prop/${ids}`,
    method: 'delete'
  })
}
