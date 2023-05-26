import request from "@/utils/request";
export function report(data) {
    return request({
      url: "/ch/version/login/report",
      method: "post",
      data,
    });
  }

