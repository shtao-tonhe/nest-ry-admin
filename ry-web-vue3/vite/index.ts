import vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'

import createAutoImport from './auto-import'
import createSvgIcon from './svg-icon'
import createCompression from './compression'
import createAutoComponents from './auto-components'

export default function createVitePlugins(viteEnv: any, isBuild = false) {
  const vitePlugins = [vue(), VueJsx()]
  // unplugin-auto-import
  vitePlugins.push(createAutoImport())
  // unplugin-vue-components
  vitePlugins.push(createAutoComponents())
  // vite-plugin-svg-icons
  vitePlugins.push(createSvgIcon(isBuild))
  // vite-plugin-compression
  isBuild && vitePlugins.push(...createCompression(viteEnv))
  return vitePlugins
}
