import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { WechatService } from './wechat.service'
import { RefreshTokenDto, WechatLoginDto } from './dto/wechat.dto'
import { Public } from 'src/shared/decorators/public.decorator'
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PublicHeaderGuard } from 'src/shared/guard/public.header.guard'
import { JWTUserInfo } from 'src/types/jwt'
import { JwtUser } from 'src/shared/decorators/user.decorator'

@ApiTags('微信授权管理')
@ApiBearerAuth()
@Controller('wechat')
export class WechatController {
  constructor(private weService: WechatService) {}

  @ApiOperation({
    summary: '微信小程序登录'
  })
  @ApiHeader({
    name: 'time',
    description: '加密时间字段，从/getPublicTime接口获得'
  })
  @ApiBody({ type: WechatLoginDto })
  @Public()
  @UseGuards(PublicHeaderGuard)
  @Post('login')
  signInWechatPhone(@Body() body: WechatLoginDto) {
    if (!body.phoneCode) {
      // 不绑定手机号
      return this.weService.loginWechat(body)
    } else {
      // 绑定手机号
      return this.weService.loginWechatPhone()
    }
  }

  @ApiOperation({
    summary: '微信小程序刷新token数据'
  })
  @ApiHeader({
    name: 'time',
    description: '加密时间字段，从/getPublicTime接口获得'
  })
  @ApiBody({ type: RefreshTokenDto })
  @Public()
  @UseGuards(PublicHeaderGuard)
  @Post('refreshToken')
  refreshToken(@Body() body: RefreshTokenDto) {
    return this.weService.refreshToken(body)
  }

  /**
   * 获取小程序用户信息
   * @param body
   * @returns
   */
  @ApiOperation({
    summary: '微信小程序获取登录用户信息'
  })
  @Get('getInfo')
  getInfo(@JwtUser() user: JWTUserInfo) {
    return this.weService.getInfo(user)
  }
}
