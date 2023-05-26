import request from '@/utils/request'

export function getRecordList(pageSize = 20, pageNum = 1, data,type) {
  var url = `/handsel/getHandselList?pageSize=${pageSize}&pageNum=${pageNum}&type=${type}`

  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }

  var startTime = null
  var endTime = null
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    console.error(JSON.stringify(data.pickerValue))
    const values = data.pickerValue
    startTime = values[0]
    endTime = values[1]
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


export function getRecordList1(pageSize = 20, pageNum = 1, data,type) {
  var url = `center/user/mysterious/Statement/list?pageSize=${pageSize}&pageNum=${pageNum}`

  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }

  var startTime = null
  var endTime = null
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    console.error(JSON.stringify(data.pickerValue))
    const values = data.pickerValue
    startTime = values[0]
    endTime = values[1]
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


export function getTotalList(pageSize = 20, pageNum = 1, data,type) {
  var url = `/handsel/getTotalList/total?pageSize=${pageSize}&pageNum=${pageNum}&type=${type}`

  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null' && `${data.uid}` != '') {
    url += `&uid=${data.uid}`
  }

  if (data.type != null && data.type != undefined && `${data.type}` != 'null' && `${data.type}` != '') {
     url += `&type=${data.type}`
   }

  var startTime = null
  var endTime = null
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    console.error(JSON.stringify(data.pickerValue))
    const values = data.pickerValue
    startTime = values[0]
    endTime = values[1]
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

export function startHandsel() {
  return request({
    url: '/handsel/isStart?&status=0',
    method: 'get'
  })
}

export function stopHandsel() {
  return request({
    url: '/handsel/isStart?&status=1',
    method: 'get'
  })
}


export function startWage_scale() {
  return request({
    url: '/handsel/wage_scale/isStart?&status=0',
    method: 'get'
  })
}

export function stopWage_scale() {
  return request({
    url: '/handsel/wage_scale/isStart?&status=1',
    method: 'get'
  })
}


//设置红包状态
export function startRed_Packet() {
  return request({
    url: '/handsel/Red_Packet/isStart?&status=0',
    method: 'get'
  })
}

export function stopRed_Packet() {
  return request({
    url: '/handsel/Red_Packet/isStart?&status=1',
    method: 'get'
  })
}

export function stopCash_feedback() {
  return request({
    url: '/handsel/cash_feedback/isStart?&status=1',
    method: 'get'
  })
}

export function stopLottery_complacent_seeial() {
  return request({
    url: '/handsel/stopLottery_complacent_seeial/isStart?&status=1',
    method: 'get'
  })
}
export function stopLottery_BET_seeial() {
  return request({
    url: '/handsel/stopLottery_BET_seeial/isStart?&status=1',
    method: 'get'
  })
}

export function cash_feedback() {
  return request({
    url: '/handsel/cash_feedback/isStart?&status=0',
    method: 'get'
  })
}

export function lottery_complacent_seeial() {
  return request({
    url: '/handsel/stopLottery_complacent_seeial/isStart?&status=0',
    method: 'get'
  })
}
export function lottery_BET_seeial() {
  return request({
    url: '/handsel/stopLottery_BET_seeial/isStart?&status=0',
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

export function getStatus(lotteryName, expect) {
  var url = `/handsel/getStatus`
  return request({
    url: url,
    method: 'get'
  })
}

export function getWage_scale(lotteryName, expect) {
  var url = `/handsel/getWage_scale`
  return request({
    url: url,
    method: 'get'
  })
}
//获取红包状态
export function getRed_Packet(lotteryName, expect) {
  var url = `/handsel/getRed_Packet`
  return request({
    url: url,
    method: 'get'
  })
}

export function getCash_feedback(lotteryName, expect) {
  var url = `/handsel/getCash_feedback`
  return request({
    url: url,
    method: 'get'
  })
}

export function getlottery_complacent_seeial(lotteryName, expect) {
  var url = `/handsel/getlottery_complacent_seeial`
  return request({
    url: url,
    method: 'get'
  })
}
export function getlottery_BET_seeial(lotteryName, expect) {
  var url = `/handsel/getlottery_BET_seeial`
  return request({
    url: url,
    method: 'get'
  })
}


export function cash_feedback1() {
  return request({
    url: '/handsel/cash_feedback/isStart1?&status=0',
    method: 'get'
  })
}

export function stopCash_feedback1() {
  return request({
    url: '/handsel/cash_feedback/isStart1?&status=1',
    method: 'get'
  })
}

export function getCash_feedback1(lotteryName, expect) {
  var url = `/handsel/getCash_feedback1`
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
