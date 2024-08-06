import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import {
  AuthRoleDTO,
  ListDTO,
  PasswordDTO,
  PhoneDTO,
  ResetPasswordDTO,
  UserAddDTO,
  UserUpdateDTO
} from './dto/user.dto'
import { JWTUserInfo } from 'src/types/jwt'
import { UserMapper } from './user.mapper'
import { bcryptCompare } from 'src/utils/crypto'
import { RedisConfigService } from 'src/framwork/redis/redis.config.service'
import { RedisNameList } from 'src/shared/enums/redis.name'
import { ConfigParamType } from 'src/shared/enums/ConfigParam'
import { ExcelService } from 'src/framwork/providers/excel/excel.service'
import { saveFileToLocal } from 'src/utils/fileTools'
import { UserInfoService } from 'src/framwork/tools-modules/userInfo/userInfo.service'
import { ToolsService } from 'src/framwork/providers/tools/tools.service'
import { SysDept } from 'src/entities/sys/sys_dept'

@Injectable()
export class UserService {
  constructor(
    private userMapper: UserMapper,
    private redisConfigService: RedisConfigService,
    private excelService: ExcelService,
    private userInfoService: UserInfoService,
    private toolsService: ToolsService
  ) {}
  /**
   * 获取列表
   * @returns
   */
  async getList(query: ListDTO, user: JWTUserInfo) {
    const userInfoDept: SysDept = await this.userInfoService.getUserInfoDept(user)
    const params = {
      ...query
    }
    if (userInfoDept.deptId) {
      params['deptId'] = userInfoDept.deptId
    } else {
      params['deptId'] = query.deptId
    }
    return await this.userMapper.getListMapper(params)
  }

  /**
   * 获取指定id用户的基本角色信息
   * @param user
   */
  async userDetail(userId, user: JWTUserInfo) {
    const roles = await this.userMapper.userDetailRoleMapper(userId ? userId : user.userId)
    const userInfo = await this.userMapper.userDetailMapper(userId ? userId : user.userId)
    const deptInfo = userInfo.deptId ? await this.userMapper.getDeptDetail(userInfo.deptId) : ''
    return {
      roles: roles,
      user: {
        ...userInfo,
        dept: deptInfo
      },
      roleIds: roles.map((item) => {
        return item.roleId
      })
    }
  }
  /**
   * 用户新增
   * @param userInfo
   */
  async userAdd(userInfo: UserAddDTO, user: JWTUserInfo) {
    const info = await this.userInfoService.getCreateInfo(user)
    const userData = {
      ...userInfo,
      ...info
    }
    if (!userData.deptId) delete userData.deptId
    if (userData.hasOwnProperty('userId')) delete userData['userId']
    console.log('user', userData)
    return await this.userMapper.userAddMapper(userData)
  }
  /**
   * 用户修改
   * @param userInfo
   */
  async userUpdate(userInfo: UserUpdateDTO, user: JWTUserInfo) {
    const info = await this.userInfoService.getUpdateInfo(user)
    const userData = {
      ...userInfo,
      ...info
    }
    if (userData.hasOwnProperty('phonenumber')) delete userData['phonenumber']
    if (userData.hasOwnProperty('password')) delete userData['password']
    console.log('userData', userData)
    return await this.userMapper.userUpdateMapper(userData)
  }

  /**
   * 修改当前登录用户基本信息
   */
  async userProfileUpdate(userInfo: UserAddDTO, user: JWTUserInfo) {
    const userData = {
      ...userInfo,
      userId: user.userId
    }
    console.log('userData', userData)
    return await this.userMapper.userBaseUpdateMapper(userData)
  }

  /**
   * 用户删除
   */
  async userDelete(id) {
    return await this.userMapper.userDeleteMapper(id)
  }

  /**
   * 重置密码
   */
  async resetPassword(body: ResetPasswordDTO) {
    const config = await this.userMapper.configDetailByConfigKeyMapper(ConfigParamType.InitPassword)
    await this.userMapper.resetPasswordMapper(config.configValue, body.userId)
    return `密码已重置为：${config.configValue}`
  }

  /**
   * 修改当前登录用户密码
   */
  async profileUpdatePwd(body: PasswordDTO, user: JWTUserInfo) {
    const userInfo = await this.userMapper.userDetailMapper(user.userId)
    if (!bcryptCompare(body.oldPassword, userInfo.password)) {
      throw new HttpException('旧密码错误！', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return await this.userMapper.resetPasswordMapper(body.newPassword, user.userId)
  }

  /**
   * 修改当前登录用户手机号
   */
  async profileUpdatePhone(body: PhoneDTO, user: JWTUserInfo) {
    const code = await this.redisConfigService.getRedis(RedisNameList.Sms + body.phonenumber)
    if (!code || code !== body.code) {
      throw new HttpException('验证码错误！', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return await this.userMapper.profileUpdatePhoneMapper(body, user.userId)
  }

  /**
   * 用户分配角色
   */
  async authRole(body: AuthRoleDTO) {
    return await this.userMapper.authRoleMapper(body)
  }

  /**
   * 用户导入，此处使用查询对比过滤出需新增的数据，数据过大时会比较慢
   */
  async userImport(file, user) {
    const excelInfo = await this.excelService.readExcel(file)
    // 当前是简单直接处理
    const sheet1Data = excelInfo[0].data
    const userAll = await this.userMapper.userAll({})
    const userData = []
    const info = await this.userInfoService.getCreateInfo(user)
    for (let i = 1; i < sheet1Data.length; i++) {
      const obj = {
        phonenumber: sheet1Data[i][0],
        email: sheet1Data[i][1],
        realName: sheet1Data[i][2],
        idCard: sheet1Data[i][3],
        nickName: sheet1Data[i][4],
        avatar: sheet1Data[i][5],
        ...info
      }
      userData.push(obj)
    }
    // 过滤出未存在的数据
    const result = userData.filter((item) => {
      return !userAll.some((item1) => item1.phonenumber == item.phonenumber)
    })
    return await this.userMapper.userImportAddMapper(Array.from(result))
  }

  /**
   * 用户导出
   */
  async userExport(req): Promise<string> {
    const userAll = await this.userMapper.userAll(req)
    const fileName = new Date().getTime() + '用户导出模板.xlsx'
    await this.excelService.exportExcel(
      fileName,
      ['用户昵称', '真实姓名', '身份证号', '用户邮箱', '手机号码', '头像地址'],
      userAll.map((item) => {
        return [
          item.nickName,
          item.realName,
          item.idCard,
          item.email,
          item.phonenumber,
          item.avatar
        ]
      })
    )
    const downloadConfig = await this.userMapper.configDetailByConfigKeyMapper(
      ConfigParamType.LocalDownloadUrl
    )
    const url = downloadConfig.configValue + '/public/' + fileName
    return url
  }

  /**
   * 头像修改
   */
  async profileAvatar(file, user): Promise<string> {
    const fileName = saveFileToLocal(file)
    const downloadConfig = await this.userMapper.configDetailByConfigKeyMapper(
      ConfigParamType.LocalDownloadUrl
    )
    const url = downloadConfig.configValue + '/public/' + fileName
    await this.userMapper.profileAvatarMapper(url, user.userId)
    return url
  }

  // 获取部门树列表
  async getDeptTree(user) {
    const result = await this.userMapper.getDeptTree()
    const userInfoDept: any = await this.userInfoService.getUserInfoDept(user)

    if (userInfoDept.deptId) {
      const resTreeList = this.toolsService.arrayGetParentList('0', result, userInfoDept.deptId)
      return this.toolsService.recursionGenerateTree('0', resTreeList, {
        id: 'deptId',
        label: 'deptName'
      })
    }
    return this.toolsService.recursionGenerateTree('0', result, {
      id: 'deptId',
      label: 'deptName'
    })
  }
}
