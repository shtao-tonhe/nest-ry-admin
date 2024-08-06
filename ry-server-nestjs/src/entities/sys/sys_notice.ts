import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, Generated } from 'typeorm'

@Entity()
export class SysNotice {
  @ApiProperty({
    description: '公告ID',
    required: false
  })
  @Column({
    type: 'int',
    name: 'notice_id',
    comment: '公告ID',
    primary: true
  })
  @Generated('increment')
  noticeId: string

  @ApiProperty({
    description: '公告标题',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 50,
    name: 'notice_title',
    comment: '公告标题',
    default: ''
  })
  noticeTitle: string

  @ApiProperty({
    description: '公告类型（1通知 2公告）',
    required: false
  })
  @Column({
    type: 'char',
    length: 1,
    name: 'notice_type',
    comment: '公告类型（1通知 2公告）',
    default: ''
  })
  noticeType: string

  @ApiProperty({
    description: '公告内容',
    required: false
  })
  @Column({
    type: 'text',
    name: 'notice_content',
    comment: '公告内容',
    nullable: true
  })
  noticeContent: string

  @ApiProperty({
    description: '公告状态（0正常 1关闭）',
    required: false
  })
  @Column({
    type: 'char',
    length: 1,
    name: 'status',
    comment: '公告状态（0正常 1关闭）',
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
    length: 255,
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
