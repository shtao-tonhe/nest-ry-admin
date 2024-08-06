import { ApiProperty } from '@nestjs/swagger'

export class LogininforListDto {
  @ApiProperty({ description: '登录ip地址', required: false })
  ipaddr: string
  @ApiProperty({ description: '用户账号（手机号）', required: false })
  userName: string
  @ApiProperty({ description: '开始时间YYYY-MM-dd', required: false })
  beginTime: string
  @ApiProperty({ description: '结束时间YYYY-MM-dd', required: false })
  endTime: string
  @ApiProperty({ description: '当前页', required: false })
  pageNum: number
  @ApiProperty({ description: '分页数量', required: false })
  pageSize: number
}
