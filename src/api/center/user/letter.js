import request from '@/utils/request'

/**
 * 用户私信记录
 * pageSize
 * pageNum
 * uid
 * destUid
 * startTime
 * endTime
 */
export function getUserLetterList(pageSize = 20, pageNum = 1, data) {
  var url = `/user/letter?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.destUid != null && data.destUid != undefined && `${data.destUid}` != 'null' && `${data.destUid}` != '') {
    url += `&destUid=${data.destUid}`
  }
  if (data.type != null && data.type != undefined && `${data.type}` != 'null' && `${data.type}` != '') {
    url += `&type=${data.type}`
  }
  if (data.content != null && data.content != undefined && `${data.content}` != 'null' && `${data.content}` != '') {
    url += `&content=${data.content}`
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

export function sendLetter(data) {
  var url = `/user/letter/sendPrivatelMsg`
  return request({
    url: url,
    method: 'post',
    data
  })
}

// 删除私信
export function deleteLetter(id) {
  return request({
    url: '/user/letter/' + id,
    method: 'delete'
  })
}
