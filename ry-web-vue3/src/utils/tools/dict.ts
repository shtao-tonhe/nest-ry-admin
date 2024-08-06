// @ts-nocheck
import useDictStore from '@/store/modules/dict'
import { DictVO } from '@/types/system/dict'
/**
 * 获取字典数据
 * @example
 *  const sys_yes_no = getDictOptions(DICT_TYPE.sys_yes_no)
 */
export function getDictOptions(dictType): Array<{ value: string; label: string }> {
  const dictStore = useDictStore()
  const dictList: Array<DictVO> = dictStore.getDictMap
  const list = []
  dictList.forEach((dict) => {
    if (dict.dictType === dictType) {
      list.push({
        value: dict.dictValue,
        label: dict.dictLabel
      })
    }
  })
  return list
}

/**
 * 转换字典值内容为对应的字典中文
 * @param value 字典值
 * @param list 对应的字典列表
 * @returns 字典值对应的中文
 */
export function formatDictLabel(
  value,
  list: Array<{ value: string; label: string; [key: string]: string }>
) {
  const fItem = list.find((item) => item.value === value)
  if (fItem) {
    return fItem.label
  } else {
    return '-'
  }
}

/**
 * 通用枚举
 */
/**=======菜单类型====== */
export const MENU_TYPE: string = {
  M: '目录',
  C: '菜单',
  F: '按钮'
}
/**=======下载模板类型====== */
export enum ModelType {
  USER = '用户导入模板.xlsx' // 用户导入模板
}

/**
 * 字典枚举
 */
export enum DICT_TYPE {
  sys_user_sex = 'sys_user_sex', // 用户性别
  sys_show_hide = 'sys_show_hide', // 菜单状态
  sys_normal_disable = 'sys_normal_disable',
  sys_yes_no = 'sys_yes_no',
  sys_notice_type = 'sys_notice_type',
  sys_notice_status = 'sys_notice_status'
}
