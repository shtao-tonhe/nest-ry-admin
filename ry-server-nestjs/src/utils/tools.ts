import { Like } from 'typeorm'

/**
 * 将对象转变为orm可以查询的参数，默认模糊查询
 * @param params
 * @likeArray 模糊查询列表
 */
export function tansTypeOrmParams(params = {}, likeArray?: Array<string>) {
  const likeList = likeArray && likeArray.length > 0 ? likeArray : []
  // 将查询参数分别包裹处理
  const queryParams = {} as any
  Object.keys(params).forEach((key) => {
    if (params[key]) {
      // 字段默认精确查询、第二个参数传递了对应的字段则模糊查询
      queryParams[key] = likeList.includes(key) ? Like(`%${params[key]}%`) : params[key]
    }
  })
  return queryParams
}

/**
 * 获取fastify中请求体中的各种数据
 */
export const getReqMainInfo: (request: any) => {
  [prop: string]: any
} = (request) => {
  const { query, headers, body } = request

  // 获取 IP
  const xRealIp = request.headers['X-Real-IP']
  const xForwardedFor = request.headers['X-Forwarded-For']
  const cip = xRealIp || xForwardedFor || request.ip || request.socket // 获取 IP
  return {
    url: request.originalUrl,
    method: request.method,
    hostname: request.hostname,
    ip: cip,
    headers: headers,
    body: body,
    query: query
  }
}
