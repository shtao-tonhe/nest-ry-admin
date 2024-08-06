import config from '@/config/env'
import { getToken,setToken,getRefreshToken, setRefreshToken } from '@/utils/auth'
import { toast } from '@/utils/common'
import { timeEncrypt } from '@/utils/common'

/*
  @des:接口请求统一封装,包含接口无感刷新机制
  @params:	
    paramsList => {
      url: '', // 路径
      data:'', // 请求参数
      method:'', // 请求方式
      header: {} // 请求头类型
    }
  @example: cloudRrequest(paramsList).then(data => {}).catch(err => {})
*/
const baseUrl = config().baseUrl // 基础路径
const refreshUrl = '/wechat/refreshToken' // 刷新token的路径
const whiteList = ['/wechat/login', '/wechat/refreshToken'] // 白名单内，可以不带token
let isRefreshing = false // 是否正在刷新的标记状态
let requests = [] // 重试队列
export function cloudRrequest(paramsList) {
	let params = {
		...paramsList
	}
	let _this = this;
  let requestUrl = baseUrl + params.url; // 接口路径
  let requestData = params.data ? params.data : {}; // 请求参数
  let requestMethod = params.method ? params.method : 'POST'; // 请求方式
	let requestHeader = params.header ? params.header : {}
  if (!whiteList.includes(params.url)) {
		requestHeader['Authorization'] = 'Bearer ' + getToken()
  }else{
		requestHeader['time'] = timeEncrypt() // 在白名单则带time字段
	}

  return new Promise((resolve, reject) => {
    // 启动请求状态
    uni.request({
      url: requestUrl,
      header: {
				...requestHeader // 请求头信息
      },
      data: requestData,
      method: requestMethod,
      success: function(res) {
				const datas = res.data;
				if (datas.code == 200 || datas.code == 201) { // 后端接口请求成功时直接返回数据 
					resolve(datas.data);
				} else if (datas.code == 401) { // 后端接口请求报401 token失效
					//这里是重点：让这个Promise一直处于Pending状态（即不调用resolve）
					// 用函数形式将 resolve 存入，等待刷新后再执行
					requests.push(async token => {
						const paramsInfo = {
							...paramsList,
							header: paramsList['header'] ? {
								...paramsList['header'],
								Authorization: 'Bearer ' + `${token}`
							} : {
								Authorization: 'Bearer ' + `${token}`
							}
						}
						//这里resolve
						resolve(await _this.cloudRrequest(paramsInfo))
					})
					if (!isRefreshing) { // 如果未处于接口刷新状态
						isRefreshing = true // 第一个请求后，后面请求都不进入执行请求
						//调用刷新token的接口，返回新的token和刷新token
						return _this.cloudRrequest({
								url: refreshUrl,
								data: {
									refreshToken: getRefreshToken(),
								},
								method: 'POST'
						}).then((resultData) => {
								if (resultData.token) {
										setToken(resultData.token);
										setRefreshToken(resultData.refreshToken)
										// token 刷新后将数组的方法重新执行
										requests.forEach((cb) => cb(resultData.token))
										requests = [] // 重新请求完清空
								}
						}).catch(() => {
							// 刷新接口获取token信息失败,清除缓存信息并且跳转重新登录
							uni.clearStorageSync() // 清空所有缓存信息
							setTimeout(()=>{
								uni.reLaunch({
									url: '/pages/login/index'
								})
							}, 1)
						}).finally(() => {
							isRefreshing = false
						})
					}
				} else { //后端接口请求失败 500 等
					toast(datas.message || datas.msg)
					reject(datas)
				}
      },
      fail: function(err) {
        reject(err)
      }
    })
  })
}

export default cloudRrequest
