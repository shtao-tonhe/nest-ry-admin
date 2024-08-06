import request from '@/utils/tools/request'

// 查询定时任务调度列表
export function listJob(query: { pageNum: number; pageSize: number; jobName: undefined }) {
  return request({
    url: '/monitor/job/list',
    method: 'get',
    params: query
  })
}

// 查询定时任务调度详细
export function getJob(jobId: string | string[]) {
  return request({
    url: '/monitor/job/' + jobId,
    method: 'get'
  })
}

// 新增定时任务调度
export function addJob(data: {}) {
  return request({
    url: '/monitor/job',
    method: 'post',
    data: data
  })
}

// 修改定时任务调度
export function updateJob(data: {}) {
  return request({
    url: '/monitor/job',
    method: 'put',
    data: data
  })
}

// 任务状态修改
export function changeJobStatus(data: any) {
  return request({
    url: '/monitor/job/changeStatus',
    method: 'put',
    data: data
  })
}

// 定时任务立即执行一次
export function runJob(data: any) {
  return request({
    url: '/monitor/job/run',
    method: 'put',
    data: data
  })
}

// 查询定时任务调度名称列表
export function getJobNameList() {
  return request({
    url: '/monitor/job/name/list',
    method: 'get'
  })
}
