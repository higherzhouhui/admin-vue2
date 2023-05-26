import request from '@/utils/request'

export function getErrorRegisterList(pageSize = 20, pageNum = 1, data) {
    console.log(pageSize, pageNum, data)
    var url = `/user/login/log/queryErrorRegisterList?pageSize=${pageSize}&pageNum=${pageNum}`
    if (data.phone != null && data.phone != undefined && `${data.phone}` != 'null' && `${data.phone}` != '') {
        url += `&phone=${data.phone}`
    }
    // 处理时间
    var startTime = null;
    var endTime = null;
    if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
        let values = data.pickerValue;
        startTime = values[0];
        endTime = values[1];
    }
    if (startTime != null && startTime != undefined && `${startTime}` != 'null') {
        url += `&startTime=${startTime}`
    }
    if (endTime != null && endTime != undefined && `${endTime}` != 'null') {
        url += `&endTime=${endTime}`
    }
    return request({
        url: url,
        method: 'get'
    })
}