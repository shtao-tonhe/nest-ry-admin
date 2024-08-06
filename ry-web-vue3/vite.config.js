import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import createVitePlugins from './vite/index'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_BASE_PATH,
    plugins: createVitePlugins(env, command === 'build'),
    resolve: {
      alias: {
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      // https://cn.vitejs.dev/config/#resolve-extensions
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    // vite 服务器相关配置
    server: {
      port: 8081,
      host: true,
      open: false,
      proxy: {
        // 请求跨域代理配置
        // '/proxyapi': {
        //   target: 'http://localhost:3001',
        //   changeOrigin: true,
        //   rewrite: (p) => p.replace(/^\/proxyapi/, '')
        // }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "./src/assets/styles/variables.scss";`,
          javascriptEnabled: true
        }
      }
    }
  }
})
