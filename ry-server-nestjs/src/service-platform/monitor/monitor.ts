import { CacheModule } from './cache/cache.module'
import { JobModule } from './job/job.module'
import { LogininforModule } from './logininfor/logininfor.module'
import { ServerModule } from './server/server.module'

export const monitorModules = [CacheModule, JobModule, ServerModule, LogininforModule]
