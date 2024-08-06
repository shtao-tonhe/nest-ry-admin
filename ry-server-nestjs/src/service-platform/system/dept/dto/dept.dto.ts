import { ApiProperty } from '@nestjs/swagger'

export class DeptListDTO {
  @ApiProperty({ description: '部门名称', required: false })
  deptName: string
  @ApiProperty({ description: '当前页', required: false })
  pageNum: number
  @ApiProperty({ description: '分页数量', required: false })
  pageSize: number
}
