import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
// typeOrm模块
import { TypeOrmModule } from '@nestjs/typeorm'

// 数据库实体类加载
import { entities } from './entities/index'

// 配置模块
import config from 'src/config/env'
import { ConfigService, ConfigModule } from '@nestjs/config'

// redis模块
import { RedisConfigModule } from 'src/framwork/redis/redis.config.module'

// 任务调度-定时任务
import { ScheduleModule } from '@nestjs/schedule'
import { ScheduleOperateModule } from './framwork/schedule/schedule.module'

// 节流阀
import { ThrottlerModule } from '@nestjs/throttler'

// winston 日志功能
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import 'winston-daily-rotate-file'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'

// 注册jwt模块
import { JwtModule } from '@nestjs/jwt'
// jwt守卫
import { AuthGuard } from 'src/shared/guard/jwt.guard'
// 基础角色权限守卫
import { RolesGuard } from 'src/shared/guard/roles.guard'
// 基于声明权限守卫
import { PermissionsGuard } from 'src/shared/guard/permissions.guard'
// 全局响应拦截器
import { ResponseInterceptor } from 'src/shared/interceptor/response.interceptor'
// 全局异常过滤器
import { AllExceptionsFilter } from 'src/shared/filters/http-exception.filter'
// 日志中间件
import LoggerMiddleware from 'src/shared/middleware/logger.middleware'
// 子模块加载
import { AdminModule } from 'src/service-admin/admin.module'
import { CommonModule } from 'src/service-common/common.module'
import { WechatModule } from 'src/service-wechat/wechat.module'
import { PlatformModule } from 'src/service-platform/platform.module'
import { ToolsModule } from 'src/framwork/tools-modules/tools.module'

@Module({
  imports: [
    // winston 日志功能
    WinstonModule.forRoot({
      transports: [
        new winston.transports.DailyRotateFile({
          level: 'info',
          dirname: `logs`, // 日志保存的目录
          filename: 'app-%DATE%.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
          datePattern: 'YYYY-MM-DD-HH', // 日志轮换的频率，此处表示每小时。
          zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
          maxFiles: '3d', // 保留日志文件的最大天数，此处表示自动删除超过 3 天的日志文件。
          // 记录时添加时间戳信息
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.json()
          )
        }),
        new winston.transports.DailyRotateFile({
          level: 'warn', // 错误警告日志
          dirname: `logs/warnanderror`, // 日志保存的目录
          filename: 'warnanderror-%DATE%.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
          datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
          zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
          maxFiles: '7d', // 保留日志文件的最大天数，此处表示自动删除超过 7 天的错误警告日志文件。
          // 记录时添加时间戳信息
          format: winston.format.combine(
            winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.json()
          )
        })
      ]
    }),
    // redis配置模块
    RedisConfigModule,
    // jwt
    JwtModule,
    // 环境变量配置模块
    ConfigModule.forRoot({
      isGlobal: true, // 作用于全局
      load: [config] // 加载自定义配置项
    }),
    // 数据库配置
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql', // 数据库类型
        host: configService.get('db.host'),
        port: configService.get('db.port'),
        username: configService.get('db.username'),
        password: configService.get('db.password'),
        database: configService.get('db.database'),
        entities: [...entities], // 从entities文件中引入所有实体文件
        timezone: '+08:00' // 东八区
      })
    }),
    // 节流阀,避免接口请求暴力攻击---1s/6次，10s/40次
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 6
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 40
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),
    // 任务调度-定时任务
    ScheduleModule.forRoot(),
    // 注册并初始化定时任务
    ScheduleOperateModule,
    // 子模块加载
    AdminModule,
    CommonModule,
    ToolsModule,
    WechatModule,
    PlatformModule
  ],
  controllers: [],
  providers: [
    // jwt守卫
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    // 基础角色的权限守卫
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    // 基于声明的权限守卫
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard
    },
    // 全局通用异常过滤器
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
    // 全局通用响应拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // 日志中间件
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
