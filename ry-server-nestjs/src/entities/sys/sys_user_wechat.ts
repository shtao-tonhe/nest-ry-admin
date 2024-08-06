import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, Generated, Index } from 'typeorm'
/**
 * 用户信息表
 */
@Entity()
@Index(['wxOpenId'])
@Index(['phonenumber'], { unique: true })
export class SysUserWechat {
  @ApiProperty({
    description: '用户ID',
    required: false
  })
  @Column({
    type: 'bigint',
    name: 'user_id',
    comment: '用户ID',
    primary: true
  })
  @Generated('increment')
  userId: string

  @ApiProperty({
    description: '微信openid',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 32,
    name: 'wx_open_id',
    comment: '微信openid',
    default: ''
  })
  wxOpenId: string

  @ApiProperty({
    description: '手机号码',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 11,
    name: 'phonenumber',
    comment: '手机号码',
    default: ''
  })
  phonenumber: string

  @ApiProperty({
    description: '用户性别（0男 1女 2未知）',
    required: false
  })
  @Column({
    type: 'char',
    length: 1,
    name: 'sex',
    comment: '用户性别（0男 1女 2未知）',
    default: '2'
  })
  sex: string

  @ApiProperty({
    description: '帐号状态（0正常 1停用）',
    required: false
  })
  @Column({
    type: 'char',
    length: 1,
    name: 'status',
    comment: '帐号状态（0正常 1停用）',
    default: '0'
  })
  status: string

  @ApiProperty({
    description: '用户昵称',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 32,
    name: 'nick_name',
    comment: '用户昵称',
    default: '默认用户'
  })
  nickName: string

  @ApiProperty({
    description: '头像地址',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 255,
    name: 'avatar',
    comment: '头像地址',
    default: ''
  })
  avatar: string

  @ApiProperty({
    description: '删除标志（0代表存在 1代表删除）',
    required: false
  })
  @Column({
    type: 'char',
    length: 1,
    name: 'del_flag',
    comment: '删除标志（0代表存在 1代表删除）',
    default: '0'
  })
  delFlag: string

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
