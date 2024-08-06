import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import xlsx from 'node-xlsx'
import * as fs from 'fs'
import { join } from 'path'

/**
 * excel文件处理服务
 */
@Injectable()
export class ExcelService {
  /**
   * 读取excel文件内容
   * @param file 文件本身
   * @returns workSheetsFromBuffer [
      { name: 'Sheet1', data: [ [第一行数据], [第二行数据] ] },
      { name: 'Sheet2', data: [] }
    ]
   */
  async readExcel(file: any): Promise<Array<any>> {
    try {
      let buffer = await file.toBuffer()
      const workSheetsFromBuffer = await xlsx.parse(buffer) // 获取所有内容
      return workSheetsFromBuffer
    } catch {
      throw new HttpException('excel处理失败', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
   * 导出为excel
   */
  async exportExcel(fileName: string, title: Array<string>, data: Array<any>): Promise<void> {
    const datas = [title, ...data]
    try {
      const buffer = await xlsx.build([{ name: 'Sheet1', data: datas, options: {} }])
      // 生成的文件存储在本地
      const pathLocal = join(__dirname, '../../../../public', `${fileName}`)
      return fs.writeFileSync(pathLocal, buffer, { flag: 'w' })
    } catch {
      throw new HttpException('excel生成处理失败', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
