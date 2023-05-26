import request from '@/utils/request'

export function getVideoList(pageSize = 20, pageNum = 1, data) {
  var url = `/center/sportsEvent/list?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.videoStatus != null && data.videoStatus != undefined && `${data.videoStatus}` != 'null' && JSON.stringify(data.videoStatus) != '[]') {
    url += `&videoStatus=${data.videoStatus}`
  } 
  if (data.sportId != null && data.sportId != undefined && `${data.sportId}` != 'null' && JSON.stringify(data.sportId) != '[]') {
    url += `&sportId=${data.sportId}`
  } 
  
  if (data.state != null && data.state != undefined && `${data.state}` != 'null' && JSON.stringify(data.state) != '[]') {
    url += `&state=${data.state}`
  }
  if (data.videoName != null && data.videoName != undefined && `${data.videoName}` != 'null' && JSON.stringify(data.videoName) != '[]') {
    url += `&videoName=${data.videoName}`
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

export function createVideo(data) {
  return request({
    url: '/center/sportsEvent/add',
    method: 'post',
    data
  })
}

export function updateVideo(data) {
  return request({
    url: '/center/sportsEvent/update',
    method: 'post',
    data
  })
}
export function updateVideoStatus(id,videoStatus) {
  return request({
    url: '/center/sportsEvent/updateStatus',
    method: 'patch',
    data: {
      'id': id,
      'videoStatus': videoStatus,

    }
  })
}

export function deleteVideo(id) {
  return request({
    url: '/center/sportsEvent/del?id=' + id,
    method: 'delete'
  })
}
