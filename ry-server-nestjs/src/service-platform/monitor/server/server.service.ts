import { Injectable } from '@nestjs/common'
import os = require('os')

@Injectable()
export class ServerService {
  // 获取当前系统基础信息
  async getInfo() {
    // cpu信息
    const cupInfo = {
      ...(await this.getCPUUsage()),
      ...(await this._getCPUInfo())
    }
    return {
      cpu: cupInfo, // 系统cpu信息
      mem: {
        // 内存信息
        total: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
        used: (os.freemem() / 1024 / 1024 / 1024).toFixed(2)
      },
      sys: {
        // 系统信息
        computerName: os.hostname(),
        osName: os.platform(),
        computerIp: this.getIpAddress(),
        osArch: os.arch()
      },
      endianness: os.endianness(), // 字节顺序
      loadavg: os.loadavg(), // 返回系统最近 1、5 和 15 分钟平均负载的数组
      release: os.release(), // 操作系统版本
      type: os.type(), // 操作系统名称
      uptime: os.uptime() // 计算机正常运行时间
    }
  }

  // 获取服务器ip
  getIpAddress() {
    const ifaces = os.networkInterfaces()
    let myip = ''
    for (const dev in ifaces) {
      for (const index in ifaces[dev]) {
        if (ifaces[dev][index].family == 'IPv4') {
          myip = ifaces[dev][index].address
        }
      }
    }
    return myip
  }

  /**
   * 获取某时间间隔段 CPU 利用率 默认1s
   */
  async getCPUUsage() {
    const cpuUsageMS = 1000 // 时间间隔

    const t1 = this._getCPUInfo() // t1 时间点 CPU 信息
    await this.sleep(cpuUsageMS)
    const t2 = this._getCPUInfo() // t2 时间点 CPU 信息
    // 空闲时间计算
    const idle = t2.idle - t1.idle
    const total = t2.total - t1.total
    let usage: any = 1 - idle / total // 使用率
    usage = (usage * 100.0).toFixed(2)
    return { usage }
  }

  // 休眠ms秒
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  // 获取 CPU 信息
  _getCPUInfo() {
    const cpus = os.cpus()
    let user = 0,
      nice = 0,
      sys = 0,
      idle = 0,
      irq = 0,
      total = 0
    // 循环各个核心
    for (const cpu in cpus) {
      const times = cpus[cpu].times
      user += times.user
      nice += times.nice
      sys += times.sys
      idle += times.idle
      irq += times.irq
    }

    total += user + nice + sys + idle + irq
    return {
      user, //用户模式下花费的毫秒数
      sys, //系统模式下花费的毫秒数
      idle, //空闲模式下花费的毫秒数
      total, //总花费的毫秒数
      num: cpus.length, // cpu核心数量
      model: cpus.length > 0 ? cpus[0].model : '',
      speed: cpus.length > 0 ? cpus[0].speed : ''
    }
  }
}
