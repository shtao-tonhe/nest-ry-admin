import request from '@/utils/tools/request'

// 查询角色列表
export function listRole(query: any) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getRole(roleId: string) {
  return request({
    url: '/system/role/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data: {}) {
  return request({
    url: '/system/role',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data: {}) {
  return request({
    url: '/system/role',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(roleId: string) {
  return request({
    url: '/system/role/' + roleId,
    method: 'delete'
  })
}

// 查询角色已授权用户列表
export function allocatedUserList(query: {
  pageNum: number
  pageSize: number
  roleId: string | string[]
  phonenumber: undefined
}) {
  return request({
    url: '/system/role/authUser/allocatedList',
    method: 'get',
    params: query
  })
}

// 查询角色未授权用户列表
export function unallocatedUserList(query: {
  pageNum: number
  pageSize: number
  roleId: undefined
  phonenumber: undefined
}) {
  return request({
    url: '/system/role/authUser/unallocatedList',
    method: 'get',
    params: query
  })
}

// 取消用户授权角色
export function authUserCancel(data: { userId: any; roleId: string | string[] }) {
  return request({
    url: '/system/role/authUser/cancel',
    method: 'put',
    data: data
  })
}

// 授权用户选择
export function authUserSelectAll(data: { roleId: undefined; userIds: string }) {
  return request({
    url: '/system/role/authUser/selectAll',
    method: 'put',
    params: data
  })
}

// 根据角色ID查询部门树结构
export function deptTreeSelect(roleId: string) {
  return request({
    url: '/system/role/deptTree/' + roleId,
    method: 'get'
  })
}

// 角色分配数据权限
export function dataScope(data: any) {
  return request({
    url: '/system/role/dataScope',
    method: 'post',
    data: data
  })
}
