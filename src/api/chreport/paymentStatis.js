import request from "@/utils/request";
/**
 * 获取代理资金报表
 * @param {object} data
 * @data endTime (integer): 截止时间
 * @data pageNum (integer): 页码
 * @data pageSize (integer): 每页大小
 * @data startTime (integer): 开始时间
 */
export function paymentStatis(data) {
  return request({
    url: "/ch/report/pay/paymentStatis",
    method: "post",
    data,
  });
}

export function paymentStatisTotal(data) {
  return request({
    url: "/ch/report/pay/paymentStatisTotal",
    method: "post",
    data,
  });
}
