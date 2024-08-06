## nestjs后端服务
技术栈：nestjs(fastify) + typeorm + mysql + redis

## 项目描述
本项目参考仿造：RuoYi-Vue项目
实现部分刚需功能：如：用户，角色，菜单，岗位，部门，字典，定时任务，缓存/服务监控，登录日志等，关于租户功能可根据自己需求调整
舍弃部分非必要功能，如：代码生成等，如有需要可自行编写

## 步骤
1.本地安装mysql5.7.x 版本以上
2.本地安装redis5.x 版本或以上
3.建立数据库(名：ry-vue-nestjs 字符集: utf8),运行sql文件夹中文件
4.设置src/config中相关配置数据

## 启动项目

```bash
# install
$ npm install

# development
$ npm run start

# watch mode
$ npm run start:dev

## build the app

```bash
# production
$ npm run build

```

## 开发注意事项
1.重要数据要加密或者设置相关解密验证守卫单独守卫某个或某部分接口
2.个人数据不能以前端传入来判定而要从token中获取对应的userId并要校对获取
3.但凡涉及个人ID或者标记查询数据的接口需要加权限标记，无权限不可用，但凡需要开发且根据某个ID查询的内容均需要校验
4.数据转换函数，传入数据和需要转换或改变的对象返回符合转换后的格式的内容数据,(避免传出一些不必要的重要数据)
5.注意代码复杂度和方法封装，尽量代码别嵌套过深