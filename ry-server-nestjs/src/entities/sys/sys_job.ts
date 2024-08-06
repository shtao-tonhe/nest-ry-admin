import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, Generated } from 'typeorm'

@Entity()
export class SysJob {
  @ApiProperty({
    description: '任务ID',
    required: false
  })
  @Column({
    type: 'bigint',
    name: 'job_id',
    comment: '任务ID',
    primary: true
  })
  @Generated('increment')
  jobId: string

  @ApiProperty({
    description: '任务名称',
    required: true
  })
  @Column({
    type: 'varchar',
    length: 64,
    name: 'job_name',
    comment: '任务名称',
    default: '',
    nullable: true
  })
  jobName: string

  @ApiProperty({
    description: '任务类型',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 64,
    name: 'job_type',
    comment: '任务类型',
    default: '',
    nullable: true
  })
  jobType: string

  @ApiProperty({
    description: '任务描述',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 255,
    name: 'job_describe',
    default: '',
    comment: '任务描述',
    nullable: true
  })
  jobDescribe: string

  @ApiProperty({
    description: 'cron执行表达式',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 255,
    name: 'cron_expression',
    comment: 'cron执行表达式',
    default: '',
    nullable: true
  })
  cronExpression: string

  @ApiProperty({
    description: '执行方式（1周期任务 2一次性任务）',
    required: false
  })
  @Column({
    type: 'char',
    length: 1,
    name: 'cron_type',
    comment: '执行方式（1周期任务 2一次性任务）',
    default: '1',
    nullable: true
  })
  cronType: string

  @ApiProperty({
    description: '执行间隔',
    required: false
  })
  @Column({
    type: 'varchar',
    length: 10,
    name: 'cron_interval',
    comment: '执行间隔',
    default: '',
    nullable: true
  })
  cronInterval: string

  @ApiProperty({
    description: '执行时间',
    required: false
  })
  @Column({
    type: 'datetime',
    name: 'cron_timeout',
    comment: '执行时间',
    nullable: true
  })
  cronTimeout: string

  @ApiProperty({
    description: '状态（0正常 1暂停）',
    required: false
  })
  @Column({
    type: 'char',
    length: 1,
    name: 'status',
    comment: '状态（0正常 1暂停）',
    default: '1',
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
