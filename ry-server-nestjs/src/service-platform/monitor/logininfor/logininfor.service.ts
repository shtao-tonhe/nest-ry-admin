import { Injectable } from '@nestjs/common'
import { LogininforMapper } from './logininfor.mapper'

@Injectable()
export class LogininforService {
  constructor(private logininforMapper: LogininforMapper) {}
  // 分页列表
  async getList(query) {
    return await this.logininforMapper.getList(query)
  }
}
