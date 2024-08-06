import { Module } from '@nestjs/common'
import { PostService } from './post.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostController } from './post.controller'
import { PostMapper } from './post.mapper'
import { SysPost } from 'src/entities/sys/sys_post'

@Module({
  imports: [TypeOrmModule.forFeature([SysPost])],
  providers: [PostService, PostMapper],
  controllers: [PostController]
})
export class PostModule {}
