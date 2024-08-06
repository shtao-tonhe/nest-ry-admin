import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JWTUserInfo } from 'src/types/jwt'
import { JwtUser } from 'src/shared/decorators/user.decorator'
import { RequirePermission } from 'src/shared/decorators/permissions.decorator'
import { Permission } from 'src/shared/enums/permissions'
import { PostListDTO } from './dto/post.dto'
import { PostService } from './post.service'
import { SysPost } from 'src/entities/sys/sys_post'

@Controller('system/post')
@ApiTags('岗位管理')
@ApiBearerAuth()
export class PostController {
  constructor(private postService: PostService) {}

  @ApiOperation({
    summary: '获取岗位列表'
  })
  @ApiResponse({
    description: '获取岗位列表',
    type: [SysPost]
  })
  @Get('list')
  @RequirePermission(Permission.systemPostQuery)
  datasList(@Query() query: PostListDTO) {
    return this.postService.datasList(query)
  }
  @ApiOperation({
    summary: '新增岗位'
  })
  @Post('')
  @RequirePermission(Permission.systemPostAdd)
  datasAdd(@Body() body: SysPost, @JwtUser() user: JWTUserInfo) {
    return this.postService.datasAddAndUpdate(body, user)
  }

  @ApiOperation({
    summary: '编辑岗位'
  })
  @Put('')
  @RequirePermission(Permission.systemPostEdit)
  datasUpdate(@Body() body: SysPost, @JwtUser() user: JWTUserInfo) {
    return this.postService.datasAddAndUpdate(body, user)
  }

  @ApiOperation({
    summary: '获取岗位详情'
  })
  @ApiResponse({
    description: '获取岗位详情',
    type: [SysPost]
  })
  @ApiParam({ name: 'id', type: String, description: '岗位id', required: true })
  @Get('/:id')
  @RequirePermission(Permission.systemPostQuery)
  datasDetail(@Param() params) {
    if (!params.id) {
      return false
    }
    return this.postService.datasDetail(params.id)
  }

  @ApiOperation({
    summary: '删除岗位'
  })
  @ApiParam({ name: 'id', type: String, description: '岗位id', required: true })
  @Delete('/:id')
  @RequirePermission(Permission.systemPostRemove)
  datasDelete(@Param() params) {
    if (!params.id) {
      return false
    }
    return this.postService.datasDelete(params.id)
  }
}
