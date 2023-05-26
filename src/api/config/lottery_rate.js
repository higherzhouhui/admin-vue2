import request from '@/utils/request'

// 获取彩票目标额度配置
export function getLotteryRate() {
  return request({
    url: '/config/lottery/rate',
    method: 'get'
  })
}

// 修改彩票目标额度配置
export function updateLotteryRate(data) {
  return request({
    url: 'config/lottery/rate',
    method: 'patch',
    data
  })
}
