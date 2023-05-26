import request from '@/utils/request'

// 获取列表
export function getList(data) {
    var url = `/recharge/gift/list`
    return request({
        url: url,
        method: 'post',
        data
    })
}
// 获取贵族等级列表
export function getVipList() {
    var url = `/recharge/gift/vip/list`
    return request({
        url: url,
        method: 'get'
    })
}
// 获取下拉框数据  type 1： 坐骑  0 礼物
export function getTypeList(type = 0) {
    var url = `/recharge/gift/type/list?type=${type}`
    return request({
        url: url,
        method: 'get'
    })
}
// 获取活动状态
export function show() {
    var url = `/recharge/gift/mainStatus/show`
    return request({
        url: url,
        method: 'get'
    })
}
// 修改
export function edit(data = {}) {
    var url = `/recharge/gift/edit`
    return request({
        url: url,
        method: 'post',
        data
    })
}
// 修改活动状态
export function swift(data = {}) {
    var url = `/recharge/gift/mainStatus/swift`
    return request({
        url: url,
        method: 'post',
        data
    })
}

// 新增
export function add(data = {}) {
    var url = `/recharge/gift/add`
    return request({
        url: url,
        method: 'post',
        data
    })
}
// 切换状态
export function changeStatus(data = {}) {
    var url = `/recharge/gift/changeStatus`
    return request({
        url: url,
        method: 'post',
        data
    })
}
// 删除
export function delData(data = {}) {
    var url = `/recharge/gift/del`
    return request({
        url: url,
        method: 'post',
        data
    })
}

