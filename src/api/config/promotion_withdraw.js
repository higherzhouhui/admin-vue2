import request from '@/utils/request'

// 提现兑换配置
export function getPromotionWithdraw() {
  return request({
    url: '/config/promotion/withdraw',
    method: 'get'
  })
}

// 提现兑换配置 
export function updatePromotionWithdraw(data) {
  return request({
    url: '/config/promotion/withdraw',
    method: 'patch',
    data
  })
}
