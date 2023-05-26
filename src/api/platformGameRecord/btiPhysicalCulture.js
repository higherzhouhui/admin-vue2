import request from '@/utils/request'

// bti体育
export function recordKy(pageSize = 20, pageNum = 1, data) {
    var url = `/game/original/record/bti?pageSize=${pageSize}&pageNum=${pageNum}`
    if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
        url += `&uid=${data.uid}`
    }
    if (data.type != null && data.type != undefined && `${data.type}` != 'null' && `${data.type}` != '') {
        url += `&type=${data.type}`
    }
    if (data.pickerValue2 != null && data.pickerValue2 != undefined && data.pickerValue2[0] != undefined) {
        url += `&betStartTime=${data.pickerValue2[0]}`
    }
    if (data.pickerValue2 != null && data.pickerValue2 != undefined && data.pickerValue2[0] != undefined) {
        url += `&betEndTime=${data.pickerValue2[1]}`
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

