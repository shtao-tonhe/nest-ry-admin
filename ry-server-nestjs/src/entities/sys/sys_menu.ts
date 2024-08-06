import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, Generated } from 'typeorm'
/**
 * 菜单权限表
 */
@Entity()
export class SysMenu {
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
  @Generated('increment')
  menuId: string

  @ApiProperty({
    description: '菜单名称',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 50,
    name: 'menu_name',
    comment: '菜单名称',
    default: ''
  })
  menuName: string

  @ApiProperty({
    description: '父菜单ID',
    required: false
  })
  @Column({
    type: 'bigint',
    name: 'parent_id',
    comment: '父菜单ID',
    default: 0,
    nullable: true
  })
  parentId: number

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
    description: '路由地址',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 200,
    name: 'path',
    comment: '路由地址',
    default: '',
    nullable: true
  })
  path: string

  @ApiProperty({
    description: '组件路径',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 255,
    name: 'component',
    comment: '组件路径',
    default: null,
    nullable: true
  })
  component: string

  @ApiProperty({
    description: '路由参数',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 255,
    name: 'query',
    comment: '路由参数',
    default: null,
    nullable: true
  })
  query: string

  @ApiProperty({
    description: '是否为外链（0是 1否）',
    required: false
  })
  @Column({
    type: 'int',
    name: 'is_frame',
    comment: '是否为外链（0是 1否）',
    default: 1,
    nullable: true
  })
  isFrame: number

  @ApiProperty({
    description: '是否缓存（0缓存 1不缓存）',
    required: false
  })
  @Column({
    type: 'int',
    name: 'is_cache',
    comment: '是否缓存（0缓存 1不缓存）',
    default: 0,
    nullable: true
  })
  isCache: number

  @ApiProperty({
    description: '菜单类型（M目录 C菜单 F按钮）',
    required: false
  })
  @Column({
    type: 'char',
    length: 1,
    name: 'menu_type',
    comment: '菜单类型（M目录 C菜单 F按钮）',
    default: '',
    nullable: true
  })
  menuType: string

  @ApiProperty({
    description: '显示状态（0显示 1隐藏）',
    required: false
  })
  @Column({
    type: 'char',
    length: 1,
    name: 'visible',
    comment: '显示状态（0显示 1隐藏）',
    default: '0',
    nullable: true
  })
  visible: string

  @ApiProperty({
    description: '菜单状态（0正常 1停用）',
    required: false
  })
  @Column({
    type: 'char',
    length: 1,
    name: 'status',
    comment: '菜单状态（0正常 1停用）',
    default: '0',
    nullable: true
  })
  status: string

  @ApiProperty({
    description: '权限标识',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 100,
    name: 'perms',
    comment: '权限标识',
    default: null,
    nullable: true
  })
  perms: string

  @ApiProperty({
    description: '菜单图标',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 100,
    name: 'icon',
    comment: '菜单图标',
    default: '',
    nullable: true
  })
  icon: string

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
