const componentsRouter = [
  // 本地图标展示页面，通过 http://localhost:8081/show-icon 访问即可
  {
    path: '/show-icon',
    hidden: true,
    component: () => import('@/components/Base/SvgIcon/show.vue')
  }
]

// 注册示例展示组件
export function showComponentsRouter() {
  const env = import.meta.env.VITE_APP_ENV
  if (env === 'development') {
    return componentsRouter
  } else {
    return []
  }
}
