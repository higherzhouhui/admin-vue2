import request from '@/utils/request'


export function getWinAll(data) {
  var url = `/cp/win/all?status=1`
  var startTime = null;
  var endTime = null;
  const { uid, agentId, openMethods } = data
  if (data.pickerValue != null && JSON.stringify(data.pickerValue) != '[]' && Array.isArray(data.pickerValue)) {
    console.error(JSON.stringify(data.pickerValue));
    let values = data.pickerValue;
    startTime = values[0];
    endTime = values[1];
  }
  if (uid != null && uid != undefined && `${uid}` != 'null') {
    url += `&uid=${uid}`
  }
  if (agentId != null && agentId != undefined && `${agentId}` != 'null') {
    url += `&agentId=${agentId}`
  }
  if (openMethods != null && openMethods != undefined && `${openMethods}` != 'null') {
    url += `&openMethods=${openMethods}`
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

export function queryLotteryList(data) {
  return request({
    url: '/ch/cp/win/queryLotteryTotalList',
    method: 'post',
    data
  })
}
