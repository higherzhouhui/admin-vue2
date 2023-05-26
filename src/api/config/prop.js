import request from '@/utils/request'

// 获取道具列表
export function getPropList(data) {
  var url = `/prop?`
  if (data.pageSize != null && data.pageSize != undefined && `${data.pageSize}` != 'null' && `${data.pageSize}` != '') {
    url += `&pageSize=${data.pageSize}`
  }
  if (data.pageNum != null && data.pageNum != undefined && `${data.pageNum}` != 'null' && `${data.pageNum}` != '') {
    url += `&pageNum=${data.pageNum}`
  }
  if (data.type != null && data.type != undefined && `${data.type}` != 'null' && `${data.type}` != '') {
    url += `&type=${data.type}`
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


export function getListCarConfigList(data) {
  var url = `/prop/listCarConfig`
  return request({
    url: url,
    method: 'get'
  })
}

// 修改座驾
export function updateCarConfig(data) {
  return request({
    url: '/prop/updateCarConfig',
    method: 'post',
    data
  })
}
// 转盘列表
export function propsList() {
  return request({
    url: `/config/turntable/props/list`,
    method: 'get'
  })
}
// 修改新增转盘列表
export function propsSave(data) {
  return request({
    url: `/config/turntable/props/save`,
    method: 'post',
    data
  })
}
//获取主播类型 
export function typeAllType() {
  return request({
    url: `/center/anchor/type/allType`,
    method: 'get'
  })
}

// 礼物分类
export function listGiftCateGory() {
  return request({
    url: `/prop/listGiftCateGory`,
    method: 'get'
  })
}

// 世界横幅配置获取
export function getWorldBanner() {
  return request({
    url: `/gift/getWorldBanner`,
    method: 'post'
  })
}
// 世界横幅配置修改
export function worldBannerSet(data) {
  return request({
    url: `/gift/worldBannerSet`,
    method: 'post',
    data: data
  })
}

export function refreshGiftCarList() {
  return request({
    url: `/prop/refreshGiftCarList`,
    method: 'post'
  })
}