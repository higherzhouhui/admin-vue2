import request from '@/utils/request'
import { stitchUrl } from '@/utils/tools'
export function getInvitedList(data) {
  const url = stitchUrl('/live/anchorBroadcast/list', data)
  return request({
    url: url,
    method: 'get'
  })
}
export function updateBroadcast(data) {
  const url = stitchUrl('/live/anchorBroadcast/setBroadcast', data)
  return request({
    url: url,
    method: 'post',
    data
  })
}
export function getBroadcast() {
  const url = stitchUrl('/live/anchorBroadcast/getBroadcast', {})
  return request({
    url: url,
    method: 'get'
  })
}
