import { openWindow } from '@/utils/common/index'
/**
 * 下载blob流形式的文件
 * @param data 流文件
 * @param fileName 文件名
 * @param mineType 文件类型
 */
const downloadBlob = (data: any, fileName: string, mineType: string) => {
  // 创建 blob
  const blob = new Blob([data], { type: mineType })
  // 创建 href 超链接，点击进行下载
  window.URL = window.URL || window.webkitURL
  const href = URL.createObjectURL(blob)
  const downA = document.createElement('a')
  downA.href = href
  downA.download = fileName
  downA.click()
  // 销毁超连接
  window.URL.revokeObjectURL(href)
}

const downloadByUrl = ({
  url,
  fileName,
  target = '_blank'
}: {
  url: string
  target?: '_self' | '_blank' | string
  fileName?: string
}): boolean => {
  const isChrome = window.navigator.userAgent.toLowerCase().indexOf('chrome') > -1
  const isSafari = window.navigator.userAgent.toLowerCase().indexOf('safari') > -1

  if (/(iP)/g.test(window.navigator.userAgent)) {
    console.error('Your browser does not support download!')
    return false
  }
  if (isChrome || isSafari) {
    const link = document.createElement('a')
    link.href = url
    link.target = target
    if (link.download !== undefined) {
      link.download = fileName || url.substring(url.lastIndexOf('/') + 1, url.length)
    }

    if (document.createEvent) {
      const e = document.createEvent('MouseEvents')
      e.initEvent('click', true, true)
      link.dispatchEvent(e)
      return true
    }
  }
  if (url.indexOf('?') === -1) {
    url += '?download'
  }

  openWindow(url, { target })
  return true
}
/**
 * 统一的通用文件下载工具方法
 */
const download = {
  // 下载 Excel 方法
  excel: (data: any, fileName: string) => {
    downloadBlob(data, fileName, 'application/vnd.ms-excel')
  },
  // 下载 Word 方法
  word: (data: any, fileName: string) => {
    downloadBlob(data, fileName, 'application/msword')
  },
  // 下载 Zip 方法
  zip: (data: any, fileName: string) => {
    downloadBlob(data, fileName, 'application/zip')
  },
  // 下载 Html 方法
  html: (data: any, fileName: string) => {
    downloadBlob(data, fileName, 'text/html')
  },
  // 下载 Markdown 方法
  markdown: (data: any, fileName: string) => {
    downloadBlob(data, fileName, 'text/markdown')
  },
  // 下载 url 方式
  downloadByUrl: (url: string, fileName?: string, target?: string) => {
    downloadByUrl({ url: url, fileName: fileName, target: target })
  }
}

export default download
