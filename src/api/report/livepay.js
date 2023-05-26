import request from "@/utils/request";
/**
 * 获取直播支出列表
 * @param {object} data
 * @data endTime (integer): 截止时间
 * @data pageNum (integer): 页码
 * @data pageSize (integer): 每页大小
 * @data startTime (integer): 开始时间
 */
export function liveprofitList(data) {
  return request({
    url: "/report/live/livePay",
    method: "post",
    data,
  });
}

export function liveprofitTotal(data) {
  return request({
    url: "/report/live/livePayTotal",
    method: "post",
    data,
  });
}
