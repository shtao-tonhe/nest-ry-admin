/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'element-plus/dist/locale/zh-cn.mjs'

declare type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

declare module 'js-cookie'
