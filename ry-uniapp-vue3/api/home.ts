import request from '@/utils/request'

// banner列表
export function bannerList() {
  return request({
    'url': '/home/banner/list',
    'method': 'get',
  })
}
// 宫格列表
export function gridList() {
  return request({
    'url': '/home/grid/list',
    'method': 'get',
  })
}
// 推荐列表
export function recommendList() {
  return request({
    'url': '/home/recommend/list',
    'method': 'get',
  })
}