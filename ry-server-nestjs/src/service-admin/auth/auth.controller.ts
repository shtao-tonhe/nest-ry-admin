import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { Public } from 'src/shared/decorators/public.decorator'
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto, UserInfoDto } from './dto/auth.dto'
import { JwtUser } from 'src/shared/decorators/user.decorator'
import { JWTUserInfo } from 'src/types/jwt'
import { PublicHeaderGuard } from 'src/shared/guard/public.header.guard'
import { SysMenu } from 'src/entities/sys/sys_menu'
@ApiTags('平台登录授权管理')
@ApiBearerAuth()
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: '平台登录接口'
  })
  @ApiHeader({
    name: 'time',
    description: '加密时间字段，从/getPublicTime接口获得'
  })
  @ApiBody({ type: LoginDto })
  @Public()
  @UseGuards(PublicHeaderGuard)
  @Post('/login')
  login(@Body() signInDto: LoginDto, @Req() req) {
    return this.authService.login(signInDto, req)
  }

  @ApiOperation({
    summary: '退出登录'
  })
  @Post('/logout')
  logout(@JwtUser() user: JWTUserInfo) {
    return this.authService.logout(user)
  }

  @ApiOperation({
    summary: '获取当前登录账号个人信息'
  })
  @ApiResponse({
    description: '获取当前登录账号个人信息',
    type: [UserInfoDto]
  })
  @Get('/getInfo')
  getInfo(@JwtUser() user: JWTUserInfo) {
    return this.authService.getInfo(user)
  }

  @ApiOperation({
    summary: '获取当前登录账号路由信息'
  })
  @ApiResponse({
    description: '获取当前登录账号路由信息',
    type: SysMenu
  })
  @Get('/getRouters')
  getRouters(@JwtUser() user: JWTUserInfo) {
    return this.authService.getRouters(user)
  }

  @ApiOperation({
    summary: '获取rsa加密公钥'
  })
  @ApiHeader({
    name: 'time',
    description: '加密时间字段，从/getPublicTime接口获得'
  })
  @Public()
  @UseGuards(PublicHeaderGuard)
  @Get('/getRsaPublicKey')
  getRsaPublicKey() {
    return this.authService.getRsaPublicKey()
  }

  @ApiOperation({
    summary: '获取time时间字段，此接口仅作内部使用,每个字段一分钟内有效'
  })
  @Get('/getPublicTime')
  @Public()
  getPublicTime() {
    return new Date().getTime()
  }
}
