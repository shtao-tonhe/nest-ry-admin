import { Module } from '@nestjs/common'
import { MenuService } from './menu.service'
import { MenuController } from './menu.controller'
import { MenuMapper } from './menu.mapper'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SysMenu } from 'src/entities/sys/sys_menu'
import { ToolsService } from 'src/framwork/providers/tools/tools.service'

@Module({
  imports: [TypeOrmModule.forFeature([SysMenu])],
  providers: [MenuService, MenuMapper, ToolsService],
  controllers: [MenuController]
})
export class MenuModule {}
