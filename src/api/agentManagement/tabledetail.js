import request from '@/utils/agaentRequest'
import request2 from "@/utils/request";

// 游戏输赢报表
export function gameStatisTable(data) {
  return request({
    url: `/commission-server/api/gameStatis`,
    method: 'post',
    data
  })
}

// 游戏输赢日报表
export function agentGameDailyStatis(data) {
  return request({
    url: `/commission-server/api/agentGameDailyStatis`,
    method: 'post',
    data
  })
}

// 平台总输赢报表
export function platformProfitStatis(data) {
  return request({
    url: `/commission-server/api/platformProfitStatis`,
    method: 'post',
    data
  })
}
// 平台总输赢导出
export function platformProfitStatisExport(data) {
  return request({
    url: `/commission-server/api/platformProfitStatis/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 平台总输赢报表（新）
export function platformProfitStatisNew(data) {
  return request2({
    url: `/ch/game/platformProfitStatis`,
    method: 'post',
    data
  })
}
// 平台总输赢导出（新）
export function platformProfitStatisExportNew(data) {
  return request2({
    url: `/ch/game/platformProfitStatis/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 用户总输赢报表
export function usersProfitStatis(data) {
  return request({
    url: `/commission-server/api/userProfitStatis`,
    method: 'post',
    data
  })
}

// 用户总输赢导出
export function usersProfitStatisExport(data) {
  return request({
    url: `/commission-server/api/userProfitStatis/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 活动红利报表
export function bannusTable(data) {
  return request({
    url: `/commission-server/api/activityBonusStatis`,
    method: 'post',
    data
  })
}

// 添加佣金调整记录
export function addCommissionModifyTable(data) {
  return request({
    url: `/commission-server/api/addCommissionModify`,
    method: 'post',
    data
  })
}
// 获取子代理提成佣金明细
export function getChildAgentCommission(data) {
  const url = stitchUrl('/commission-server/api/getChildAgentCommission', data)
  return request({
    url: url,
    method: 'get'
  })
}

// 佣金调整明细
export function commissionModifyRecordTable(data) {
  return request({
    url: `/commission-server/api/commissionModifyRecord`,
    method: 'post',
    data
  })
}

// 佣金调整统计
export function commissionModifyStatisTable(data) {
  return request({
    url: `/commission-server/api/commissionModifyStatis`,
    method: 'post',
    data
  })
}

// 游戏平台费统计
export function gamePlatformStatisTable(data) {
  return request({
    url: `/commission-server/api/gamePlatformStatis`,
    method: 'post',
    data
  })
}

// 主播打赏抽成报表
export function giftCommissionStatisTable(data) {
  return request({
    url: `/commission-server/api/giftCommissionStatis`,
    method: 'post',
    data
  })
}

// 扶持佣金统计
export function supportCommissionStatisTable(data) {
  return request({
    url: `/commission-server/api/supportCommissionStatis`,
    method: 'post',
    data
  })
}

// 代理佣金报表 统计和结算共用
export function agentCommissionStatis(data) {
  return request({
    url: '/commission-server/api/agentCommissionStatis',
    method: 'post',
    data
  })
}

// 发放代理佣金 适用代理佣金 团队佣金
export function giveAgentCommission(data) {
  return request({
    url: `/commission-server/api/giveAgentCommission?id=${data.id}&operator=${data.operator}`,
    method: 'post'
  })
}
// 发放扶持佣金
export function giveSupportCommission(data) {
  return request({
    url: `/commission-server/api/giveSupportCommission?id=${data.id}&operator=${data.operator}`,
    method: 'post'
  })
}
// 团队代理佣金报表:统计和结算共用接口
export function teamCommissionStatis(data) {
  return request({
    url: '/commission-server/api/teamCommissionStatis',
    method: 'post',
    data
  })
}
// 礼物抽成比例更新
export function updateGiftCommissionRatio(data) {
  return request({
    url: `/agent-server/api/config/updateGiftCommissionRatio?operator=${data.operator}&giftCommissionRatio=${data.giftCommissionRatio}`,
    method: 'post'
  })
}
// 拼接字符串
const stitchUrl = (url, data) => {
  let newUrl = url
  Object.keys(data).map(item => {
    if (newUrl.includes('?')) {
      newUrl += `&${item}=${data[item]}`
    } else {
      newUrl += `?${item}=${data[item]}`
    }
  })
  return newUrl
}
// 有效人数设置
export function updateValidPerson(data) {
  const url = stitchUrl('/agent-server/api/config/updateValidPerson', data)
  return request({
    url: url,
    method: 'post'
  })
}
// 获取游戏平台费比例
export function getSysGameConfig() {
  return request({
    url: '/agent-server/api/config/getSysGameConfig',
    method: 'get'
  })
}
// 游戏平台费比例-更新
export function updateSysGameConfig(data) {
  return request({
    url: `/agent-server/api/config/updateSysGameConfig`,
    method: 'post',
    data
  })
}
// 扶持方案
export function getSysSupportPlan() {
  return request({
    url: '/agent-server/api/config/getSysSupportPlan',
    method: 'get'
  })
}

// 扶持方案更新
export function updateSysSupportPlan(data) {
  return request({
    url: '/agent-server/api/config/updateSysSupportPlan',
    method: 'post',
    data
  })
}

// 佣金等级比例
export function getCommissionLevelRatio() {
  return request({
    url: '/agent-server/api/config/getCommissionLevelRatio',
    method: 'get'
  })
}
// 佣金添加修改
export function addOrUpdateCommissionLevelRatio(data) {
  return request({
    url: '/agent-server/api/config/addOrUpdateCommissionLevelRatio',
    method: 'post',
    data
  })
}
// 佣金删除
export function deleteCommissionLevelRatio(data) {
  return request({
    url: '/agent-server/api/config/deleteCommissionLevelRatio',
    method: 'post',
    data
  })
}
// 获取礼物抽成
export function getGiftCommissionRatio() {
  return request({
    url: '/agent-server/api/config/getGiftCommissionRatio',
    method: 'get'
  })
}
// 有效人数设置
export function getValidPerson() {
  return request({
    url: '/agent-server/api/config/getValidPerson',
    method: 'get'
  })
}
// 扶持佣金发放方式
export function getSupportCommissionGive() {
  return request({
    url: '/agent-server/api/config/getSupportCommissionGive',
    method: 'get'
  })
}

// 扶持佣金发放方式 更新
export function updateSupportCommissionGive(data) {
  return request({
    url: `/agent-server/api/config/updateSupportCommissionGive?operator=${data.operator}&supportCommissionGive=${data.supportCommissionGive}`,
    method: 'post'
  })
}

// 活动红利报表-excel导出
export function activityBonusStatisExport(data) {
  return request({
    url: `/commission-server/api/activityBonusStatis/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 代理佣金报表-excel导出
export function agentCommissionStatisExport(data) {
  return request({
    url: `/commission-server/api/agentCommissionStatis/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 代理佣金调整明细-excel导出
export function commissionModifyRecordExport(data) {
  return request({
    url: `/commission-server/api/commissionModifyRecord/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 代理佣金调整统计-excel导出
export function commissionModifyStatisExport(data) {
  return request({
    url: `/commission-server/api/commissionModifyStatis/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 游戏平台费统计-excel导出
export function gamePlatformStatisExport(data) {
  return request({
    url: `/commission-server/api/gamePlatformStatis/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 游戏输赢报表-excel导出
export function gameStatisExport(data) {
  return request({
    url: `/commission-server/api/gameStatis/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 游戏输赢日报表-excel导出
export function agentGameDailyStatisExport(data) {
  return request({
    url: `/commission-server/api/agentGameDailyStatis/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 主播打赏抽成报表-excel导出
export function giftCommissionStatisExport(data) {
  return request({
    url: `/commission-server/api/giftCommissionStatis/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 扶持佣金统计-excel导出
export function supportCommissionStatisExport(data) {
  return request({
    url: `/commission-server/api/supportCommissionStatis/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 团队代理佣金报表-excel导出
export function teamCommissionStatisExport(data) {
  return request({
    url: `/commission-server/api/teamCommissionStatis/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

// 重新核算代理的佣金

export function recalculateAgentCommission(data) {
  return request({
    url: `/commission-server/api/recalculateAgentCommission`,
    method: 'post',
    data
  })
}

// 获取彩票返水比例
export function getLotteryRateConfig() {
  return request({
    url: `/agent-server/api/config/getLotteryRateConfig`,
    method: 'get'
  })
}

// 更新彩票返水比例
export function updateLotteryRateConfig(data) {
  return request({
    url: '/agent-server/api/config/updateLotteryRateConfig',
    method: 'post',
    data
  })
}

// 代理彩票返水明细
export function agentLotteryRebateRecord(data) {
  return request({
    url: '/commission-server/api/agentLotteryRebateRecord',
    method: 'post',
    data
  })
}
// 发放彩票返水(一键发放)
export function giveAllLotteryRebate(data) {
  return request({
    url: `/commission-server/api/giveAllLotteryRebate?operator=${data.operator}&date=${data.date}&month=${data.month}`,
    method: 'post',
    data
  })
}
//发放彩票返水(单条)
export function giveLotteryRebateById(data) {
  return request({
    url: `/commission-server/api/giveLotteryRebateById?operator=${data.operator}&id=${data.id}`,
    method: 'post',
    data
  })
}

//代理彩票返水明细-excel导出
export function agentLotteryRebateRecordExport(data) {
  return request({
    url: `/commission-server/api/agentLotteryRebateRecord/export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}