import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Cron, SchedulerRegistry } from '@nestjs/schedule'
import { JobMapper } from './job.mapper'
import { SysJob } from 'src/entities/sys/sys_job'
import { ScheduleName } from 'src/shared/enums/schedule'
import { ScheduleOperateService } from 'src/framwork/schedule/schedule.service'

@Injectable()
export class JobService {
  constructor(
    private jobMapper: JobMapper,
    private scheduleOperateService: ScheduleOperateService,
    private schedulerRegistry: SchedulerRegistry
  ) {}

  // 分页列表
  async getList(query) {
    return await this.jobMapper.getListMapper(query)
  }

  // 根据id获取详情
  async getDetail(id) {
    const info = await this.jobMapper.getDetailMapper(id)
    let infos = null
    let jobinfo = null
    let nextDate = null
    try {
      jobinfo = await this.schedulerRegistry.getCronJob(info.jobName)
      if (!jobinfo.runOnce) {
        nextDate = jobinfo.nextDates(5)
      }
    } catch {
      throw new HttpException('任务调度信息获取错误', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    infos = {
      running: jobinfo.running,
      lastExecution: jobinfo.lastExecution,
      runOnce: jobinfo.runOnce,
      nextDates: nextDate
    }
    return {
      jobInfo: infos,
      dataInfo: info
    }
  }

  // 执行一次任务
  async runOnce(body) {
    const jobinfo = this.schedulerRegistry.getCronJob(body.jobName)
    jobinfo.fireOnTick()
    return true
  }

  // 新增cron任务
  async addJob(body: SysJob) {
    // 新增至数据库
    return await this.jobMapper.addJobMapper(body)
  }

  // 修改任务
  async updateJob(body: SysJob) {
    try {
      const jobinfo = this.schedulerRegistry.getCronJob(body.jobName)
      // 周期任务
      if (body.cronType === '1') {
        jobinfo.setTime(this.scheduleOperateService.createCronTime(body.cronExpression))
        if (body.status === '0') {
          jobinfo.start()
        } else {
          jobinfo.stop()
        }
      }
      // 一次性任务
      if (body.cronType === '2') {
        const currentTime = new Date().getTime()
        const time = new Date(body.cronExpression).getTime()
        // 时间过期过期则停止，时间未到则启动
        if (currentTime > time) {
          jobinfo.stop()
        } else {
          jobinfo.setTime(this.scheduleOperateService.createCronTime(new Date(body.cronExpression)))
          jobinfo.start()
        }
      }
    } catch {
      throw new HttpException('任务调度设置错误', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return await this.jobMapper.updateJobMapper(body)
  }

  // 修改状态(启用禁用)
  async changeStatus(body: SysJob) {
    try {
      const jobinfo = this.schedulerRegistry.getCronJob(body.jobName)
      // 如果启用状态且未在运行，则启动
      if (body.status == '0' && !jobinfo.running) {
        jobinfo.start()
      }
      // 如果禁用状态且在运行，则停止
      if (body.status == '1' && jobinfo.running) {
        jobinfo.stop()
      }
    } catch {
      throw new HttpException('任务调度修改错误', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return await this.jobMapper.changeStatusMapper(body)
  }

  /**
   * cron表达式执行，通常情况下Cron即可满足所有需求, @Cron 首参数必传，因此启动项目就必定会根据规则触发
   * 示例：
   * 1.一次，给与指定的日期/时间。例如： new Date(Date.now() + 5 * 1000)  当前时间 5s 后调用一次
   * 2.在经常性的基础上:重复作业可以在指定时间间隔内的指定时刻运行（例如，每小时一次、每周一次、每 5 分钟一次）
   *    间隔执行，如：0/6 * * * * *  每6秒执行一次
   *    指定时间间隔内的指定时刻，如：0 10 * * * * 每小时，第 10 分钟开始时执行一次
   */

  /** 任务1号周期任务 */
  @Cron(ScheduleName.JobTaskCron.initCron, {
    name: ScheduleName.JobTaskCron.name,
    timeZone: ScheduleName.JobTaskCron.timeZone,
    disabled: ScheduleName.JobTaskCron.disabled
  })
  async testCron() {
    console.log('testCron运行', ScheduleName.JobTaskCron.name)
  }
  /** 任务2号一次性任务 */
  @Cron(ScheduleName.JobTaskCron2.initCron, {
    name: ScheduleName.JobTaskCron2.name,
    timeZone: ScheduleName.JobTaskCron2.timeZone,
    disabled: ScheduleName.JobTaskCron.disabled
  })
  async testCron2() {
    console.log('testCron2运行', ScheduleName.JobTaskCron2.name)
  }
}
