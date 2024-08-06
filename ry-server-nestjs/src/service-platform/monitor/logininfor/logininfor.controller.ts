import { Controller, Get, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { LogininforService } from './logininfor.service'
import { SysLogininfor } from 'src/entities/sys/sys_logininfor'
import { LogininforListDto } from './dto/logininfor.dto'

@Controller('monitor/logininfor')
@ApiTags('登录日志')
@ApiBearerAuth()
export class LogininforController {
  constructor(private logininforService: LogininforService) {}

  @ApiOperation({
    summary: '分页列表'
  })
  @ApiResponse({
    description: '任务列表',
    type: [SysLogininfor]
  })
  @Get('list')
  list(@Query() query: LogininforListDto) {
    return this.logininforService.getList(query)
  }
}
