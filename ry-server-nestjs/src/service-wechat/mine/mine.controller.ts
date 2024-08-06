import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { MineService } from './mine.service'

@ApiTags('我的模块')
@ApiBearerAuth()
@Controller('mine')
export class MineController {
  constructor(private mineService: MineService) {}

  @ApiOperation({
    summary: '个人列表'
  })
  @Get('list')
  list() {
    return this.mineService.list()
  }
}
