import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// 自动导入组件功能
export default function createAutoComponents() {
  return Components({
    // 要搜索组件的目录的相对路径
    dirs: ['src'],
    // 组件的有效文件扩展名
    extensions: ['vue'],
    // 搜索子目录
    deep: true,
    include: [/\.vue$/, /\.vue\?vue/],
    // 生成自定义全局声明
    dts: 'src/types/auto-components.d.ts',
    // 自定义组件的解析器
    resolvers: [ElementPlusResolver()],
    exclude: [/[\\/]node_modules[\\/]/]
  })
}
