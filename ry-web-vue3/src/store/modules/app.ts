const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: {
      // 侧边栏控制状态
      opened: true,
      hide: false
    },
    device: 'desktop' // 页面是PC还是移动
  }),
  actions: {
    toggleSideBar() {
      if (this.sidebar.hide) {
        return false
      }
      this.sidebar.opened = !this.sidebar.opened
    },
    toggleDevice(device: string) {
      this.device = device
    },
    toggleSideBarHide(status: boolean) {
      this.sidebar.hide = status
    }
  }
})

export default useAppStore
