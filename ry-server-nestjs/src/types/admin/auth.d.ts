import { SysUser } from 'src/entities/sys/sys_user'
import { SysRole } from 'src/entities/sys/sys_role'
import { SysDept } from 'src/entities/sys/sys_dept'

export interface UserInfoVO {
  user: SysUser
  dept?: SysDept
  roles: Array<string>
  permissions: Array<string>
}

export interface SysUserVO extends SysUser {
  roles: SysRole
}

export interface TreeRouterVO {
  alwaysShow?: boolean
  component: string
  hidden: boolean
  meta: {
    icon: string
    link: string | null
    noCache: boolean
    title: string
  }
  name: string
  path: string
  redirect?: string
  children?: Array<TreeRouter>
}
