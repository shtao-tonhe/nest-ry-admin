import { ApiProperty } from '@nestjs/swagger'
import { SysUser } from 'src/entities/sys/sys_user'

export class ListDTO {
  @ApiProperty({ description: '手机号码', required: false })
  phonenumber?: string
  @ApiProperty({ description: '部门id', required: false })
  deptId?: string
  @ApiProperty({ description: '状态(0正常1停用)', required: false })
  status: string
  @ApiProperty({ description: '创建开始时间YYYY-MM-dd', required: false })
  beginTime: string
  @ApiProperty({ description: '创建结束时间YYYY-MM-dd', required: false })
  endTime: string
  @ApiProperty({ description: '当前页', required: false })
  pageNum: number
  @ApiProperty({ description: '分页数量', required: false })
  pageSize: number
}

export type UserAddDTO = Omit<SysUser, 'userId'>
export type UserUpdateDTO = Omit<SysUser, 'phonenumber' | 'password'>
export class PhoneDTO {
  @ApiProperty({ description: '手机号', required: false })
  phonenumber: string
  @ApiProperty({ description: '验证码', required: false })
  code: string
  @ApiProperty({ description: '新手机号', required: false })
  newPhonenumber: string
}

export class PasswordDTO {
  @ApiProperty({ description: '旧密码', required: false })
  oldPassword: string
  @ApiProperty({ description: '新密码', required: false })
  newPassword: string
}

export class AuthRoleDTO {
  @ApiProperty({ description: '角色id数组', required: false })
  roleIds: Array<string>
  @ApiProperty({ description: '用户id', required: false })
  userId: string
}

export class ResetPasswordDTO {
  @ApiProperty({ description: '用户id', required: false })
  userId: string
}
