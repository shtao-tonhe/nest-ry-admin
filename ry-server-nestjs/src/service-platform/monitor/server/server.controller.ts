import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ServerService } from './server.service'
import { Permission } from 'src/shared/enums/permissions'
import { RequirePermission } from 'src/shared/decorators/permissions.decorator'

@Controller('monitor/server')
@ApiTags('服务监控')
@ApiBearerAuth()
export class ServerController {
  constructor(private serverService: ServerService) {}
  @ApiOperation({
    summary: '服务监控信息'
  })
  @Get('')
  @RequirePermission(Permission.MonitorServerList)
  info() {
    return this.serverService.getInfo()
  }
}
