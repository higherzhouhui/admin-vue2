import request from '@/utils/request'
import { stitchUrl } from '../../../utils/tools'

// 列表
export function getQucik(data) {
  const url = stitchUrl('/live/quickComment', data)
  return request({
    url: url,
    method: 'get'
  })
}

// 新增
export function addQuickComment(data) {
  const url = stitchUrl('/live/quickComment/addQuickComment', data)
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 删除
export function delQuickComment(data) {
  const url = stitchUrl('/live/quickComment/del', data)
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 编辑
export function updateQuickComment(data) {
  const url = stitchUrl('/live/quickComment/updateQuickComment', data)
  return request({
    url: url,
    method: 'post',
    data
  })
}
