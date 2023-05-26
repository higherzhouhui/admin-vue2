import request from "@/utils/request";

export function getCpTypeList(pageSize = 20, pageNum = 1, data) {
  var url = `/cp/config?pageSize=${pageSize}&pageNum=${pageNum}`;
  if (
    data.status != null &&
    data.status != undefined &&
    `${data.status}` != "null" &&
    `${data.status}` != ""
  ) {
    url += `&status=${data.status}`;
  }
  if (
    data.name != null &&
    data.name != undefined &&
    `${data.name}` != "null" &&
    `${data.name}` != ""
  ) {
    url += `&name=${data.name}`;
  }
  return request({
    url: url,
    method: "get",
  });
}

export function createCpType(data) {
  return request({
    url: "/cp/config",
    method: "post",
    data,
  });
}

export function updateCpType(data) {
  return request({
    url: "/cp/config",
    method: "patch",
    data,
  });
}

export function deleteCpType(id) {
  return request({
    url: "/cp/config/" + id,
    method: "delete",
  });
}
export function changeCpStatus(params) {
  return request({
    url: "/cp/config/changeStatus",
    method: "post",
    params,
  });
}

export function getCpMessage() {
  var url = `/cp/config/getCpMessage`;
  return request({
    url: url,
    method: "post",
  });
}

export function startCp() {
  return request({
    url: "/cp/lotteryrecord/isStart?&status=0",
    method: "get",
  });
}

export function stopCp() {
  return request({
    url: "/cp/lotteryrecord/isStart?&status=1",
    method: "get",
  });
}

export function startCpButton() {
  return request({
    url: "/cp/lotteryrecord/isButton?&status=0",
    method: "get",
  });
}

export function stopCpButton() {
  return request({
    url: "/cp/lotteryrecord/isButton?&status=1",
    method: "get",
  });
}

export function HandleClearCache() {
  return request({
    url: "/cp/config/refreshCPList",
    method: "get",
  });
}
