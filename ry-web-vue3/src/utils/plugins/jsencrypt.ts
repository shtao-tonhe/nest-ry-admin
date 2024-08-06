import JSEncrypt from 'jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

/**
 * RSA加密
 * @param txt 内容
 * @param publicKey 公钥
 * @returns
 */
export function RSAEncrypt(txt: string, publicKey: string) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}
