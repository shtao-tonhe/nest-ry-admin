/**
 * qs.js URL参数格式化、JSON序列化库
 * 文档：https://www.npmjs.com/package/qs
 */
// @ts-ignore
import Qs from 'qs'
/**
 * 将对象序列化成URL参数
 * @param obj 对象
 * @returns {a:1,b:2} =>  a=1&b=2
 */
export function qsStringify(obj: { [key: string]: string | number | boolean }) {
  return Qs.stringify(obj)
}
/**
 * 获取url 路径中的参数
 * @param url string
 * @returns a=1&b=2 => {a:1,b:2}
 */
export function qsParse(url: string) {
  return Qs.parse(url)
}
