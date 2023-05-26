import request from '@/utils/agaentRequest'
// 代理用户列表
export function pageList(data) {
  var url = '/agent-server/api/agent/pageList'
  return request({
    url: url,
    method: 'post',
    // params: data
    data
  })
}
// 添加总代理
export function addTopAgent(data) {
  return request({
    url: '/agent-server/api/agent/addTopAgent',
    method: 'post',
    data
  })
}
// 更新代理状态
export function updateAgentStatus(data) {
  return request({
    url: '/agent-server/api/agent/updateAgentStatus',
    method: 'post',
    data
  })
}
// 域名分组列表
export function getDoMainGroupListInfo() {
  return request({
    url: `/agent-server/api/domain/group/getDoMainGroupListInfo`,
    method: 'get'
  })
}
// 代理详请
export function getAgentDetail(data) {
  return request({
    url: `/agent-server/api/agent/getAgentDetail`,
    method: 'post',
    data
  })
}
// 平台费比例
export function getSysGameConfig() {
  return request({
    url: `/agent-server/api/config/getSysGameConfig`,
    method: 'get'
  })
}
// 编辑总代理
export function updateAgent(data) {
  return request({
    url: '/agent-server/api/agent/updateAgent',
    method: 'post',
    data
  })
}

// 重置密码
export function resetAgentPwd(data) {
  return request({
    url: '/agent-server/api/agent/resetAgentPwd',
    method: 'post',
    data
  })
}

// 下级会员列表
export function getNumberList(data) {
  return request({
    url: '/agent-server/api/agent/directMemberList',
    method: 'post',
    data: data
  })
}

// 查询会员红利数据
/*
{
    "month": "",
    "uid": 0
}
*/
export function queryMemberBonusData(data) {
  return request({
    url: '/agent-server/api/member/queryMemberBonusData',
    method: 'post',
    data: data
  })
}

// 查询会员存款
/*
{
    "month": "",
    "uid": 0
}
*/
export function queryMemberDepositData(data) {
  return request({
    url: '/agent-server/api/member/queryMemberDepositData',
    method: 'post',
    data: data
  })
}

// 查询会员游戏数据
/*
{
    "month": "",
    "uid": 0
}
*/
export function queryMemberGameData(data) {
  return request({
    url: '/agent-server/api/member/queryMemberGameData',
    method: 'post',
    data: data
  })
}

// 查询会员打赏数据
/*
{
    "month": "",
    "uid": 0
}
*/
export function queryMemberGiftData(data) {
  return request({
    url: '/agent-server/api/member/queryMemberGiftData',
    method: 'post',
    data: data
  })
}

// 查询会员提款数据
/*
{
    "month": "",
    "uid": 0
}
*/
export function queryMemberWithdrawData(data) {
  return request({
    url: '/agent-server/api/member/queryMemberWithdrawData',
    method: 'post',
    data: data
  })
}

// 导出代理列表
export function agentExport(data) {
  return request({
    url: `/agent-server/api/agent/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 导出会员报表
export function memberListExport(data) {
  return request({
    url: `/agent-server/api/agent/directMemberList/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 导出会员报表
export function queryUpdateAgentList(data) {
  return request({
    url: `/agent-server/api/agent/queryUpdateAgentList`,
    method: 'post',
    data
  })
}
