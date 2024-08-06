import { ApiProperty } from '@nestjs/swagger'
import { IsNotIn } from 'class-validator'
import { SysRole } from 'src/entities/sys/sys_role'
import { SysUser } from 'src/entities/sys/sys_user'

export class LoginDto {
  @IsNotIn(['', undefined, null], {
    message: '账号不能为空'
  })
  @ApiProperty({ description: '账号/手机号', required: true })
  phonenumber: string

  @IsNotIn(['', undefined, null], {
    message: '密码不能为空'
  })
  @ApiProperty({ description: '密码', required: true })
  password: string

  @ApiProperty({ description: 'rsa公钥', required: true })
  key: string
}

export class UserInfoDto {
  @ApiProperty({ description: '用户信息', required: false })
  user: SysUser
  @ApiProperty({ description: '角色信息', required: false })
  roles: SysRole
  @ApiProperty({ description: '权限数组信息', required: false })
  permissions: Array<string>
}
