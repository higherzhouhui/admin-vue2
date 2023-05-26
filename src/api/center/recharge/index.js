import request from '@/utils/request'
import { stitchUrl } from '@/utils/tools'


// 获取活动充值纪录
export function listPromotionRechargeRecord(data) {
  const url = stitchUrl('/activity/promotion/pecharge/listPromotionRechargeRecord', data)
  return request({
    url: url,
    method: 'post',
    data
  })
}


