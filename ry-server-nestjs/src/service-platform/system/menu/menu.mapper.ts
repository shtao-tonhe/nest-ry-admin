import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { SysMenu } from 'src/entities/sys/sys_menu'
import { SysRoleMenu } from 'src/entities/sys/sys_role_menu'
import { SysUserRole } from 'src/entities/sys/sys_user_role'
import { JWTUserInfo } from 'src/types/jwt'

@Injectable()
export class MenuMapper {
  constructor(
    @InjectRepository(SysMenu)
    private repository,
    @InjectEntityManager()
    private entityManager
  ) {}
  // 菜单列表
  async menulistMapper(queryParams, user: JWTUserInfo) {
    if (user.userId == '1') {
      // 认定id为1的为超级管理员获取所有菜单权限
      return await this.entityManager
        .createQueryBuilder(SysMenu, 'SysMenu')
        .where(queryParams)
        .getMany()
    }
    // 查出当前用户拥有的菜单列表
    return await this.entityManager
      .createQueryBuilder(SysMenu, 'SysMenu')
      .leftJoin(SysRoleMenu, 'SysRoleMenu', 'SysRoleMenu.menuId = SysMenu.menuId')
      .leftJoin(SysUserRole, 'SysUserRole', 'SysUserRole.roleId = SysRoleMenu.roleId')
      .where(queryParams)
      .andWhere('SysUserRole.userId = :userId', { userId: user.userId })
      .getMany()
  }
  // 新增菜单
  async addMenuMapper(datas) {
    return await this.entityManager
      .createQueryBuilder()
      .insert()
      .into(SysMenu)
      .values(datas)
      .execute()
  }

  //编辑菜单
  async updateMenuMapper(datas, id) {
    return await this.entityManager
      .createQueryBuilder()
      .update(SysMenu)
      .set(datas)
      .where('menuId = :menuId', { menuId: id })
      .execute()
  }
  // 根据菜单id获取菜单详情
  async findOneMapper(id) {
    return await this.repository.findOne({
      where: { menuId: id }
    })
  }
  // 根据父菜单id获取详情
  async findParentOneMapper(id) {
    return await this.repository.findOne({
      where: { parentId: id }
    })
  }

  // 菜单删除
  async removeMenuMapper(id) {
    const findInfo = await this.findParentOneMapper(id)
    if (!findInfo) {
      return await this.entityManager
        .createQueryBuilder()
        .delete()
        .from(SysMenu)
        .where('menuId = :menuId', { menuId: id })
        .execute()
    } else {
      throw new HttpException(
        '删除失败,请检查是否存在子菜单未删除',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  // 根据用户id获取对应的菜单总数
  async treeListMapper(user): Promise<SysMenu[]> {
    if (user.userId == '1') {
      // 认定id为1的为超级管理员获取所有菜单权限
      return await this.entityManager
        .createQueryBuilder(SysMenu, 'SysMenu')
        .andWhere('SysMenu.status = :status', { status: '0' })
        .getMany()
    }
    // 查询当前用户所拥有的菜单列表
    return await this.entityManager
      .createQueryBuilder(SysMenu, 'SysMenu')
      .leftJoin(SysRoleMenu, 'SysRoleMenu', 'SysRoleMenu.menuId = SysMenu.menuId')
      .leftJoin(SysUserRole, 'SysUserRole', 'SysUserRole.roleId = SysRoleMenu.roleId')
      .where('SysUserRole.userId = :userId', { userId: user.userId })
      .getMany()
  }
  // 根据角色id获取对应菜单列表
  async roleMenuTreeselectMapper(roleId) {
    return await this.entityManager
      .createQueryBuilder(SysMenu, 'SysMenu')
      .leftJoin(SysRoleMenu, 'SysRoleMenu', 'SysRoleMenu.menuId = SysMenu.menuId')
      .where('SysRoleMenu.roleId = :roleId', { roleId: roleId })
      .getMany()
  }
}
