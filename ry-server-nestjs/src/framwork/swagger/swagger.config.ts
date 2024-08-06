import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { adminModules } from 'src/service-admin'
import { commonModules } from 'src/service-common'
import { platformModules } from 'src/service-platform'
import { wechatModules } from 'src/service-wechat'

/**
 * 登录模块和公共模块新页面
 */
export function initSwaggerCommonModules(app) {
  const options = new DocumentBuilder()
    .setTitle('登录公共模块文档')
    .setDescription('全局登录公共模块的管理内容')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options, {
    ignoreGlobalPrefix: false,
    include: [...adminModules, ...commonModules]
  })
  SwaggerModule.setup('api/common', app, document)
}

/**
 * 平台模块新页面
 */
export function initSwaggerPlatformModule(app) {
  const options = new DocumentBuilder()
    .setTitle('平台管理模块文档')
    .setDescription('全局后台管理模块的内容')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options, {
    ignoreGlobalPrefix: false,
    include: [...platformModules]
  })
  SwaggerModule.setup('api/platform', app, document)
}
/**
 * 移动端模块新页面
 */
export function initSwaggerMobileModule(app) {
  const options = new DocumentBuilder()
    .setTitle('移动端模块文档')
    .setDescription('全局移动端模块的管理内容')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, options, {
    ignoreGlobalPrefix: false,
    include: [...wechatModules]
  })
  SwaggerModule.setup('api/mobile', app, document)
}
