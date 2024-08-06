import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Permission } from '../enums/permissions'
import { PERMISSION_KEY } from '../decorators/permissions.decorator'
import { RedisConfigService } from 'src/framwork/redis/redis.config.service'
import { RedisNameList } from '../enums/redis.name'

/**
 * 基于声明的权限验证守卫（全局）
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private redisConfigService: RedisConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (!requiredPermissions) {
      return true
    }
    const { user } = context.switchToHttp().getRequest()
    // 认定id为1的为超级管理员有所有按钮权限,跳过后续校验
    if (user.userId == '1') {
      return true
    }
    // 登录获取个人信息时候已经存了按钮权限于redis,这里查询校对即可
    const permissions: any = await this.redisConfigService.hgetRedis(
      RedisNameList.UserInfoPerm + user.userId,
      'permissions'
    )
    if (!permissions) {
      throw new HttpException('登录已过期，请重新登录', HttpStatus.UNAUTHORIZED)
    }
    if (requiredPermissions.some((perm) => permissions.includes(perm))) {
      return true
    } else {
      throw new HttpException('暂无该操作权限，请联系管理员处理', HttpStatus.FORBIDDEN)
    }
  }
}
