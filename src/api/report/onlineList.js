import request from "@/utils/request";
export function dayStatis(data) {
    return request({
        url: "/ch/report/live/dayStatis",
        method: "post",
        data,
    });
}