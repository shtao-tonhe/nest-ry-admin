import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ConfigParamService } from './config.service'
import { JWTUserInfo } from 'src/types/jwt'
import { JwtUser } from 'src/shared/decorators/user.decorator'
import { SysConfig } from 'src/entities/sys/sys_config'
import { Permission } from 'src/shared/enums/permissions'
import { RequirePermission } from 'src/shared/decorators/permissions.decorator'
import { ConfigListDTO } from './dto/config.dto'

@Controller('system/config')
@ApiTags('参数管理')
@ApiBearerAuth()
export class ConfigParamController {
  constructor(private configService: ConfigParamService) {}

  @ApiOperation({
    summary: '获取参数列表'
  })
  @ApiResponse({
    description: '获取参数列表',
    type: [SysConfig]
  })
  @Get('list')
  @RequirePermission(Permission.SystemConfigList)
  datasList(@Query() query: ConfigListDTO) {
    return this.configService.datasList(query)
  }

  @ApiOperation({
    summary: '新增参数'
  })
  @Post('')
  @RequirePermission(Permission.SystemConfigAdd)
  datasAdd(@Body() body: SysConfig, @JwtUser() user: JWTUserInfo) {
    return this.configService.datasAddAndUpdate(body, user)
  }

  @ApiOperation({
    summary: '编辑参数'
  })
  @Put('')
  @RequirePermission(Permission.SystemConfigEdit)
  datasUpdate(@Body() body: SysConfig, @JwtUser() user: JWTUserInfo) {
    return this.configService.datasAddAndUpdate(body, user)
  }

  @ApiOperation({
    summary: '获取参数详情'
  })
  @ApiResponse({
    description: '获取参数详情',
    type: [SysConfig]
  })
  @ApiParam({ name: 'id', type: String, description: '参数configId', required: true })
  @Get('/:id')
  @RequirePermission(Permission.SystemConfigList)
  datasDetail(@Param() params) {
    if (!params.id) {
      return false
    }
    return this.configService.datasDetail(params.id)
  }

  @ApiOperation({
    summary: '删除参数'
  })
  @ApiParam({ name: 'id', type: String, description: '参数configId', required: true })
  @Delete('/:id')
  @RequirePermission(Permission.SystemConfigRemove)
  datasDelete(@Param() params) {
    if (!params.id) {
      return false
    }
    return this.configService.datasDelete(params.id)
  }
}
