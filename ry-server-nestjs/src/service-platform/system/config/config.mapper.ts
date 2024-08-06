import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { SysConfig } from 'src/entities/sys/sys_config'
import { Page } from 'src/types/page'
import { tansTypeOrmParams } from 'src/utils/tools'
import { ConfigListDTO } from './dto/config.dto'

@Injectable()
export class ConfigParamMapper {
  constructor(
    @InjectRepository(SysConfig)
    private useRepository,
    @InjectEntityManager()
    private entityManager
  ) {}

  // 获取列表
  async configListMapper(query: ConfigListDTO): Promise<Page<SysConfig>> {
    const { pageSize = 10, pageNum = 1, ...params } = query
    const queryParams = tansTypeOrmParams(params)
    const qb = await this.entityManager.createQueryBuilder(SysConfig, 'SysConfig')
    qb.where(queryParams)
    qb.orderBy(`SysConfig.create_time`, 'DESC')
    qb.skip(pageSize * (pageNum - 1))
    qb.take(pageSize)
    return {
      rows: await qb.getMany(),
      total: await qb.getCount()
    }
  }
  // 新增编辑
  async configAddUpdateMapper(body: SysConfig, configId: string): Promise<SysConfig> {
    const bodyData = !configId ? body : { ...body, configId }
    return await this.useRepository.save(bodyData)
  }
  // 详情
  async configDetailMapper(id: string): Promise<SysConfig> {
    return await this.useRepository.findOne({ where: { configId: id } })
  }
  // 删除
  async configDeleteMapper(id: string) {
    return await this.useRepository.delete(id)
  }
}
