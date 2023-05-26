import request from "@/utils/request";
/**
 * 获取日利润报表
 * @param {object} data
 * @data endTime (integer): 截止时间
 * @data pageNum (integer): 页码
 * @data pageSize (integer): 每页大小
 * @data startTime (integer): 开始时间
 */
export function dailyProfit(data) {
  return request({
    url: "/ch/report/daily/dailyProfit",
    method: "post",
    data,
  });
}

export function liveProfitTotal(data) {
  return request({
    url: "/ch/report/daily/dailyProfitTotal",
    method: "post",
    data,
  });
}
