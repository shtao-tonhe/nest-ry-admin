import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { SysConfig } from 'src/entities/sys/sys_config'

@Injectable()
export class FileMapper {
  constructor(
    @InjectEntityManager()
    private entityManager
  ) {}

  // 字典详情-根据键名查询
  async configDetailByConfigKeyMapper(configKey) {
    return await this.entityManager
      .createQueryBuilder(SysConfig, 'SysConfig')
      .select(['SysConfig.configValue'])
      .where('SysConfig.configKey = :configKey', { configKey: configKey })
      .getOne()
  }
}
