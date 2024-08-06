import { Injectable } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { InjectEntityManager } from '@nestjs/typeorm'
import { CronTime } from 'cron'
import { SysJob } from 'src/entities/sys/sys_job'
import { ScheduleName } from 'src/shared/enums/schedule'
import dayjs = require('dayjs')

/**
 * 定时任务-工具服务
 */
@Injectable()
export class ScheduleOperateService {
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @InjectEntityManager()
    private entityManager
  ) {
    this.initCronJob()
  }

  /**
   * 初始化定时器
   * 根据ScheduleName配置的定时器对项目中所有的定时器内容进行统一初始化操作
   * 若未使用ScheduleName进行枚举设置则不会对该任务进行数据库的初始化
   */
  async initCronJob() {
    // 从数据库中找出所有的任务列表
    const jobList = await this.entityManager.find(SysJob)
    const list: Array<{
      jobName: string
      jobType: string
      cronExpression: string
      cronType: string
      status: string
    }> = [] // 数据库未存在的任务列表
    for (const key in ScheduleName) {
      // 如果数据库中不存在该任务则保存起来后续添加
      const fItem = jobList.find((item) => item.jobName === ScheduleName[key].name)
      if (!fItem) {
        const obj = {
          jobName: ScheduleName[key].name,
          jobType: ScheduleName[key].type,
          cronExpression: ScheduleName[key].initCron,
          cronType: ScheduleName[key].cronType,
          jobDescribe: ScheduleName[key].jobDescribe,
          status: '1', // 默认创建的任务均为暂停状态
          createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
        }
        list.push(obj)
      } else {
        // 如果存在任务且状态启动中则重新赋值启动
        const jobinfo = this.schedulerRegistry.getCronJob(ScheduleName[key].name)
        // 循环任务处理
        if (fItem.status === '0' && fItem.cronType == '1') {
          jobinfo.setTime(this.createCronTime(fItem.cronExpression))
          jobinfo.start()
        }
        // 一次性任务处理
        if (fItem.status === '0' && fItem.cronType == '2') {
          const currentTime = new Date().getTime()
          const time = new Date(fItem.cronExpression).getTime()
          // 未过期任务则重新赋值启动
          if (currentTime < time) {
            jobinfo.setTime(this.createCronTime(new Date(fItem.cronExpression)))
            jobinfo.start()
          }
        }
      }
    }
    if (list.length !== 0) {
      // 给数据库添加所有未存在的定时任务
      await this.entityManager
        .createQueryBuilder(SysJob, 'SysJob')
        .insert()
        .into(SysJob)
        .values(list)
        .execute()
    }
  }

  /**
   * 创建CronTime
   */
  createCronTime(time) {
    return new CronTime(time, 'Asia/Shanghai')
  }
}
