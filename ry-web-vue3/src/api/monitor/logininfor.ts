import request from '@/utils/tools/request'

// 查询登录日志列表
export function loginlist(query: any) {
  return request({
    url: '/monitor/logininfor/list',
    method: 'get',
    params: query
  })
}
