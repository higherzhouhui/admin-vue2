import request from '@/utils/request'

/**
 * 渠道列表
 * pageSize
 * pageNum
 * channel 渠道名
 * flagDelete 启用禁用
 */
export function getTypeSubsidyList(data) {
  var url = `/center/anchor/type/subsidy?pageSize=${data.limit}&pageNum=${data.page}`
  if (data.anchorType != null && data.anchorType != undefined && `${data.anchorType}` != 'null' && `${data.anchorType}` != '') {
    url += `&anchorType=${data.anchorType}`
  }
  return request({
    url: url,
    method: 'get'
  })
}




export function getTypeList() {
  var url = `/center/anchor/type/subsidy/typeList`
  return request({
    url: url,
    method: 'get'
  })
}



// 删除渠道
export function deleteTypeSubsidy(id) {
  return request({
    url: '/center/anchor/type/subsidy/' + id,
    method: 'delete'
  })
}


export function createTypeSubsidy(data) {
  return request({
    url: '/center/anchor/type/subsidy/create/typeSubsidy',
    method: 'post',
    data
  })
}


export function updateTypeSubsidy(data) {
  return request({
    url: '/center/anchor/type/subsidy/update/typeSubsidy',
    method: 'post',
    data
  })
}
