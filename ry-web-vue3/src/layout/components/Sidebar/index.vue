<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar class="theme-dark" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#ffffff"
        :unique-opened="true"
        :active-text-color="theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(routes, index) in sidebarRouters"
          :key="routes.path + index"
          :item="routes"
          :base-path="routes.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import Logo from './Logo.vue'
import SidebarItem from './SidebarItem.vue'
import useAppStore from '@/store/modules/app'
import settings from '@/layout/components/Settings/index'
import usePermissionStore from '@/store/modules/permission'

const route = useRoute()
const appStore = useAppStore()
const settingsStore = settings
const permissionStore = usePermissionStore()

// 侧边栏路由
const sidebarRouters: any = computed(() => permissionStore.sidebarRouters)
// 是否显示logo
const showLogo = computed(() => settingsStore.sidebarLogo)
// 主题色
const theme = computed(() => settingsStore.theme)
// 侧边栏显隐控制
const isCollapse = computed(() => !appStore.sidebar.opened)
// 激活菜单
const activeMenu: any = computed(() => {
  const { meta, path } = route
  // if set path, the sidebar will highlight the path you set
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})
</script>
