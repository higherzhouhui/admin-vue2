import request from '@/utils/request'

// 获取主播补贴配置
export function getAnchorSubsidy() {
  return request({
    url: '/config/anchor/subsidy',
    method: 'get'
  })
}

// 修改主播补贴配置
export function updateAnchorSubsidy(data) {
  return request({
    url: 'config/anchor/subsidy',
    method: 'patch',
    data
  })
}
