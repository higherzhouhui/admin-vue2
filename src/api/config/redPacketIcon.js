import request from '@/utils/request'
import { getURL } from '@/utils/tools'

// 红包ICON列表
export function getRedPacketIconList(data) {
  var url = `/redPacketIcon/list?`
  return request({
    url: getURL(url, data),
    method: 'post'
  })
}

// 添加红包ICON列表
export function redPacketIconAdd(data) {
  var url = `/redPacketIcon/add`
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 编辑红包ICON列表
export function redPacketUpdate(data) {
  var url = `/redPacketIcon/update`
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 禁用启用红包ICON状态
export function redPacketUpdateStatus(data) {
  var url = `/redPacketIcon/updateStatus?`
  return request({
    url: getURL(url, data),
    method: 'post'
  })
}


