import request from '@/utils/request'

export function getLineDetectionList(params) {
  var url = `/line/management/url/LineList`
  // if (status != null && status != undefined && `${status}` != 'null' && `${status}` != '') {
  //   url += `&status=${status}`
  // }
  // if (url != null && url != undefined && `${url}` != 'null' && `${url}` != '') {
  //   url += `&url=${url}`
  // }
  return request({
    url: url,
    method: 'get',
    params
  })
}

export function addLineDetection(data) {
  return request({
    url: '/line/management/url/addLine',
    method: 'post',
    data
  })
}

export function updateLineDection(data) {
  delete data.operator
  delete data.createTime
  delete data.updateTime
  delete data.createTimeString
  delete data.updateTimeString
  return request({
    url: '/line/management/url/updateLine',
    method: 'post',
    data
  })
}
export function deleteLineDection(id) {
  return request({
    url: '/line/management/url/deleteLine/' + id,
    method: 'delete'
  })
}
