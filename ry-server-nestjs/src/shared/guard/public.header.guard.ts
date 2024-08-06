import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

/**
 * 简单公开接口防守守卫
 * 请求头中带有当前请求时间戳，只有该时间戳在1分钟以内才允许通过
 * 使用@UseGuards(PublicHeaderGuard)单独接口设置
 */
@Injectable()
export class PublicHeaderGuard implements CanActivate {
  constructor(private config: ConfigService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    if (!request.headers.time || !this.validateTime(request.headers.time)) {
      throw new UnauthorizedException()
    }
    return true
  }
  private validateTime(time) {
    const currentTime = new Date().getTime()
    // 一分钟以内则有效
    return Number(time) + 1000 * 60 * 1 > currentTime
  }
}
