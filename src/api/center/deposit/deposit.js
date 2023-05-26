import request from '@/utils/request'

// 活动列表
export function giftList(data) {
    var url = `/center/activity/gift/list?`
    if (data.pageSize != null && data.pageSize != undefined && `${data.pageSize}` != 'null' && `${data.pageSize}` != '') {
        url += `&pageSize=${data.pageSize}`
    }
    if (data.pageNum != null && data.pageNum != undefined && `${data.pageNum}` != 'null' && `${data.pageNum}` != '') {
        url += `&pageNum=${data.pageNum}`
    }
    if (data.title != null && data.title != undefined && `${data.title}` != 'null' && `${data.title}` != '') {
        url += `&title=${data.title}`
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
export function giftDetail(data) {
    return request({
        url: `/center/activity/gift/detail?activityBaseId=${data}`,
        method: 'get',
        data
    })
}
// 新增
export function giftSaveActivity(data) {
    return request({
        url: '/center/activity/gift/saveActivity',
        method: 'post',
        data
    })
}
// 编辑
export function giftUpdateActivity(data) {
    return request({
        url: '/center/activity/gift/updateActivity',
        method: 'post',
        data
    })
}
// 活动启用禁用
export function giftUpdateState(data) {
    return request({
        url: '/center/activity/gift/updateState',
        method: 'post',
        data
    })
}
// 领取明细
export function giftGetParticipateDetail(data) {
    var url = `/center/activity/gift/getParticipateDetail?`
    if (data.id != null && data.id != undefined && `${data.id}` != 'null' && `${data.id}` != '') {
        url += `&activityBaseId=${data.id}`
    }
    if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
        url += `&uid=${data.uid}`
    }
    if (data.nickname != null && data.nickname != undefined && `${data.nickname}` != 'null' && `${data.nickname}` != '') {
        url += `&nickname=${data.nickname}`
    }
    if (data.depositNo != null && data.depositNo != undefined && `${data.depositNo}` != 'null' && `${data.depositNo}` != '') {
        url += `&depositNo=${data.depositNo}`
    }
    if (data.pickerValue != null && data.pickerValue[0] != undefined) {
        url += `&startTime=${data.pickerValue[0]}`
    }
    if (data.pickerValue != null && data.pickerValue[0] != undefined) {
        url += `&endTime=${data.pickerValue[1]}`
    }
    return request({
        url: url,
        method: 'get',
    })
}
