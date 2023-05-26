import request from '@/utils/request'
import { stitchUrl } from '@/utils/tools'

// 获取彩票返水活动配置
export function getLotteryBackwaterConfig(data) {
  return request({
    url: '/activity/lottery/getLotteryBackwaterConfig',
    method: 'get',
    data
  })
}

// 发放彩票返水（一键发放）
export function giveAllRecord(data) {
  return request({
    url: '/activity/lottery/giveAllRecord',
    method: 'post',
    data
  })
}

// 发放彩票返水（单条）
export function giveRecord(data) {
  const url = stitchUrl('/activity/lottery/giveRecord', data)
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 查询彩票返水记录
export function getLotteryList(data) {
  return request({
    url: '/activity/lottery/list',
    method: 'post',
    data
  })
}

// 更新彩票配置
export function updateLotteryBackwaterConfig(data) {
  return request({
    url: '/activity/lottery/updateLotteryBackwaterConfig',
    method: 'post',
    data
  })
}
