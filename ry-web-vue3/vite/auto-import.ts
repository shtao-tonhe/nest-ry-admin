import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 自动导入vue,vuerouter,pinia的语法
export default function createAutoImport() {
  return AutoImport({
    imports: [
      'vue',
      'vue-router',
      'pinia'
      // 可额外添加需要 autoImport 的组件...
    ],
    dts: 'src/types/auto-import.d.ts',
    resolvers: [ElementPlusResolver()]
  })
}
