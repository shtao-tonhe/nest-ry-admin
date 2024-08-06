## 平台简介
基于RuoYi-Vue3改造的项目
## 技术栈: 
| 框架                                              | 说明          |   
|------------------------------------------------- |------------------|
| [Vue3]                                           | Vue3 框架        |
| [Vite]                                           | 开发与构建工具    |
| [Element Plus]                                   | Element Plus     |
| [TypeScript]                                     | JavaScript 的超集 |
| [pinia]                                          | Vue 存储库        |
| [Vue-router]                                     | Vue 路由          |
| [vueuse]                                         | 常用工具集        |
| [tailwindcss]                                    | 原子 css         |
| [sass]                                           | CSS扩展工具       |
| [eslint,prettier,stylelint]                      | 代码规范工具      |
| [wangeditor](https://www.wangeditor.com/)        | 富文本编辑器      |
| [dayjs]                                          | 日期时间工具库     |
| [decimal.js]                                     | js数学计算工具库, 避免精度问题   |
| [lodash-es]                                      | js实用方法工具库，如：防抖节流，深克隆等  |
| [jsencrypt,crypto-js]                            | 加密相关工具库  |
| [miit]                                           | 跨组件通信工具库     |

## 前端运行

```bash
# 进入项目目录

# 安装依赖
npm install

# 启动开发环境服务
npm run dev

# 构建测试环境 
npm build:test

# 构建生产环境 
npm build:prod

# 前端访问地址 http://localhost:8081
```

## 前端开发规范文档
* 查看doc目录

## 内置功能
1.  用户管理：用户是系统操作者，该功能主要完成系统用户配置。
2.  菜单管理：配置系统菜单，操作权限，按钮权限标识等。
3.  角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。
4.  字典管理：对系统中经常使用的一些较为固定的数据进行维护。
5.  参数管理：对系统动态配置常用参数。
6.  通知公告：系统通知公告信息发布维护。
7.  部门管理。
8.  岗位管理。
9.  日志管理-登录日志
10. 定时任务：（添加、修改)任务调度。
11. 缓存信息：对系统的redis缓存基础信息查询，统计等。
12. 服务监控：对系统的基础信息查询，统计等。
