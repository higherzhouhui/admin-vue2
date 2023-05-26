import request from '@/utils/request'

// 获取列表

export function getVideoList(data) {
    let { pageNum, pageSize, nickname, uid, title, videoId, startTime, endTime } = data
    let str = `?pageNum=${pageNum}&pageSize=${pageSize}`
    if(nickname) str += `&nickname=${nickname}`
    if(uid) str += `&uid=${uid}`
    if(title) str += `&title=${title}`
    if(videoId) str += `&videoId=${videoId}`
    if(startTime) str += `&startTime=${startTime}`
    if(endTime) str += `&endTime=${endTime}`
    return request({
        url: `/video/info/list${str}`,
        method: 'get',
        data
    })
}
export function createVideo(data) {
    return request({
        url: '/video/info/add',
        method: 'post',
        data
    })
}
export function updateVideo(data) {
    return request({
        url: '/video/info/update',
        method: 'post',
        data
    })
}
export function deleteVideo(data) {
    return request({
        url: '/video/info/del',
        method: 'delete',
        data
    })
}
export function importVideo(data) {
    return request({
        url: '/video/info/importVideo',
        method: 'post',
        data
    })
}
