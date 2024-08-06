import { Module } from '@nestjs/common'
import { JobController } from './job.controller'
import { JobService } from './job.service'
import { JobMapper } from './job.mapper'

@Module({
  imports: [],
  controllers: [JobController],
  providers: [JobService, JobMapper]
})
export class JobModule {}
