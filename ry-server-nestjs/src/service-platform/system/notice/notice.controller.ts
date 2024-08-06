import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { NoticeService } from './notice.service'
import { JWTUserInfo } from 'src/types/jwt'
import { JwtUser } from 'src/shared/decorators/user.decorator'
import { SysNotice } from 'src/entities/sys/sys_notice'
import { RequirePermission } from 'src/shared/decorators/permissions.decorator'
import { Permission } from 'src/shared/enums/permissions'
import { NoticeListDTO } from './dto/notice.dto'

@Controller('system/notice')
@ApiTags('通知公告')
@ApiBearerAuth()
export class NoticeController {
  constructor(private noticeService: NoticeService) {}

  @ApiOperation({
    summary: '获取公告列表'
  })
  @ApiResponse({
    description: '公告列表',
    type: [SysNotice]
  })
  @Get('list')
  @RequirePermission(Permission.systemNoticeList)
  datasList(@Query() query: NoticeListDTO) {
    return this.noticeService.datasList(query)
  }
  @ApiOperation({
    summary: '新增公告'
  })
  @Post('')
  @RequirePermission(Permission.systemNoticeAdd)
  datasAdd(@Body() body: SysNotice, @JwtUser() user: JWTUserInfo) {
    return this.noticeService.datasAddAndUpdate(body, user)
  }

  @ApiOperation({
    summary: '编辑公告'
  })
  @Put('')
  @RequirePermission(Permission.systemNoticeEdit)
  datasUpdate(@Body() body: SysNotice, @JwtUser() user: JWTUserInfo) {
    return this.noticeService.datasAddAndUpdate(body, user)
  }

  @ApiOperation({
    summary: '公告详情'
  })
  @ApiResponse({
    description: '公告详情',
    type: [SysNotice]
  })
  @ApiParam({ name: 'id', type: String, description: '公告noticeId', required: true })
  @Get('/:id')
  @RequirePermission(Permission.systemNoticeList)
  datasDetail(@Param() params) {
    if (!params.id) {
      return false
    }
    return this.noticeService.datasDetail(params.id)
  }

  @ApiOperation({
    summary: '删除公告'
  })
  @ApiParam({ name: 'id', type: String, description: '公告noticeId', required: true })
  @Delete('/:id')
  @RequirePermission(Permission.systemNoticeRemove)
  datasDelete(@Param() params) {
    if (!params.id) {
      return false
    }
    return this.noticeService.datasDelete(params.id)
  }
}
