import { ApiProperty } from '@nestjs/swagger'

export class NameListDto {
  @ApiProperty({ description: '任务名称', required: false })
  name: string
  @ApiProperty({ description: '任务类型', required: false })
  type: string
}

export class JobListDto {
  @ApiProperty({ description: '任务名称', required: false })
  jobName: string
  @ApiProperty({ description: '当前页', required: false })
  pageNum: number
  @ApiProperty({ description: '分页数量', required: false })
  pageSize: number
}
