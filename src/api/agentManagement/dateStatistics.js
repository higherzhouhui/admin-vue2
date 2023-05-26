
import request from '@/utils/agaentRequest'
// 域名分组列表
export function dailyReport(data) {
    return request({
        url: `/commission-server/api/dailyReport`,
        method: 'post',
        data
    })
}