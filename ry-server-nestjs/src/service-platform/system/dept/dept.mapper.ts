import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { SysDept } from 'src/entities/sys/sys_dept'
import { tansTypeOrmParams } from 'src/utils/tools'
import { DeptListDTO } from './dto/dept.dto'

@Injectable()
export class DeptMapper {
  constructor(
    @InjectRepository(SysDept)
    private useRepository,
    @InjectEntityManager()
    private entityManager
  ) {}

  // 获取列表
  async datasListMapper(query: DeptListDTO) {
    const { ...params } = query
    const queryParams = tansTypeOrmParams(params)
    const qb = await this.entityManager.createQueryBuilder(SysDept, 'SysDept')
    qb.where(queryParams)
    qb.orderBy(`SysDept.create_time`, 'DESC')
    return await qb.getMany()
  }
  // 新增编辑
  async datasAddUpdateMapper(body: SysDept) {
    return await this.useRepository.save(body)
  }
  // 详情
  async datasDetailMapper(id) {
    return await this.useRepository.findOne({ where: { deptId: id } })
  }
  // 删除
  async datasDeleteMapper(id) {
    return await this.useRepository.delete(id)
  }
}
