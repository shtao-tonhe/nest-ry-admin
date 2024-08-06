// redis缓存名称列表
export enum RedisNameList {
  Sms = 'sms:', // 短信手机号验证码
  WechatToken = 'wechat:accessToken', // 微信后端接口调用凭证
  UserInfo = 'userinfo:', // 用户信息-基础信息
  UserInfoDept = 'userinfo:dept:', // 用户信息-部门信息
  UserInfoPerm = 'userinfo:perm:' // 用户信息-权限信息
}

// redis缓存列表名称集合
export const RedisNameListArray = {
  Sms: {
    name: '短信手机号验证码',
    value: RedisNameList.Sms
  },
  WechatToken: {
    name: '微信后端接口调用凭证',
    value: RedisNameList.WechatToken
  },
  UserInfo: {
    name: '用户信息',
    value: RedisNameList.UserInfo
  }
}
