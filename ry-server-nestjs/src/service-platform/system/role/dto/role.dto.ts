import { ApiProperty } from '@nestjs/swagger'
import { SysRole } from 'src/entities/sys/sys_role'

export class ListDTO {
  @ApiProperty({ description: '角色名称', required: false })
  menuName: string
  @ApiProperty({ description: '状态(0正常1停用)', required: false })
  status: string
  @ApiProperty({ description: '分页（当前页）', required: false })
  pageNum: number
  @ApiProperty({ description: '分页（当前每页条数）', required: false })
  pageSize: number
}

export class RoleDTO extends SysRole {
  @ApiProperty({ description: '前端传递字段(不需要管)', required: false })
  menuCheckStrictly: boolean
  @ApiProperty({ description: '菜单id数组', required: true })
  menuIds: Array<string>
}

export class AllocatedListDTO {
  @ApiProperty({ description: '用户手机', required: false })
  phonenumber?: string
  @ApiProperty({ description: '分页（当前页）', required: true })
  pageNum: number
  @ApiProperty({ description: '分页（当前每页条数）', required: true })
  pageSize: number
  @ApiProperty({ description: '角色id', required: true })
  roleId: string
}

export class UserRoleDTO {
  @ApiProperty({ description: '角色id', required: true })
  roleId: string
  @ApiProperty({ description: '用户id', required: true })
  userId: string
}

export class UsersRoleDTO {
  @ApiProperty({ description: '角色id', required: true })
  roleId: string
  @ApiProperty({ description: '用户ids复数以逗号分隔', required: true })
  userIds: string
}
