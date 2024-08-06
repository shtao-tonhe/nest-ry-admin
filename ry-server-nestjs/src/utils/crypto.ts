import { HttpException, HttpStatus } from '@nestjs/common'

import bcryptjs = require('bcryptjs')
import NodeRSA = require('node-rsa')
import CryptoJS = require('crypto-js')
/**
 * bcryptjs  加密
 */
/**
 * bcryptjs加密处理 - 同步方法
 * @returns -> $10$AMIZt3YJXDFDJzNAsIIGXuEl4XptFzP/XRUfa6qKfFhFHB8VIxaNC
 * bcryptjs.hashSync(data, salt)
 *    - password  要加密的数据
 *    - slat  用于哈希密码的盐。如果指定为数字，则将使用指定的轮数生成盐并将其使用
 */

export function bcryptEncryption(password: string): string {
  const salt = bcryptjs.genSaltSync(10)
  return bcryptjs.hashSync(password, salt)
}
/**
 * bcryptjs校验 - 同步方法
 * @returns -> Bool
 * bcryptjs.compareSync(data, encrypted)
 *    - password    要比较的数据, 使用登录时传递过来的密码
 *    - encrypted   要比较的数据, 使用从数据库中查询出来的加密过的密码
 */
export function bcryptCompare(password: string, encrypted: string): boolean {
  try {
    return bcryptjs.compareSync(password, encrypted)
  } catch {
    throw new HttpException('密码校验错误！', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

/**
 * crypto模块aes加密
 */
export function AESEncrypt(data: any, key: string): string {
  const de = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
    iv: ''
  })
  return de.toString()
}
/**
 * crypto模块aes解密
 */
export function AESDecrypt(data: any, key: string): string {
  if (!data) {
    return ''
  }
  const de = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
    iv: ''
  })
  return de.toString(CryptoJS.enc.Utf8)
}
/**
 * RSA加密
 * @param text 内容
 * @param publicKey 公钥
 * @returns
 */
export function RSAEncrypt(text: string, publicKey): string {
  const publicKeyObj = new NodeRSA(publicKey)
  return publicKeyObj.encrypt(text, 'base64')
}

/**
 * RSA解密
 * @param text 内容
 * @param privateKey 私钥
 * @returns
 */
export function RSADecrypt(text: string, privateKey) {
  const privateKeyObj = new NodeRSA(privateKey)
  privateKeyObj.setOptions({ encryptionScheme: 'pkcs1' })
  return privateKeyObj.decrypt(text, 'utf8')
}

/**
 * RSA公钥验签
 * @param text 内容
 * @param decrypted 生成的加密内容
 * @param publicKey 公钥
 * @returns
 */
export function RSAVerify(text: string, decrypted, publicKey) {
  const privateKeyObj = new NodeRSA(publicKey)
  return privateKeyObj.verify(text, decrypted, 'utf8', 'base64')
}
