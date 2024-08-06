import { Module } from '@nestjs/common'
import { DictController } from './dict.controller'
import { DictService } from './dict.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SysDictData } from 'src/entities/sys/sys_dict_data'
import { DictMapper } from './dict.mapper'
import { SysDictType } from 'src/entities/sys/sys_dict_type'

@Module({
  imports: [TypeOrmModule.forFeature([SysDictData]), TypeOrmModule.forFeature([SysDictType])],
  providers: [DictService, DictMapper],
  controllers: [DictController]
})
export class DictModule {}
