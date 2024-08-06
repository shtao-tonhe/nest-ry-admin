import { ApiProperty } from '@nestjs/swagger'

export class ConfigListDTO {
  @ApiProperty({ description: '参数键名', required: false })
  configKey: string
  @ApiProperty({ description: '参数名称', required: false })
  configName: string
  @ApiProperty({ description: '当前页', required: false })
  pageNum: number
  @ApiProperty({ description: '分页数量', required: false })
  pageSize: number
}
