// @ts-nocheck
import { createApp } from 'vue'
import App from '@/App.vue'
import { setupStore } from '@/store'
import router from '@/router'

import 'element-plus/dist/index.css' // element plus
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/tailwind.css' // tailwindcss

// 解决浏览器[Violation] Added non-passive event listener to a scroll-blocking 'wheel' event. Consider marking警告问题
import 'default-passive-events'
// globalComponents
import registerGlobalComponents from '@/components/index'
// globalProperties
import installGlobalProperties from '@/globalProperties'
// directive
import directive from '@/directive'
// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/Base/SvgIcon/index.vue'
import elementIcons from '@/components/Base/SvgIcon/svgicon'

const setupAll = async () => {
  const app = createApp(App)

  await setupStore(app)

  app.use(router)
  // 注册全局属性
  app.use(installGlobalProperties)
  // 全局图标icon
  app.use(elementIcons)
  app.component('SvgIcon', SvgIcon)
  // 注册全局组件
  registerGlobalComponents(app)
  // 注册全局指令
  directive(app)

  app.mount('#app')
}

setupAll()
