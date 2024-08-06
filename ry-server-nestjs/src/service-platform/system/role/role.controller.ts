import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { RoleService } from './role.service'
import { JWTUserInfo } from 'src/types/jwt'
import { JwtUser } from 'src/shared/decorators/user.decorator'
import { AllocatedListDTO, ListDTO, RoleDTO, UserRoleDTO, UsersRoleDTO } from './dto/role.dto'
import { Permission } from 'src/shared/enums/permissions'
import { RequirePermission } from 'src/shared/decorators/permissions.decorator'
import { SysRole } from 'src/entities/sys/sys_role'

@Controller('/system/role')
@ApiTags('角色管理')
@ApiBearerAuth()
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiOperation({
    summary: '获取角色列表'
  })
  @ApiResponse({
    description: '获取角色列表',
    type: SysRole
  })
  @Get('/list')
  @RequirePermission(Permission.SystemRoleList)
  list(@Query() query: ListDTO, @JwtUser() user: JWTUserInfo) {
    return this.roleService.getList(query, user)
  }

  @ApiOperation({
    summary: '角色新增'
  })
  @ApiBody({ type: RoleDTO })
  @Post('')
  @RequirePermission(Permission.SystemRoleAdd)
  addRole(@Body() role: RoleDTO, @JwtUser() user: JWTUserInfo) {
    return this.roleService.addRole(role, user)
  }

  @ApiOperation({
    summary: '角色详情'
  })
  @ApiParam({ name: 'id', type: String, description: '角色roleId', required: true })
  @ApiResponse({
    description: '角色详情',
    type: SysRole
  })
  @Get('/:id')
  @RequirePermission(Permission.SystemRoleList)
  roleDetail(@Param() params) {
    if (!params.id) {
      return false
    }
    return this.roleService.getDetail(params.id)
  }

  @ApiOperation({
    summary: '角色编辑'
  })
  @Put('')
  @RequirePermission(Permission.SystemRoleEdit)
  editRole(@Body() role: RoleDTO, @JwtUser() user: JWTUserInfo) {
    return this.roleService.editRole(role, user)
  }

  @ApiOperation({
    summary: '角色删除'
  })
  @ApiParam({ name: 'id', type: String, description: '角色roleId', required: true })
  @Delete('/:id')
  @RequirePermission(Permission.SystemRoleRemove)
  removeRole(@Param() params, @JwtUser() user: JWTUserInfo) {
    if (!params.id) {
      return false
    }
    return this.roleService.removeRole(params.id, user)
  }

  @ApiOperation({
    summary: '获取当前登录账号所有可用角色列表'
  })
  @ApiResponse({
    description: '获取当前登录账号所有可用角色列表',
    type: SysRole
  })
  @Get('/all')
  @RequirePermission(Permission.SystemRoleList)
  allList(@JwtUser() user: JWTUserInfo) {
    return this.roleService.getAllList(user)
  }

  @ApiOperation({
    summary: '获取指定角色已分配的用户列表'
  })
  @Get('/authUser/allocatedList')
  @RequirePermission(Permission.SystemRoleAllocation)
  authUserAllocatedList(@Query() query: AllocatedListDTO, @JwtUser() user: JWTUserInfo) {
    return this.roleService.allocatedList(query, user)
  }

  @ApiOperation({
    summary: '取消指定用户在指定角色的授权'
  })
  @ApiBody({
    type: UserRoleDTO
  })
  @Put('/authUser/cancel')
  @RequirePermission(Permission.SystemRoleRevoke)
  authUserCancel(@Body() body: UserRoleDTO) {
    return this.roleService.authUserCancel(body)
  }

  @ApiOperation({
    summary: '获取指定角色未分配的用户列表，用于分配用户选择'
  })
  @Get('/authUser/unallocatedList')
  @RequirePermission(Permission.SystemRoleAllocation)
  authUserUnallocatedList(@Query() query: AllocatedListDTO, @JwtUser() user: JWTUserInfo) {
    return this.roleService.authUserUnallocatedList(query, user)
  }

  @ApiOperation({
    summary: '角色分配选择用户'
  })
  @ApiBody({
    type: UsersRoleDTO
  })
  @Put('/authUser/selectAll')
  @RequirePermission(Permission.SystemRoleAllocation)
  authUserSelectAll(@Query() query: UsersRoleDTO) {
    return this.roleService.authUserSelectAll(query)
  }

  @ApiOperation({
    summary: '获取部门树列表'
  })
  @Get('/deptTree/:id')
  deptTree(@Param() params: any, @JwtUser() user: JWTUserInfo) {
    return this.roleService.getDeptTree(params.id, user)
  }

  @ApiOperation({
    summary: '角色分配数据权限'
  })
  @Post('/dataScope')
  dataScope(@Body() data) {
    return this.roleService.dataScope(data)
  }
}
