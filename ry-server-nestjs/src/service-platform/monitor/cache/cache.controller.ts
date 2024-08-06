import { Controller, Delete, Get, Param, Query } from '@nestjs/common'
import { CacheService } from './cache.service'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { RequirePermission } from 'src/shared/decorators/permissions.decorator'
import { Permission } from 'src/shared/enums/permissions'

@Controller('monitor/cache')
@ApiTags('缓存信息')
@ApiBearerAuth()
export class CacheController {
  constructor(private cacheService: CacheService) {}

  @ApiOperation({
    summary: '缓存监控信息'
  })
  @Get('')
  @RequirePermission(Permission.MonitorCacheList)
  getInfo() {
    return this.cacheService.getInfo()
  }

  @ApiOperation({
    summary: '缓存列表'
  })
  @Get('/getNames')
  @RequirePermission(Permission.MonitorCacheList)
  getNames() {
    return this.cacheService.getNames()
  }

  @ApiOperation({
    summary: '缓存键名列表'
  })
  @ApiParam({ name: 'cacheName', type: String, description: '缓存组名,如sysdict:', required: true })
  @Get('/getKeys/:cacheName')
  @RequirePermission(Permission.MonitorCacheList)
  getKeys(@Param() param, @Query() query) {
    if (!param.cacheName) {
      return false
    }
    return this.cacheService.getKeys(param.cacheName, query.searchValue)
  }

  @ApiOperation({
    summary: '查询缓存内容'
  })
  @ApiParam({
    name: 'cacheKey',
    type: String,
    description: '缓存键名,如sysdict:sys_notice_status',
    required: true
  })
  @Get('/getValue/:cacheKey')
  @RequirePermission(Permission.MonitorCacheList)
  getValue(@Param() param) {
    if (!param.cacheKey) {
      return false
    }
    return this.cacheService.getValue(param.cacheKey)
  }

  @ApiOperation({
    summary: '清理指定键名缓存'
  })
  @ApiParam({
    name: 'cacheKey',
    type: String,
    description: '缓存键名,如sysdict:sys_notice_status',
    required: true
  })
  @Delete('/clearCacheKey/:cacheKey')
  @RequirePermission(Permission.MonitorCacheList)
  clearCacheKey(@Param() param) {
    if (!param.cacheKey) {
      return false
    }
    return this.cacheService.clearCacheKey(param.cacheKey)
  }
}
