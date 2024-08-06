import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisConfigService {
  private redisClient
  constructor(private config: ConfigService) {
    this.initRedis()
  }
  /**
   * 初始化登录
   * @param connectType
   */
  private async initRedis() {
    try {
      const redis = new Redis(this.config.get('redisConfig'))
      redis.on('error', (err) => {
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
      })
      redis.on('connect', () => {
        this.redisClient = redis
      })
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /*----字符串格式string----*/
  /**
   * 设置redis字符串格式内容存储
   * @param key 健名
   * @param string 字符串内容
   * @param time 过期时间 单位s
   * @returns
   */
  async setRedis(key: string, value: string, time?: number): Promise<void> {
    try {
      // 存储
      await this.redisClient.set(key, value)
      // 设置过期时间
      if (time) {
        await this.setRedisTime(key, time)
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  /**
   * 获取字符串格式redis内容
   * @param key
   * @returns string | null
   */
  async getRedis(key: string): Promise<string | null> {
    return await this.redisClient.get(key)
  }

  /*----对象格式object----*/
  /**
   * 设置redis对象格式内容存储
   * @param key 健名
   * @param object 对象内容
   * @param time 过期时间 单位s
   * @returns
   */
  async hsetRedis(key: string, value: object, time?: number): Promise<void> {
    try {
      // 将对象转换为适合 hset 命令的键值对列表
      // const flatData = Object.entries(value).flatMap(([k, v]) =>
      //   [k, typeof v === 'object' ? JSON.stringify(v) : v]
      // );
      // 存储
      // await this.redisClient.hset(key, flatData)

      await this.redisClient.hset(key, value)
      // 设置过期时间
      if (time) {
        await this.setRedisTime(key, time)
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
  /**
   * 获取对象格式redis内容
   * @param key
   * @returns object | null
   */
  async hgetRedis(key: string, objectKey?: string): Promise<null | object> {
    if (objectKey) {
      return await this.redisClient.hget(key, objectKey)
    }
    return await this.redisClient.hgetall(key)
  }

  /**---数组格式暂未封装按需可以自行封装-- */

  /*-----设置过期时间----- */
  /**
   * 设定指定key对应的过期时间，单位s
   * @param key
   * @param time
   * @returns 0 为设置失败, 1为设置成功
   */
  async setRedisTime(key: string, time: number): Promise<number> {
    const result = await this.redisClient.expire(key, time)
    if (result && result === 0) {
      throw new HttpException('redis过期时间设置失败', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return result
  }
  /**
   * 设定key永不过期，因此需要主动删除
   * @param key
   * @returns 0 为设置失败, 1为设置成功
   */
  async setRedisTimePersist(key: string): Promise<number> {
    const result = await this.redisClient.persist(key)
    if (result && result === 0) {
      throw new HttpException('redis过期时间设置失败', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return result
  }
  /*-----删除指定key的内容----- */
  /**
   * 移除指定key
   * @param key
   */
  async delRedis(key: string): Promise<void> {
    return await this.redisClient.del(key)
  }

  /*-----redis相关信息---- */
  /**
   * 扫描指定名称下的缓存键名列表
   */
  async getRedisKeysByName(
    name: string,
    searchValue: string
  ): Promise<Array<{ cacheKey: string }>> {
    if (searchValue) {
      name = name + searchValue
    }
    const stream = this.redisClient.scanStream({
      match: `${name}*`,
      count: 100
    })
    const list = []
    stream.on('data', (resultKeys) => {
      for (let i = 0; i < resultKeys.length; i++) {
        list.push({
          cacheKey: resultKeys[i]
        })
      }
    })
    return new Promise((resolve) => {
      stream.on('end', () => {
        resolve(list)
      })
    })
  }
  /**
   * 获取 redis 服务器的各种信息和统计数值
   */
  async getRedisInfo() {
    const serverInfo = await this.redisClient.info('Server')
    const clientsInfo = await this.redisClient.info('Clients')
    const memoryInfo = await this.redisClient.info('Memory')
    const cpuInfo = await this.redisClient.info('CPU')
    const statsInfo = await this.redisClient.info('Stats')
    const commandstatsInfo = await this.redisClient.info('Commandstats')
    const keyspaceInfo = await this.redisClient.info('Keyspace')
    const Persistence = await this.redisClient.info('Persistence')
    return {
      ...this.transArrayToObject(serverInfo.split('\r\n')),
      ...this.transArrayToObject(clientsInfo.split('\r\n')),
      ...this.transArrayToObject(memoryInfo.split('\r\n')),
      ...this.transArrayToObject(cpuInfo.split('\r\n')),
      ...this.transArrayToObject(statsInfo.split('\r\n')),
      ...this.transArrayToObject(commandstatsInfo.split('\r\n')),
      ...this.transArrayToObject(Persistence.split('\r\n')),
      db: this.transArrayToObjectTotal(keyspaceInfo.split('\r\n'))
    }
  }
  // 处理redis字符串信息相关转换为对象
  transArrayToObject(arr) {
    if (arr.length === 0) return
    const arrObj = {}
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].indexOf(':') >= 0) {
        const list = arr[i].split(':')
        arrObj[list[0]] = list[1]
      }
    }
    return arrObj
  }
  // 处理redis字符串信息相关转换为对象并统计为数组
  transArrayToObjectTotal(arr) {
    if (arr.length === 0) return
    const arrList = []
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].indexOf(':') >= 0) {
        const arrObj = {}
        const list = arr[i].split(':')
        arrObj[list[0]] = list[1]
        arrList.push(arrObj)
      }
    }
    return arrList
  }
}
