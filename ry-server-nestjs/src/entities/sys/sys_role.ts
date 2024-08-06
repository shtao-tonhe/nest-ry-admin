import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, Generated } from 'typeorm'
/**
 * 角色信息表
 */
@Entity()
export class SysRole {
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
  @Generated('increment')
  roleId: string

  @ApiProperty({
    description: '角色名称',
    required: true
  })
  @Column({
    type: 'varchar',
    length: 30,
    name: 'role_name',
    comment: '角色名称',
    default: ''
  })
  roleName: string

  @ApiProperty({
    description: '角色权限字符串',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 100,
    name: 'role_key',
    comment: '角色权限字符串',
    default: 'common'
  })
  roleKey: string

  @ApiProperty({
    description: '显示顺序',
    required: false
  })
  @Column({
    type: 'int',
    name: 'role_sort',
    comment: '显示顺序',
    default: ''
  })
  roleSort: number

  @ApiProperty({
    description: '角色状态（0正常 1停用）',
    required: false
  })
  @Column({
    type: 'char',
    length: 1,
    name: 'status',
    comment: '角色状态（0正常 1停用）',
    default: '0'
  })
  status: string

  @ApiProperty({
    description: '备注',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 500,
    name: 'remark',
    nullable: true,
    comment: '备注',
    default: ''
  })
  remark: string

  @ApiProperty({
    description: '创建时间',
    required: false
  })
  @Column({
    name: 'create_time',
    type: 'datetime',
    nullable: true,
    comment: '创建时间',
    default: () => 'NOW()'
  })
  createTime: Date

  @ApiProperty({
    description: '创建者',
    required: false
  })
  @Column({
    name: 'create_by',
    type: 'varchar',
    length: 64,
    nullable: true,
    comment: '创建者',
    default: ''
  })
  createBy: string

  @ApiProperty({
    description: '更新时间',
    required: false
  })
  @Column({
    name: 'update_time',
    type: 'datetime',
    nullable: true,
    comment: '更新时间'
  })
  updateTime: Date

  @ApiProperty({
    description: '更新者',
    required: false
  })
  @Column({
    name: 'update_by',
    length: 64,
    type: 'varchar',
    comment: '更新者',
    nullable: true,
    default: ''
  })
  updateBy: string
}
