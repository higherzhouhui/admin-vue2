import {
  login,
  logout,
  getInfo,
  getPermission
} from '@/api/ums/admin'
import { getDateTime } from '@/utils/tools'
const { NOW_TIME_START, NOW_TIME_END } = getDateTime()
import {
  getTokenHeader,
  setTokenHeader,
  removeTokenHeader,
  getToken,
  setToken,
  removeToken,
  getUid,
  setUid,
  removeUid
} from '@/utils/auth'

import {
  resetRouter
} from '@/router'

import store from '@/store'

const state = {
  tokenHeader: getTokenHeader(),
  token: getToken(),
  uid: getUid(),
  name: '',
  avatar: '',
  roles: [''],
  buttonPermission: [],
  timerDate: [
    NOW_TIME_START, NOW_TIME_END
  ]
}

const mutations = {
  SET_TOKEN_HEADER: (state, tokenHeader) => {
    state.tokenHeader = tokenHeader
  },
  SET_DATE_TIME: (state, value) => {
    let { NOW_TIME_START, NOW_TIME_END } = value
    state.timerDate = [NOW_TIME_START, NOW_TIME_END]
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_UID: (state, uid) => {
    state.uid = uid
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_BUTTON_PERMISSION: (state, buttonPermission) => {
    state.buttonPermission = buttonPermission
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password,
      code
    } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password,
        code: code
      }).then(res => {
        const {
          tokenHead,
          token
        } = res.data
        const newToken = `${tokenHead}${token}`
        commit('SET_TOKEN_HEADER', tokenHead)
        commit('SET_TOKEN', newToken)
        setTokenHeader(tokenHead)
        setToken(newToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  setDate({ commit }, date) {
    commit('SET_DATE_TIME', date)
  },
  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo().then(res => {
        const {
          data
        } = res
        if (!data) {
          reject('验证失败，请重新登录')
        }

        const {
          uid,
          name,
          avatar,
          roles
        } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_UID', uid)
        commit('SET_ROLES', roles)
        setUid(uid)

        // 获取用户所有权限
        getPermission(uid).then(res => {
          data['routes'] = res.data || []
          const defautArr = ['用户银行卡操作', '主播出款审核操作', '用户出款审核操作', '分享出款审核操作', '公司入款审核操作', 'usdt入款审核操作']
          const arr = []
          for (const i of defautArr) {
            for (const k of data['routes']) {
              if (i === k.name) {
                arr.push(i)
              }
            }
          }
          commit('SET_BUTTON_PERMISSION', arr)
          console.log(arr)
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      logout().then(res => {
        commit('SET_TOKEN_HEADER', '')
        commit('SET_TOKEN', '')
        commit('SET_UID', '')
        removeTokenHeader()
        removeToken()
        removeUid()
        resetRouter()
        // 清除路由信息
        store.dispatch('permission/delDynamicRoutes').then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      }).catch(error => {
        this.$message.error('退出失败')
        reject(error)
      })
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN_HEADER', '')
      commit('SET_TOKEN', '')
      commit('SET_UID', '')
      removeTokenHeader()
      removeToken()
      removeUid()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
