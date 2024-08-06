import { login, logout, getInfo, getCodeImg } from '@/api/login'
import {
  getToken,
  setToken,
  removeToken,
  getRsaPublicKey,
  setRsaPublicKey,
  removeRsaPublicKey
} from '@/utils/plugins/cookie'
import defAva from '@/assets/images/default.jpg'
import { RSAEncrypt } from '@/utils/plugins/jsencrypt'
import { defineStore } from 'pinia'

const useUserStore = defineStore('user', {
  state: () => ({
    publicKey: getRsaPublicKey(), // rsa公钥
    token: getToken(),
    id: '', // 登录用户id
    name: '', // 登录用户名
    avatar: '', // 登录用户头像
    deptId: '', // 登录部门
    roles: [] as any,
    permissions: []
  }),
  actions: {
    // 设置公钥信息
    getPublicKey() {
      if (this.publicKey) {
        return false
      }
      getCodeImg().then((res: any) => {
        setRsaPublicKey(res.data)
        this.publicKey = res.data
      })
    },
    // 登录
    login(phonenumber: string, password: string) {
      const passwords = RSAEncrypt(password, this.publicKey)
      return new Promise<void>((resolve, reject) => {
        login(phonenumber, passwords, this.publicKey)
          .then((res: any) => {
            setToken(res.data)
            this.token = res.data
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res: any) => {
            const user = res.data.user
            const avatar = user.avatar || defAva
            if (res.data.roles && res.data.roles.length > 0) {
              // 验证返回的roles是否是一个非空数组
              this.roles = res.data.roles
              this.permissions = res.data.permissions
            } else {
              this.roles = ['ROLE_DEFAULT']
              this.permissions = []
            }
            this.id = user.userId
            this.name = user.nickName
            this.deptId = user.deptId
            this.avatar = avatar
            resolve(res.data)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 退出系统
    logOut() {
      return new Promise<void>((resolve, reject) => {
        logout()
          .then(() => {
            this.publicKey = ''
            this.token = ''
            this.id = ''
            this.name = ''
            this.avatar = ''
            this.roles = []
            this.permissions = []
            removeToken()
            removeRsaPublicKey()
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})

export default useUserStore
