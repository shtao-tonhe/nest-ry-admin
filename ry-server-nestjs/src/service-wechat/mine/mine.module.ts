import { Module } from '@nestjs/common'
import { MineService } from './mine.service'
import { MineController } from './mine.controller'

@Module({
  imports: [],
  controllers: [MineController],
  providers: [MineService]
})
export class MineModule {}
