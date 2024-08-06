module.exports = {
  printWidth: 100, // 每行代码长度（默认80）
  tabWidth: 2, // 每个tab相当于多少个空格（默认2）ab进行缩进（默认false）
  useTabs: false, // 是否使用tab
  semi: false, // 声明结尾使用分号(默认true)
  vueIndentScriptAndStyle: false,
  singleQuote: true, // 使用单引号（默认false）
  quoteProps: 'as-needed', // 引用对象中的属性时，仅在需要时在对象属性周围添加引号。
  bracketSpacing: true, // 对象字面量的大括号间使用空格（默认true）
  trailingComma: 'none', // 多行使用拖尾逗号（默认none）
  jsxSingleQuote: false, // 在 JSX 中使用单引号而不是双引号。
  // 箭头函数参数括号 默认avoid 可选 avoid| always
  // avoid 能省略括号的时候就省略 例如x => x
  // always 总是有括号
  arrowParens: 'always', // 在唯一的箭头函数参数周围始终包含括号。
  insertPragma: false, // 插入编译指示
  requirePragma: false, // 需要编译指示
  proseWrap: 'never', // 如果散文超过打印宽度，则换行
  htmlWhitespaceSensitivity: 'strict', // 所有标签周围的空格（或缺少空格）被认为是重要的。
  endOfLine: 'auto', // 确保在文本文件中仅使用 ( \n)换行，常见于 Linux 和 macOS 以及 git repos 内部。
  rangeStart: 0, // 格式化文件时，回到包含所选语句的第一行的开头。
};
