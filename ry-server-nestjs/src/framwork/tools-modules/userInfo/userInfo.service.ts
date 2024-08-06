import { Injectable } from '@nestjs/common'
import dayjs = require('dayjs')
import { SysDept } from 'src/entities/sys/sys_dept'
import { SysUser } from 'src/entities/sys/sys_user'
import { RedisConfigService } from 'src/framwork/redis/redis.config.service'
import { RedisNameList } from 'src/shared/enums/redis.name'
import { JWTUserInfo } from 'src/types/jwt'

@Injectable()
export class UserInfoService {
  constructor(private redisConfigService: RedisConfigService) {}
  /**
   * 返回创建者和创建时间
   * @param userId token中携带的userId
   * @time 路径中携带的时间戳
   */
  async getCreateInfo(user: JWTUserInfo, time?: string) {
    const userInfo: any = await this.redisConfigService.hgetRedis(
      RedisNameList.UserInfo + user.userId
    )
    let name = ''
    try {
      name = userInfo.realName || userInfo.nickName
    } catch {}
    return {
      createTime: time
        ? dayjs(Number(time)).format('YYYY-MM-DD HH:mm:ss')
        : dayjs().format('YYYY-MM-DD HH:mm:ss'),
      createBy: name
    }
  }
  /**
   * 返回更新者和更新时间
   * @param userId token中携带的userId
   * @time 路径中携带的时间戳
   */
  async getUpdateInfo(user: JWTUserInfo, time?: string) {
    const userInfo: any = await this.redisConfigService.hgetRedis(
      RedisNameList.UserInfo + user.userId
    )
    let name = ''
    try {
      name = userInfo.realName || userInfo.nickName
    } catch {}
    return {
      updateTime: time
        ? dayjs(Number(time)).format('YYYY-MM-DD HH:mm:ss')
        : dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updateBy: name
    }
  }

  /**
   * 返回登录者用户信息-基本信息
   */
  async getUserInfo(user: JWTUserInfo, key?: string): Promise<SysUser> {
    const info: any = await this.redisConfigService.hgetRedis(
      RedisNameList.UserInfo + user.userId,
      key
    )
    return info
  }
  /**
   * 返回登录者用户信息-部门信息
   */
  async getUserInfoDept(user: JWTUserInfo, key?: string): Promise<SysDept> {
    const info: any = await this.redisConfigService.hgetRedis(
      RedisNameList.UserInfoDept + user.userId,
      key
    )
    return info
  }
}
