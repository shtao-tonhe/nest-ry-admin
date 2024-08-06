// @ts-ignore
import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const PublicKey = 'Public-Key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token: string) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRsaPublicKey() {
  return Cookies.get(PublicKey)
}

export function setRsaPublicKey(value: string) {
  return Cookies.set(PublicKey, value)
}

export function removeRsaPublicKey() {
  return Cookies.remove(PublicKey)
}
