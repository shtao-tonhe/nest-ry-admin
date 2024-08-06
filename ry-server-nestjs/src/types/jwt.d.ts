import { Role } from 'src/shared/enums/roles'
export interface JWTUserInfo {
  userId: string // 用户id
  phonenumber?: string
  roles?: Array<Role>
}
