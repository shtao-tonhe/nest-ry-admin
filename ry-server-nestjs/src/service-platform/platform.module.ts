import { Module } from '@nestjs/common'
// 加载子模块
import { platformModules } from './index'

@Module({
  imports: [...platformModules],
  providers: [],

  exports: [...platformModules]
})
export class PlatformModule {}
