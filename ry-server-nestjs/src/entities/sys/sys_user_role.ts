import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity } from 'typeorm'
/**
 * 用户和角色关联表
 */
@Entity()
export class SysUserRole {
  @ApiProperty({
    description: '用户ID',
    required: false
  })
  @Column({
    type: 'bigint',
    name: 'user_id',
    comment: '用户ID',
    primary: true
  })
  userId: string

  @ApiProperty({
    description: '角色ID',
    required: false
  })
  @Column({
    type: 'bigint',
    name: 'role_id',
    comment: '角色ID',
    primary: true
  })
  roleId: string
}
