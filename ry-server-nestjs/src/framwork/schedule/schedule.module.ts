import { Global, Module } from '@nestjs/common'
import { ScheduleOperateService } from './schedule.service'

@Global()
@Module({
  providers: [ScheduleOperateService],
  exports: [ScheduleOperateService]
})
export class ScheduleOperateModule {}
