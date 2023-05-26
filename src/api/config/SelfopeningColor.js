import request from '@/utils/request'

// 自开彩控制-取消注单
export function cancelResultByExpect(data) {
    var url = `/cp/lotteryrecord/cancelResultByExpect?expect=${data}`
    return request({
        url: url,
        method: 'get'
    })
}
//获取彩票种类/以及玩法
export function getLotteryTypeMethod() {
    var url = `/cp/lotteryrecord/getLotteryTypeMethod`
    return request({
        url: url,
        method: 'get'
    })
}

//自开彩控制-根据号码开奖
export function openResultByNumber(data) {
    var url = `/cp/lotteryrecord/v2/openResultByNumber`
    return request({
        url: url,
        method: 'post',
        data,
    })
}

//自开彩控制-根据开奖号码获取输赢金额
export function getResultByNumber(expect, data, lotteryCode) {
    var url = `/cp/lotteryrecord/getResultByNumber?number=${data}&expect=${expect}&lotteryCode=${lotteryCode}`
    return request({
        url: url,
        method: 'get'
    })
}

// 自开彩控制-列表-历史期v2
export function queryControlLotteryHistoryList(data) {
    return request({
        url: '/cp/lotteryrecord/v2/queryControlLotteryHistoryList',
        method: 'post',
        data
    })
}


// 自开彩控制-列表-当前期
export function queryControlLotteryList(data) {
    return request({
        url: '/cp/lotteryrecord/queryControlLotteryList',
        method: 'post',
        data
    })
}

// 自开彩控制-列表-当前期v2
export function queryControlLotteryListV2(data) {
    return request({
        url: '/cp/lotteryrecord/v2/queryControlLotteryList',
        method: 'post',
        data
    })
}
// 设置开奖
export function openResultByNumberV2(data) {
    return request({
        url: '/cp/lotteryrecord/v2/openResultByNumber',
        method: 'post',
        data
    })
}

// 设置开奖
export function manMadeLotteryResult(data) {
    return request({
        url: '/cp/lotteryrecord/manMadeLotteryResult',
        method: 'post',
        data
    })
}
