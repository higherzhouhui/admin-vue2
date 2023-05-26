import request from '@/utils/agaentRequest'
// 平台域名管理列表
export function platformDomainList(data) {
    return request({
        url: `/agent-server/api/platformDomain/list`,
        method: 'post',
        data
    })
}

// 平台域名修改 新增
export function update(data) {
    return request({
        url: `/agent-server/api/platformDomain/update`,
        method: 'post',
        data
    })
}

// 批量修改
export function batchUpdate(data) {
    return request({
        url: `/agent-server/api/platformDomain/batchUpdate`,
        method: 'post',
        data
    })
}

// 获取域名分组
export function getDoMainGroupListInfo() {
    return request({
        url: `/agent-server/api/domain/group/getDoMainGroupListInfo`,
        method: 'get',
    })
}