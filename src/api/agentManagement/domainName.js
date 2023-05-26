import request from '@/utils/agaentRequest'
// 域名分组列表
export function groupList(data) {
    return request({
        url: `/agent-server/api/domain/group/list`,
        method: 'post',
        data
    })
}

// 新增/修改
export function update(data) {
    return request({
        url: `/agent-server/api/domain/group/update`,
        method: 'post',
        data
    })
}

// 平台域名管理列表
export function platformDomainList(data) {
    return request({
        url: '/agent-server/api/platformDomain/list',
        method: 'post',
        data
    })
}
// 分组域名配置
export function subGroupConfig(data) {
    return request({
        url: '/agent-server/api/domain/group/subGroupConfig',
        method: 'post',
        data
    })
}