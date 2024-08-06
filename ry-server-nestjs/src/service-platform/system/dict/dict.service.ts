import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { SysDictType } from 'src/entities/sys/sys_dict_type'
import { DictMapper } from './dict.mapper'
import { SysDictData } from 'src/entities/sys/sys_dict_data'
import { JWTUserInfo } from 'src/types/jwt'
import { Page } from 'src/types/page'
import { DataListDTO, ListDTO } from './dto/dict.dto'
import { UserInfoService } from 'src/framwork/tools-modules/userInfo/userInfo.service'

@Injectable()
export class DictService {
  constructor(
    private dictMapper: DictMapper,
    private userInfoService: UserInfoService
  ) {}

  // 获取所有字典类型数据列表
  async allDataTypeList() {
    return this.dictMapper.allDataTypeListMapper()
  }
  /**
   * 获取指定字典类型数据列表
   */
  async dataType(dictType): Promise<SysDictData> {
    const dictInfo = await this.dictMapper.typeDetailByDictTypeMapper(dictType)
    if (dictInfo.status != '0') {
      throw new HttpException(`字典${dictType}已被禁用`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return this.dictMapper.getDictValueMapper(dictType)
  }

  /**
   * 字典分页列表
   */
  async typeList(query: ListDTO): Promise<Page<SysDictType>> {
    return this.dictMapper.dictListMapper(query)
  }

  /**
   * 字典类型新增编辑
   */
  async typeAddUpdate(body: SysDictType, user: JWTUserInfo) {
    let info = null
    const { dictId = '', ...params } = body
    if (!dictId) {
      info = await this.userInfoService.getCreateInfo(user)
    } else {
      info = await this.userInfoService.getUpdateInfo(user)
    }
    return await this.dictMapper.dictAddUpdateMapper({ ...params, ...info }, dictId)
  }

  /**
   * 字典详情
   */
  async typeDetail(id): Promise<SysDictType> {
    return await this.dictMapper.typeDetailMapper(id)
  }

  /**
   * 字典删除
   */
  async typeDelete(id) {
    return await this.dictMapper.typeDeleteMapper(id)
  }

  /**
   * 获取指定字典数据列表
   */
  async dataList(query: DataListDTO): Promise<Page<SysDictData>> {
    return await this.dictMapper.dataListMapper(query)
  }

  /**
   * 指定字典新增编辑数据
   */
  async dataAddUpdate(body: SysDictData, user: JWTUserInfo) {
    let info = null
    const { dictCode = '', ...params } = body
    if (!dictCode) {
      info = await this.userInfoService.getCreateInfo(user)
    } else {
      info = await this.userInfoService.getUpdateInfo(user)
    }
    return await this.dictMapper.dictDataAddUpdateMapper({ ...params, ...info }, dictCode)
  }
  // 指定字典数据详情
  async dataDetail(id) {
    return await this.dictMapper.dataDetailMapper(id)
  }
  // 指定字典数据删除
  async dataRemove(id) {
    return await this.dictMapper.dataRemoveMapper(id)
  }
}
