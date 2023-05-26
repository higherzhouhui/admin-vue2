import request from '@/utils/request'
export function updateResourceVersion(data) {
  return request({
    url: '/resource/version/update',
    method: 'post',
    data
  })
}
