import { ModelType } from '@/utils/tools/dict'
import request from '@/utils/tools/request'

// 获取下载模板文件
export function getModelType(params: { type: ModelType | string | undefined }) {
  return request({
    url: '/file/download/model',
    method: 'get',
    params
  })
}

// 上传文件
export function uploadFile(data: any) {
  return request({
    url: '/file/upload',
    method: 'post',
    data
  })
}
