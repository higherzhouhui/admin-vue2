import request from '@/utils/agaentRequest'
// 审核确认
export function checkConfirm(data) {
    return request({
        url: `/agent-server/api/withdraw/checkConfirm`,
        method: 'post',
        data
    })
}

// 获取提款记录信息
export function getWithdrawInfo(data) {
    return request({
        url: `/agent-server/api/withdraw/getWithdrawInfo`,
        method: 'post',
        data
    })
}
// 导出
export function getWithdrawInfoExport(data) {
    return request({
        // url: `/agent-server/api/withdraw/getWithdrawInfo/export?account=${data.account}&endDate=${data.endDate}&orderId=${data.orderId}&startDate=${data.startDate}`,
        url: `/agent-server/api/withdraw/getWithdrawInfo/export`,
        method: 'post',
        data,
        responseType: 'blob'
    })
}

// 默认配置数据
export function getConfigDataInfo() {
    return request({
        url: `/agent-server/agent/config/getConfigDataInfo`,
        method: 'get',
    })
}