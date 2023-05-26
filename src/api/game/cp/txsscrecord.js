import request from '@/utils/request'

export function getRecordList(pageSize = 20, pageNum = 1, data) {
  var url = `/cp/lotteryrecord?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.lotteryName != null && data.lotteryName != undefined && `${data.lotteryName}` != 'null' && `${data.lotteryName}` != '') {
    url += `&cpName=${data.lotteryName}`
  }
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.expect != null && data.expect != undefined && `${data.expect}` != 'null' && `${data.expect}` != '') {
    url += `&expect=${data.expect}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  if (data.trn != null && data.trn != undefined && `${data.trn}` != 'null' && `${data.trn}` != '') {
    url += `&trn=${data.trn}`
  }
  if (data.trnAward != null && data.trnAward != undefined && `${data.trnAward}` != 'null' && `${data.trnAward}` != '') {
    url += `&trnAward=${data.trnAward}`
  }
  if (data.flagTest != null && data.flagTest != undefined && `${data.flagTest}` != 'null' && `${data.flagTest}` != '') {
    url += `&flagTest=${data.flagTest}`
  }
  var startTime = null;
  var endTime = null;
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    console.error(JSON.stringify(data.pickerValue));
    let values = data.pickerValue;
    startTime = values[0];
    endTime = values[1];
  }
  if (startTime != null && startTime != undefined && `${startTime}` != 'null') {
    url += `&startTime=${startTime}`
  }
  if (endTime != null && endTime != undefined && `${endTime}` != 'null') {
    url += `&endTime=${endTime}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

export function getTotalList(pageSize = 20, pageNum = 1, data) {
  var url = `/cp/lotteryrecord/total?pageSize=${pageSize}&pageNum=${pageNum}`
  if (data.lotteryName != null && data.lotteryName != undefined && `${data.lotteryName}` != 'null' && `${data.lotteryName}` != '') {
    url += `&cpName=${data.lotteryName}`
  }
  if (data.expect != null && data.expect != undefined && `${data.expect}` != 'null' && `${data.expect}` != '') {
    url += `&expect=${data.expect}`
  }
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  if (data.trn != null && data.trn != undefined && `${data.trn}` != 'null' && `${data.trn}` != '') {
    url += `&trn=${data.trn}`
  }
  if (data.trnAward != null && data.trnAward != undefined && `${data.trnAward}` != 'null' && `${data.trnAward}` != '') {
    url += `&trnAward=${data.trnAward}`
  }
  var startTime = null;
  var endTime = null;
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    console.error(JSON.stringify(data.pickerValue));
    let values = data.pickerValue;
    startTime = values[0];
    endTime = values[1];
  }
  if (startTime != null && startTime != undefined && `${startTime}` != 'null') {
    url += `&startTime=${startTime}`
  }
  if (endTime != null && endTime != undefined && `${endTime}` != 'null') {
    url += `&endTime=${endTime}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

export function updateRecord(data) {
  return request({
    url: '/cp/lotteryrecord',
    method: 'patch',
    data
  })
}

export function startCp() {
  return request({
    url: '/cp/lotteryrecord/isStart?&status=0',
    method: 'get'
  })
}

export function stopCp() {
  return request({
    url: '/cp/lotteryrecord/isStart?&status=1',
    method: 'get'
  })
}

export function startCpButton() {
  return request({
    url: '/cp/lotteryrecord/isButton?&status=0',
    method: 'get'
  })
}

export function stopCpButton() {
  return request({
    url: '/cp/lotteryrecord/isButton?&status=1',
    method: 'get'
  })
}


export function getLotteryCode(lotteryName, expect) {
  var url = `/cp/lotteryrecord/getLotteryResult?lotteryName=${lotteryName}&expect=${expect}`
  return request({
    url: url,
    method: 'get'
  })
}

// export function getTransAll(data) {
//   var url = `/cp/record/all?status=1`
//   var startTime = null;
//   var endTime = null;
//   if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
//     console.error(JSON.stringify(data.pickerValue));
//     let values = data.pickerValue;
//     startTime = values[0];
//     endTime = values[1];
//   }
//   if (startTime != null && startTime != undefined && `${startTime}` != 'null') {
//     url += `&startTime=${startTime}`
//   }
//   if (endTime != null && endTime != undefined && `${endTime}` != 'null') {
//     url += `&endTime=${endTime}`
//   }
//   return request({
//     url: url,
//     method: 'get'
//   })
// }
