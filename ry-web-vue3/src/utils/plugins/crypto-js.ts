/**
 * 加密解密工具库
 * 文档：https://www.npmjs.com/package/crypto-js
 */
// @ts-ignore
import CryptoJS from 'crypto-js'

/**
 * AES加密
 * @param message
 * @returns
 */
export function AESEncrypt(message: string) {
  const key = import.meta.env.VITE_APP_AES_KEY
  const en = CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
    iv: ''
  })
  return en.toString()
}

/**
 * AES解密
 * @param encrypt
 * @returns
 */
export function AESDecrypt(encrypt: string) {
  const key = import.meta.env.VITE_APP_AES_KEY
  const de = CryptoJS.AES.decrypt(encrypt, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
    iv: ''
  })
  return de.toString(CryptoJS.enc.Utf8)
}
