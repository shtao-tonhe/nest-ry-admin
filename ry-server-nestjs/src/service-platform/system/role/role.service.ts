import { Injectable } from '@nestjs/common'
import { RoleMapper } from './role.mapper'
import { AllocatedListDTO, ListDTO, RoleDTO, UserRoleDTO } from './dto/role.dto'
import { JWTUserInfo } from 'src/types/jwt'

import { SysRole } from 'src/entities/sys/sys_role'
import { UserInfoService } from 'src/framwork/tools-modules/userInfo/userInfo.service'
import { ToolsService } from 'src/framwork/providers/tools/tools.service'
import { SysDept } from 'src/entities/sys/sys_dept'

@Injectable()
export class RoleService {
  constructor(
    private roleMapper: RoleMapper,
    private userInfoService: UserInfoService,
    private toolsService: ToolsService
  ) {}
  /**
   * 分页列表
   */
  async getList(query: ListDTO, user) {
    const userInfoDept: SysDept = await this.userInfoService.getUserInfoDept(user)
    return await this.roleMapper.getListMapper(query, userInfoDept.deptId)
  }

  /**
   * 添加角色
   */
  async addRole(role: RoleDTO, user: JWTUserInfo) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { menuIds, menuCheckStrictly, roleId, ...params } = role
    const info = await this.userInfoService.getCreateInfo(user)
    const userInfoDept: SysDept = await this.userInfoService.getUserInfoDept(user)
    const roles = {
      ...params,
      ...info
    }
    return await this.roleMapper.addRoleMapper(roles, menuIds, userInfoDept.deptId)
  }

  /**
   * 角色详情
   */
  async getDetail(id): Promise<SysRole> {
    return await this.roleMapper.roleDetailMapper(id)
  }

  /**
   * 修改角色
   */
  async editRole(role: RoleDTO, user: JWTUserInfo) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { menuIds, menuCheckStrictly, ...params } = role
    const info = await this.userInfoService.getUpdateInfo(user)
    const roles = {
      ...params,
      ...info
    }
    return await this.roleMapper.editRoleMapper(roles, menuIds)
  }

  /**
   * 删除角色
   */
  async removeRole(id, user) {
    const userInfoDept: SysDept = await this.userInfoService.getUserInfoDept(user)
    return await this.roleMapper.removeRoleMapper(id, userInfoDept.deptId)
  }

  /**
   * 获取当前登录账号所有可用角色列表
   */
  async getAllList(user): Promise<Array<SysRole>> {
    const userInfoDept: SysDept = await this.userInfoService.getUserInfoDept(user)
    return await this.roleMapper.getAllListMapper(userInfoDept.deptId)
  }

  /**
   * 获取指定角色已分配的用户列表
   */
  async allocatedList(query: AllocatedListDTO, user) {
    const userInfoDept: SysDept = await this.userInfoService.getUserInfoDept(user)
    return await this.roleMapper.allocatedListMapper(query, userInfoDept.deptId)
  }

  /**
   * 取消指定用户在指定角色的授权
   */
  async authUserCancel(body: UserRoleDTO) {
    return await this.roleMapper.authUserCancelMapper(body)
  }

  /**
   * 获取指定角色未分配的用户列表，用于分配用户选择
   */
  async authUserUnallocatedList(query: AllocatedListDTO, user: JWTUserInfo) {
    const userInfoDept: SysDept = await this.userInfoService.getUserInfoDept(user)
    return await this.roleMapper.authUserUnallocatedListMapper(query, user, userInfoDept.deptId)
  }

  /**
   * 角色分配选择用户
   */
  async authUserSelectAll(query) {
    return await this.roleMapper.authUserSelectAllMapper(query)
  }

  // 获取部门树列表
  async getDeptTree(roleId, user) {
    const result = await this.roleMapper.getDeptTree(roleId)
    if (roleId) {
      return result
    }
    const userInfoDept: SysDept = await this.userInfoService.getUserInfoDept(user)
    if (userInfoDept.deptId) {
      const resTreeList = this.toolsService.arrayGetParentList('0', result, userInfoDept.deptId)
      return this.toolsService.recursionGenerateTree('0', resTreeList, {
        id: 'deptId',
        label: 'deptName'
      })
    }
    return this.toolsService.recursionGenerateTree('0', result, { id: 'deptId', label: 'deptName' })
  }

  // 角色分配数据权限
  async dataScope(body) {
    return await this.roleMapper.setDataScope(body)
  }
}
