import { Module } from '@nestjs/common'
import { WechatService } from './wechat.service'
import { WechatController } from './wechat.controller'
import { JwtUseModule } from 'src/framwork/jwt/jwt.use.module'
import { WechatMapper } from './wechat.mapper'
import { WechatConfigService } from 'src/framwork/providers/wechatConfig/wechat.config.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SysUserWechat } from 'src/entities/sys/sys_user_wechat'

@Module({
  imports: [TypeOrmModule.forFeature([SysUserWechat]), JwtUseModule],
  providers: [WechatService, WechatMapper, WechatConfigService],
  controllers: [WechatController]
})
export class WechatModule {}
