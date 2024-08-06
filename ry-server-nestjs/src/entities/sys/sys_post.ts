import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, Generated } from 'typeorm'

@Entity()
export class SysPost {
  @ApiProperty({
    description: '岗位ID',
    required: false
  })
  @Column({
    type: 'bigint',
    name: 'post_id',
    comment: '岗位ID',
    primary: true
  })
  @Generated('increment')
  postId: string

  @ApiProperty({
    description: '岗位编码',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 64,
    name: 'post_code',
    comment: '岗位编码',
    default: '',
    nullable: true
  })
  postCode: string

  @ApiProperty({
    description: '岗位名称',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 50,
    name: 'post_name',
    comment: '岗位名称',
    default: '',
    nullable: true
  })
  postName: string

  @ApiProperty({
    description: '显示顺序',
    required: false
  })
  @Column({
    type: 'int',
    name: 'post_sort',
    comment: '显示顺序',
    default: 0,
    nullable: true
  })
  postSort: number

  @ApiProperty({
    description: '状态（0正常 1停用）',
    required: false
  })
  @Column({
    type: 'char',
    length: 1,
    name: 'status',
    comment: '状态（0正常 1停用）',
    default: '0',
    nullable: true
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
    comment: '备注',
    default: '',
    nullable: true
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
