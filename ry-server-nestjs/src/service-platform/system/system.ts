import { ConfigParamModule } from './config/config.moudule'
import { DeptModule } from './dept/dept.moudule'
import { DictModule } from './dict/dict.moudule'
import { MenuModule } from './menu/menu.module'
import { NoticeModule } from './notice/notice.moudule'
import { PostModule } from './post/post.moudule'
import { RoleModule } from './role/role.module'
import { UserModule } from './user/user.module'

export const systemModules = [
  RoleModule,
  MenuModule,
  UserModule,
  DictModule,
  ConfigParamModule,
  NoticeModule,
  DeptModule,
  PostModule
]
