import request from '@/utils/request'

export function getRecordList(pageSize = 20, pageNum = 1, data) {
  var url = `/cp/lotteryResult?pageSize=${pageSize}&pageNum=${pageNum}`

  if (data.cpName != null && data.cpName != undefined && `${data.cpName}` != 'null' && `${data.cpName}` != '') {
    url += `&cpName=${data.cpName}`
  }
  if (data.issue != null && data.issue != undefined && `${data.issue}` != 'null' && `${data.issue}` != '') {
    url += `&issue=${data.issue}`
  }
  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
  }
  if (data.openMethods != null && data.openMethods != undefined && `${data.openMethods}` != 'null' && `${data.openMethods}` != '') {
    url += `&openMethods=${data.openMethods}`
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

/* export function getTotalList(pageSize = 20, pageNum = 1, data) {
  var url = `/cp/record/total?pageSize=${pageSize}&pageNum=${pageNum}`


  if (data.status != null && data.status != undefined && `${data.status}` != 'null' && `${data.status}` != '') {
    url += `&status=${data.status}`
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
} */
/*
export function updateRecord(data) {
  return request({
    url: '/cp/record',
    method: 'patch',
    data
  })
}

export function startCp() {
  return request({
    url: '/cp/record/isStart?&status=0',
    method: 'get'
  })
}

export function stopCp() {
  return request({
    url: '/cp/record/isStart?&status=1',
    method: 'get'
  })
}

export function startCpButton() {
  return request({
    url: '/cp/record/isButton?&status=0',
    method: 'get'
  })
}

export function stopCpButton() {
  return request({
    url: '/cp/record/isButton?&status=1',
    method: 'get'
  })
} */

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
