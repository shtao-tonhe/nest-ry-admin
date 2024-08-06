import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity } from 'typeorm'
/**
 * 部门和角色关联表
 */
@Entity()
export class SysRoleDept {
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

  @ApiProperty({
    description: '部门ID',
    required: false
  })
  @Column({
    type: 'bigint',
    name: 'dept_id',
    comment: '部门ID',
    primary: true
  })
  deptId: string
}
