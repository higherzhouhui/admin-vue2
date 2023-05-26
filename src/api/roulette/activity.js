import request from '@/utils/request'

// 活动列表
export function rouletteList(data) {
    var url = `/center/activity/roulette/list?`
    if (data.pageSize != null && data.pageSize != undefined && `${data.pageSize}` != 'null' && `${data.pageSize}` != '') {
        url += `&pageSize=${data.pageSize}`
    }
    if (data.pageNum != null && data.pageNum != undefined && `${data.pageNum}` != 'null' && `${data.pageNum}` != '') {
        url += `&pageNum=${data.pageNum}`
    }
    if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
        url += `&uid=${data.uid}`
    }
    if (data.state != null && data.state != undefined && `${data.state}` != 'null' && `${data.state}` != '') {
        url += `&state=${data.state}`
    }
    if (data.pickerValue != null && data.pickerValue[0] != undefined && `${data.startTime}` != 'null' && `${data.startTime}` != '') {
        url += `&startTime=${data.pickerValue[0]}`
    }
    if (data.pickerValue != null && data.pickerValue[0] != undefined && data.pickerValue[1] != undefined && `${data.endTime}` != 'null' && `${data.endTime}` !=
        '') {
        url += `&endTime=${data.pickerValue[1]}`
    }
    return request({
        url: url,
        method: 'get'
    })
}

// 活动查询详细
export function rouletteDetail(data) {
    return request({
        url: `/center/activity/roulette/detail?id=${data}`,
        method: 'get',
        data
    })
}
// 新增
export function saveActivityRoulette(data) {
    return request({
        url: '/center/activity/roulette/saveActivityRoulette',
        method: 'post',
        data
    })
}
// 编辑
export function updateActivityRoulette(data) {
    return request({
        url: '/center/activity/roulette/updateActivityRoulette',
        method: 'post',
        data
    })
}
// 活动启用禁用
export function updateState(data) {
    return request({
        url: '/center/activity/roulette/updateState',
        method: 'post',
        data
    })
}
// 奖励发放
export function winnersGrant(data) {
    return request({
        url: '/center/activity/roulette/winnersGrant',
        method: 'post',
        data
    })
}
// 中奖明细
export function winnersDetail(data) {
    var url = `/center/activity/roulette/winnersDetail?`
    if (data.id != null && data.id != undefined && `${data.id}` != 'null' && `${data.id}` != '') {
        url += `&rouletteBaseId=${data.id}`
    }
    if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
        url += `&uid=${data.uid}`
    }
    return request({
        url: url,
        method: 'get',
    })
}
