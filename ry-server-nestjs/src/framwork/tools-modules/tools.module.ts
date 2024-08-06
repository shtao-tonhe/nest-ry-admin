import { Module } from '@nestjs/common'

// 加载子模块
import { toolsModules } from './index'

@Module({
  imports: [...toolsModules],
  providers: [],

  exports: [...toolsModules]
})
export class ToolsModule {}
