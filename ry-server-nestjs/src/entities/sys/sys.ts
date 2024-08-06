import { SysConfig } from './sys_config'
import { SysDept } from './sys_dept'
import { SysDictData } from './sys_dict_data'
import { SysDictType } from './sys_dict_type'
import { SysJob } from './sys_job'
import { SysLogininfor } from './sys_logininfor'
import { SysMenu } from './sys_menu'
import { SysNotice } from './sys_notice'
import { SysPost } from './sys_post'
import { SysRole } from './sys_role'
import { SysRoleDept } from './sys_role_dept'
import { SysRoleMenu } from './sys_role_menu'
import { SysUser } from './sys_user'
import { SysUserPost } from './sys_user_post'
import { SysUserRole } from './sys_user_role'
import { SysUserWechat } from './sys_user_wechat'

export const sysEntities = [
  SysConfig,
  SysDictData,
  SysDictType,
  SysJob,
  SysMenu,
  SysNotice,
  SysRole,
  SysRoleMenu,
  SysUser,
  SysUserWechat,
  SysUserRole,
  SysLogininfor,
  SysDept,
  SysPost,
  SysRoleDept,
  SysUserPost
]
