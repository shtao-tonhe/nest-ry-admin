import { monitorModules } from './monitor/monitor'
import { systemModules } from './system/system'

export const platformModules = [...systemModules, ...monitorModules]
