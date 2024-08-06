import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { SysConfig } from 'src/entities/sys/sys_config'
import { SysDept } from 'src/entities/sys/sys_dept'
import { SysRole } from 'src/entities/sys/sys_role'
import { SysUser } from 'src/entities/sys/sys_user'
import { SysUserRole } from 'src/entities/sys/sys_user_role'
import { bcryptEncryption } from 'src/utils/crypto'
import { tansTypeOrmParams } from 'src/utils/tools'
import { Between, In } from 'typeorm'

@Injectable()
export class UserMapper {
  constructor(
    @InjectRepository(SysUser)
    private repository,
    @InjectEntityManager()
    private entityManager
  ) {}

  // 分页列表
  async getListMapper(query) {
    const {
      pageSize = 10,
      pageNum = 1,
      beginTime = '',
      endTime = '',
      deptId = '',
      ...params
    } = query
    // 将查询参数分别包裹处理
    const queryParams = tansTypeOrmParams(params, ['phonenumber'])
    // 处理时间搜索
    if (beginTime) {
      queryParams['createTime'] = Between(beginTime, endTime)
    }
    // 如果存在部门则查询部门以及其子部门
    if (deptId) {
      const deptInfo = await this.entityManager
        .createQueryBuilder(SysDept, 'SysDept')
        .where('SysDept.parentId = :parentId', { parentId: deptId })
        .getMany()
      const depts = [deptId, ...deptInfo.map((item) => item.deptId)]
      queryParams['deptId'] = In(depts)
    }
    // 创建查询
    const qb = await this.entityManager.createQueryBuilder(SysUser, 'SysUser')
    qb.select([
      'SysUser.userId',
      'SysUser.deptId',
      'SysUser.phonenumber',
      'SysUser.createTime',
      'SysUser.nickName',
      'SysUser.idCard',
      'SysUser.realName',
      'SysUser.status',
      'SysUser.email'
    ])
    qb.where(queryParams)
    qb.andWhere('SysUser.userId != :userId', { userId: '1' }) // 不查询超级管理员
    qb.orderBy(`SysUser.create_time`, 'DESC')
    qb.skip(pageSize * (pageNum - 1))
    qb.take(pageSize)
    const result = await qb.getMany()
    // 处理结果数据，补充用户部门和角色
    const rowsList = []
    for (let i = 0; i < result.length; i++) {
      const dept = result[i].deptId ? await this.getDeptDetail(result[i].deptId) : ''
      const roles = await this.userDetailRoleMapper(result[i].userId)
      rowsList.push({
        ...result[i],
        dept: dept,
        roles: roles
      })
    }
    return {
      rows: rowsList,
      total: await qb.getCount() // 总的数量
    }
  }

  // 获取部门详情
  async getDeptDetail(deptId) {
    return await this.entityManager
      .createQueryBuilder(SysDept, 'SysDept')
      .where('SysDept.deptId = :deptId', { deptId: deptId })
      .getOne()
  }

  // 获取用户对应的角色列表
  async userDetailRoleMapper(userId) {
    return await this.entityManager
      .createQueryBuilder(SysRole, 'SysRole')
      .leftJoin(SysUserRole, 'SysUserRole', 'SysUserRole.roleId = SysRole.roleId')
      .where('SysUserRole.userId = :userId', { userId: userId })
      .andWhere('SysRole.status = :status', { status: '0' })
      .getMany()
  }

  // 获取用户对应的用户信息
  async userDetailMapper(userId) {
    return await this.entityManager
      .createQueryBuilder(SysUser, 'SysUser')
      .select([
        'SysUser.userId',
        'SysUser.deptId',
        'SysUser.phonenumber',
        'SysUser.idCard',
        'SysUser.realName',
        'SysUser.status',
        'SysUser.email',
        'SysUser.nickName',
        'SysUser.remark',
        'SysUser.sex'
      ])
      .where('SysUser.userId = :userId', { userId: userId })
      .getOne()
  }

  // 用户新增
  async userAddMapper(userData) {
    // 检查账号是否存在
    const hasUser = await this.repository.findOne({ where: { phonenumber: userData.phonenumber } })
    if (!!hasUser) {
      throw new HttpException('账号已存在', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    userData.password = bcryptEncryption(userData.password)
    return await this.repository.save(userData)
  }

  // 用户导入
  async userImportAddMapper(userData) {
    return await this.entityManager
      .createQueryBuilder()
      .insert()
      .into(SysUser)
      .values(userData)
      .updateEntity(false) // 不更新实体
      .onConflict(`("phonenumber") DO NOTHING`) // phonenumber如果有相同数据存在，则不做任何操作，原数据保持不变
      .execute()
  }

  // 获取所有用户信息列表
  async userAll(query) {
    const { beginTime = '', endTime = '', ...params } = query
    // 将查询参数分别包裹处理
    const queryParams = tansTypeOrmParams(params)
    if (beginTime) {
      queryParams['createTime'] = Between(beginTime, endTime)
    }
    const qb = await this.entityManager.createQueryBuilder(SysUser, 'SysUser')
    qb.select([
      'SysUser.nickName',
      'SysUser.realName',
      'SysUser.idCard',
      'SysUser.email',
      'SysUser.phonenumber',
      'SysUser.avatar'
    ])
    qb.where(queryParams)
    qb.andWhere('SysUser.userId != :userId', { userId: '1' }) // 默认不查询超级管理员
    qb.orderBy(`SysUser.create_time`, 'DESC')
    return await qb.getMany()
  }

  // 用户编辑
  async userUpdateMapper(userData) {
    // 认定id为1的为超级管理员,禁止修改
    if (userData.userId == '1') {
      return false
    }
    return await this.repository.save(userData)
  }

  // 修改当前登录用户基本信息
  async userBaseUpdateMapper(userData) {
    await this.repository.save(userData)
  }

  // 用户删除
  async userDeleteMapper(id) {
    // 认定id为1的为超级管理员,禁止删除
    if (id == '1') {
      return false
    }
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(SysUser)
        .where('userId = :userId', { userId: id })
        .execute()

      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(SysUserRole)
        .where('userId = :userId', { userId: id })
        .execute()
    })
  }

  // 修改密码
  async resetPasswordMapper(password, userId) {
    const passwordT = bcryptEncryption(String(password))
    return await this.entityManager
      .createQueryBuilder()
      .update(SysUser)
      .set({
        password: passwordT
      })
      .where('userId = :userId', { userId: userId })
      .execute()
  }

  // 修改手机号
  async profileUpdatePhoneMapper(body, userId) {
    return await this.entityManager
      .createQueryBuilder()
      .update(SysUser)
      .set({
        phonenumber: body.newPhonenumber
      })
      .where('userId = :userId', { userId: userId })
      .execute()
  }

  // 用户分配角色
  async authRoleMapper(body) {
    await this.entityManager.transaction(async (transactionalEntityManager) => {
      // 先移除
      await transactionalEntityManager
        .createQueryBuilder()
        .delete()
        .from(SysUserRole)
        .where('userId = :userId', { userId: body.userId })
        .execute()
      // 后增加
      const roleData = body.roleIds.map((item) => {
        return {
          roleId: item,
          userId: body.userId
        }
      })
      await transactionalEntityManager
        .createQueryBuilder()
        .insert()
        .into(SysUserRole)
        .values(roleData)
        .execute()
    })
  }

  // 参数设置详情-根据键名查询
  async configDetailByConfigKeyMapper(configKey) {
    return await this.entityManager
      .createQueryBuilder(SysConfig, 'SysConfig')
      .where('SysConfig.configKey = :configKey', { configKey: configKey })
      .getOne()
  }

  // 修改用户头像
  async profileAvatarMapper(avatar, userId) {
    return await this.entityManager
      .createQueryBuilder()
      .update(SysUser)
      .set({
        avatar: avatar
      })
      .where('userId = :userId', { userId: userId })
      .execute()
  }

  // 获取部门列表
  async getDeptTree() {
    const qb = this.entityManager.createQueryBuilder(SysDept, 'SysDept')
    qb.where('SysDept.status = :status', { status: '0' })
    return await qb.getMany()
  }
}
