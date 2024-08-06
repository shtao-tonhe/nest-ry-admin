import { SetMetadata } from '@nestjs/common'

/**
 * 设置该请求跳过token拦截验证
 * 使用参考auth模块'/login'接口
 */
export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
