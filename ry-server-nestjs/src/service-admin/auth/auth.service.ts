import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { LoginDto } from './dto/auth.dto'
import { RSADecrypt, bcryptCompare } from 'src/utils/crypto'
import { ConfigService } from '@nestjs/config'
import { SysMenu } from 'src/entities/sys/sys_menu'
import { JWTUserInfo } from 'src/types/jwt'
import { JwtUseService } from 'src/framwork/jwt/jwt.use.service'
import { AuthMapper } from './auth.mapper'
import { RedisConfigService } from 'src/framwork/redis/redis.config.service'
import { RedisNameList } from 'src/shared/enums/redis.name'
import { SysUser } from 'src/entities/sys/sys_user'
import { TreeRouterVO, UserInfoVO } from 'src/types/admin/auth'
import { getReqMainInfo } from 'src/utils/tools'

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtUseService: JwtUseService,
    private authMapper: AuthMapper,
    private redisConfigService: RedisConfigService
  ) { }
  /**
   * 登录
   */
  async login(signInDto: LoginDto, req): Promise<string> {
    // 登录前置校验
    const user = await this.loginPreCheck(signInDto, req)
    // 角色信息
    const roles = await this.authMapper.findUerRolesMapper(user)
    if (roles.length === 0) {
      throw new HttpException('无登录权限', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    const payload: JWTUserInfo = {
      userId: user.userId
    }
    // 登录日志
    this.insetLogininfor(req, {
      phonenumber: signInDto.phonenumber,
      msg: '登录成功',
      status: '0'
    })
    return this.jwtUseService.createJwtToken(payload)
  }

  // 写入登录日志
  async insetLogininfor(
    req,
    obj: {
      phonenumber: string
      status?: string
      msg?: string
    } = { phonenumber: '', status: '0', msg: '登录成功' }
  ) {
    const { ip } = getReqMainInfo(req)
    const userAgent = req.headers['user-agent']
    const loginData = {
      userName: obj.phonenumber,
      ipaddr: ip,
      userAgent: userAgent,
      msg: obj.msg,
      status: obj.status,
      loginTime: new Date()
    }
    await this.authMapper.insertLogininfor(loginData)
  }

  /**
   * 登录前置校验
   * @param username 用户名
   * @param password 用户密码
   */
  async loginPreCheck(signInDto: LoginDto, req): Promise<SysUser> {
    if (!signInDto.key || signInDto.key !== this.configService.get('RSAPublicKey')) {
      // 登录日志
      this.insetLogininfor(req, {
        phonenumber: signInDto.phonenumber,
        msg: '公钥错误,请刷新页面后重试',
        status: '1'
      })
      throw new HttpException('公钥错误,请刷新页面后重试', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    const user = await this.authMapper.findUserMapper(signInDto.phonenumber)
    const password = RSADecrypt(signInDto.password, this.configService.get('RSAPrivateKey'))
    if (!user || !bcryptCompare(password, user.password)) {
      // 登录日志
      this.insetLogininfor(req, {
        phonenumber: signInDto.phonenumber,
        msg: '账号或密码错误！',
        status: '1'
      })
      throw new HttpException('账号或密码错误！', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return user
  }
  /**
   * 退出登录
   */
  async logout(user: JWTUserInfo): Promise<string> {
    // 退出操作...
    this.redisConfigService.delRedis(RedisNameList.UserInfo + user.userId)
    this.redisConfigService.delRedis(RedisNameList.UserInfoDept + user.userId)
    this.redisConfigService.delRedis(RedisNameList.UserInfoPerm + user.userId)
    return `${user.userId}退出成功`
  }

  /**
   * 获取当前登录账号信息
   * @param user jwt个人信息
   */
  async getInfo(user: JWTUserInfo): Promise<UserInfoVO> {
    // 用户信息
    const userInfo = await this.authMapper.findUserInfoMapper(user)
    const dept = userInfo.deptId ? await this.authMapper.findDeptDetail(userInfo.deptId) : ''
    // 角色信息
    const roles = await this.authMapper.findUerRolesMapper(user)
    // 按钮权限信息
    let resultPermissions = []
    // 认定id为1的为超级管理员有所有按钮权限
    if (user.userId == '1') {
      resultPermissions = ['*:*:*']
    } else {
      const permissionsMapper = await this.authMapper.findUserPermissionsMapper(user)
      resultPermissions = permissionsMapper.map((item) => item.perms)
    }
    // redis缓存登录账号的数据,设置redis时间与token过期一致 1d
    const resultRoles = roles.map((item) => item.roleKey)
    // 基础用户信息
    this.redisConfigService.hsetRedis(
      RedisNameList.UserInfo + userInfo.userId,
      {
        userInfo: userInfo
      },
      24 * 60 * 60
    )
    // 登录用户权限
    const dataToStore = {
      permissions: resultPermissions,
      roles: resultRoles
    }
    // 检查 resultPermissions 和 resultRoles 是否为对象
    if (typeof resultPermissions === 'object' && typeof resultRoles === 'object') {
      console.log('=============permissions and roles are valid objects')
    }
    this.redisConfigService.hsetRedis(
      RedisNameList.UserInfoPerm + userInfo.userId,
      dataToStore,
      24 * 60 * 60
    )
    // 用户部门信息
    if (dept) {
      this.redisConfigService.hsetRedis(
        RedisNameList.UserInfoDept + userInfo.userId,
        {
          dept: dept
        },
        24 * 60 * 60
      )
    }
    return {
      user: userInfo,
      roles: resultRoles,
      permissions: resultPermissions
    }
  }

  /**
   * 获取当前登录账号的路由信息
   * @param user
   */
  async getRouters(user: JWTUserInfo): Promise<TreeRouterVO[]> {
    const routes: SysMenu[] = await this.authMapper.findRoutesMapper(user)
    return this.recursionGenerateTree('0', routes)
  }
  /**
   * 构造前端菜单路由树
   */
  recursionGenerateTree(pid: string, routes: SysMenu[]): TreeRouterVO[] {
    const array: any = []
    routes.forEach((item: any) => {
      let currentItem = {}
      if (item.parentId === pid) {
        const children = this.recursionGenerateTree(item.menuId, routes) // 接收子节点
        // 默认为菜单类型的结构
        currentItem = {
          component:
            item.component ||
            (item.menuType == 'M' && item.parentId != '0' ? 'ParentView' : 'Layout'),
          hidden: item.visible == '0' ? false : true,
          name: item.path,
          path: item.path,
          meta: {
            icon: item.icon,
            title: item.menuName,
            link: item.isFrame == 0 ? item.path : null,
            noCache: item.isCache == 0 ? false : true
          }
        }
        // 非外链且为目录结构则补充相关字段
        if (item.isFrame != 0 && item.menuType == 'M') {
          currentItem['alwaysShow'] = true
          currentItem['redirect'] = 'noRedirect'
        }
        if (item.parentId == '0') {
          // 只有parentId为0的path需要加'/',即最外层目录
          currentItem['path'] = '/' + item.path
        }
        // 含有子节点
        if (children.length) {
          currentItem['children'] = children
        }
        array.push(currentItem)
      }
    })
    return array
  }

  /**
   * 获取rsa加密公钥
   */
  getRsaPublicKey(): string {
    return this.configService.get('RSAPublicKey')
  }
}
