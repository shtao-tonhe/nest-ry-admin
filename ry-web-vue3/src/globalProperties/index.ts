import tab from './tab'
import cache from './cache'
import modal from './modal'
import { resetForm } from '@/utils/common/index'
import download from '@/utils/tools/download'

export default function installPlugins(app: any) {
  // 页签操作
  app.config.globalProperties.$tab = tab
  // 缓存对象 sessionStorage localStorage
  app.config.globalProperties.$cache = cache
  // 模态框对象
  app.config.globalProperties.$modal = modal
  // 全局方法挂载
  app.config.globalProperties.download = download
  app.config.globalProperties.resetForm = resetForm
}
