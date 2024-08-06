import { Injectable } from '@nestjs/common'
import { ConfigParamMapper } from './config.mapper'
import { SysConfig } from 'src/entities/sys/sys_config'
import { Page } from 'src/types/page'
import { ConfigListDTO } from './dto/config.dto'
import { JWTUserInfo } from 'src/types/jwt'
import { UserInfoService } from 'src/framwork/tools-modules/userInfo/userInfo.service'

@Injectable()
export class ConfigParamService {
  constructor(
    private configMapper: ConfigParamMapper,
    private userInfoService: UserInfoService
  ) {}
  /**
   * 获取数据列表
   */
  async datasList(query: ConfigListDTO): Promise<Page<SysConfig>> {
    return this.configMapper.configListMapper(query)
  }

  /**
   * 新增编辑
   */
  async datasAddAndUpdate(body: SysConfig, user: JWTUserInfo): Promise<SysConfig> {
    let info = null
    const { configId = '', ...params } = body
    if (!configId) {
      info = await this.userInfoService.getCreateInfo(user)
    } else {
      info = await this.userInfoService.getUpdateInfo(user)
    }
    return await this.configMapper.configAddUpdateMapper({ ...params, ...info }, configId)
  }

  /**
   * 详情
   */
  async datasDetail(id): Promise<SysConfig> {
    return await this.configMapper.configDetailMapper(id)
  }

  /**
   * 删除
   */
  async datasDelete(id) {
    return await this.configMapper.configDeleteMapper(id)
  }
}
