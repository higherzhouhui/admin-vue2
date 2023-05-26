import request from '@/utils/request'

// 意见反馈
export function feedbackList(data) {
    var url = `/center/feedback/list?pageSize=${data.pageSize}&pageNum=${data.pageNum}`
    if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
        url += `&uid=${data.uid}`
    }
    if (data.typeId != null && data.typeId != undefined && `${data.typeId}` != 'null' && `${data.typeId}` != '') {
        url += `&typeId=${data.typeId}`
    }
    if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
        url += `&status=${data.status}`
    }
    return request({
        url: url,
        method: 'get'
    })
}

// 回复意见反馈
export function replyFeedback(data) {
    return request({
        url: `/center/feedback/replyFeedback?id=${data.id}&replyContent=${data.replyContent}`,
        method: 'post',
    })
}

// 意见反馈类别
export function typeList() {
    return request({
        url: '/center/feedback/typeList',
        method: 'get'
    })
} 