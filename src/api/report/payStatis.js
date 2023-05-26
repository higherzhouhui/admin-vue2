import request from "@/utils/request";
/**
 * 获取代理资金报表
 * @param {object} data
 * @data endTime (integer): 截止时间
 * @data pageNum (integer): 页码
 * @data pageSize (integer): 每页大小
 * @data startTime (integer): 开始时间
 */
export function payStatis(data) {
  return request({
    url: "/report/pay/payStatis",
    method: "post",
    data,
  });
}

export function payStatisTotal(data) {
  return request({
    url: "/report/pay/payStatisTotal",
    method: "post",
    data,
  });
}
