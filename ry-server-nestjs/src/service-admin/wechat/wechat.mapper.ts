import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SysUserWechat } from 'src/entities/sys/sys_user_wechat'

@Injectable()
export class WechatMapper {
  constructor(
    @InjectRepository(SysUserWechat)
    private repository
  ) {}
  // 根据openid获取用户信息
  async findOpenIdMapper(openid): Promise<SysUserWechat> {
    return await this.repository.findOne({
      select: {
        userId: true,
        wxOpenId: true,
        sex: true,
        avatar: true,
        nickName: true,
        phonenumber: true
      },
      where: { wxOpenId: openid }
    })
  }
  // 新增微信用户
  async insetUserMapper(openid): Promise<any> {
    return await this.repository.save({ wxOpenId: openid })
  }
}
