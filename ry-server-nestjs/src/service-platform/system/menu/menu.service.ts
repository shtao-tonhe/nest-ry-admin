import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { MenuListDTO } from './dto/menu.dto'
import { SysMenu } from 'src/entities/sys/sys_menu'
import { JWTUserInfo } from 'src/types/jwt'
import { MenuMapper } from './menu.mapper'
import { tansTypeOrmParams } from 'src/utils/tools'
import { UserInfoService } from 'src/framwork/tools-modules/userInfo/userInfo.service'
import { ToolsService } from 'src/framwork/providers/tools/tools.service'

@Injectable()
export class MenuService {
  constructor(
    private menuMapper: MenuMapper,
    private userInfoService: UserInfoService,
    private toolsService: ToolsService
  ) {}
  /**
   * 获取菜单列表
   */
  async getList(query: MenuListDTO, user: JWTUserInfo) {
    const { ...params } = query
    const queryParams = tansTypeOrmParams(params)
    return await this.menuMapper.menulistMapper(queryParams, user)
  }
  /**
   * 菜单新增
   */
  async addMenu(body: SysMenu, user: JWTUserInfo) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { menuId = '', ...params } = body
    // 按钮菜单无法新增子菜单
    const menuInfo = await this.menuMapper.findOneMapper(body.parentId)
    if (menuInfo && menuInfo.menuType === 'F') {
      throw new HttpException('上级菜单不能为按钮', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    const info = await this.userInfoService.getCreateInfo(user)
    return await this.menuMapper.addMenuMapper({
      ...params,
      ...info
    })
  }
  /**
   * 菜单编辑
   */
  async updateMenu(body: SysMenu, user: JWTUserInfo) {
    const { menuId = '', ...params } = body
    const info = await this.userInfoService.getUpdateInfo(user)
    return await this.menuMapper.updateMenuMapper({ ...params, ...info }, menuId)
  }
  /**
   * 获取菜单详情
   */
  async getMenuDetail(id): Promise<SysMenu> {
    return await this.menuMapper.findOneMapper(id)
  }
  /**
   * 删除菜单
   */
  async delMenu(id) {
    return await this.menuMapper.removeMenuMapper(id)
  }

  /**
   * 获取用户对应的菜单列表
   */
  async treeselect(user): Promise<Array<{ id: string; label: string }>> {
    const result = await this.menuMapper.treeListMapper(user)
    return this.toolsService.recursionGenerateTree('0', result, { id: 'menuId', label: 'menuName' })
  }

  /**
   * 根据角色id查询对应的菜单列表
   */
  async roleMenuTreeselect(roleId) {
    return await this.menuMapper.roleMenuTreeselectMapper(roleId)
  }
}
