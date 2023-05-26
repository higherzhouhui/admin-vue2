import request from '@/utils/request'

/**
 * 官方直播间列表
 */
export function getPlatformRoomList(pageSize = 20, pageNum = 1, liveId) {
    console.log(liveId,"liveId")
    var url = `/live/record/getPlatformRoomList?pageSize=${pageSize}&pageNum=${pageNum}`
    if (liveId != null && liveId != undefined && `${liveId}` != 'null' && `${liveId}` != '') {
        url += `&liveId=${liveId}`
    }
    return request({
        url: url,
        method: 'get'
    })
}


// 新增官方直播间
export function addPlatformRoom(data) {
    return request({
        url: '/live/record/addPlatformRoom',
        method: 'post',
        data
    })
}

// 停止官方轮播视频直播间
export function stopPlatformRoom(data) {
    return request({
        url: '/live/record/stopPlatformRoom',
        method: 'post',
        data
    })
}
