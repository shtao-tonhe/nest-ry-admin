import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { SysDictData } from 'src/entities/sys/sys_dict_data'
import { SysDictType } from 'src/entities/sys/sys_dict_type'
import { Page } from 'src/types/page'
import { tansTypeOrmParams } from 'src/utils/tools'
import { ListDTO } from './dto/dict.dto'

@Injectable()
export class DictMapper {
  constructor(
    @InjectRepository(SysDictData)
    private useRepository,
    @InjectRepository(SysDictType)
    private useTypeRepository,
    @InjectEntityManager()
    private entityManager
  ) {}

  // 返回字典的所有数据类型
  async allDataTypeListMapper() {
    return this.useRepository.find({
      select: {
        dictType: true,
        dictLabel: true,
        dictValue: true
      },
      where: { status: '0' }
    })
  }

  // 根据id获取字典-字段列表值
  async getDictValueMapper(dictType): Promise<SysDictData> {
    return await this.useRepository.find({ where: { dictType: dictType } })
  }

  // 获取字典列表
  async dictListMapper(query: ListDTO): Promise<Page<SysDictType>> {
    const { pageSize = 10, pageNum = 1, ...params } = query
    const queryParams = tansTypeOrmParams(params)
    const qb = await this.entityManager.createQueryBuilder(SysDictType, 'SysDictType')
    qb.where(queryParams)
    qb.orderBy(`SysDictType.create_time`, 'DESC')
    qb.skip(pageSize * (pageNum - 1))
    qb.take(pageSize)
    return {
      rows: await qb.getMany(),
      total: await qb.getCount()
    }
  }
  // 新增编辑
  async dictAddUpdateMapper(body: SysDictType, dictId) {
    // 若为新增则查询字典类型是否存在
    let dictInfo = null
    if (!dictId) {
      dictInfo = await this.useTypeRepository.findOne({ where: { dictType: body.dictType } })
    }
    if (!!dictInfo) {
      throw new HttpException('字典类型已存在', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    const bodyData = !dictId ? body : { ...body, dictId }
    return await this.useTypeRepository.save(bodyData)
  }
  // 字典详情根据id获取
  async typeDetailMapper(dictId): Promise<SysDictType> {
    return await this.useTypeRepository.findOne({ where: { dictId: dictId } })
  }
  // 字典详情根据dictType获取
  async typeDetailByDictTypeMapper(type) {
    return await this.useTypeRepository.findOne({ where: { dictType: type } })
  }
  // 字典删除
  async typeDeleteMapper(dictId) {
    const result = await this.useTypeRepository.findOne({ where: { dictId: dictId } })
    const dataResult = await this.useRepository.findOne({ where: { dictType: result.dictType } })
    if (!!dataResult) {
      throw new HttpException('请先删除字典详细列表数据', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return await this.useTypeRepository.delete(dictId)
  }

  //获取指定字典数据列表
  async dataListMapper(query): Promise<Page<SysDictData>> {
    const { pageSize = 10, pageNum = 1, dictType = '', ...params } = query
    const queryParams = tansTypeOrmParams(params)
    const qb = await this.entityManager.createQueryBuilder(SysDictData, 'SysDictData')
    qb.where(queryParams)
    qb.andWhere({ dictType: dictType })
    qb.orderBy(`SysDictData.create_time`, 'DESC')
    qb.skip(pageSize * (pageNum - 1))
    qb.take(pageSize)
    return {
      rows: await qb.getMany(),
      total: await qb.getCount()
    }
  }
  //指定字典新增编辑数据
  async dictDataAddUpdateMapper(body: SysDictData, dictCode) {
    const bodyData = !dictCode ? body : { ...body, dictCode }
    return await this.useRepository.save(bodyData)
  }
  // 指定字典数据详情
  async dataDetailMapper(id) {
    return await this.useRepository.findOne({ where: { dictCode: id } })
  }
  // 指定字典数据删除
  async dataRemoveMapper(id) {
    return await this.useRepository.delete(id)
  }
}
