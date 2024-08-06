import { Injectable } from '@nestjs/common'
import { RedisConfigService } from 'src/framwork/redis/redis.config.service'
import { RedisNameList, RedisNameListArray } from 'src/shared/enums/redis.name'

@Injectable()
export class CacheService {
  constructor(private redisConfigService: RedisConfigService) {}

  // 获取所有缓存列表
  async getNames() {
    const arr = []
    for (const key in RedisNameListArray) {
      arr.push({
        cacheName: RedisNameListArray[key].name,
        value: RedisNameListArray[key].value
      })
    }
    return arr
  }

  // 缓存键名列表
  async getKeys(cacheName, searchValue = '') {
    const result = await this.redisConfigService.getRedisKeysByName(cacheName, searchValue)
    return await result
  }

  // 查询缓存内容
  async getValue(cacheKey) {
    if (cacheKey.indexOf(RedisNameList.UserInfo) >= 0) {
      const userInfo = await this.redisConfigService.hgetRedis(cacheKey)
      return userInfo
    } else {
      return await this.redisConfigService.getRedis(cacheKey)
    }
  }

  // 清理指定键名缓存
  async clearCacheKey(cacheKey) {
    return await this.redisConfigService.delRedis(cacheKey)
  }

  // 获取redis系统信息
  async getInfo() {
    return await this.redisConfigService.getRedisInfo()
  }
}
