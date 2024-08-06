/**
 *  js数学计算工具库, 避免精度问题
 *  文档：https://mikemcl.github.io/decimal.js/
 */

import Decimal from 'decimal.js'

/**
 * 分转元
 * @param value
 * @returns
 */
export function fenTransformYuan(value: string) {
  const values = new Decimal(value || '0')
  return values.div(100).toFixed(2, Decimal.ROUND_DOWN)
}

/**
 * 元转分
 * @param value
 * @returns
 */
export function yuanTransformFen(value: string) {
  const values = new Decimal(value || '0')
  return values.mul(100).toFixed(2, Decimal.ROUND_DOWN)
}
