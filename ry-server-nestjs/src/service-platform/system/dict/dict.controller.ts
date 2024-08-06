import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { DictService } from './dict.service'
import { SysDictType } from 'src/entities/sys/sys_dict_type'
import { JwtUser } from 'src/shared/decorators/user.decorator'
import { JWTUserInfo } from 'src/types/jwt'
import { SysDictData } from 'src/entities/sys/sys_dict_data'
import { RequirePermission } from 'src/shared/decorators/permissions.decorator'
import { Permission } from 'src/shared/enums/permissions'
import { DataListDTO, ListDTO } from './dto/dict.dto'

@Controller('system/dict')
@ApiTags('字典管理')
@ApiBearerAuth()
export class DictController {
  constructor(private dictService: DictService) {}

  @ApiOperation({
    summary: '获取所有字典类型数据列表'
  })
  @ApiResponse({
    description: '获取所有字典类型数据列表',
    type: [SysDictData]
  })
  @Get('/data/type-all')
  allDataTypeList() {
    return this.dictService.allDataTypeList()
  }

  @ApiOperation({
    summary: '获取指定字典类型数据列表'
  })
  @ApiParam({ name: 'id', type: String, description: '字典类型dictType', required: true })
  @ApiResponse({
    description: '获取指定字典类型数据列表',
    type: [SysDictData]
  })
  @Get('/data/type/:id')
  dataType(@Param() params: { id: string }) {
    if (!params.id) {
      return false
    }
    return this.dictService.dataType(params.id)
  }

  @ApiOperation({
    summary: '获取字典列表'
  })
  @ApiResponse({
    description: '获取字典列表',
    type: [SysDictType]
  })
  @Get('/type/list')
  @RequirePermission(Permission.SystemDictList)
  typeList(@Query() query: ListDTO) {
    return this.dictService.typeList(query)
  }

  @ApiOperation({
    summary: '新增字典'
  })
  @Post('/type')
  @RequirePermission(Permission.SystemDictAdd)
  typeAdd(@Body() body: SysDictType, @JwtUser() user: JWTUserInfo) {
    return this.dictService.typeAddUpdate(body, user)
  }

  @ApiOperation({
    summary: '编辑字典'
  })
  @Put('/type')
  @RequirePermission(Permission.SystemDictEdit)
  typeUpdate(@Body() body: SysDictType, @JwtUser() user: JWTUserInfo) {
    return this.dictService.typeAddUpdate(body, user)
  }

  @ApiOperation({
    summary: '获取字典详情'
  })
  @ApiResponse({
    description: '获取字典详情',
    type: [SysDictType]
  })
  @ApiParam({ name: 'id', type: String, description: '字典dictId', required: true })
  @Get('/type/:id')
  @RequirePermission(Permission.SystemDictList)
  typeDetail(@Param() params) {
    if (!params.id) {
      return false
    }
    return this.dictService.typeDetail(params.id)
  }

  @ApiOperation({
    summary: '字典删除'
  })
  @ApiParam({ name: 'id', type: String, description: '字典dictId', required: true })
  @Delete('/type/:id')
  @RequirePermission(Permission.SystemDictRemove)
  typeDelete(@Param() params) {
    if (!params.id) {
      return false
    }
    return this.dictService.typeDelete(params.id)
  }

  @ApiOperation({
    summary: '获取指定字典数据列表'
  })
  @ApiResponse({
    description: '获取指定字典数据列表',
    type: [SysDictData]
  })
  @Get('/data/list')
  @RequirePermission(Permission.SystemDictList)
  dataList(@Query() query: DataListDTO) {
    return this.dictService.dataList(query)
  }

  @ApiOperation({
    summary: '指定字典新增数据'
  })
  @Post('/data')
  @RequirePermission(Permission.SystemDictAdd)
  dataAdd(@Body() body: SysDictData, @JwtUser() user: JWTUserInfo) {
    return this.dictService.dataAddUpdate(body, user)
  }

  @ApiOperation({
    summary: '指定字典编辑数据'
  })
  @Put('/data')
  @RequirePermission(Permission.SystemDictEdit)
  dataUpdate(@Body() body: SysDictData, @JwtUser() user: JWTUserInfo) {
    return this.dictService.dataAddUpdate(body, user)
  }

  @ApiOperation({
    summary: '指定字典数据详情'
  })
  @ApiParam({ name: 'id', type: String, description: '字典数据dictCode', required: true })
  @ApiResponse({
    description: '指定字典数据详情',
    type: [SysDictData]
  })
  @Get('/data/:id')
  @RequirePermission(Permission.SystemDictList)
  dataDetail(@Param() param) {
    if (!param.id) {
      return false
    }
    return this.dictService.dataDetail(param.id)
  }

  @ApiOperation({
    summary: '指定字典数据删除'
  })
  @ApiParam({ name: 'id', type: String, description: '字典数据dictCode', required: true })
  @Delete('/data/:id')
  @RequirePermission(Permission.SystemDictRemove)
  dataRemove(@Param() param) {
    if (!param.id) {
      return false
    }
    return this.dictService.dataRemove(param.id)
  }
}
