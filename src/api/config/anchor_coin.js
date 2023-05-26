import request from '@/utils/request'


export function getDayRank() {
  return request({
    url: '/coin/get/anchor/day',
    method: 'get'
  })
}

export function updateDayRank(data) {
  return request({
    url: '/coin/anchor/day',
    method: 'patch',
    data
  })
}