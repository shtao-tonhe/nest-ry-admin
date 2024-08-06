export interface MenuForm {
  menuId?: string
  parentId: string | number
  menuType: string
  icon: string
  menuName: string
  orderNum: number
  path: string
  component: string
  perms: string
  query: string
  isCache: number
  visible: string
  status: string
}
