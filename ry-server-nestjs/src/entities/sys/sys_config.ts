import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, Generated } from 'typeorm'

@Entity()
export class SysConfig {
  @ApiProperty({
    description: '参数主键id',
    required: false
  })
  @Column({
    type: 'int',
    name: 'config_id',
    comment: '参数主键',
    primary: true
  })
  @Generated('increment')
  configId: string

  @ApiProperty({
    description: '参数名称',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'config_name',
    comment: '参数名称',
    default: ''
  })
  configName: string

  @ApiProperty({
    description: '参数键名',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'config_key',
    comment: '参数键名',
    default: ''
  })
  configKey: string

  @ApiProperty({
    description: '参数键值',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'config_value',
    comment: '参数键值',
    default: ''
  })
  configValue: string

  @ApiProperty({
    description: '系统内置（Y是 N否）',
    required: false
  })
  @Column({
    type: 'char',
    length: 1,
    nullable: true,
    name: 'config_type',
    comment: '系统内置（Y是 N否）',
    default: 'N'
  })
  configType: string

  @ApiProperty({
    description: '备注',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'remark',
    comment: '备注',
    default: null
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
