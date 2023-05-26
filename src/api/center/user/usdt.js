import request from '@/utils/request'

/**
 * 用户绑定银行卡列表
 */
export function getCenterBankList(pageSize = 20, pageNum = 1, data) {
  var url = `/center/user/bank/usdt?pageSize=${pageSize}&pageNum=${pageNum}`
  // if (uid != null && uid != undefined && `${uid}` != 'null' && `${uid}` != '') {
  //   url += `&uid=${uid}`
  // }
  if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null') {
    url += `&uid=${data.uid}`
  }

  if (data.bankName != null && data.bankName != undefined && `${data.bankName}` != 'null') {
    url += `&bankName=${data.bankName}`
  }
  if (data.cardNo != null && data.cardNo != undefined && `${data.cardNo}` != 'null') {
    url += `&cardNo=${data.cardNo}`
  }
  return request({
    url: url,
    method: 'get'
  })
}

//编辑绑定银行卡配置
export function updateCenterBank(data) {
  return request({
    url: '/center/user/bank/usdt/update/bank',
    method: 'patch',
    data
  })
}

// 刪除银行卡配置
export function deleteCenterBank(id) {
  return request({
    url: '/center/user/bank/usdt/delete/bank/' + id,
    method: 'delete'
  })
}

// // 获取银行列表
// export function getBankList() {
//   return request({
//     url: '/center/user/bank/usdt/getBankList',
//     method: 'get'
//   })
// }
