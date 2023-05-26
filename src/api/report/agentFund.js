import request from "@/utils/request";
/**
 * 获取代理资金报表
 * @param {object} data
 * @data endTime (integer): 截止时间
 * @data pageNum (integer): 页码
 * @data pageSize (integer): 每页大小
 * @data startTime (integer): 开始时间
 */
export function agentStatis(data) {
  return request({
    url: "/report/agent/agentStatis",
    method: "post",
    data,
  });
}

export function agentStatisTotal(data) {
  return request({
    url: "/report/agent/agentStatisTotal",
    method: "post",
    data,
  });
}
