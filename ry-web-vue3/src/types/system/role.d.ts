export interface RoleForm {
  roleId?: string | undefined
  roleName: string
  roleKey: string
  roleSort: number
  menuCheckStrictly: boolean
  menuIds?: Array<string>
  remark: string
  status: string
}
