/**
 * dayjs 处理日期和时间库
 * 文档：https://day.js.org/docs/zh-CN/installation/installation
 */
import dayjs from 'dayjs'
/**
 * 转换日期时间
 * @param time Date
 * @returns
 */
export function parseDateTime(time: string | number | Date) {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}
/**
 * 转换日期
 * @param time Date
 * @returns
 */
export function parseDate(time: string | number | Date) {
  return dayjs(time).format('YYYY-MM-DD')
}
