import request from '@/utils/request';
import { getURL } from "@/utils/tools";

//获取红包类型表格
export function getRedPacketList(pageSize = 20, pageNum = 1, data) {
  var url = `/redPacket/list?pageSize=${pageSize}&pageNum=${pageNum}`

  return request({
    url: getURL(url, data),
    method: 'post'
  })
}

// 子表格数据
export function getRedDetailList(redPacketId) {
  var url = `/redPacket/getRedDetailList?redPacketId=${redPacketId}`
  return request({
    url: url,
    method: 'post'
  })
}

//添加活动
export function RedPacketAdd(data) {
  var url = `/redPacket/add`
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 编辑活动
export function RedPacketUpdate(data) {
  var url = `/redPacket/update`
  return request({
    url: url,
    method: 'post',
    data
  })
}

//更新活动状态
export function redPacketUpdateStatus(data) {
  var url = `/redPacket/updateDetail?operationType=${data.operationType}&id=${data.redPacketId}`
  return request({
    url: url,
    method: 'post'
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

export function checkTime(obj) {
  var url = `/redPacket/checkTime?`

  return request({
    url: getURL(url, obj),
    method: 'post'
  })
}

// 红包雨动画时长查询
export function getAnimationTime() {
  var url = `/redPacket/getAnimationTime`
  return request({
    url,
    method: 'post'
  })
}

// 红包雨动画时长设置
export function setAnimationTime(obj) {
  var url = `/redPacket/setAnimationTime?`
  return request({
    url: getURL(url, obj),
    method: 'post'
  })
}
