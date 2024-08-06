import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserMapper } from './user.mapper'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SysUser } from 'src/entities/sys/sys_user'
import { ExcelService } from 'src/framwork/providers/excel/excel.service'
import { ToolsService } from 'src/framwork/providers/tools/tools.service'

@Module({
  imports: [TypeOrmModule.forFeature([SysUser])],
  providers: [UserService, UserMapper, ExcelService, ToolsService],
  controllers: [UserController]
})
export class UserModule {}
