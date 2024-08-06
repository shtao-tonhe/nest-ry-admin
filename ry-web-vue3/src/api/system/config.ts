import request from '@/utils/tools/request'

// 查询参数列表
export function listConfig(query: any) {
  return request({
    url: '/system/config/list',
    method: 'get',
    params: query
  })
}

// 查询参数详细
export function getConfig(configId: string | number) {
  return request({
    url: '/system/config/' + configId,
    method: 'get'
  })
}

// 新增参数配置
export function addConfig(data: any) {
  return request({
    url: '/system/config',
    method: 'post',
    data: data
  })
}

// 修改参数配置
export function updateConfig(data: any) {
  return request({
    url: '/system/config',
    method: 'put',
    data: data
  })
}

// 删除参数配置
export function delConfig(configId: string | number) {
  return request({
    url: '/system/config/' + configId,
    method: 'delete'
  })
}