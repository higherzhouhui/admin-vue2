import request from '@/utils/request'

/**
 * 添加座驾明细
 * pageSize
 * pageNum
 * startTime
 * endTime
 * uid
 * gids
 */
export function getProps(pageSize = 20, pageNum = 1, data) {
  var url = `/user/prop?pageSize=${pageSize}&pageNum=${pageNum}`
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
  //
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

// 新增座驾
export function createProp(data) {
  return request({
    url: '/user/prop',
    method: 'post',
    data
  })
}
