import { Injectable } from '@nestjs/common'
import { DeptMapper } from './dept.mapper'
import { SysDept } from 'src/entities/sys/sys_dept'
import { UserInfoService } from 'src/framwork/tools-modules/userInfo/userInfo.service'
import { DeptListDTO } from './dto/dept.dto'
import { JWTUserInfo } from 'src/types/jwt'

@Injectable()
export class DeptService {
  constructor(
    private deptMapper: DeptMapper,
    private userInfoService: UserInfoService
  ) {}
  /**
   * 获取数据列表
   */
  async datasList(query: DeptListDTO) {
    return this.deptMapper.datasListMapper(query)
  }

  /**
   * 新增编辑
   */
  async datasAddAndUpdate(body: SysDept, user: JWTUserInfo) {
    let info = null
    if (!body.deptId) {
      info = await this.userInfoService.getCreateInfo(user)
    } else {
      info = await this.userInfoService.getUpdateInfo(user)
    }
    return await this.deptMapper.datasAddUpdateMapper({ ...body, ...info })
  }

  /**
   * 详情
   */
  async datasDetail(id) {
    return await this.deptMapper.datasDetailMapper(id)
  }

  /**
   * 删除
   */
  async datasDelete(id) {
    return await this.deptMapper.datasDeleteMapper(id)
  }
}
