import request from '@/utils/request'

export function getHierarchyList(pageSize = 20, pageNum = 1,date,id) {
  var url = `/center/account/base/dlized?pageSize=${pageSize}&pageNum=${pageNum}`
  if (date.uid != null && date.uid != undefined && `${date.uid}` != 'null' && `${date.uid}` != '') {
    url += `&uid=${date.uid}`
  }
  if (id != null && id != undefined && `${id}` != 'null' && `${id}` != '') {
    url += `&id=${id}`
  }
  return request({
    url: url,
    method: 'get'
  })
}


export function getHierarchicalUser() {
  return request({
    url: '/center/account/base/dlizedName',
    method: 'get'
  })
}

export function updateHierarchy(params) {
  return request({
    url: '/center/account/base/updateHierarchy?id='+params.id+'&uid='+params.uid,
    method: 'get'
  })
}

// 批量分层
export function updateBatchHierarchy(data) {
  return request({
    url: `/center/account/base/updateBatchHierarchy?id=${data.id}&uidList=${data.uidList}`,
    method: 'post',
    data
  })
}
