import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
/*
 * 全局异常过滤器
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<any>()
    const request = ctx.getRequest<any>()
    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const message =
      exception instanceof HttpException
        ? exception.getResponse()['message']
        : exception || '系统错误'
    const responseBody = {
      code: httpStatus,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
      msg: message
    }
    this.logger.error('error', { responseBody, exception })
    response.status(httpStatus).send(responseBody)
  }
}
