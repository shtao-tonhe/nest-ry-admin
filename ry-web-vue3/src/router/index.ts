import { createWebHistory, createRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/plugins/cookie'
import { isHttp } from '@/utils/common/validate'
import { isRelogin } from '@/utils/tools/request'
import useUserStore from '@/store/modules/user'
import usePermissionStore from '@/store/modules/permission'
import useDictStore from '@/store/modules/dict'
/* Layout */
import Layout from '@/layout/index.vue'
import { showComponentsRouter } from '@/components/test'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [
  // 重定向
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  // 登录
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    hidden: true
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404.vue'),
    hidden: true
  },
  // 401
  {
    path: '/401',
    component: () => import('@/views/error/401.vue'),
    hidden: true
  },
  // 首页
  {
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/home/index.vue'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  // 个人信息中心
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: () => import('@/views/system/user/profile/index.vue'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  // 注册组件示例
  ...showComponentsRouter()
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [
  // 角色管理分配用户
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:allocation'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser.vue'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  }
]
// 路由创建
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由拦截
NProgress.configure({ showSpinner: false })
// 路由白名单
const whiteList = ['/login']
router.beforeEach((to, _from, next) => {
  NProgress.start()
  // 检查是否存在token
  if (getToken()) {
    // 存在token
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const dictStore = useDictStore()
      const permissionStore = usePermissionStore()
      const userStore = useUserStore()
      // 检查字典菜单是否加载完毕
      if (!dictStore.getIsSetDict) {
        dictStore.initDictMap()
        dictStore.setIsSetDict(true)
      }
      // 检查角色信息是否存在
      if (userStore.roles.length === 0) {
        isRelogin.show = true
        // 重新拉取用户信息数据
        userStore
          .getInfo()
          .then(() => {
            isRelogin.show = false
            // 重新拉取用户菜单列表
            permissionStore
              .generateRoutes()
              .then((accessRoutes: any) => {
                // 根据roles权限生成可访问的路由表
                accessRoutes.forEach((route: any) => {
                  if (!isHttp(route.path)) {
                    router.addRoute(route) // 动态添加可访问路由表
                  }
                })
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
              })
              .catch((err) => {
                userStore.logOut().then(() => {
                  ElMessage.error(err)
                  next({ path: '/' })
                })
              })
          })
          .catch((err) => {
            userStore.logOut().then(() => {
              ElMessage.error(err)
              next({ path: '/' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    // 不存在token，检查是否在白名单中
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})

export default router
