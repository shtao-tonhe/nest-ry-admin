// 任务调度定时器-类型枚举
export enum ScheduleType {
  CRON = 'cron' // cron表达式 对应 @Cron() 装饰器注释的定时器
}
// 任务调度定时器-初始化cron枚举
export enum ScheduleInitCron {
  JobTaskCron = '45 * * * * *' // (每分钟第45s运行)
}

/* 
 * 任务调度定时器-命名对象-项目所有的定时器均在此处设定
  task: { 
    name: 'testCron', //必须 名称
    type: ScheduleType.CRON, //必须 类型
    initCron: ScheduleInitCron.JobTaskCron,//必须 初始化表达式（cron表达式 | new Date时间对象）
    cronType: '1',  // 必须 执行方式（1周期任务 2一次性任务），当initCron为cron表达式时候必为1,当initCron为new Date时间对象的时候必为2
    timeZone: 'Asia/Shanghai', //必须 时区
    disabled: true, //必须 设置为true 项目启动时候任务默认不启动，可以在定时任务列表里面配置启动
    jobDescribe: '测试周期任务' // 任务描述
  }
 */
export const ScheduleName = {
  // 测试cron表达式1 - 周期任务
  JobTaskCron: {
    name: 'testCron', //必须 名称
    type: ScheduleType.CRON, //必须 类型
    initCron: ScheduleInitCron.JobTaskCron, //必须 初始化表达式（cron表达式）
    cronType: '1', // 必须 执行方式（1周期任务 2一次性任务），当initCron为cron表达式时候必为1
    timeZone: 'Asia/Shanghai', //必须 时区
    disabled: true, //必须 设置为true 项目启动时候任务默认不启动，可以在定时任务列表里面配置启动
    jobDescribe: '测试周期任务' // 任务描述
  },
  // 测试cron表达式2 - 一次性任务
  JobTaskCron2: {
    name: 'testCron2', //必须 名称
    type: ScheduleType.CRON, //必须 类型
    initCron: new Date('2024-01-01 00:00:00'), //必须 初始化表达式（new Date时间对象）
    cronType: '2', // 必须 执行方式（1周期任务 2一次性任务），当initCron为new Date时间对象的时候必为2
    timeZone: 'Asia/Shanghai', // 必须 时区
    disabled: true, //必须 设置为true 项目启动时候任务默认不启动，可以在定时任务列表里面配置启动
    jobDescribe: '测试一次性任务' // 任务描述
  }
}
