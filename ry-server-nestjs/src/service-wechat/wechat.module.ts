import { Module } from '@nestjs/common'

// 加载子模块
import { wechatModules } from './index'

@Module({
  imports: [...wechatModules],
  providers: [],

  exports: [...wechatModules]
})
export class WechatModule {}
