<template>
  <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme }">
    <!-- 侧边栏 -->
    <Sidebar v-if="!sidebar.hide" class="sidebar-container" />
    <!-- 右边主体 -->
    <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }" class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <!-- 顶部菜单 -->
        <navbar />
        <!-- 视图标题行 -->
        <TagsView v-if="needTagsView" />
      </div>
      <!-- 中心页面内容 -->
      <app-main />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import Sidebar from './components/Sidebar/index.vue'
import { AppMain, Navbar, TagsView } from './components'

import useAppStore from '@/store/modules/app'
import settings from '@/layout/components/Settings/index'

const appStore = useAppStore()
const settingsStore = settings
const theme = computed(() => settingsStore.theme)
const sidebar = computed(() => appStore.sidebar)
const needTagsView = computed(() => settingsStore.tagsView)
const fixedHeader = computed(() => settingsStore.fixedHeader)

const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened
}))

// 实时获取当前的页面宽度
const { width } = useWindowSize()
// pc和移动页面的中介点宽度
const WIDTH = 992 // refer to Bootstrap's responsive design

// 判断并设置当前是PC还是移动端页面
watchEffect(() => {
  if (width.value - 1 < WIDTH) {
    appStore.toggleDevice('mobile')
  } else {
    appStore.toggleDevice('desktop')
  }
})
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  &::after {
    display: table;
    clear: both;
    content: '';
  }
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$base-sidebar-width});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
  width: 100%;
}
</style>
