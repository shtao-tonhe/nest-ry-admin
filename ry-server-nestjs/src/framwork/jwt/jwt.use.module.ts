import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { JwtUseService } from './jwt.use.service'

@Module({
  providers: [JwtService, JwtUseService],
  exports: [JwtUseService]
})
export class JwtUseModule {}
