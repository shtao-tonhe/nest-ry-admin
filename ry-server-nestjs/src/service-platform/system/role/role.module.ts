import { Module } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { RoleMapper } from './role.mapper'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SysRole } from 'src/entities/sys/sys_role'
import { ToolsService } from 'src/framwork/providers/tools/tools.service'

@Module({
  imports: [TypeOrmModule.forFeature([SysRole])],
  providers: [RoleService, RoleMapper, ToolsService],
  controllers: [RoleController]
})
export class RoleModule {}
