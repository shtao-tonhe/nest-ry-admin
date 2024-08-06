import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { SysLogininfor } from 'src/entities/sys/sys_logininfor'
import { tansTypeOrmParams } from 'src/utils/tools'
import { Between } from 'typeorm'

@Injectable()
export class LogininforMapper {
  constructor(
    @InjectEntityManager()
    private entityManager
  ) {}
  // 分页列表
  async getList(query) {
    const { pageSize = 10, pageNum = 1, beginTime = '', endTime = '', ...params } = query
    const queryParams = tansTypeOrmParams(params)
    if (beginTime) {
      queryParams['loginTime'] = Between(beginTime, endTime)
    }
    const qb = await this.entityManager.createQueryBuilder(SysLogininfor, 'SysLogininfor')
    qb.where(queryParams)
    qb.orderBy(`SysLogininfor.login_time`, 'DESC')
    qb.skip(pageSize * (pageNum - 1))
    qb.take(pageSize)
    return {
      rows: await qb.getMany(),
      total: await qb.getCount()
    }
  }
}
