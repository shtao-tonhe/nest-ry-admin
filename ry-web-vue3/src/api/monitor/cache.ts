import request from '@/utils/tools/request'

// 查询缓存详细
export function getCache() {
  return request({
    url: '/monitor/cache',
    method: 'get'
  })
}

// 查询缓存名称列表
export function listCacheName() {
  return request({
    url: '/monitor/cache/getNames',
    method: 'get'
  })
}

// 查询缓存键名列表
export function listCacheKey(cacheName: string, params: any) {
  return request({
    url: '/monitor/cache/getKeys/' + cacheName,
    method: 'get',
    params: params
  })
}

// 查询缓存内容
export function getCacheValue(cacheKey: string) {
  return request({
    url: '/monitor/cache/getValue/' + cacheKey,
    method: 'get'
  })
}

// 清理指定键名缓存
export function clearCacheKey(cacheKey: string) {
  return request({
    url: '/monitor/cache/clearCacheKey/' + cacheKey,
    method: 'delete'
  })
}
