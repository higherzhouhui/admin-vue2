import request from '@/utils/request'

export const newUserStatistics = () => {
  return request({
    url: '/homePage/findUserDataStatistics',
    method: 'get'
  })
}

export const getProportioActiveUser = (params) => {
  return request({
    url: '/homePage/getProportioActiveUser',
    method: 'get',
    params
  })
}

export const getUserChangeTrendActive = (params) => {
  return request({
    url: '/homePage/getUserChangeTrendActive',
    method: 'get',
    params
  })
}
export const getUserChangeTrendNew = (params) => {
  return request({
    url: '/homePage/getUserChangeTrendNew',
    method: 'get',
    params
  })
}
