// 角色权限枚举
export enum Role {
  Admin = 'admin', // 管理员
  Common = 'common' // 普通用户(默认值)
}

// 按钮权限枚举
export enum Permission {
  // 用户管理
  SystemUserList = 'system:user:list', // 用户列表
  SystemUserAdd = 'system:user:add', // 用户新增
  SystemUserEdit = 'system:user:edit', // 用户编辑
  SystemUserRemove = 'system:user:remove', // 用户删除
  SystemUserExport = 'system:user:export', // 用户导出
  SystemUserImport = 'system:user:import', // 用户导入
  SystemUserResetPwd = 'system:user:resetPwd', // 用户密码重置
  SystemUserAllocation = 'system:user:allocation', // 分配角色
  // 角色管理
  SystemRoleList = 'system:role:list', // 角色列表
  SystemRoleAdd = 'system:role:add', // 角色新增
  SystemRoleEdit = 'system:role:edit', // 角色编辑
  SystemRoleRemove = 'system:role:remove', // 角色删除
  SystemRoleAllocation = 'system:role:allocation', // 角色分配用户
  SystemRoleRevoke = 'system:role:revoke', // 角色取消授权
  // 菜单管理
  SystemMenuList = 'system:menu:list', // 菜单列表
  SystemMenuAdd = 'system:menu:add', // 菜单新增
  SystemMenuEdit = 'system:menu:edit', // 菜单编辑
  SystemMenuRemove = 'system:menu:remove', // 菜单删除
  // 字典管理
  SystemDictList = 'system:dict:list', // 字典列表
  SystemDictAdd = 'system:dict:add', // 字典新增
  SystemDictEdit = 'system:dict:edit', // 字典编辑
  SystemDictRemove = 'system:dict:remove', // 字典删除
  // 参数管理
  SystemConfigList = 'system:config:list', // 参数列表
  SystemConfigAdd = 'system:config:add', // 参数新增
  SystemConfigEdit = 'system:config:edit', //  参数编辑
  SystemConfigRemove = 'system:config:remove', // 参数删除
  // 通知公告
  systemNoticeList = 'system:notice:list', // 通知公告列表
  systemNoticeAdd = 'system:notice:add', // 通知公告新增
  systemNoticeEdit = 'system:notice:edit', // 通知公告编辑
  systemNoticeRemove = 'system:notice:remove', // 通知公告删除
  // 部门管理
  systemDeptQuery = 'system:dept:query', // 部门列表
  systemDeptAdd = 'system:dept:add', // 部门新增
  systemDeptEdit = 'system:dept:edit', // 部门编辑
  systemDeptRemove = 'system:dept:remove', // 部门删除
  // 岗位管理
  systemPostQuery = 'system:post:query', // 岗位列表
  systemPostAdd = 'system:post:add', // 岗位新增
  systemPostEdit = 'system:post:edit', // 岗位编辑
  systemPostRemove = 'system:post:remove', // 岗位删除
  // 定时任务
  MonitorJobList = 'monitor:job:list', // 定时任务列表
  MonitorJobAdd = 'monitor:job:add', // 定时任务新增
  MonitorJobEdit = 'monitor:job:edit', // 定时任务编辑
  MonitorJobRemove = 'monitor:job:remove', // 定时任务删除
  MonitorJobStatus = 'monitor:job:status', // 状态修改
  MonitorJobOnce = 'monitor:job:once', // 执行一次
  // 缓存列表和缓存监控
  MonitorCacheList = 'monitor:cache:list', // 缓存列表
  // 服务监控
  MonitorServerList = 'monitor:server:list' // 服务监控列表
}
