import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { SysNotice } from 'src/entities/sys/sys_notice'
import { tansTypeOrmParams } from 'src/utils/tools'

@Injectable()
export class NoticeMapper {
  constructor(
    @InjectRepository(SysNotice)
    private useRepository,
    @InjectEntityManager()
    private entityManager
  ) {}

  // 获取列表
  async datasListMapper(query) {
    const { pageSize = 10, pageNum = 1, ...params } = query
    const queryParams = tansTypeOrmParams(params)
    const qb = await this.entityManager.createQueryBuilder(SysNotice, 'SysNotice')
    qb.where(queryParams)
    qb.orderBy(`SysNotice.create_time`, 'DESC')
    qb.skip(pageSize * (pageNum - 1))
    qb.take(pageSize)
    return {
      rows: await qb.getMany(),
      total: await qb.getCount()
    }
  }
  // 新增编辑
  async datasAddUpdateMapper(body) {
    return await this.useRepository.save(body)
  }
  // 详情
  async datasDetailMapper(id) {
    return await this.useRepository.findOne({ where: { noticeId: id } })
  }
  // 删除
  async datasDeleteMapper(id) {
    return await this.useRepository.delete(id)
  }
}
