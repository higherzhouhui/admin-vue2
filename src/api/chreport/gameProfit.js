import request from "@/utils/request";
/**
 * 获取直播支出列表
 * @param {object} data
 * @data endTime (integer): 截止时间
 * @data pageNum (integer): 页码
 * @data pageSize (integer): 每页大小
 * @data startTime (integer): 开始时间
 */
export function gameProfit(data) {
  return request({
    url: "/ch/report/dailyStatistics/gameProfit",
    method: "post",
    data,
  });
}

export function gameProfitTotal(data) {
  return request({
    url: "/ch/report/dailyStatistics/gameProfitTotal",
    method: "post",
    data,
  });
}
