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
export function getPropPlusList(pageSize = 20, pageNum = 1, data) {
  var url = `/user/prop/plus?pageSize=${pageSize}&pageNum=${pageNum}`
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
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  if (data.trn != null && data.trn != undefined && `${data.trn}` != 'null' && JSON.stringify(data.trn) != '[]') {
    url += `&trn=${data.trn}`
  }
  if (data.gid != null && data.gid != undefined && `${data.gid}` != 'null' && `${data.gid}` != '') {
    url += `&gid=${data.gid}`
  }
  if (data.from != null && data.from != undefined && `${data.from}` != 'null' && `${data.from}` != '') {
    url += `&from=${data.from}`
  }
  return request({
    url: url,
    method: 'get'
  })
}
