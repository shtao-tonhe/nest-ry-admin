import request from '@/utils/tools/request'

// 查询所有字典数据的列表
export function allDataTypeList() {
  return request({
    url: '/system/dict/data/type-all',
    method: 'get'
  })
}

// 查询字典数据列表
export function listData(query: {
  pageNum: number
  pageSize: number
  dictName?: undefined
  dictType: undefined
  status?: undefined
}) {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: query
  })
}

// 查询字典数据详细
export function getData(dictCode: string) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType: string) {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  })
}

// 新增字典数据
export function addData(data: {}) {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data: {}) {
  return request({
    url: '/system/dict/data',
    method: 'put',
    data: data
  })
}

// 删除字典数据
export function delData(dictCode: string) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'delete'
  })
}
