import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, Generated } from 'typeorm'

@Entity()
export class SysDictData {
  @ApiProperty({
    description: '字典编码',
    required: false
  })
  @Column({
    type: 'bigint',
    name: 'dict_code',
    comment: '字典编码',
    primary: true
  })
  @Generated('increment')
  dictCode: string

  @ApiProperty({
    description: '字典排序',
    required: false
  })
  @Column({
    type: 'int',
    name: 'dict_sort',
    comment: '字典排序',
    default: 0,
    nullable: true
  })
  dictSort: number

  @ApiProperty({
    description: '字典标签',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 100,
    name: 'dict_label',
    comment: '字典标签',
    default: '',
    nullable: true
  })
  dictLabel: string

  @ApiProperty({
    description: '字典键值',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 100,
    name: 'dict_value',
    comment: '字典键值',
    default: '',
    nullable: true
  })
  dictValue: string

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
    description: '样式属性（其他样式扩展）',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 100,
    name: 'css_class',
    comment: '样式属性（其他样式扩展）',
    default: null,
    nullable: true
  })
  cssClass: string

  @ApiProperty({
    description: '表格回显样式',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 100,
    name: 'list_class',
    comment: '表格回显样式',
    default: null,
    nullable: true
  })
  listClass: string

  @ApiProperty({
    description: '是否默认（Y是 N否）',
    required: false
  })
  @Column({
    type: 'char',
    length: 1,
    name: 'is_default',
    comment: '是否默认（Y是 N否）',
    default: 'N',
    nullable: true
  })
  isDefault: string

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
    description: '状态（0正常 1停用）',
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
