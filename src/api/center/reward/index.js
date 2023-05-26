import request from '@/utils/request'
import { stitchUrl } from '@/utils/tools'

// 获取彩票返水活动配置
export function getRewardAnchorConfig(data) {
  return request({
    url: '/activity/reward/getRewardAnchorConfig',
    method: 'get',
    data
  })
}

// 发放彩票返水（一键发放）
export function giveAllRecord() {
  return request({
    url: '/activity/reward/giveAllRecord',
    method: 'post'
  })
}

// 发放彩票返水（单条）
export function giveRecord(data) {
  const url = stitchUrl('/activity/reward/giveRecord', data)
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 查询彩票返水记录
export function getLotteryList(data) {
  return request({
    url: '/activity/reward/list',
    method: 'post',
    data
  })
}

// 更新彩票配置
export function updateRewardAnchorConfig(data) {
  return request({
    url: '/activity/reward/updateRewardAnchorConfig',
    method: 'post',
    data
  })
}

