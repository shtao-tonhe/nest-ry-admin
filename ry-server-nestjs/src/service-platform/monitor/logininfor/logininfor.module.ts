import { Module } from '@nestjs/common'
import { LogininforService } from './logininfor.service'
import { LogininforController } from './logininfor.controller'
import { LogininforMapper } from './logininfor.mapper'

@Module({
  imports: [],
  controllers: [LogininforController],
  providers: [LogininforService, LogininforMapper]
})
export class LogininforModule {}
