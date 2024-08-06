import { Module } from '@nestjs/common'
import { DeptService } from './dept.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DeptController } from './dept.controller'
import { DeptMapper } from './dept.mapper'
import { SysDept } from 'src/entities/sys/sys_dept'

@Module({
  imports: [TypeOrmModule.forFeature([SysDept])],
  providers: [DeptService, DeptMapper],
  controllers: [DeptController]
})
export class DeptModule {}
