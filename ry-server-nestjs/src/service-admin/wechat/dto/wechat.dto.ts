import { ApiProperty } from '@nestjs/swagger'

export class WechatLoginDto {
  @ApiProperty({ description: '微信登录code(wx.login获取)', required: true })
  loginCode: string

  @ApiProperty({
    description: '微信手机号code(不传则使用普通微信授权)',
    required: false
  })
  phoneCode: string
}

export class RefreshTokenDto {
  @ApiProperty({ description: '刷新token', required: false })
  refreshToken: string
}
