import request from '@/utils/request'
import { stitchUrl } from '@/utils/tools'
// 获取分享明细列表
export function getShareList(data) {
  const url = stitchUrl('/promotion/income/list', data)
  return request({
    url,
    method: 'get'
  })
}
