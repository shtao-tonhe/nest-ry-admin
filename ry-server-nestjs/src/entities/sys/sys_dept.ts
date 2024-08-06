import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, Generated } from 'typeorm'

@Entity()
export class SysDept {
  @ApiProperty({
    description: '部门id',
    required: false
  })
  @Column({
    type: 'bigint',
    name: 'dept_id',
    comment: '部门id',
    primary: true
  })
  @Generated('increment')
  deptId: string

  @ApiProperty({
    description: '父部门id',
    required: false
  })
  @Column({
    type: 'bigint',
    name: 'parent_id',
    comment: '父部门id',
    default: 0,
    nullable: true
  })
  parentId: number

  @ApiProperty({
    description: '部门名称',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 30,
    name: 'dept_name',
    comment: '部门名称',
    default: ''
  })
  deptName: string

  @ApiProperty({
    description: '显示顺序',
    required: false
  })
  @Column({
    type: 'int',
    name: 'order_num',
    comment: '显示顺序',
    default: 0,
    nullable: true
  })
  orderNum: number

  @ApiProperty({
    description: '负责人',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 20,
    name: 'leader',
    comment: '负责人',
    default: null,
    nullable: true
  })
  leader: string

  @ApiProperty({
    description: '联系电话',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 11,
    name: 'phone',
    comment: '联系电话',
    default: null,
    nullable: true
  })
  phone: string

  @ApiProperty({
    description: '邮箱',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 50,
    name: 'email',
    comment: '邮箱',
    default: null,
    nullable: true
  })
  email: string

  @ApiProperty({
    description: '部门状态（0正常 1停用）',
    required: false
  })
  @Column({
    type: 'char',
    length: 1,
    name: 'status',
    comment: '部门状态（0正常 1停用）',
    default: '0',
    nullable: true
  })
  status: string

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
