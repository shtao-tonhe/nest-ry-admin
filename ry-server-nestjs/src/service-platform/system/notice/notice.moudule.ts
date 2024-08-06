import { Module } from '@nestjs/common'
import { NoticeService } from './notice.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NoticeMapper } from './notice.mapper'
import { NoticeController } from './notice.controller'
import { SysNotice } from 'src/entities/sys/sys_notice'

@Module({
  imports: [TypeOrmModule.forFeature([SysNotice])],
  providers: [NoticeService, NoticeMapper],
  controllers: [NoticeController]
})
export class NoticeModule {}
