const TokenKey = 'App-Token'
const RefreshToken = 'Refresh-Token'

export function getToken() {
  return uni.getStorageSync(TokenKey)
}

export function setToken(token) {
  return uni.setStorageSync(TokenKey, token)
}

export function removeToken() {
  return uni.removeStorageSync(TokenKey)
}

export function getRefreshToken() {
  return uni.getStorageSync(RefreshToken)
}

export function setRefreshToken(token) {
  return uni.setStorageSync(RefreshToken,token)
}

export function removeRefreshToken() {
  return uni.removeStorageSync(RefreshToken)
}
