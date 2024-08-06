import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { SysJob } from 'src/entities/sys/sys_job'
import { tansTypeOrmParams } from 'src/utils/tools'

@Injectable()
export class JobMapper {
  constructor(
    @InjectEntityManager()
    private entityManager
  ) {}

  // 分页列表
  async getListMapper(query) {
    // 拆解query
    const { pageSize = 10, pageNum = 1, ...params } = query
    // 将查询参数分别包裹处理
    const queryParams = tansTypeOrmParams(params)
    // 创建查询
    const qb = await this.entityManager.createQueryBuilder(SysJob, 'SysJob')
    qb.where(queryParams)
    qb.orderBy(`SysJob.create_time`, 'DESC')
    qb.skip(pageSize * (pageNum - 1))
    qb.take(pageSize)
    return {
      rows: await qb.getMany(),
      total: await qb.getCount() // 总的数量
    }
  }

  // 根据id获取详情
  async getDetailMapper(id) {
    return await this.entityManager
      .createQueryBuilder(SysJob, 'SysJob')
      .where('SysJob.jobId = :jobId', { jobId: id })
      .getOne()
  }

  // 新增任务
  async addJobMapper(body: SysJob) {
    const jobInfo = await this.entityManager
      .createQueryBuilder(SysJob, 'SysJob')
      .where('SysJob.jobName = :jobName', { jobName: body.jobName })
      .getOne()
    if (!!jobInfo) {
      throw new HttpException('该任务已存在', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return await this.entityManager
      .createQueryBuilder(SysJob, 'SysJob')
      .insert()
      .into(SysJob)
      .values(body)
      .execute()
  }

  // 修改任务
  async updateJobMapper(body: SysJob) {
    return await this.entityManager
      .createQueryBuilder(SysJob, 'SysJob')
      .update(SysJob)
      .set({
        cronExpression: body.cronExpression,
        jobDescribe: body.jobDescribe
      })
      .where('jobId = :jobId', { jobId: body.jobId })
      .execute()
  }

  // 修改状态
  async changeStatusMapper(body: SysJob) {
    return await this.entityManager
      .createQueryBuilder(SysJob, 'SysJob')
      .update(SysJob)
      .set({
        status: body.status
      })
      .where('jobId = :jobId', { jobId: body.jobId })
      .execute()
  }
}
