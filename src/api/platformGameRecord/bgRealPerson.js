import request from '@/utils/request'

// bg真人
export function recordKy(pageSize = 20, pageNum = 1, data) {
    var url = `/game/original/record/bgLive?pageSize=${pageSize}&pageNum=${pageNum}`
    if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
        url += `&uid=${data.uid}`
    }
    if (data.type != null && data.type != undefined && `${data.type}` != 'null' && `${data.type}` != '') {
        url += `&type=${data.type}`
    }
    if (data.pickerValue != null && data.pickerValue != undefined && data.pickerValue[0] != undefined) {
        url += `&settlementStartTime=${data.pickerValue[0]}`
    }
    if (data.pickerValue != null && data.pickerValue != undefined && data.pickerValue[0] != undefined) {
        url += `&settlementEndTime=${data.pickerValue[1]}`
    }
    return request({
        url: url,
        method: 'get'
    })
}

// 游戏数据手动补偿
export function dayCompensate(data) {
    return request({
        url: "/game/compensate/dayCompensate",
        method: 'post',
        data
    })
}
// 游戏数据手动补偿2 ag、pp、xg、fb
export function hourCompensate(data) {
    return request({
        url: "/game/compensate/hourCompensate",
        method: 'post',
        data
    })
}