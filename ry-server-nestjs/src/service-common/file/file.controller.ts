import { Controller, Get, Post, Query, Req } from '@nestjs/common'
import { FileService } from './file.service'
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiConsumes,
  ApiBody,
  ApiProperty
} from '@nestjs/swagger'
import { ModelType } from 'src/shared/enums/ConfigParam'

@Controller('file')
@ApiBearerAuth()
@ApiTags('文件管理')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * 文件上传
   */
  @ApiOperation({
    summary: '文件上传'
  })
  @ApiBody({
    description: '文件',
    type: () => {
      class File {
        @ApiProperty({ type: 'string', format: 'binary' })
        file: any
      }
      return File
    }
  })
  @ApiConsumes('multipart/form-data')
  @Post('upload')
  async uploadFiles(@Req() req) {
    const file = await req.file()
    return await this.fileService.uploadFiles(file)
  }

  /**
   * 文件下载---返回public/static中的静态文件路径，从参数设置中读取路径前缀
   */
  @ApiOperation({
    summary: '文件下载'
  })
  @ApiQuery({
    name: 'type',
    description: '模板类型',
    required: true,
    enum: ModelType
  })
  @Get('/download/model')
  download(@Query() query: { type: ModelType }) {
    return this.fileService.downloadModel(query.type)
  }
}
