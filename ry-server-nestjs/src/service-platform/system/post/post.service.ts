import { Injectable } from '@nestjs/common'
import { PostMapper } from './post.mapper'
import { SysPost } from 'src/entities/sys/sys_post'
import { UserInfoService } from 'src/framwork/tools-modules/userInfo/userInfo.service'

@Injectable()
export class PostService {
  constructor(
    private postMapper: PostMapper,
    private userInfoService: UserInfoService
  ) {}
  /**
   * 获取数据列表
   */
  async datasList(query) {
    return this.postMapper.datasListMapper(query)
  }

  /**
   * 新增编辑
   */
  async datasAddAndUpdate(body: SysPost, user) {
    let info = null
    if (!body.postId) {
      info = await this.userInfoService.getCreateInfo(user)
    } else {
      info = await this.userInfoService.getUpdateInfo(user)
    }
    return await this.postMapper.datasAddUpdateMapper({ ...body, ...info })
  }

  /**
   * 详情
   */
  async datasDetail(id) {
    return await this.postMapper.datasDetailMapper(id)
  }

  /**
   * 删除
   */
  async datasDelete(id) {
    return await this.postMapper.datasDeleteMapper(id)
  }
}
