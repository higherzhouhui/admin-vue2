import request from '@/utils/request'

/**
 * 资产变更详情列表
 * pageSize
 * pageNum
 * startTime
 * endTime
 * uid 用户ID
 */
export function getAssetsPlusList(pageSize = 20, pageNum = 1, data) {
    var url = `/anchor/assets/plus?pageSize=${pageSize}&pageNum=${pageNum}`
    if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null') {
        url += `&uid=${data.uid}`
    }
    if (data.type != null && data.type != undefined && `${data.type}` != 'null') {
        url += `&type=${data.type}`
    }
    if (data.isIncrease != null && data.isIncrease != undefined && `${data.isIncrease}` != 'null') {
        url += `&isIncrease=${data.isIncrease}`
    }
    if (data.trn != null && data.trn != undefined && `${data.trn}` != 'null') {
        url += `&trn=${data.trn}`
    }
    // 处理时间
    var startTime = null;
    var endTime = null;
    if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
        console.error(JSON.stringify(data.pickerValue));
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

export function getAssetsPlus(pageSize = 20, pageNum = 1, data) {
    var url = `/anchor/assets/plus/total?pageSize=${pageSize}&pageNum=${pageNum}`
    if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null') {
        url += `&uid=${data.uid}`
    }
    if (data.type != null && data.type != undefined && `${data.type}` != 'null') {
        url += `&type=${data.type}`
    }
    if (data.isIncrease != null && data.isIncrease != undefined && `${data.isIncrease}` != 'null') {
        url += `&isIncrease=${data.isIncrease}`
    }

    if (data.trn != null && data.trn != undefined && `${data.trn}` != 'null') {
        url += `&trn=${data.trn}`
    }
    // 处理时间
    var startTime = null;
    var endTime = null;
    if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
        console.error(JSON.stringify(data.pickerValue));
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
