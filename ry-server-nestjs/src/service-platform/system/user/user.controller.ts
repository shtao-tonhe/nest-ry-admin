import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import {
  AuthRoleDTO,
  ListDTO,
  PasswordDTO,
  PhoneDTO,
  ResetPasswordDTO,
  UserAddDTO,
  UserUpdateDTO
} from './dto/user.dto'
import { SysUser } from 'src/entities/sys/sys_user'
import { UserService } from './user.service'
import { JwtUser } from 'src/shared/decorators/user.decorator'
import { JWTUserInfo } from 'src/types/jwt'
import { RequirePermission } from 'src/shared/decorators/permissions.decorator'
import { Permission } from 'src/shared/enums/permissions'
import { SysRole } from 'src/entities/sys/sys_role'

@Controller('system/user')
@ApiTags('用户管理')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({
    summary: '用户分页列表'
  })
  @ApiResponse({
    description: '用户分页列表',
    type: [SysUser]
  })
  @RequirePermission(Permission.SystemUserList)
  @Get('/list')
  list(@Query() query: ListDTO, @JwtUser() user: JWTUserInfo) {
    return this.userService.getList(query, user)
  }

  @ApiOperation({
    summary: '获取指定id用户的基本信息'
  })
  @ApiParam({ name: 'id', type: String, description: '用户userId', required: true })
  @ApiResponse({
    description: '用户信息',
    type: [SysUser]
  })
  @Get('/:id')
  @RequirePermission(Permission.SystemUserList)
  userDetail(@JwtUser() user: JWTUserInfo, @Param() params: any) {
    return this.userService.userDetail(params.id, user)
  }

  @ApiOperation({
    summary: '新增用户信息'
  })
  @Post('')
  @RequirePermission(Permission.SystemUserAdd)
  add(@Body() userInfo: UserAddDTO, @JwtUser() user: JWTUserInfo) {
    return this.userService.userAdd(userInfo, user)
  }

  @ApiOperation({
    summary: '修改用户信息'
  })
  @Put('')
  @RequirePermission(Permission.SystemUserEdit)
  update(@Body() userInfo: UserUpdateDTO, @JwtUser() user: JWTUserInfo) {
    return this.userService.userUpdate(userInfo, user)
  }

  @ApiOperation({
    summary: '删除指定id用户的基本信息'
  })
  @ApiParam({ name: 'id', type: String, description: '用户userId', required: true })
  @Delete('/:id')
  @RequirePermission(Permission.SystemUserRemove)
  userDelete(@Param() params) {
    return this.userService.userDelete(params.id)
  }

  @ApiOperation({
    summary: '重置用户密码'
  })
  @Put('/resetPwd')
  @RequirePermission(Permission.SystemUserResetPwd)
  updateCurrentPassword(@Body() body: ResetPasswordDTO) {
    return this.userService.resetPassword(body)
  }

  @ApiOperation({
    summary: '用户分配角色'
  })
  @Put('/authRole')
  @RequirePermission(Permission.SystemUserAllocation)
  authRole(@Body() body: AuthRoleDTO) {
    return this.userService.authRole(body)
  }

  @ApiOperation({
    summary: '用户导入'
  })
  @ApiBody({
    description: '文件',
    type: () => {
      class File {
        @ApiProperty({ type: 'string', format: 'binary' })
        file: any
      }
      return File
    }
  })
  @ApiConsumes('multipart/form-data')
  @Post('/import')
  @RequirePermission(Permission.SystemUserImport)
  async import(@Req() req, @JwtUser() user: JWTUserInfo) {
    const file = await req.file()
    return this.userService.userImport(file, user)
  }

  @ApiOperation({
    summary: '用户导出'
  })
  @Get('/export')
  @RequirePermission(Permission.SystemUserExport)
  async export(@Query() req: ListDTO) {
    return this.userService.userExport(req)
  }

  /**---------当前登录用户信息---------- */
  @ApiOperation({
    summary: '当前登录用户修改基本资料'
  })
  @Put('/profile')
  profileUpdate(@Body() userInfo: UserAddDTO, @JwtUser() user: JWTUserInfo) {
    return this.userService.userProfileUpdate(userInfo, user)
  }

  @ApiOperation({
    summary: '当前登录用户获取基本资料'
  })
  @ApiResponse({
    description: '当前登录账号个人信息',
    type: () => {
      // 可在方法中自定义类，如果该类没有复用的地方完成可以如此
      class Info {
        @ApiProperty({ description: '用户信息', required: false })
        user: SysUser
        @ApiProperty({ description: '角色信息', required: false })
        roles: SysRole
        @ApiProperty({ description: '角色id数组', required: false })
        roleIds: Array<string>
      }
      return Info
    }
  })
  @Get('/profile')
  userDetailProfile(@JwtUser() user: JWTUserInfo) {
    return this.userService.userDetail('', user)
  }

  @ApiOperation({
    summary: '当前登录用户修改密码'
  })
  @Put('/profile/updatePwd')
  profileUpdatePwd(@JwtUser() user: JWTUserInfo, @Body() body: PasswordDTO) {
    return this.userService.profileUpdatePwd(body, user)
  }

  @ApiOperation({
    summary: '当前登录用户修改手机号'
  })
  @Put('/profile/phone')
  profileUpdatePhone(@JwtUser() user: JWTUserInfo, @Body() body: PhoneDTO) {
    return this.userService.profileUpdatePhone(body, user)
  }

  @ApiOperation({
    summary: '当前登录用户头像修改'
  })
  @ApiBody({
    description: '文件',
    type: () => {
      class File {
        @ApiProperty({ type: 'string', format: 'binary' })
        file: any
      }
      return File
    }
  })
  @ApiConsumes('multipart/form-data')
  @Post('/profile/avatar')
  async profileAvatar(@Req() req, @JwtUser() user: JWTUserInfo) {
    const file = await req.file()
    return this.userService.profileAvatar(file, user)
  }

  @ApiOperation({
    summary: '获取部门树列表'
  })
  @Get('/deptTree')
  deptTree(@JwtUser() user: JWTUserInfo) {
    return this.userService.getDeptTree(user)
  }
}
