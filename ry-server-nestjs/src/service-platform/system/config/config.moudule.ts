import { Module } from '@nestjs/common'
import { ConfigParamService } from './config.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigParamMapper } from './config.mapper'
import { SysConfig } from 'src/entities/sys/sys_config'
import { ConfigParamController } from './config.controller'

@Module({
  imports: [TypeOrmModule.forFeature([SysConfig])],
  providers: [ConfigParamMapper, ConfigParamService],
  controllers: [ConfigParamController]
})
export class ConfigParamModule {}
