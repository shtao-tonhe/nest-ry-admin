import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Inject,
  HttpException
} from '@nestjs/common'
import { catchError, map, timeout } from 'rxjs/operators'
import { Observable, TimeoutError, throwError } from 'rxjs'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { getReqMainInfo } from 'src/utils/tools'
// 返回体结构
interface Response<T> {
  data: T
}
/*
 * 全局响应拦截器，成功请求统一返回体内容
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Response<T>> {
    // 解析ExecutionContext的数据内容获取到请求体
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<any>()

    // 实现数据的遍历与转变
    return next.handle().pipe(
      timeout(60000), // 60s请求超时
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new HttpException('请求超时', HttpStatus.GATEWAY_TIMEOUT))
        }
        return throwError(() => new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR))
      }),
      map((data) => {
        // 打印响应日志
        this.logger.info('response', {
          responseData: data,
          req: getReqMainInfo(request)
        })
        return {
          code: HttpStatus.OK,
          msg: '请求成功',
          data: data
        }
      })
    )
  }
}
