import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigParamType, ModelType } from 'src/shared/enums/ConfigParam'
import { FileMapper } from './file.mapper'
import { saveFileToLocal } from 'src/utils/fileTools'

@Injectable()
export class FileService {
  constructor(private fileMapper: FileMapper) {}

  /**
   * 静态模板文件下载
   */
  async downloadModel(type: ModelType): Promise<string> {
    const downloadConfig = await this.fileMapper.configDetailByConfigKeyMapper(
      ConfigParamType.LocalDownloadUrl
    )
    if (!downloadConfig) {
      throw new HttpException('请先配置参数设置模板内容', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return downloadConfig.configValue + '/public/static/' + type
  }

  /**
   * 文件上传方式(通常情况下上传的文件都会使用云文件服务器，因此这里需要做上传云的各种封装)
   */
  async uploadFiles(file): Promise<string> {
    return await saveFileToLocal(file)
  }

  /**
   * 上传至文件服务器的方法，如阿里云oss文件服务器
   */
  async uploadToTencentYun() {}
}
