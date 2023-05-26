import request from '@/utils/request'


export function getWeekRank() {
  return request({
    url: '/coin/get/week',
    method: 'get'
  })
}

export function updateWeekRank(data) {
  return request({
    url: '/coin/week',
    method: 'patch',
    data
  })
}
