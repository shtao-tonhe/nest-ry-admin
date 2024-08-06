import { ApiProperty } from '@nestjs/swagger'

export class MenuListDTO {
  @ApiProperty({ description: '菜单名称', required: false })
  menuName: string
  @ApiProperty({ description: '状态(0正常1停用)', required: false })
  status: string
}
