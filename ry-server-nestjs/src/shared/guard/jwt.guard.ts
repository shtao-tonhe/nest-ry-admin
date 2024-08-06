import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private config: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    // 解析token中的荷载信息
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('jwtSecret')
      })
      // 荷载信息必须带有用户id才为有效的token
      if (!payload.userId) {
        throw new UnauthorizedException()
      }
      request['user'] = payload
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }
  // 获取请求头中的token信息
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
