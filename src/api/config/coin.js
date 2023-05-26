import request from '@/utils/request'


export function getDayRank() {
  return request({
    url: '/coin/get/day',
    method: 'get'
  })
}

export function updateDayRank(data) {
  return request({
    url: '/coin/day',
    method: 'patch',
    data
  })
}