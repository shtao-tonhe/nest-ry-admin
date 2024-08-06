-- ----------------------------
-- 1、用户信息表
-- ----------------------------
drop table if exists sys_user;
create table sys_user (
  user_id           bigint(20)      not null auto_increment    comment '用户ID',
  dept_id           bigint(20)      default null               comment '部门ID',
  phonenumber       varchar(11)     default ''                 comment '手机号码',
  real_name         varchar(20)     default ''                 comment '真实姓名',
  id_card           varchar(18)     default ''                 comment '身份证号',
  id_card_front     varchar(255)    default ''                 comment '身份证照片国徽面',
  id_card_back      varchar(255)    default ''                 comment '身份证照片人像面',
  email             varchar(50)     default ''                 comment '用户邮箱',
  sex               char(1)         default '2'                comment '用户性别（0男 1女 2未知）',
  password          varchar(255)    default ''                 comment '密码',
  status            char(1)         default '0'                comment '帐号状态（0正常 1停用）',
  login_ip          varchar(128)    default ''                 comment '最后登录IP',
  login_date        datetime                                   comment '最后登录时间',
  nick_name         varchar(32)     default ''                 comment '用户昵称',
  avatar            varchar(255)    default ''                 comment '头像地址',
  remark            varchar(255)    default ''                 comment '备注',
  del_flag          char(1)         default '0'                comment '删除标志（0代表存在 1代表删除）',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time       datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  primary key (user_id)
) engine=innodb auto_increment=100 comment = '用户信息表';

-- ----------------------------
-- 初始化-用户信息表数据
-- ----------------------------
insert into sys_user values('1', null, '18088888888', '超级管理员', '', '', '', 'admin@163.com', '2', '$2a$10$mf24x.lpSrw9fxok1PNn5.u6K80QkX6yUAZxC8dO.EsNDbbmubcuO', '0', '127.0.0.1', sysdate(), '超级管理员', '', '超级管理员', '0', '超级管理员', sysdate(), '', null);

-- ----------------------------
-- 1.2、微信用户信息表
-- ----------------------------
drop table if exists sys_user_wechat;
create table sys_user_wechat (
  user_id           bigint(20)      not null auto_increment    comment '用户ID',
  wx_open_id        varchar(32)     default ''                 comment '微信openId',
  phonenumber       varchar(11)     default ''                 comment '手机号码',
  sex               char(1)         default '2'                comment '用户性别（0男 1女 2未知）',
  status            char(1)         default '0'                comment '帐号状态（0正常 1停用）',
  nick_name         varchar(32)     default ''                 comment '用户昵称',
  avatar            varchar(255)    default ''                 comment '头像地址',
  del_flag          char(1)         default '0'                comment '删除标志（0代表存在 1代表删除）',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time       datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  primary key (user_id)
) engine=innodb auto_increment=1 comment = '微信用户信息表';

-- ----------------------------
-- 2、角色信息表
-- ----------------------------
drop table if exists sys_role;
create table sys_role (
  role_id              bigint(20)      not null auto_increment    comment '角色ID',
  role_name            varchar(30)     not null                   comment '角色名称',
  role_key             varchar(100)    default 'common'           comment '角色权限字符串',
  role_sort            int(4)          default 0                  comment '显示顺序',
  status               char(1)         default '0'                comment '角色状态（0正常 1停用）',
  create_by            varchar(64)     default ''                 comment '创建者',
  create_time          datetime                                   comment '创建时间',
  update_by            varchar(64)     default ''                 comment '更新者',
  update_time          datetime                                   comment '更新时间',
  remark               varchar(500)    default ''                 comment '备注',
  primary key (role_id)
) engine=innodb auto_increment=100 comment = '角色信息表';

-- ----------------------------
-- 初始化-角色信息表数据
-- ----------------------------
insert into sys_role values('1', '超级管理员',  'admin',  1, '0', '1', sysdate(), '', null, '超级管理员');

-- ----------------------------
-- 3、菜单权限表
-- ----------------------------
drop table if exists sys_menu;
create table sys_menu (
  menu_id           bigint(20)      not null auto_increment    comment '菜单ID',
  menu_name         varchar(50)     not null                   comment '菜单名称',
  parent_id         bigint(20)      default 0                  comment '父菜单ID',
  order_num         int(4)          default 0                  comment '显示顺序',
  path              varchar(200)    default ''                 comment '路由地址',
  component         varchar(255)    default ''                 comment '组件路径',
  query             varchar(255)    default ''                 comment '路由参数',
  is_frame          int(1)          default 1                  comment '是否为外链（0是 1否）',
  is_cache          int(1)          default 0                  comment '是否缓存（0缓存 1不缓存）',
  menu_type         char(1)         default ''                 comment '菜单类型（M目录 C菜单 F按钮）',
  visible           char(1)         default 0                  comment '显示状态（0显示 1隐藏）',
  status            char(1)         default 0                  comment '菜单状态（0正常 1停用）',
  perms             varchar(100)    default ''                 comment '权限标识',
  icon              varchar(100)    default ''                 comment '菜单图标',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time       datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  remark            varchar(500)    default ''                 comment '备注',
  primary key (menu_id)
) engine=innodb auto_increment=1000 comment = '菜单权限表';

-- ----------------------------
-- 初始化-菜单信息表数据
-- ----------------------------
-- 一级菜单
insert into sys_menu values('1', '系统管理', '0', '1', 'system',  '', '', 1, 0, 'M', '0', '0', '', 'system',   '1', sysdate(), '', null, '系统管理目录');
insert into sys_menu values('2', '系统监控', '0', '2', 'monitor', '', '', 1, 0, 'M', '0', '0', '', 'monitor',  '1', sysdate(), '', null, '系统监控目录');
-- 二级菜单
insert into sys_menu values('100',  '用户管理',      '1',   '1', 'user',       'system/user/index',        '', 1, 0, 'C', '0', '0', '',       '',    '1', sysdate(), '', null, '用户管理菜单');
insert into sys_menu values('101',  '角色管理',      '1',   '2', 'role',       'system/role/index',        '', 1, 0, 'C', '0', '0', '',       '',    '1', sysdate(), '', null, '角色管理菜单');
insert into sys_menu values('102',  '菜单管理',      '1',   '3', 'menu',       'system/menu/index',        '', 1, 0, 'C', '0', '0', '',       '',    '1', sysdate(), '', null, '菜单管理菜单');
insert into sys_menu values('103',  '字典管理',      '1',   '4', 'dict',       'system/dict/index',        '', 1, 0, 'C', '0', '0', '',       '',    '1', sysdate(), '', null, '字典管理菜单');
insert into sys_menu values('104',  '参数设置',      '1',   '5', 'config',     'system/config/index',      '', 1, 0, 'C', '0', '0', '',       '',    '1', sysdate(), '', null, '参数设置菜单');
insert into sys_menu values('105',  '通知公告',      '1',   '6', 'notice',     'system/notice/index',      '', 1, 0, 'C', '0', '0', '',       '',    '1', sysdate(), '', null, '通知公告菜单');
insert into sys_menu values('106',  '日志管理',      '2',   '7', 'log',        '',                         '', 1, 0, 'M', '0', '0', '',       '',    '1', sysdate(), '', null, '日志管理目录');
insert into sys_menu values('107',  '定时任务',      '2',   '8', 'job',        'monitor/job/index',        '', 1, 0, 'C', '0', '0', '',       '',    '1', sysdate(), '', null, '定时任务菜单');
insert into sys_menu values('108',  '缓存信息', '2',   '9', 'cache',       'monitor/cache/list',      '', 1, 0, 'C', '0', '0', '',       '',    '1', sysdate(), '', null, '缓存信息菜单');
insert into sys_menu values('109',  '服务监控',      '2',   '10', 'server',     'monitor/server/index',     '', 1, 0, 'C', '0', '0', '',      '',    '1', sysdate(), '', null, '服务监控菜单');
insert into sys_menu values('110',  '部门管理',      '1',   '7',  'dept',       'system/dept/index',        '', 1, 0, 'C', '0', '0', '',      '',    '1', sysdate(), '', null, '部门管理菜单');
insert into sys_menu values('111',  '岗位管理',      '1',   '8',  'post',       'system/post/index',        '', 1, 0, 'C', '0', '0', '',      '',    '1', sysdate(), '', null, '岗位管理菜单');

-- 三级菜单
insert into sys_menu values('500',  '登录日志',      '106', '2', 'logininfor', 'monitor/logininfor/index', '', 1, 0, 'C', '0', '0', '',        '',    '1', sysdate(), '', null, '登录日志菜单');

-- 用户管理按钮
insert into sys_menu values('1001', '用户新增', '100', '2',  '', '', '', 1, 0, 'F', '0', '0', 'system:user:add',            '', '1', sysdate(), '', null, '');
insert into sys_menu values('1002', '用户修改', '100', '3',  '', '', '', 1, 0, 'F', '0', '0', 'system:user:edit',           '', '1', sysdate(), '', null, '');
insert into sys_menu values('1003', '用户删除', '100', '4',  '', '', '', 1, 0, 'F', '0', '0', 'system:user:remove',         '', '1', sysdate(), '', null, '');
insert into sys_menu values('1004', '用户导出', '100', '5',  '', '', '', 1, 0, 'F', '0', '0', 'system:user:export',         '', '1', sysdate(), '', null, '');
insert into sys_menu values('1005', '用户导入', '100', '6',  '', '', '', 1, 0, 'F', '0', '0', 'system:user:import',         '', '1', sysdate(), '', null, '');
insert into sys_menu values('1006', '重置密码', '100', '7',  '', '', '', 1, 0, 'F', '0', '0', 'system:user:resetPwd',       '', '1', sysdate(), '', null, '');
insert into sys_menu values('1007', '用户查询', '100', '8',  '', '', '', 1, 0, 'F', '0', '0', 'system:user:list',           '', '1', sysdate(), '', null, '');
insert into sys_menu values('1008', '分配角色', '100', '9',  '', '', '', 1, 0, 'F', '0', '0', 'system:user:allocation',     '', '1', sysdate(), '', null, '');
-- 角色管理按钮
insert into sys_menu values('1009', '角色新增', '101', '2',  '', '', '', 1, 0, 'F', '0', '0', 'system:role:add',            '', '1', sysdate(), '', null, '');
insert into sys_menu values('1010', '角色修改', '101', '3',  '', '', '', 1, 0, 'F', '0', '0', 'system:role:edit',           '', '1', sysdate(), '', null, '');
insert into sys_menu values('1011', '角色删除', '101', '4',  '', '', '', 1, 0, 'F', '0', '0', 'system:role:remove',         '', '1', sysdate(), '', null, '');
insert into sys_menu values('1012', '分配用户', '101', '5',  '', '', '', 1, 0, 'F', '0', '0', 'system:role:allocation',     '', '1', sysdate(), '', null, '');
insert into sys_menu values('1013', '取消授权', '101', '6',  '', '', '', 1, 0, 'F', '0', '0', 'system:role:revoke',         '', '1', sysdate(), '', null, '');
insert into sys_menu values('1014', '角色查询', '101', '7',  '', '', '', 1, 0, 'F', '0', '0', 'system:role:list',           '', '1', sysdate(), '', null, '');
-- 菜单管理按钮
insert into sys_menu values('1015', '菜单新增', '102', '2',  '', '', '', 1, 0, 'F', '0', '0', 'system:menu:add',            '', '1', sysdate(), '', null, '');
insert into sys_menu values('1016', '菜单修改', '102', '3',  '', '', '', 1, 0, 'F', '0', '0', 'system:menu:edit',           '', '1', sysdate(), '', null, '');
insert into sys_menu values('1017', '菜单删除', '102', '4',  '', '', '', 1, 0, 'F', '0', '0', 'system:menu:remove',         '', '1', sysdate(), '', null, '');
insert into sys_menu values('1018', '菜单查询', '102', '5',  '', '', '', 1, 0, 'F', '0', '0', 'system:menu:list',           '', '1', sysdate(), '', null, '');
-- 字典管理按钮
insert into sys_menu values('1019', '字典新增', '103', '2', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:add',            '', '1', sysdate(), '', null, '');
insert into sys_menu values('1020', '字典修改', '103', '3', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:edit',           '', '1', sysdate(), '', null, '');
insert into sys_menu values('1021', '字典删除', '103', '4', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:remove',         '', '1', sysdate(), '', null, '');
insert into sys_menu values('1022', '字典查询', '103', '5', '', '', '', 1, 0, 'F', '0', '0', 'system:dict:list',           '', '1', sysdate(), '', null, '');
-- 参数设置按钮
insert into sys_menu values('1023', '参数新增', '104', '2', '', '', '', 1, 0, 'F', '0', '0', 'system:config:add',          '', '1', sysdate(), '', null, '');
insert into sys_menu values('1024', '参数修改', '104', '3', '', '', '', 1, 0, 'F', '0', '0', 'system:config:edit',         '', '1', sysdate(), '', null, '');
insert into sys_menu values('1025', '参数删除', '104', '4', '', '', '', 1, 0, 'F', '0', '0', 'system:config:remove',       '', '1', sysdate(), '', null, '');
insert into sys_menu values('1026', '参数查询', '104', '5', '', '', '', 1, 0, 'F', '0', '0', 'system:config:list',         '', '1', sysdate(), '', null, '');
-- 通知公告按钮
insert into sys_menu values('1027', '公告新增', '105', '2', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:add',          '', '1', sysdate(), '', null, '');
insert into sys_menu values('1028', '公告修改', '105', '3', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:edit',         '', '1', sysdate(), '', null, '');
insert into sys_menu values('1029', '公告删除', '105', '4', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:remove',       '', '1', sysdate(), '', null, '');
insert into sys_menu values('1030', '公告查询', '105', '5', '', '', '', 1, 0, 'F', '0', '0', 'system:notice:list',         '', '1', sysdate(), '', null, '');
-- 定时任务按钮
insert into sys_menu values('1032', '任务修改', '106', '3', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:edit',           '', '1', sysdate(), '', null, '');
insert into sys_menu values('1034', '状态切换', '106', '5', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:status',         '', '1', sysdate(), '', null, '');
insert into sys_menu values('1036', '执行一次', '106', '7', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:once',           '', '1', sysdate(), '', null, '');
insert into sys_menu values('1037', '任务详情', '106', '8', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:detail',         '', '1', sysdate(), '', null, '');
insert into sys_menu values('1038', '任务查询', '106', '9', '', '', '', 1, 0, 'F', '0', '0', 'monitor:job:list',           '', '1', sysdate(), '', null, '');
-- 缓存信息
insert into sys_menu values('1039', '缓存查询', '107', '1', '', '', '', 1, 0, 'F', '0', '0', 'monitor:cache:list',         '', '1', sysdate(), '', null, '');
-- 服务监控
insert into sys_menu values('1040', '服务查询', '108', '1', '', '', '', 1, 0, 'F', '0', '0', 'monitor:server:list',        '', '1', sysdate(), '', null, '');
-- 部门管理按钮
insert into sys_menu values('1041', '部门查询', '110', '1',  '', '', '', 1, 0, 'F', '0', '0', 'system:dept:query',          '', '1', sysdate(), '', null, '');
insert into sys_menu values('1042', '部门新增', '110', '2',  '', '', '', 1, 0, 'F', '0', '0', 'system:dept:add',            '', '1', sysdate(), '', null, '');
insert into sys_menu values('1043', '部门修改', '110', '3',  '', '', '', 1, 0, 'F', '0', '0', 'system:dept:edit',           '', '1', sysdate(), '', null, '');
insert into sys_menu values('1044', '部门删除', '110', '4',  '', '', '', 1, 0, 'F', '0', '0', 'system:dept:remove',         '', '1', sysdate(), '', null, '');
-- 岗位管理按钮
insert into sys_menu values('1045', '岗位查询', '111', '1',  '', '', '', 1, 0, 'F', '0', '0', 'system:post:query',          '', '1', sysdate(), '', null, '');
insert into sys_menu values('1046', '岗位新增', '111', '2',  '', '', '', 1, 0, 'F', '0', '0', 'system:post:add',            '', '1', sysdate(), '', null, '');
insert into sys_menu values('1047', '岗位修改', '111', '3',  '', '', '', 1, 0, 'F', '0', '0', 'system:post:edit',           '', '1', sysdate(), '', null, '');
insert into sys_menu values('1048', '岗位删除', '111', '4',  '', '', '', 1, 0, 'F', '0', '0', 'system:post:remove',         '', '1', sysdate(), '', null, '');

-- ----------------------------
-- 4、用户和角色关联表  用户N-1角色
-- ----------------------------
drop table if exists sys_user_role;
create table sys_user_role (
  user_id   bigint(20) not null comment '用户ID',
  role_id   bigint(20) not null comment '角色ID',
  primary key(user_id, role_id)
) engine=innodb comment = '用户和角色关联表';

-- ----------------------------
-- 初始化-用户和角色关联表数据
-- ----------------------------
insert into sys_user_role values ('1', '1');

-- ----------------------------
-- 5、角色和菜单关联表  角色1-N菜单
-- ----------------------------
drop table if exists sys_role_menu;
create table sys_role_menu (
  role_id   bigint(20) not null comment '角色ID',
  menu_id   bigint(20) not null comment '菜单ID',
  primary key(role_id, menu_id)
) engine=innodb comment = '角色和菜单关联表';

-- ----------------------------
-- 6、字典类型表
-- ----------------------------
drop table if exists sys_dict_type;
create table sys_dict_type
(
  dict_id          bigint(20)      not null auto_increment    comment '字典主键',
  dict_name        varchar(100)    default ''                 comment '字典名称',
  dict_type        varchar(100)    default ''                 comment '字典类型',
  status           char(1)         default '0'                comment '状态（0正常 1停用）',
  create_by        varchar(64)     default ''                 comment '创建者',
  create_time      datetime                                   comment '创建时间',
  update_by        varchar(64)     default ''                 comment '更新者',
  update_time      datetime                                   comment '更新时间',
  remark           varchar(500)    default ''                 comment '备注',
  primary key (dict_id),
  unique (dict_type)
) engine=innodb auto_increment=100 comment = '字典类型表';

insert into sys_dict_type values(1,  '用户性别', 'sys_user_sex',        '0', '1', sysdate(), '', null, '用户性别列表');
insert into sys_dict_type values(2,  '菜单状态', 'sys_show_hide',       '0', '1', sysdate(), '', null, '菜单状态列表');
insert into sys_dict_type values(3,  '系统开关', 'sys_normal_disable',  '0', '1', sysdate(), '', null, '系统开关列表');
insert into sys_dict_type values(6,  '系统是否', 'sys_yes_no',          '0', '1', sysdate(), '', null, '系统是否列表');
insert into sys_dict_type values(7,  '通知类型', 'sys_notice_type',     '0', '1', sysdate(), '', null, '通知类型列表');
insert into sys_dict_type values(8,  '通知状态', 'sys_notice_status',   '0', '1', sysdate(), '', null, '通知状态列表');

-- ----------------------------
-- 7、字典数据表
-- ----------------------------
drop table if exists sys_dict_data;
create table sys_dict_data
(
  dict_code        bigint(20)      not null auto_increment    comment '字典编码',
  dict_sort        int(4)          default 0                  comment '字典排序',
  dict_label       varchar(100)    default ''                 comment '字典标签',
  dict_value       varchar(100)    default ''                 comment '字典键值',
  dict_type        varchar(100)    default ''                 comment '字典类型',
  css_class        varchar(100)    default ''                 comment '样式属性（其他样式扩展）',
  list_class       varchar(100)    default ''                 comment '表格回显样式',
  is_default       char(1)         default 'N'                comment '是否默认（Y是 N否）',
  status           char(1)         default '0'                comment '状态（0正常 1停用）',
  create_by        varchar(64)     default ''                 comment '创建者',
  create_time      datetime                                   comment '创建时间',
  update_by        varchar(64)     default ''                 comment '更新者',
  update_time      datetime                                   comment '更新时间',
  remark           varchar(500)    default ''                 comment '备注',
  primary key (dict_code)
) engine=innodb auto_increment=100 comment = '字典数据表';

insert into sys_dict_data values(1,  1,  '男',       '0',       'sys_user_sex',        '',   '',        'Y', '0', '1', sysdate(), '', null, '性别男');
insert into sys_dict_data values(2,  2,  '女',       '1',       'sys_user_sex',        '',   '',        'N', '0', '1', sysdate(), '', null, '性别女');
insert into sys_dict_data values(3,  3,  '未知',     '2',       'sys_user_sex',        '',   '',        'N', '0', '1', sysdate(), '', null, '性别未知');
insert into sys_dict_data values(4,  1,  '显示',     '0',       'sys_show_hide',       '',   'primary', 'Y', '0', '1', sysdate(), '', null, '显示菜单');
insert into sys_dict_data values(5,  2,  '隐藏',     '1',       'sys_show_hide',       '',   'danger',  'N', '0', '1', sysdate(), '', null, '隐藏菜单');
insert into sys_dict_data values(6,  1,  '正常',     '0',       'sys_normal_disable',  '',   'primary', 'Y', '0', '1', sysdate(), '', null, '正常状态');
insert into sys_dict_data values(7,  2,  '停用',     '1',       'sys_normal_disable',  '',   'danger',  'N', '0', '1', sysdate(), '', null, '停用状态');
insert into sys_dict_data values(12, 1,  '是',       'Y',       'sys_yes_no',          '',   'primary', 'Y', '0', '1', sysdate(), '', null, '系统默认是');
insert into sys_dict_data values(13, 2,  '否',       'N',       'sys_yes_no',          '',   'danger',  'N', '0', '1', sysdate(), '', null, '系统默认否');
insert into sys_dict_data values(14, 1,  '通知',     '1',       'sys_notice_type',     '',   'warning', 'Y', '0', '1', sysdate(), '', null, '通知');
insert into sys_dict_data values(15, 2,  '公告',     '2',       'sys_notice_type',     '',   'success', 'N', '0', '1', sysdate(), '', null, '公告');
insert into sys_dict_data values(16, 1,  '正常',     '0',       'sys_notice_status',   '',   'primary', 'Y', '0', '1', sysdate(), '', null, '正常状态');
insert into sys_dict_data values(17, 2,  '关闭',     '1',       'sys_notice_status',   '',   'danger',  'N', '0', '1', sysdate(), '', null, '关闭状态');

-- ----------------------------
-- 8、参数配置表
-- ----------------------------
drop table if exists sys_config;
create table sys_config (
  config_id         int(5)          not null auto_increment    comment '参数主键',
  config_name       varchar(100)    default ''                 comment '参数名称',
  config_key        varchar(100)    default ''                 comment '参数键名',
  config_value      varchar(500)    default ''                 comment '参数键值',
  config_type       char(1)         default 'N'                comment '系统内置（Y是 N否）',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time       datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  remark            varchar(500)    default ''                 comment '备注',
  primary key (config_id)
) engine=innodb auto_increment=100 comment = '参数配置表';

insert into sys_config values(1, '用户管理-账号初始密码', 'initPassword', '123456', 'Y', '1', sysdate(), '', null, '初始化密码 123456' );
insert into sys_config values(2, '本地内容下载前缀路径', 'localDownloadUrl', 'http://localhost:3001', 'Y', '1', sysdate(), '', null, '本地内容下载前缀路径' );
-- ----------------------------
-- 9、定时任务调度表
-- ----------------------------
drop table if exists sys_job;
create table sys_job (
  job_id              bigint(20)    not null auto_increment    comment '任务ID',
  job_name            varchar(64)   default ''                 comment '任务名称',
  job_type            varchar(64)   default ''                 comment '任务类型',
  job_describe        varchar(255)  default ''                 comment '任务描述',
  cron_expression     varchar(255)  default ''                 comment 'cron执行表达式',
  cron_interval       varchar(10)   default ''                 comment '执行间隔',
  cron_timeout        datetime                                 comment '执行时间',
  cron_type           char(1)       default '1'                comment '执行策略（1周期任务 2一次性任务）',
  status              char(1)       default '1'                comment '状态（0正常 1暂停）',
  create_by           varchar(64)   default ''                 comment '创建者',
  create_time         datetime                                 comment '创建时间',
  update_by           varchar(64)   default ''                 comment '更新者',
  update_time         datetime                                 comment '更新时间',
  primary key (job_id)
) engine=innodb auto_increment=100 comment = '定时任务调度表';

-- ----------------------------
-- 10、通知公告表
-- ----------------------------
drop table if exists sys_notice;
create table sys_notice (
  notice_id         int(4)          not null auto_increment    comment '公告ID',
  notice_title      varchar(50)     not null                   comment '公告标题',
  notice_type       char(1)         not null                   comment '公告类型（1通知 2公告）',
  notice_content    text            default null               comment '公告内容',
  status            char(1)         default '0'                comment '公告状态（0正常 1关闭）',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time       datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  remark            varchar(255)    default ''                 comment '备注',
  primary key (notice_id)
) engine=innodb auto_increment=10 comment = '通知公告表';

-- ----------------------------
-- 初始化-公告信息表数据
-- ----------------------------
insert into sys_notice values('1', '温馨提醒：新版本发布啦', '2', '新版本内容', '0', '超级管理员', sysdate(), '', null, '超级管理员');

-- ----------------------------
-- 11、系统访问记录(登录日志)
-- ----------------------------
drop table if exists sys_logininfor;
create table sys_logininfor (
  info_id        bigint(20)     not null auto_increment   comment '访问ID',
  user_name      varchar(50)    default ''                comment '用户账号（手机号）',
  ipaddr         varchar(128)   default ''                comment '登录IP地址',
  login_location varchar(255)   default ''                comment '登录地点',
  user_agent     varchar(255)   default ''                comment '浏览器信息',
  os             varchar(50)    default ''                comment '操作系统',
  status         char(1)        default '0'               comment '登录状态（0成功 1失败）',
  msg            varchar(255)   default ''                comment '提示消息',
  login_time     datetime                                 comment '访问时间',
  primary key (info_id)
) engine=innodb auto_increment=100 comment = '系统访问记录';

-- ----------------------------
-- 12、部门表
-- ----------------------------
drop table if exists sys_dept;
create table sys_dept (
  dept_id           bigint(20)      not null auto_increment    comment '部门id',
  parent_id         bigint(20)      default 0                  comment '父部门id',
  dept_name         varchar(30)     default ''                 comment '部门名称',
  order_num         int(4)          default 0                  comment '显示顺序',
  leader            varchar(20)     default null               comment '负责人',
  phone             varchar(11)     default null               comment '联系电话',
  email             varchar(50)     default null               comment '邮箱',
  status            char(1)         default '0'                comment '部门状态（0正常 1停用）',
  create_by         varchar(64)     default ''                 comment '创建者',
  create_time 	    datetime                                   comment '创建时间',
  update_by         varchar(64)     default ''                 comment '更新者',
  update_time       datetime                                   comment '更新时间',
  primary key (dept_id)
) engine=innodb auto_increment=100 comment = '部门表';

-- ----------------------------
-- 初始化-部门表数据
-- ----------------------------
insert into sys_dept values(1,  0,  '总公司',     1, '', '18088888888', 'ry@qq.com', '0', 'admin', sysdate(), '', null);
insert into sys_dept values(2,  1,  '研发部门',   2, '', '',            'ry@qq.com', '0', 'admin', sysdate(), '', null);
insert into sys_dept values(3,  1,  '市场部门',   3, '', '',            'ry@qq.com', '0', 'admin', sysdate(), '', null);
insert into sys_dept values(4,  1,  '财务部门',   4, '', '',            'ry@qq.com', '0', 'admin', sysdate(), '', null);

-- ----------------------------
-- 13、岗位信息表
-- ----------------------------
drop table if exists sys_post;
create table sys_post
(
  post_id       bigint(20)      not null auto_increment    comment '岗位ID',
  post_code     varchar(64)     not null                   comment '岗位编码',
  post_name     varchar(50)     not null                   comment '岗位名称',
  post_sort     int(4)          not null                   comment '显示顺序',
  status        char(1)         not null                   comment '状态（0正常 1停用）',
  create_by     varchar(64)     default ''                 comment '创建者',
  create_time   datetime                                   comment '创建时间',
  update_by     varchar(64)     default ''			           comment '更新者',
  update_time   datetime                                   comment '更新时间',
  remark        varchar(500)    default ''                 comment '备注',
  primary key (post_id)
) engine=innodb auto_increment=10 comment = '岗位信息表';

-- ----------------------------
-- 初始化-岗位信息表数据
-- ----------------------------
insert into sys_post values(1, 'ceo',  '董事长',    1, '0', 'admin', sysdate(), '', null, '');
insert into sys_post values(2, 'se',   '部长',      2, '0', 'admin', sysdate(), '', null, '');
insert into sys_post values(3, 'user', '普通员工',  3, '0', 'admin', sysdate(), '', null, '');

-- ----------------------------
-- 14、角色和部门关联表  角色1-N部门
-- ----------------------------
drop table if exists sys_role_dept;
create table sys_role_dept (
  role_id   bigint(20) not null comment '角色ID',
  dept_id   bigint(20) not null comment '部门ID',
  primary key(role_id, dept_id)
) engine=innodb comment = '角色和部门关联表';

-- ----------------------------
-- 15、用户与岗位关联表  用户1-N岗位
-- ----------------------------
drop table if exists sys_user_post;
create table sys_user_post
(
  user_id   bigint(20) not null comment '用户ID',
  post_id   bigint(20) not null comment '岗位ID',
  primary key (user_id, post_id)
) engine=innodb comment = '用户与岗位关联表';
