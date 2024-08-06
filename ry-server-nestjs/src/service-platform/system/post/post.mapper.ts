import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { SysPost } from 'src/entities/sys/sys_post'
import { tansTypeOrmParams } from 'src/utils/tools'

@Injectable()
export class PostMapper {
  constructor(
    @InjectRepository(SysPost)
    private useRepository,
    @InjectEntityManager()
    private entityManager
  ) {}

  // 获取列表
  async datasListMapper(query) {
    const { pageSize = 10, pageNum = 1, ...params } = query
    const queryParams = tansTypeOrmParams(params)
    const qb = await this.entityManager.createQueryBuilder(SysPost, 'SysPost')
    qb.where(queryParams)
    qb.orderBy(`SysPost.create_time`, 'DESC')
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
    return await this.useRepository.findOne({ where: { postId: id } })
  }
  // 删除
  async datasDeleteMapper(id) {
    return await this.useRepository.delete(id)
  }
}
