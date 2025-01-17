import request from '@/utils/tools/request'

// 查询公告列表
export function listNotice(query: {
  pageNum: number
  pageSize: number
  noticeTitle: undefined
  createBy: undefined
  status: undefined
}) {
  return request({
    url: '/system/notice/list',
    method: 'get',
    params: query
  })
}

// 查询公告详细
export function getNotice(noticeId: string) {
  return request({
    url: '/system/notice/' + noticeId,
    method: 'get'
  })
}

// 新增公告
export function addNotice(data: {}) {
  return request({
    url: '/system/notice',
    method: 'post',
    data: data
  })
}

// 修改公告
export function updateNotice(data: {}) {
  return request({
    url: '/system/notice',
    method: 'put',
    data: data
  })
}

// 删除公告
export function delNotice(noticeId: string) {
  return request({
    url: '/system/notice/' + noticeId,
    method: 'delete'
  })
}
