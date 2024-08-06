import { NestFactory } from '@nestjs/core'
import { AppModule } from 'src/app.module'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import fastifyCsrf from '@fastify/csrf-protection'
import helmet from '@fastify/helmet'
import { ValidationPipe } from '@nestjs/common'
import multipart from '@fastify/multipart'
import { join } from 'path'
import fastifyStatic from '@fastify/static'
import {
  initSwaggerCommonModules,
  initSwaggerMobileModule,
  initSwaggerPlatformModule
} from 'src/framwork/swagger/swagger.config'

async function bootstrap() {
  // 使用fastify
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false })
  )

  // 设置 HTTP 标头增加安全性
  await app.register(helmet)

  // 跨站点请求伪造（也称为 CSRF 或 XSRF）保护
  await app.register(fastifyCsrf)

  //开启跨源资源共享CORS
  app.enableCors()

  // 注册全局通用验证管道
  app.useGlobalPipes(new ValidationPipe())

  // 设置全局接口前缀
  app.setGlobalPrefix('api')

  // swagger文档
  if (process.env.NODE_ENV !== 'prod') {
    initSwaggerMobileModule(app)
    initSwaggerPlatformModule(app)
    initSwaggerCommonModules(app)
  }

  // 注册 @fastify/multipart 支持文件上传功能
  await app.register(multipart)

  // fastify静态服务器
  await app.register(fastifyStatic, {
    root: join(__dirname, '../public'),
    prefix: '/public/'
  })

  await app.listen(3001)
}
bootstrap()
