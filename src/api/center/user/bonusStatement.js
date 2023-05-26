import request from '@/utils/request'
import { specifyZoneTime } from '@/utils/tools'

export function getQueryActivityConfigList() {
    var url = `/center/user/mysterious/queryActivityConfigList`
    return request({
        url: url,
        method: 'get'
    })
}

export function getQueryReceiveActivityList(data) {
    var url = `/center/user/mysterious/queryReceiveActivityList`
    let params = {
        pageSize: data.pageSize,
        pageNum: data.pageNum,
        uid: undefined,
        userName: undefined,
        agentId: undefined,
        startActivityGold: undefined,
        endActivityGold: undefined,
        userType: undefined,
        activityType: undefined,
        status: undefined,
        startReceiveTime: undefined,
        endReceiveTime: undefined,
    }
    if (data.uid != null && data.uid != undefined && `${data.uid}` != 'null') {
        params.uid = data.uid
    }
    if (data.userName != null && data.userName != undefined && `${data.userName}` != 'null') {
        params.userName = data.userName
    }
    if (data.agentId != null && data.agentId != undefined && `${data.agentId}` != 'null') {
        params.agentId = data.agentId
    }
    if (data.startActivityGold != null && data.startActivityGold != undefined && `${data.startActivityGold}` != 'null') {
        params.startActivityGold = data.startActivityGold
    }
    if (data.endActivityGold != null && data.endActivityGold != undefined && `${data.endActivityGold}` != 'null') {
        params.endActivityGold = data.endActivityGold
    }
    if (data.activityType != null && data.activityType != undefined && `${data.activityType}` != 'null') {
        params.activityType = data.activityType
    }
    if (data.userType != null && data.userType != undefined && `${data.userType}` != 'null') {
        params.userType = data.userType
    }
    if (data.status != null && data.status != undefined && `${data.status}` != 'null') {
        params.status = data.status
    }
    // 领取时间
    if (data.pickerValue && data.pickerValue.length > 0) {
        const values = data.pickerValue
        params.startReceiveTime = specifyZoneTime(values[0])
        params.endReceiveTime = specifyZoneTime(values[1])
    } else {
        params.startReceiveTime = undefined
        params.endReceiveTime = undefined
    }
    return request({
        url: url,
        method: 'post',
        data: params
    })
}

//活动管理-红利报表-excel导出
export function queryReceiveActivityListExcel(data) {
    return request({
      url: `/center/user/mysterious/queryReceiveActivityListExcel`,
      method: 'post',
      data,
      responseType: 'blob'
    })
  }

//活动管理-红利报表-计算总额
export function countReceiveActivityVO(data) {
    return request({
      url: `/center/user/mysterious/countReceiveActivityVO`,
      method: 'post',
      data,
    })
  }