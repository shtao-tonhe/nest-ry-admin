import { Module } from '@nestjs/common'
import { FileController } from './file.controller'
import { FileService } from './file.service'
import { FileMapper } from './file.mapper'

@Module({
  imports: [],
  controllers: [FileController],
  providers: [FileService, FileMapper]
})
export class FileModule {}
