import request from '@/utils/request'

// bg捕鱼
export function recordKy(pageSize = 20, pageNum = 1, data) {
    var url = `/game/original/record/bgFish?pageSize=${pageSize}&pageNum=${pageNum}`
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

