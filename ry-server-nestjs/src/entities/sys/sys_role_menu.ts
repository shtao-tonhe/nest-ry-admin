import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity } from 'typeorm'
/**
 * 角色和菜单关联表
 */
@Entity()
export class SysRoleMenu {
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
    description: '菜单ID',
    required: false
  })
  @Column({
    type: 'bigint',
    name: 'menu_id',
    comment: '菜单ID',
    primary: true
  })
  menuId: string
}
