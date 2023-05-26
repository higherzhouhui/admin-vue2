import request from '@/utils/agaentRequest'
// 推广域名管理列表
export function promotionDoMainList(data) {
  return request({
    url: `/agent-server/api/promotionDoMain/list`,
    method: 'post',
    data
  })
}

// 推广域名管理 绑定域名
export function promotionDoMainDind(data) {
  return request({
    url: `/agent-server/api/promotionDoMain/bind`,
    method: 'post',
    data
  })
}

// 推广域名管理 绑定域名
export function getCnameIpInfo(groupId) {
  return request({
    url: `/agent-server/api/promotionDoMain/getCnameIpInfo?groupId=${groupId}`,
    method: 'get'
  })
}
// 推广域名管理-通过cnameid获取私有域名信息
// {
//   agentId: integer(int64)
//   cnameId: integer(int64)
// }
export function getPrivateDomainByCname(data) {
  return request({
    url: `/agent-server/api/promotionDoMain/getPrivateDomainByCname?agentId=${data.agentId}&cnameId=${data.cnameId}`,
    method: 'get'
  })
}
