import request from "@/utils/request";
/**
 * 获取列表数据
 * @param {object} data
 * @data endTime (integer): 截止时间
 * @data pageNum (integer): 页码
 * @data pageSize (integer): 每页大小
 * @data startTime (integer): 开始时间
 */
export function userAccessStatis(data) {
  return request({
    url: "/ch/report/pay/userAccessStatis",
    method: "post",
    data,
  });
}

export function userAccessStatisTotal(data) {
  return request({
    url: "/ch/report/pay/userAccessStatisTotal",
    method: "post",
    data,
  });
}
