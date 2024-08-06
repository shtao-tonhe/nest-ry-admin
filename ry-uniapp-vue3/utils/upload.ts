import config from '@/config/env'
import { getToken } from '@/utils/auth'
import { toast, tansParams } from '@/utils/common'

const baseUrl = config().baseUrl

/*
	@des文件上传
	@params:
	  config => {
			isToken: false 是否需要设置token （true需要）
	    url: '', // 开发者服务 url
	    filePath:'', // 要上传文件资源的路径
	  }
	@example: cloudRrequest(paramsList).then(data => {}).catch(err => {})
*/
const uploadFile = config => {
  // 是否需要设置 token 默认为需要
  const isToken = (config.header || {}).isToken || true
	// 请求头处理
  config.header = config.header || {}
  if (getToken() && isToken) {
    config.header['Authorization'] = 'Bearer ' + getToken()
  }
	config.header['Content-Type'] = 'multipart/form-data'
  // get请求映射params参数
  if (config.params) {
    let url = config.url + '?' + tansParams(config.params)
    url = url.slice(0, -1)
    config.url = url
  }
  return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: baseUrl + config.url,
        filePath: config.filePath,
        name: config.name || 'file',
        header: config.header,
        formData: config.formData || {},
        success: (res) => {
          let result = JSON.parse(res.data)
          const code = result.code || 200
          const msg = result.msg || ''
          if (code === 200 || code === 201) {
            resolve(result)
          } else if (code == 401) {
            reject('无效的会话，或者会话已过期，请重新登录。')
          } else {
            toast(msg)
            reject(code)
          }
        },
        fail: (error) => {
          let { message } = error
          if (message == 'Network Error') {
            message = '后端接口连接异常'
          } else if (message.includes('timeout')) {
            message = '系统接口请求超时'
          } else if (message.includes('Request failed with status code')) {
            message = '系统接口' + message.substr(message.length - 3) + '异常'
          }
          toast(message)
          reject(error)
        }
      })
  })
}

export default uploadFile
