import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity } from 'typeorm'
/**
 * 用户和岗位关联表
 */
@Entity()
export class SysUserPost {
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
  userId: string

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
  postId: string
}
