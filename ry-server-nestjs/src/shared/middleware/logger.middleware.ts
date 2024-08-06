import { Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { getReqMainInfo } from 'src/utils/tools'
import { Logger } from 'winston'

@Injectable()
export default class LoggerMiddleware implements NestMiddleware {
  // 注入日志服务相关依赖
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  use(req: any, res: any, next) {
    // 记录请求日志
    this.logger.info('route', {
      req: getReqMainInfo(req)
    })

    next()
  }
}
