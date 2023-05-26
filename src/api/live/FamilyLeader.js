import request from '@/utils/request'

// 家族长中介费明细
export function queryFamilyAgencyFeeList(data) {
    return request({
        url: '/subsidy/queryFamilyAgencyFeeList',
        method: 'post',
        data
    })
}
// 中介费明细
export function queryFamilyAgencyFeeDetailList(data) {
    return request({
        url: '/subsidy/queryFamilyAgencyFeeDetailList',
        method: 'post',
        data
    })
}
// 中介费明细-统计
export function queryTotalFamilyAgencyFeeDetailList(data) {
    return request({
        url: '/subsidy/queryTotalFamilyAgencyFeeDetailList',
        method: 'post',
        data
    })
}
