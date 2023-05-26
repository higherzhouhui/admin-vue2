import request from '@/utils/request'
import { getURL } from '@/utils/tools'

// 红包雨中奖列表
export function getRedPacketAwardList(data) {
  var url = `/redPacket/win/list?`
  return request({
    url: getURL(url, data),
    method: 'post'
  })
}

// 红包雨中奖总数据
export function getRedPacketAwardListTotal(data) {
  var url = `/redPacket/win/total?`
  return request({
    url: getURL(url, data),
    method: 'post'
  })
}
