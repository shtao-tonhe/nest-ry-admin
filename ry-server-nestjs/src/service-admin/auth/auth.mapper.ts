import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { SysRole } from 'src/entities/sys/sys_role'
import { SysUser } from 'src/entities/sys/sys_user'
import { SysUserRole } from 'src/entities/sys/sys_user_role'
import { JWTUserInfo } from 'src/types/jwt'
import { SysRoleMenu } from 'src/entities/sys/sys_role_menu'
import { SysMenu } from 'src/entities/sys/sys_menu'
import { SysLogininfor } from 'src/entities/sys/sys_logininfor'
import { SysUserVO } from 'src/types/admin/auth'
import { SysDept } from 'src/entities/sys/sys_dept'

@Injectable()
export class AuthMapper {
  constructor(
    @InjectRepository(SysUser)
    private repository,
    @InjectEntityManager()
    private entityManager
  ) {}

  // 用户账号信息
  async findUserMapper(phonenumber: string): Promise<SysUser> {
    return await this.repository.findOne({
      select: {
        userId: true,
        password: true
      },
      where: { phonenumber: phonenumber }
    })
  }

  // 获取部门详情
  async findDeptDetail(deptId) {
    return await this.entityManager
      .createQueryBuilder(SysDept, 'SysDept')
      .select([
        'SysDept.deptId',
        'SysDept.parentId',
        'SysDept.deptName',
        'SysDept.leader',
        'SysDept.phone',
        'SysDept.email'
      ])
      .where('SysDept.deptId = :deptId', { deptId: deptId })
      .andWhere('SysDept.status = :status', { status: '0' })
      .getOne()
  }

  // 写入登录日志
  async insertLogininfor(userData: object) {
    return await this.entityManager
      .createQueryBuilder()
      .insert()
      .into(SysLogininfor)
      .values(userData)
      .execute()
  }

  // 用户信息
  async findUserInfoMapper(user: JWTUserInfo): Promise<SysUserVO> {
    let userInfo = null // 用户信息
    let roles = null // 角色信息
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      userInfo = await transactionalEntityManager
        .createQueryBuilder(SysUser, 'SysUser')
        .select([
          'SysUser.avatar',
          'SysUser.userId',
          'SysUser.nickName',
          'SysUser.phonenumber',
          'SysUser.realName',
          'SysUser.deptId'
        ])
        .where('SysUser.userId = :userId', { userId: user.userId })
        .getOne()
      roles = await transactionalEntityManager
        .createQueryBuilder(SysRole, 'SysRole')
        .select(['SysRole.roleName', 'SysRole.roleKey', 'SysRole.roleId'])
        .leftJoin(SysUserRole, 'SysUserRole', 'SysUserRole.roleId = SysRole.roleId')
        .where('SysUserRole.userId = :userId', { userId: user.userId })
        .andWhere('SysRole.status = :status', { status: '0' }) // 开启状态
        .getMany()
    })
    return {
      ...userInfo,
      roles: roles
    }
  }

  // 用户角色信息
  async findUerRolesMapper(user: JWTUserInfo | SysUser): Promise<Array<SysRole>> {
    return await this.entityManager
      .createQueryBuilder(SysRole, 'SysRole')
      .select(['SysRole.roleName', 'SysRole.roleKey', 'SysRole.roleId'])
      .leftJoin(SysUserRole, 'SysUserRole', 'SysUserRole.roleId = SysRole.roleId')
      .where('SysUserRole.userId = :userId', { userId: user.userId })
      .andWhere('SysRole.status = :status', { status: '0' }) // 开启状态
      .getMany()
  }

  // 用户按钮权限信息
  async findUserPermissionsMapper(user: JWTUserInfo): Promise<SysMenu[]> {
    return await this.entityManager
      .createQueryBuilder(SysMenu, 'SysMenu')
      .select(['SysMenu.perms'])
      .leftJoin(SysRoleMenu, 'SysRoleMenu', 'SysRoleMenu.menuId = SysMenu.menuId')
      .leftJoin(SysUserRole, 'SysUserRole', 'SysUserRole.roleId = SysRoleMenu.roleId')
      .where('SysUserRole.userId = :userId', { userId: user.userId })
      .andWhere('SysMenu.menuType = :menuType', { menuType: 'F' }) // 按钮
      .andWhere('SysMenu.status = :status', { status: '0' }) // 开启状态
      .getMany()
  }

  // 用户路由信息
  async findRoutesMapper(user: JWTUserInfo): Promise<SysMenu[]> {
    // 认定id为1的为超级管理员获取所有菜单权限
    if (user.userId == '1') {
      return await this.entityManager
        .createQueryBuilder(SysMenu, 'SysMenu')
        .select([
          'SysMenu.menuId',
          'SysMenu.menuName',
          'SysMenu.parentId',
          'SysMenu.orderNum',
          'SysMenu.path',
          'SysMenu.component',
          'SysMenu.query',
          'SysMenu.isFrame',
          'SysMenu.isCache',
          'SysMenu.menuType',
          'SysMenu.visible',
          'SysMenu.perms',
          'SysMenu.icon'
        ])
        .andWhere('SysMenu.menuType != :menuType', { menuType: 'F' }) // 非按钮
        .andWhere('SysMenu.status = :status', { status: '0' }) // 开启状态
        .getMany()
    }
    // 联查当前用户拥有的角色对应的菜单信息
    return await this.entityManager
      .createQueryBuilder(SysMenu, 'SysMenu')
      .select([
        'SysMenu.menuId',
        'SysMenu.menuName',
        'SysMenu.parentId',
        'SysMenu.orderNum',
        'SysMenu.path',
        'SysMenu.component',
        'SysMenu.query',
        'SysMenu.isFrame',
        'SysMenu.isCache',
        'SysMenu.menuType',
        'SysMenu.visible',
        'SysMenu.perms',
        'SysMenu.icon'
      ])
      .leftJoin(SysRoleMenu, 'SysRoleMenu', 'SysRoleMenu.menuId = SysMenu.menuId')
      .leftJoin(SysUserRole, 'SysUserRole', 'SysUserRole.roleId = SysRoleMenu.roleId')
      .where('SysUserRole.userId = :userId', { userId: user.userId })
      .andWhere('SysMenu.menuType != :menuType', { menuType: 'F' }) // 非按钮
      .andWhere('SysMenu.status = :status', { status: '0' }) // 开启状态
      .getMany()
  }
}
