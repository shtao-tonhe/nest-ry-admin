import { SetMetadata } from '@nestjs/common'
import { Permission } from '../enums/permissions'

/**
 * 基于声明权限装饰器
 * @RequirePermission(Permission.SystemUserAdd, Permission.SystemUserAdd)
 */
export const PERMISSION_KEY = 'permissions'
export const RequirePermission = (...permission: Permission[]) =>
  SetMetadata(PERMISSION_KEY, permission)
