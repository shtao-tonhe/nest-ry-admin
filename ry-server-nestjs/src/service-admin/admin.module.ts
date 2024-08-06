import { Module } from '@nestjs/common'
// 加载子模块
import { adminModules } from './index'

@Module({
  imports: [...adminModules],
  providers: [],
  exports: [...adminModules]
})
export class AdminModule {}
