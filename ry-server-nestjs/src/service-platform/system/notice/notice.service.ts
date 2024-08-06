import { Injectable } from '@nestjs/common'
import { NoticeMapper } from './notice.mapper'
import { SysNotice } from 'src/entities/sys/sys_notice'
import { UserInfoService } from 'src/framwork/tools-modules/userInfo/userInfo.service'

@Injectable()
export class NoticeService {
  constructor(
    private noticeMapper: NoticeMapper,
    private userInfoService: UserInfoService
  ) {}
  /**
   * 获取数据列表
   */
  async datasList(query) {
    return this.noticeMapper.datasListMapper(query)
  }

  /**
   * 新增编辑
   */
  async datasAddAndUpdate(body: SysNotice, user) {
    let info = null
    if (!body.noticeId) {
      info = await this.userInfoService.getCreateInfo(user)
    } else {
      info = await this.userInfoService.getUpdateInfo(user)
    }
    return await this.noticeMapper.datasAddUpdateMapper({ ...body, ...info })
  }

  /**
   * 详情
   */
  async datasDetail(id) {
    return await this.noticeMapper.datasDetailMapper(id)
  }

  /**
   * 删除
   */
  async datasDelete(id) {
    return await this.noticeMapper.datasDeleteMapper(id)
  }
}
