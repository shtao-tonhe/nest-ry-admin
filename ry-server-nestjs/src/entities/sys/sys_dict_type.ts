import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, Generated } from 'typeorm'

@Entity()
export class SysDictType {
  @ApiProperty({
    description: '字典主键',
    required: false
  })
  @Column({
    type: 'bigint',
    name: 'dict_id',
    comment: '字典主键',
    primary: true
  })
  @Generated('increment')
  dictId: string

  @ApiProperty({
    description: '字典名称',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 100,
    name: 'dict_name',
    comment: '字典名称',
    default: '',
    nullable: true
  })
  dictName: string

  @ApiProperty({
    description: '字典类型',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 100,
    name: 'dict_type',
    comment: '字典类型',
    default: '',
    nullable: true
  })
  dictType: string

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
    default: null,
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
