import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { JWTUserInfo } from 'src/types/jwt'
import { AESEncrypt } from 'src/utils/crypto'
@Injectable()
export class JwtUseService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}
  /**
   * 创建jwt token
   * @param payload
   */
  async createJwtToken(payload: JWTUserInfo, expiresIn?: string): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('jwtSecret'),
      expiresIn: expiresIn ? expiresIn : this.configService.get('jwtExpiresIn')
    })
  }

  /**
   * 创建jwt 刷新token
   * @param payload
   */
  async createJwtRefreshToken(payload: JWTUserInfo): Promise<string> {
    const infos = {
      info: AESEncrypt(payload.userId, this.configService.get('AESKey'))
    }
    return await this.jwtService.signAsync(infos, {
      secret: this.configService.get('jwtSecret'),
      expiresIn: this.configService.get('refreshTokenExpiresIn')
    })
  }

  /**
   * 验证token并且获取信息
   * @param payload
   */
  async verifyJwtToken(token: string): Promise<{ userId?: string; info?: string }> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwtSecret')
      })
    } catch {
      throw new HttpException(`token过期`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
