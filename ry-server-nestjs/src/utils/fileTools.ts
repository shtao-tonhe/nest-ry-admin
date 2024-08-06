import { join } from 'path'
import * as fs from 'fs'

/**
 * 保存文件至本地public文件夹
 * @param file 文件流
 * @returns 文件名称
 */
export function saveFileToLocal(file: any, fileType?: string): string {
  const fileUrl = '../../public' // 文件路径
  let fileName = ''
  if (file.filename.lastIndexOf('.') > 0) {
    fileName = new Date().getTime() + file.filename
  } else {
    const type = file.mimetype.split('/')
    if (type.length) {
      fileName = new Date().getTime() + file.filename + '.' + type[1]
    } else if (fileType) {
      fileName = new Date().getTime() + fileType
    } else {
    }
  }
  const urlPath = join(__dirname, fileUrl, `${fileName}`)
  const writeStream = fs.createWriteStream(urlPath)
  file.file.pipe(writeStream)
  return fileName
}

/**
 * 移除本地public文件夹文件
 * @param fileName 文件名称
 */
export function removeLocalFile(fileName) {
  setTimeout(() => {
    const fileUrl = '../../public' // 文件路径
    const urlPath = join(__dirname, fileUrl, `${fileName}`)
    fs.unlinkSync(urlPath)
  }, 3000)
}
