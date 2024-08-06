import { timeEncrypt } from '@/utils/common'
import request from '@/utils/tools/request'

// 登录方法
export function login(phonenumber: string, password: string | false, key: string) {
  const data = {
    phonenumber,
    password,
    key
  }
  return request({
    url: '/login',
    headers: {
      isToken: false,
      time: timeEncrypt()
    },
    method: 'post',
    data: data
  })
}

// 获取当前用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}
// 获取当前用户路由信息
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取公钥
export function getCodeImg() {
  return request({
    url: '/getRsaPublicKey',
    headers: {
      isToken: false,
      time: timeEncrypt()
    },
    method: 'get',
    timeout: 10000
  })
}

// 获取手机验证码
export function verifyCode(params: { phone: string; messageType: string }) {
  return request({
    url: '/sms/code',
    method: 'get',
    params
  })
}
