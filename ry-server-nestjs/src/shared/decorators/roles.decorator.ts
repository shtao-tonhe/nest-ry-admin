import { SetMetadata } from '@nestjs/common'
import { Role } from '../enums/permissions'

/**
 * 角色权限装饰器
 * @RequireRoles(Role.Admin, Role.Common)
 */
export const ROLES_KEY = 'roles'
export const RequireRoles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)
