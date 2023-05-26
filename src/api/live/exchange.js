import request from '@/utils/request'

export function centerAssetsChange(data) {
    var url = `/center/assets/change?`
    if (data.pageSize != null && data.pageSize != undefined && `${data.pageSize}` != 'null' && JSON.stringify(data.pageSize) != '') {
        url += `&pageSize=${data.pageSize}`
    }
    if (data.pageNum != null && data.pageNum != undefined && `${data.pageNum}` != 'null' && JSON.stringify(data.pageNum) != '') {
        url += `&pageNum=${data.pageNum}`
    }
    if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && JSON.stringify(data.uid) != '') {
        url += `&uid=${data.uid}`
    }
    if (data.nickName != null && data.nickName != undefined && `${data.nickName}` != 'null' && `${data.nickName}` != '') {
        url += `&nickName=${data.nickName}`
    }
    // 处理时间
    var startTime = null;
    var endTime = null;
    if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
        let values = data.pickerValue;
        startTime = values[0];
        endTime = values[1];
    }
    if (startTime != null && startTime != undefined && `${startTime}` != 'null' && `${startTime}` !=
        '') {
        url += `&startTime=${startTime}`
    }
    if (endTime != null && endTime != undefined && `${endTime}` != 'null' && `${endTime}` != '') {
        url += `&endTime=${endTime}`
    }
    return request({
        url: url,
        method: 'get'
    })
}
