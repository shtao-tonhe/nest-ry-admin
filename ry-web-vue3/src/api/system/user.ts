import request from '@/utils/tools/request'

// 查询用户列表
export function listUser(query: any) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId: string) {
  return request({
    url: '/system/user/' + userId,
    method: 'get'
  })
}

// 查询当前用户拥有的所有可分配角色列表
export function getUserRoles() {
  return request({
    url: '/system/role/all',
    method: 'get'
  })
}

// 新增用户
export function addUser(data: {}) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data: {}) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(userId: string) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

// 用户密码重置
export function resetUserPwd(userId: any) {
  const data = {
    userId
  }
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data: Record<string, any> | undefined) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码修改
export function updateUserPwd(oldPassword: string, newPassword: string) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    data: data
  })
}

// 用户手机号修改
export function updateUserPhone(data: any) {
  return request({
    url: '/system/user/profile/phone',
    method: 'put',
    data: data
  })
}

// 用户头像上传
export function uploadAvatar(data: FormData) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data;'
    },
    data: data
  })
}

// 用户分配角色
export function updateUserAuthRole(data: any) {
  return request({
    url: '/system/user/authRole',
    method: 'put',
    data: data
  })
}

// 用户导入
export function userImport(data: FormData) {
  return request({
    url: '/system/user/import',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data;'
    },
    data: data
  })
}

// 用户导出
export function userExport(params: any) {
  return request({
    url: '/system/user/export',
    method: 'get',
    params: params
  })
}
// 查询部门下拉树结构
export function deptTreeSelect() {
  return request({
    url: '/system/user/deptTree',
    method: 'get'
  })
}
