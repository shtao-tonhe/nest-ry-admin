import { ApiProperty } from '@nestjs/swagger'

export class PostListDTO {
  @ApiProperty({ description: '岗位名称', required: false })
  postName: string
  @ApiProperty({ description: '当前页', required: false })
  pageNum: number
  @ApiProperty({ description: '分页数量', required: false })
  pageSize: number
}
