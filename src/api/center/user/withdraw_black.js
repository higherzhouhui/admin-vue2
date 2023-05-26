import request from '@/utils/request'

/**
 * 提现黑名单
 * pageSize
 * pageNum
 * startTime
 * endTime
 * status
 * uid
 */
export function getUserWithdrawBlackList(pageSize = 20, pageNum = 1, data) {
  var url = `/user/withdraw/blcak?pageSize=${pageSize}&pageNum=${pageNum}`
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
  return request({
    url: url,
    method: 'get'
  })
}

// 新增提现黑名单
export function createWithdrawBlcak(data) {
  return request({
    url: '/user/withdraw/blcak',
    method: 'post',
    data
  })
}

// 编辑提现黑名单--更改状态 两级 左右横拉 传ID 和status
export function updateWithdrawBlcak(data) {
  return request({
    url: '/user/withdraw/blcak',
    method: 'patch',
    data
  })
}
