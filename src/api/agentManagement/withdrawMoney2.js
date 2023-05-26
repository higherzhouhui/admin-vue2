import request from '@/utils/request'

// 新增贵族信息
export function goldAgent(data) {
    return request({
        url: '/center/withdraw/user/gold/agent',
        method: 'post',
        data
    })
}