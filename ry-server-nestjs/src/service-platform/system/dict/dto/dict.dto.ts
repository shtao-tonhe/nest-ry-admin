import { ApiProperty } from '@nestjs/swagger'

export class ListDTO {
  @ApiProperty({ description: '字典类型', required: false })
  dictType: string
  @ApiProperty({ description: '字典名称', required: false })
  dictName: string
  @ApiProperty({ description: '当前页', required: false })
  pageNum: number
  @ApiProperty({ description: '分页数量', required: false })
  pageSize: number
}

export class DataListDTO {
  @ApiProperty({ description: '字典类型', required: true })
  dictType: string
  @ApiProperty({ description: '字典标签', required: false })
  dictLabel: string
  @ApiProperty({ description: '当前页', required: false })
  pageNum: number
  @ApiProperty({ description: '分页数量', required: false })
  pageSize: number
}
