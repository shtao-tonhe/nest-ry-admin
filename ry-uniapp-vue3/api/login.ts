import request from '@/utils/request'

// 登录方法
export function login(data) {
  return request({
    'url': '/wechat/login',
    'method': 'post',
    'data': data
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    'url': '/wechat/getInfo',
    'method': 'get'
  })
}
