import {
  getOSSPolicy
} from '@/api/config/oss'

const state = {
  ossInfos: {}
}

const mutations = {
  SET_OSS_INFOS: (state, ossInfos) => {
    state.ossInfos = ossInfos
  }
}

const actions = {
  // OSS上传签名生成
  getOSSInfos({
    commit
  }) {
    return new Promise((resolve, reject) => {
      getOSSPolicy().then(res => {
        const {
          data
        } = res
        if (!data && JSON.stringify(data) != '{}') {
          reject('数据为空')
        }
        commit('SET_OSS_INFOS', data)
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
