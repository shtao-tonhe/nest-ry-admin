import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, Generated } from 'typeorm'

@Entity()
export class SysLogininfor {
  @ApiProperty({
    description: '访问ID',
    required: false
  })
  @Column({
    type: 'bigint',
    name: 'info_id',
    comment: '访问ID',
    primary: true
  })
  @Generated('increment')
  infoId: string

  @ApiProperty({
    description: '用户账号（手机号）',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 50,
    name: 'user_name',
    comment: '用户账号（手机号）',
    default: ''
  })
  userName: string

  @ApiProperty({
    description: '登录IP地址',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 128,
    name: 'ipaddr',
    comment: '登录IP地址',
    default: ''
  })
  ipaddr: string

  @ApiProperty({
    description: '登录地点',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 255,
    name: 'login_location',
    comment: '登录地点',
    default: ''
  })
  loginLocation: string

  @ApiProperty({
    description: '浏览器信息',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 255,
    name: 'user_agent',
    comment: '浏览器信息',
    default: ''
  })
  userAgent: string

  @ApiProperty({
    description: '操作系统',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 50,
    name: 'os',
    comment: '操作系统',
    default: ''
  })
  os: string

  @ApiProperty({
    description: '登录状态（0成功 1失败）',
    required: false
  })
  @Column({
    type: 'char',
    length: 1,
    name: 'status',
    comment: '登录状态（0成功 1失败）',
    default: '0'
  })
  status: string

  @ApiProperty({
    description: '登录状态（0成功 1失败）',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 255,
    name: 'msg',
    comment: '提示消息',
    default: ''
  })
  msg: string

  @ApiProperty({
    description: '访问时间',
    required: false
  })
  @Column({
    name: 'login_time',
    type: 'datetime',
    nullable: true,
    comment: '访问时间',
    default: () => 'NOW()'
  })
  loginTime: Date
}
