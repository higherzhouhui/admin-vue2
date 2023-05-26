import Cookies from 'js-cookie'

const TokenHeaderKey = 'TokenHeaderKey'

export function getTokenHeader() {
  return Cookies.get(TokenHeaderKey)
}

export function setTokenHeader(token) {
  return Cookies.set(TokenHeaderKey, token)
}

export function removeTokenHeader() {
  return Cookies.remove(TokenHeaderKey)
}

const TokenKey = 'TokenKey'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const UidKey = 'UidKey'

export function getUid() {
  return Cookies.get(UidKey)
}

export function setUid(uid) {
  return Cookies.set(UidKey, uid)
}

export function removeUid() {
  return Cookies.remove(UidKey)
}
