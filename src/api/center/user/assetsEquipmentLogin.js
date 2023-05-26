import request from '@/utils/request'

/**
 * 资产变更记录列表
 * pageSize
 * pageNum
 * uid
 */
export function queryUserLoginLogList(data) {
    var url = `/user/login/log/queryUserLoginLogList?pageSize=${data.pageSize}&pageNum=${data.pageNum}`
    if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null') {
        url += `&uid=${data.uid}`
    }
    if (data.ip != null && data.ip != undefined && `${data.ip}` != 'null') {
        url += `&ip=${data.ip}`
    }
    return request({
        url: url,
        method: 'get'
    })
}


// 人工存款
export function createUserAssets(data) {
    return request({
        url: '/center/user/assetslog',
        method: 'post',
        data
    })
}

