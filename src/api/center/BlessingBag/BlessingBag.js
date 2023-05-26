import request from '@/utils/request'

// 查询福袋列表
export function giftLuckBagList(data) {
    var url = `/gift/luckBagList`
    // if (data.pageSize != null && data.pageSize != undefined && `${data.pageSize}` != 'null' && `${data.pageSize}` != '') {
    //     url += `&pageSize=${data.pageSize}`
    // }
    // if (data.pageNum != null && data.pageNum != undefined && `${data.pageNum}` != 'null' && `${data.pageNum}` != '') {
    //     url += `&pageNum=${data.pageNum}`
    // }
    // if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    //     url += `&uid=${data.uid}`
    // }
    // if (data.anchorName != null && data.anchorName != undefined && `${data.anchorName}` != 'null' && `${data.anchorName}` != '') {
    //     url += `&anchorName=${data.anchorName}`
    // }
    return request({
        url: url,
        method: 'post',
        data
    })
}

// 添加福袋
export function giftAddLuckBag(data) {
    return request({
        url: `/gift/addLuckBag`,
        method: 'post',
        data
    })
}

// 获取参与方式配置
export function giftGgetJoinTypeConfig(data) {
    return request({
        url: '/gift/getJoinTypeConfig',
        method: 'get',
        data
    })
}
// 获取当前正在直播中的主播
export function giftListInAnchor(data) {
    let url = `/gift/listInAnchor`
    if (data != null && data != undefined && `${data}` != 'null' && `${data}` != '') {
        url += `?queryParam=${data}`
    }
    return request({
        url: url,
        method: 'get',
    })
}
// 查询中奖名单
export function giftLuckBagUserList(data) {
    return request({
        url: '/gift/luckBagUserList',
        method: 'post',
        data
    })
}