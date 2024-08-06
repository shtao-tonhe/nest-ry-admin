import { Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { SysRole } from 'src/entities/sys/sys_role'
import { SysRoleMenu } from 'src/entities/sys/sys_role_menu'
import { AllocatedListDTO, UserRoleDTO } from './dto/role.dto'
import { SysUser } from 'src/entities/sys/sys_user'
import { SysUserRole } from 'src/entities/sys/sys_user_role'
import { tansTypeOrmParams } from 'src/utils/tools'
import { SysDept } from 'src/entities/sys/sys_dept'
import { SysRoleDept } from 'src/entities/sys/sys_role_dept'
import { In } from 'typeorm'
import { JWTUserInfo } from 'src/types/jwt'

@Injectable()
export class RoleMapper {
  constructor(
    @InjectRepository(SysRole)
    private repository,
    @InjectEntityManager()
    private entityManager
  ) {}
  // 角色列表
  async getListMapper(query, deptId) {
    const { pageSize = 10, pageNum = 1, ...params } = query
    // 将查询参数分别包裹处理
    const queryParams = tansTypeOrmParams(params)
    // 创建查询
    const qb = await this.entityManager.createQueryBuilder(SysRole, 'SysRole')
    if (deptId) {
      qb.leftJoin(SysRoleDept, 'SysRoleDept', 'SysRoleDept.roleId = SysRole.roleId').where(
        'SysRoleDept.deptId = :deptId',
        { deptId: deptId }
      )
    }
    qb.select([
      'SysRole.roleName',
      'SysRole.roleId',
      'SysRole.roleKey',
      'SysRole.status',
      'SysRole.roleSort',
      'SysRole.createTime',
      'SysRole.remark'
    ])
    qb.andWhere(queryParams)
    qb.skip(pageSize * (pageNum - 1))
    qb.take(pageSize)

    return {
      rows: await qb.getMany(),
      total: await qb.getCount() // 总的数量
    }
  }

  // 获取当前登录账号所有可用角色列表
  async getAllListMapper(deptId): Promise<Array<SysRole>> {
    const qb = await this.entityManager.createQueryBuilder(SysRole, 'SysRole')
    qb.select(['SysRole.roleName', 'SysRole.roleId'])
    // 如果存在部门id，则联查部门角色列表
    if (deptId) {
      qb.leftJoin(SysRoleDept, 'SysRoleDept', 'SysRoleDept.roleId = SysRole.roleId').where(
        'SysRoleDept.deptId = :deptId',
        { deptId: deptId }
      )
    }
    qb.andWhere('SysRole.roleId != :roleId', { roleId: '1' }) // 超级管理员角色不可分配
    return qb.getMany()
  }

  // 角色新增
  async addRoleMapper(role, MenuIds, deptId) {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      const roleInfo = await transactionalEntityManager.save(SysRole, role)
      const roleMenu: SysRoleMenu = MenuIds.map((element) => {
        return {
          roleId: roleInfo.roleId,
          menuId: element
        }
      })
      await transactionalEntityManager.save(SysRoleMenu, roleMenu)
      // 保存部门角色信息
      if (deptId) {
        const roleDeptObj = {
          roleId: roleInfo.roleId,
          deptId: deptId
        }
        await transactionalEntityManager.save(SysRoleDept, roleDeptObj)
      }
    })
  }

  // 角色详情
  async roleDetailMapper(id) {
    return await this.repository.findOne({
      where: { roleId: id }
    })
  }

  // 编辑角色
  async editRoleMapper(role, MenuIds: string[]) {
    // 认定id为1的为超级管理员,禁止修改
    if (role.roleId == '1') {
      return false
    }
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      // 修改角色信息表
      await transactionalEntityManager.save(SysRole, role)
      // 修改角色菜单关联表,先删后增
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(SysRoleMenu)
        .where('roleId = :roleId', { roleId: role.roleId })
        .execute()
      const roleMenu = MenuIds.map((element) => {
        return {
          roleId: role.roleId,
          menuId: element
        }
      })
      await transactionalEntityManager
        .createQueryBuilder()
        .insert()
        .into(SysRoleMenu)
        .values(roleMenu)
        .execute()
    })
  }

  // 删除角色
  async removeRoleMapper(id, deptId) {
    // 认定id为1的为超级管理员,禁止删除
    if (id == '1') {
      return false
    }
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      // 移除角色名称
      await transactionalEntityManager.delete(SysRole, id)
      // 移除角色菜单关联
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(SysRoleMenu)
        .where('roleId = :roleId', { roleId: id })
        .execute()
      // 移除角色部门关联
      const qb = await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(SysRoleDept)
        .where('roleId = :roleId', { roleId: id })
      if (deptId) {
        qb.where('roleId = :roleId', { roleId: id })
      }
      qb.execute()
      // 移除用户角色关联
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(SysUserRole)
        .where('roleId = :roleId', { roleId: id })
        .execute()
    })
  }

  // 获取指定角色已分配的用户列表
  async allocatedListMapper(query: AllocatedListDTO, deptId: string) {
    const { pageSize = 10, pageNum = 1, roleId = '', ...params } = query
    // 将查询参数分别包裹处理
    const queryParams = tansTypeOrmParams(params)
    const qb = await this.entityManager.createQueryBuilder(SysUser, 'SysUser')
    qb.leftJoin(SysUserRole, 'SysUserRole', 'SysUserRole.userId = SysUser.userId')
    qb.where('SysUserRole.roleId = :roleId', { roleId: roleId })
    qb.andWhere(queryParams)
    // 如果存在部门id则查该部门
    if (deptId) {
      qb.andWhere('SysUser.deptId = :deptId', { deptId: deptId })
    }
    qb.skip(pageSize * (pageNum - 1))
    qb.take(pageSize)
    return {
      rows: await qb.getMany(),
      total: await qb.getCount() // 总的数量
    }
  }

  // 取消指定用户在指定角色的授权
  async authUserCancelMapper(body: UserRoleDTO) {
    await this.entityManager
      .createQueryBuilder()
      .delete()
      .from(SysUserRole)
      .where('userId = :userId', { userId: body.userId })
      .andWhere('roleId = :roleId', { roleId: body.roleId })
      .execute()
  }

  // 获取指定角色未分配的用户列表，用于分配用户选择
  async authUserUnallocatedListMapper(query: AllocatedListDTO, user: JWTUserInfo, deptId: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pageSize = 10, pageNum = 1, roleId = '', ...params } = query
    // 将查询参数分别包裹处理
    const queryParams = tansTypeOrmParams(params, ['phonenumber'])
    // 创建查询
    const qb = await this.entityManager.createQueryBuilder(SysUser, 'SysUser')
    // 如果存在部门，则查询该部门以及其子部门的数据
    if (deptId) {
      const deptInfo = await this.entityManager
        .createQueryBuilder(SysDept, 'SysDept')
        .where('SysDept.parentId = :parentId', { parentId: deptId })
        .getMany()
      const depts = [deptId, ...deptInfo.map((item) => item.deptId)]
      queryParams['deptId'] = In(depts)
    }
    qb.where(queryParams)
    qb.andWhere('SysUser.userId NOT IN (:...userIds)', { userIds: ['1', user.userId] }) // 不查询超级管理员和当前账户
    qb.skip(pageSize * (pageNum - 1))
    qb.take(pageSize)
    return {
      rows: await qb.getMany(),
      total: await qb.getCount() // 总的数量
    }
  }

  // 角色分配选择用户
  async authUserSelectAllMapper(query) {
    // 查出该角色所有用户
    const roleInfo = await this.entityManager
      .createQueryBuilder(SysUserRole, 'SysUserRole')
      .where('SysUserRole.roleId = :roleId', { roleId: query.roleId })
      .getMany()
    const userIds = query?.userIds.split(',')
    // 对比消除已存在的用户
    const values = userIds
      .filter((item) => {
        return !roleInfo.some((item2) => {
          return item2.userId == item
        })
      })
      .map((item3) => {
        return {
          userId: item3,
          roleId: query.roleId
        }
      })
    await this.entityManager
      .createQueryBuilder()
      .insert()
      .into(SysUserRole)
      .values(values)
      .execute()
  }

  // 获取部门树列表
  async getDeptTree(roleId) {
    const qb = this.entityManager.createQueryBuilder(SysDept, 'SysDept')
    qb.select(['SysDept.deptId', 'SysDept.deptName', 'SysDept.parentId', 'SysDept.status'])
    if (roleId) {
      qb.leftJoin(SysRoleDept, 'SysRoleDept', 'SysRoleDept.deptId = SysDept.deptId')
      qb.where('SysRoleDept.roleId = :roleId', { roleId: roleId })
    }
    qb.andWhere('SysDept.status = :status', { status: '0' })
    return await qb.getMany()
  }

  // 角色分配数据权限
  async setDataScope(body) {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      // 修改角色部门关联表
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(SysRoleDept)
        .where('roleId = :roleId', { roleId: body.roleId })
        .execute()
      const depts: SysRoleDept = body.deptIds.map((element) => {
        return {
          roleId: body.roleId,
          deptId: element
        }
      })
      await transactionalEntityManager
        .createQueryBuilder()
        .insert()
        .into(SysRoleDept)
        .values(depts)
        .execute()
    })
  }
}
