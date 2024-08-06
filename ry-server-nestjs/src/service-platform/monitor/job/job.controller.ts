import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { JobService } from './job.service'
import { SysJob } from 'src/entities/sys/sys_job'
import { ScheduleName } from 'src/shared/enums/schedule'
import { JobListDto, NameListDto } from './dto/job.dto'
import { RequirePermission } from 'src/shared/decorators/permissions.decorator'
import { Permission } from 'src/shared/enums/permissions'

@Controller('monitor/job')
@ApiTags('定时任务')
@ApiBearerAuth()
export class JobController {
  constructor(private jobService: JobService) {}

  @ApiOperation({
    summary: '调用名称列表'
  })
  @ApiResponse({
    description: '列表',
    type: [NameListDto]
  })
  @Get('/name/list')
  @RequirePermission(Permission.MonitorJobList)
  nameList() {
    const list = []
    for (const key in ScheduleName) {
      const obj = {
        name: ScheduleName[key].name,
        type: ScheduleName[key].type,
        initCron: ScheduleName[key].initCron,
        cronType: ScheduleName[key].cronType,
        jobDescribe: ScheduleName[key].jobDescribe
      }
      list.push(obj)
    }
    return list
  }

  @ApiOperation({
    summary: '分页列表'
  })
  @ApiResponse({
    description: '任务列表',
    type: [SysJob]
  })
  @Get('list')
  @RequirePermission(Permission.MonitorJobList)
  list(@Query() query: JobListDto) {
    return this.jobService.getList(query)
  }

  @ApiOperation({
    summary: '任务详情'
  })
  @ApiParam({ name: 'id', type: Number, description: '任务jobId', required: true })
  @ApiResponse({
    description: '任务详情',
    type: [SysJob]
  })
  @Get('/:id')
  @RequirePermission(Permission.MonitorJobList)
  detail(@Param() params) {
    if (!params.id) {
      return false
    }
    return this.jobService.getDetail(params.id)
  }

  @ApiOperation({
    summary: '任务新增'
  })
  @Post('')
  @RequirePermission(Permission.MonitorJobAdd)
  add(@Body() body: SysJob) {
    return this.jobService.addJob(body)
  }

  @ApiOperation({
    summary: '任务修改'
  })
  @Put('')
  @RequirePermission(Permission.MonitorJobEdit)
  update(@Body() body: SysJob) {
    return this.jobService.updateJob(body)
  }

  @ApiOperation({
    summary: '修改状态，启用禁用'
  })
  @Put('/changeStatus')
  @RequirePermission(Permission.MonitorJobStatus)
  changeStatus(@Body() body: SysJob) {
    return this.jobService.changeStatus(body)
  }

  @ApiOperation({
    summary: '立即运行一次'
  })
  @Put('/run')
  @RequirePermission(Permission.MonitorJobOnce)
  runOnce(@Body() body: SysJob) {
    return this.jobService.runOnce(body)
  }
}
