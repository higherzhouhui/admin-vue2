import request from '@/utils/request'
import { stitchUrl } from '@/utils/tools'


// 获取活动充值纪录
export function getList(data) {
  const url = stitchUrl('/gift/bet/record/list', data)
  return request({
    url: url,
    method: 'post',
    data
  })
}
export function getBetList(data = {}) {
  const url = stitchUrl('/gift/bet/list', data)
  return request({
    url: url,
    method: 'post',
    data
  })
}
// 新增送彩票配置
export function add(data) {
  const url = stitchUrl('/gift/bet/add', data)
  return request({
    url: url,
    method: 'post',
    data
  })
}
// 编辑送彩票配置
export function edit(data) {
  const url = stitchUrl('/gift/bet/edit', data)
  return request({
    url: url,
    method: 'post',
    data
  })
}
// 新增中奖号码
export function lotteryResultAdd(data) {
  const url = stitchUrl('/gift/bet/lotteryResult/add', data)
  return request({
    url: url,
    method: 'post',
    data
  })
}
// 中奖结果列表
export function lotteryResultList(data) {
  const url = stitchUrl('/gift/bet/lotteryResult/list', data)
  return request({
    url: url,
    method: 'post',
    data
  })
}
// 编辑中奖号码
export function lotteryResultEdit(data) {
  const url = stitchUrl('/gift/bet/lotteryResult/edit', data)
  return request({
    url: url,
    method: 'post',
    data
  })
}
export function getIssue(data = {}) {
  const url = stitchUrl('/gift/bet/issue', data)
  return request({
    url: url,
    method: 'get',
    data
  })
}


