import { ApiProperty } from '@nestjs/swagger'

export class NoticeListDTO {
  @ApiProperty({ description: '公告标题', required: false })
  noticeTitle: string
  @ApiProperty({ description: '操作人员', required: false })
  createBy: string
  @ApiProperty({ description: '类型1通知2公共', required: false })
  noticeType: string
  @ApiProperty({ description: '当前页', required: false })
  pageNum: number
  @ApiProperty({ description: '分页数量', required: false })
  pageSize: number
}
