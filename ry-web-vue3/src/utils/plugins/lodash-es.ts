/**
 * lodash 一个一致性、模块化、高性能的 JavaScript 实用工具库
 * 文档：https://www.lodashjs.com/
 */

// cloneDeep 深克隆

// uniq 数组去重

// union 合并两数组，去重

// debounce 防抖

// throttle 节流

/** 
  get   一般通过这个方法获取嵌套层数较深的数据,这个方法对在ts中查找嵌套数据有奇效。
  @example 
    const obj= { a: [{ b: { c: 30 } }] };
    const result = get(obj, 'a[0].b.c');
    // result=30
*/

/**
  has  判断对象中是否存在查找的属性
  @example 
    const obj = { a: 10, b: { c: 30 } };
    const result1 = has(obj, 'a');
    const result2 = has(obj, 'b.c');
    const result3 = has(obj, 'b.a');
    // result1=true
    // result2=true
    // result3=false
 */

/**
 * omit 忽略对象中传入的属性，相当于delete方法，但不改变原对象，返回的是新对象
 * @example 
    const obj = { a: 10, b: 20, c: 30 };
    const result = omit(obj, ['a', 'b']);
    // result1={ c: 30 }
 */

/**
 * remove 移除数组中符合条件的值
 * @example 
    const array = [10, 20, 30];
    const result = remove(array, (e)=>(e < 20));
    // result =[20, 30]
 */
