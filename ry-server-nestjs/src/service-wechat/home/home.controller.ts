import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { HomeService } from './home.service'

@ApiTags('首页模块')
@ApiBearerAuth()
@Controller('home')
export class HomeController {
  constructor(private homeService: HomeService) {}

  @ApiOperation({
    summary: 'banner列表'
  })
  @Get('banner/list')
  bannerList() {
    return this.homeService.bannerList()
  }

  @ApiOperation({
    summary: '宫格列表'
  })
  @Get('grid/list')
  gridList() {
    return this.homeService.gridList()
  }

  @ApiOperation({
    summary: '推荐列表'
  })
  @Get('recommend/list')
  recommendList() {
    return this.homeService.recommendList()
  }
}
