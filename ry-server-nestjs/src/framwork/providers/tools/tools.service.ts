import { Injectable } from '@nestjs/common'

/**
 * 工具函数处理服务
 */
@Injectable()
export class ToolsService {
  /**
   * 数组构造树形结构
   * @param pid 父级id
   * @param routes 数组
   * @param props 字段结构
   * @returns
   */
  recursionGenerateTree(
    pid: string,
    routes: Array<any>,
    props: {
      id: string
      label: string
    } = {
      id: 'id',
      label: 'label'
    }
  ): Array<{ id: string; label: string }> {
    const array: any = []
    routes.forEach((item: any) => {
      let currentItem = {}
      if (item.parentId === pid) {
        const children = this.recursionGenerateTree(item[props.id], routes, {
          id: props.id,
          label: props.label
        }) // 接收子节点
        // 默认为菜单类型的结构
        currentItem = {
          id: item[props.id],
          label: item[props.label]
        }
        // 含有子节点
        if (children.length) {
          currentItem['children'] = children
        }
        array.push(currentItem)
      }
    })
    return array
  }

  /**
   * 树形结构数组扁平化
   * @param arr 树形结构数组
   * @param props.children 子数组
   * @returns
   */
  treeFlat(
    arr: Array<any>,
    props: {
      children: string
    } = {
      children: 'children'
    }
  ) {
    const list = []
    if (arr instanceof Array) {
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (item[props.children] && item[props.children].length > 0) {
          list.push(...this.treeFlat(item.children)) //将每一层的结果push到list
        }
        delete item[props.children]
        list.push(item)
      }
    }
    return list
  }

  /**
   * 树形结构数组格式化
   * @param arr 树形结构数组
   * @param obj 转换对象，左边为转换值，右边为被转换值 { key: 'value' } 将数组中的key字段转换为value字段
   * @param props.children 子数组
   * @returns
   */
  treeFormat(
    arr: Array<any>,
    obj: object,
    props: {
      children: string
    } = {
      children: 'children'
    }
  ) {
    if (arr instanceof Array) {
      return arr.map((item) => {
        // 这里对应相关字段
        for (const key in obj) {
          item[obj[key]] = item[key]
          delete item[key]
        }
        delete item.name
        if (item[props.children] && item[props.children].length > 0) {
          this.treeFormat(item[props.children], obj, props)
        }
        return item
      })
    }
  }
  /**
   * 获取数组中某个节点及其对应上级节点
   * @param data 树形结构数组
   * @param targetId 目标节点
   * @returns
   */
  arrayGetParentList(pid = '0', data: Array<any>, targetId: string) {
    const fitem = data.find((item) => {
      return item.deptId === targetId
    })
    if (fitem && fitem.parentId !== pid) {
      const child = this.arrayGetParentList(pid, data, fitem.parentId)
      return [fitem, ...child]
    }
    // 最顶级的
    if (fitem) {
      return [fitem]
    }
  }
}
