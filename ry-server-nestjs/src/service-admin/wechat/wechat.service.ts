import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { WechatConfigService } from 'src/framwork/providers/wechatConfig/wechat.config.service'
import { JWTUserInfo } from 'src/types/jwt'
import { JwtUseService } from 'src/framwork/jwt/jwt.use.service'
import { WechatMapper } from './wechat.mapper'
import { ConfigService } from '@nestjs/config'
import { RefreshTokenDto, WechatLoginDto } from './dto/wechat.dto'
import { AESDecrypt } from 'src/utils/crypto'
import { loginWechatVO } from 'src/types/admin/wechat'
import { SysUserWechat } from 'src/entities/sys/sys_user_wechat'
@Injectable()
export class WechatService {
  constructor(
    private jwtUseService: JwtUseService,
    private wechatConfigService: WechatConfigService,
    private wechatMapper: WechatMapper,
    private configService: ConfigService
  ) {}

  /**
   * 微信小程序登录，不关联手机号
   */
  async loginWechat(body: WechatLoginDto): Promise<loginWechatVO> {
    // 获取小程序openid
    const info: any = await this.wechatConfigService.getJscode2session(body.loginCode)
    if (!info) {
      throw new HttpException('微信授权登录失败！', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    try {
      // 获取用户信息
      let fOpenid = await this.wechatMapper.findOpenIdMapper(info.data.openid)
      // 不存在则注册
      if (!fOpenid) {
        await this.wechatMapper.insetUserMapper(info.data.openid)
        fOpenid = await this.wechatMapper.findOpenIdMapper(info.data.openid)
      }
      // 根据openid创建token
      const payload: JWTUserInfo = {
        userId: fOpenid.wxOpenId
      }
      return {
        token: await this.jwtUseService.createJwtToken(
          payload,
          this.configService.get('wechatjwtExpiresIn')
        ),
        refreshToken: await this.jwtUseService.createJwtRefreshToken(payload)
      }
    } catch {
      throw new HttpException('微信授权登录失败！', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  /**
   * 微信小程序登录，关联手机号
   */
  async loginWechatPhone() {
    return '暂未开发'
  }

  // 刷新登录token
  async refreshToken(body: RefreshTokenDto): Promise<loginWechatVO> {
    const refreshTokenInfo = await this.jwtUseService.verifyJwtToken(body.refreshToken)
    // 解密内容获取刷新token中的userId
    const userId = AESDecrypt(refreshTokenInfo.info, this.configService.get('AESKey'))
    // 根据openid创建token
    const payload: JWTUserInfo = {
      userId: userId
    }
    return {
      token: await this.jwtUseService.createJwtToken(
        payload,
        this.configService.get('wechatjwtExpiresIn')
      ),
      refreshToken: await this.jwtUseService.createJwtRefreshToken(payload)
    }
  }

  // 获取用户信息
  async getInfo(user: JWTUserInfo): Promise<SysUserWechat> {
    return await this.wechatMapper.findOpenIdMapper(user.userId)
  }
}
