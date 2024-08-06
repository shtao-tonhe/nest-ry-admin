import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import axios from 'axios'
import { RedisConfigService } from 'src/framwork/redis/redis.config.service'
import { RedisNameList } from 'src/shared/enums/redis.name'

@Injectable()
export class WechatConfigService {
  constructor(
    private config: ConfigService,
    private redisConfigService: RedisConfigService
  ) {}

  /**
   * 通过code获取微信登录凭证校验获取openid和session_key
   * @param code
   * @returns {
   *    data:{
   *      session_key:'',
   *      unionid:'',
   *      openid:'',
   *    }
   * }
   */
  async getJscode2session(code: string): Promise<any> {
    return await axios({
      method: 'get',
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      params: {
        appid: this.config.get('wxAPPID'),
        secret: this.config.get('wxAPPSecret'),
        js_code: code,
        grant_type: 'authorization_code'
      }
    })
  }

  /**
   * 根据code获取手机号
   * @param token 微信后端接口调用凭证
   * @param code 手机号code
   * @returns {
   *    data:{
          "errcode":0,
          "errmsg":"ok",
          "phone_info": {
              "phoneNumber":"xxxxxx", // 手机号
              "purePhoneNumber": "xxxxxx",
              "countryCode": 86,
              "watermark": {
                  "timestamp": 1637744274,
                  "appid": "xxxx"
              }
          }
        } 
   * }
   */
  async getWechatPhoneNumber(token: string, code: string): Promise<any> {
    return await axios({
      method: 'post',
      url: 'https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=' + token,
      data: {
        code: code
      }
    })
  }

  /**
   * 获取微信的后端接口调用凭证
   * @returns {
   *    data:{
   *      access_token:''
   *    }
   * }
   */
  async getWechatAccessToken(): Promise<string> {
    const localToken = await this.redisConfigService.getRedis(RedisNameList.WechatToken)
    if (!localToken) {
      const info = await axios({
        method: 'get',
        url: 'https://api.weixin.qq.com/cgi-bin/token',
        params: {
          appid: this.config.get('wxAPPID'),
          secret: this.config.get('wxAPPSecret'),
          grant_type: 'client_credential'
        }
      })
      // 微信token有效期为7200秒，其中300秒之内可以重新获取
      this.redisConfigService.setRedis(RedisNameList.WechatToken, JSON.stringify(info.data), 7000)
      return info.data
    }
    return JSON.parse(localToken)
  }
}
