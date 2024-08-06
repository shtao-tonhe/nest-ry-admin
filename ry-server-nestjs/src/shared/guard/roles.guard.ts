import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { Role } from '../enums/permissions'
import { RedisConfigService } from 'src/framwork/redis/redis.config.service'
import { RedisNameList } from '../enums/redis.name'
/**
 * 基于角色的权限验证守卫（全局）
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private redisConfigService: RedisConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (!requiredRoles) {
      return true
    }
    const { user } = context.switchToHttp().getRequest()
    // 认定id为1的为超级管理员有所有角色权限,跳过后续校验
    if (user.userId == '1') {
      return true
    }
    // 登录获取个人信息时候已经存了按钮权限于redis,这里查询校对即可
    const roles: any = await this.redisConfigService.hgetRedis(
      RedisNameList.UserInfoPerm + user.userId,
      'roles'
    )
    if (!roles) {
      throw new HttpException('登录已过期，请重新登录', HttpStatus.UNAUTHORIZED)
    }

    if (requiredRoles.some((role) => roles.includes(role))) {
      return true
    } else {
      throw new HttpException('暂无该角色权限，请联系管理员处理', HttpStatus.FORBIDDEN)
    }
  }
}
