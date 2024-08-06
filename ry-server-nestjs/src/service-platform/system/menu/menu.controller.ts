import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SysMenu } from 'src/entities/sys/sys_menu'
import { MenuListDTO } from './dto/menu.dto'
import { MenuService } from './menu.service'
import { JwtUser } from 'src/shared/decorators/user.decorator'
import { JWTUserInfo } from 'src/types/jwt'
import { Permission } from 'src/shared/enums/permissions'
import { RequirePermission } from 'src/shared/decorators/permissions.decorator'

@Controller('system/menu')
@ApiTags('菜单管理')
@ApiBearerAuth()
export class MenuController {
  constructor(private menuService: MenuService) {}

  @ApiOperation({
    summary: '菜单列表'
  })
  @ApiResponse({
    description: '菜单列表',
    type: [SysMenu]
  })
  @Get('list')
  @RequirePermission(Permission.SystemMenuList)
  list(@Query() query: MenuListDTO, @JwtUser() user: JWTUserInfo) {
    return this.menuService.getList(query, user)
  }

  @ApiOperation({
    summary: '菜单新增'
  })
  @Post('')
  @RequirePermission(Permission.SystemMenuAdd)
  addMenu(@Body() body: SysMenu, @JwtUser() user: JWTUserInfo) {
    return this.menuService.addMenu(body, user)
  }

  @ApiOperation({
    summary: '菜单编辑'
  })
  @Put('')
  @RequirePermission(Permission.SystemMenuEdit)
  updateMenu(@Body() body: SysMenu, @JwtUser() user: JWTUserInfo) {
    return this.menuService.updateMenu(body, user)
  }

  @ApiOperation({
    summary: '菜单详情'
  })
  @ApiResponse({
    description: '菜单详情',
    type: [SysMenu]
  })
  @ApiParam({ name: 'id', type: String, description: '菜单menuId', required: true })
  @Get('/detail/:id')
  @RequirePermission(Permission.SystemMenuList)
  getMenuDetail(@Param() params) {
    if (!params.id) {
      return false
    }
    return this.menuService.getMenuDetail(params.id)
  }

  @ApiOperation({
    summary: '删除菜单'
  })
  @ApiParam({ name: 'id', type: String, description: '菜单menuId', required: true })
  @Delete('/remove/:id')
  @RequirePermission(Permission.SystemMenuRemove)
  delMenu(@Param() params) {
    if (!params.id) {
      return false
    }
    return this.menuService.delMenu(params.id)
  }

  @ApiOperation({
    summary: '获取当前登录用户拥有角色对应的菜单树列表'
  })
  @Get('/treeselect')
  @RequirePermission(Permission.SystemMenuList, Permission.SystemRoleList)
  treeselect(@JwtUser() user: JWTUserInfo) {
    return this.menuService.treeselect(user)
  }

  @ApiOperation({
    summary: '根据角色id查询对应的菜单树列表'
  })
  @ApiParam({ name: 'id', type: String, description: '角色roleId', required: true })
  @Get('/roleMenuTreeselect/:id')
  @RequirePermission(Permission.SystemMenuList, Permission.SystemRoleList)
  roleMenuTreeselect(@Param() params) {
    if (!params.id) {
      return false
    }
    return this.menuService.roleMenuTreeselect(params.id)
  }
}
