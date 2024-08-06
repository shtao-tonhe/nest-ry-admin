import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { SysUser } from 'src/entities/sys/sys_user'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtUseModule } from 'src/framwork/jwt/jwt.use.module'
import { AuthMapper } from './auth.mapper'

@Module({
  imports: [TypeOrmModule.forFeature([SysUser]), JwtUseModule],
  providers: [AuthService, AuthMapper],
  controllers: [AuthController]
})
export class AuthModule {}
