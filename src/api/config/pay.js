import request from '@/utils/request'
import Qs from 'qs'

// 支付渠道配置列表
export function getPayChannelList(pageSize = 20, pageNum = 1) {
  var url = `/payChannel?pageSize=${pageSize}&pageNum=${pageNum}`
  return request({
    url: url,
    method: 'get'
  })
}


//获取用户层级列表
export function getHierarchyList() {
  var url = `/center/Hierarchy/list`
  return request({
    url: url,
    method: 'get'
  })
}

// 新增支付渠道配置
export function createPayChannel(data) {
  if (data.product != null && data.product.length > 0) {
    var arr = new Array();
    var new_str = '';
    var len = data.product.length;
    for (var i = 0; i < len; i++) {
      var a = data.product[i];
      arr[i] = a;
    }
    new_str = arr.join(",");
    data.product = new_str
  } else {
    data.product = ''
  }

  return request({
    url: '/payChannel',
    method: 'post',
    data
  })
}

// 编辑支付渠道配置
export function updatePayChannel(data) {
  if (data.product != null && data.product.length > 0) {
    var arr = new Array();
    var new_str = '';
    var len = data.product.length;
    for (var i = 0; i < len; i++) {
      var a = data.product[i];
      arr[i] = a;
    }
    new_str = arr.join(",");
    data.product = new_str
  } else {
    data.product = ''
  }

  return request({
    url: '/payChannel',
    method: 'patch',
    data
  })
}





// 编辑支付渠道配置
export function updatePayChannel1(data) {
  return request({
    url: '/payChannel/user',
    method: 'patch',
    data
  })
}

// 编辑支付渠道配置
export function updatePayExplain(data) {
  return request({
    url: '/payChannel/updatePayExplain',
    method: 'patch',
    data
  })
}


export function updateStatus(data) {
  return request({
    url: '/payChannel/user',
    method: 'patch',
    data
  })
}


// 编辑支付渠道产品配置
export function updatePayChannelProduct(tags, id) {
  var arr = new Array();
  var new_str = '';
  var len = tags.length;
  for (var i = 0; i < len; i++) {
    var a = tags[i];
    arr[i] = a;
  }
  new_str = arr.join(",");

  return request({
    url: '/payChannel',
    method: 'patch',
    data: {
      id: id,
      product: new_str
    }
  })
}

// 刪除支付渠道配置
export function deletePayChannel(ids) {
  return request({
    url: '/payChannel/' + ids,
    method: 'delete'
  })
}
