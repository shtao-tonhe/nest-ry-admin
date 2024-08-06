import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JWTUserInfo } from 'src/types/jwt'
import { JwtUser } from 'src/shared/decorators/user.decorator'
import { RequirePermission } from 'src/shared/decorators/permissions.decorator'
import { Permission } from 'src/shared/enums/permissions'
import { DeptListDTO } from './dto/dept.dto'
import { DeptService } from './dept.service'
import { SysDept } from 'src/entities/sys/sys_dept'

@Controller('system/dept')
@ApiTags('部门管理')
@ApiBearerAuth()
export class DeptController {
  constructor(private deptService: DeptService) {}

  @ApiOperation({
    summary: '获取部门列表'
  })
  @ApiResponse({
    description: '获取部门列表',
    type: [SysDept]
  })
  @Get('list')
  @RequirePermission(Permission.systemDeptQuery)
  datasList(@Query() query: DeptListDTO) {
    return this.deptService.datasList(query)
  }
  @ApiOperation({
    summary: '新增部门'
  })
  @Post('')
  @RequirePermission(Permission.systemDeptAdd)
  datasAdd(@Body() body: SysDept, @JwtUser() user: JWTUserInfo) {
    return this.deptService.datasAddAndUpdate(body, user)
  }

  @ApiOperation({
    summary: '编辑部门'
  })
  @Put('')
  @RequirePermission(Permission.systemDeptEdit)
  datasUpdate(@Body() body: SysDept, @JwtUser() user: JWTUserInfo) {
    return this.deptService.datasAddAndUpdate(body, user)
  }

  @ApiOperation({
    summary: '获取部门详情'
  })
  @ApiResponse({
    description: '获取部门详情',
    type: [SysDept]
  })
  @ApiParam({ name: 'id', type: String, description: '部门id', required: true })
  @Get('/:id')
  @RequirePermission(Permission.systemDeptQuery)
  datasDetail(@Param() params) {
    if (!params.id) {
      return false
    }
    return this.deptService.datasDetail(params.id)
  }

  @ApiOperation({
    summary: '删除部门'
  })
  @ApiParam({ name: 'id', type: String, description: '部门id', required: true })
  @Delete('/:id')
  @RequirePermission(Permission.systemDeptRemove)
  datasDelete(@Param() params) {
    if (!params.id) {
      return false
    }
    return this.deptService.datasDelete(params.id)
  }
}
