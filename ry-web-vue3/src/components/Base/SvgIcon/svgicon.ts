// @ts-nocheck
// elementui 图标导入 使用：<el-icon><Plus /></el-icon>
import * as components from '@element-plus/icons-vue'
export default {
  install: (app) => {
    for (const key in components) {
      const componentConfig = components[key]
      app.component(componentConfig.name, componentConfig)
    }
  }
}
