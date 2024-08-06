<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div>部门列表</div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :expand-on-click-node="false"
            ref="deptTree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input
              v-model="queryParams.phonenumber"
              placeholder="请输入手机号码"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="dict in sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间" style="width: 308px">
            <el-date-picker
              v-model="dateRange"
              value-format="YYYY-MM-DD"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="Plus"
              @click="handleAdd"
              v-hasPermi="['system:user:add']"
            >
              新增
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <ImportFile
              ref="ImportFile"
              :uploadMethod="userImportMethod"
              :modelType="ModelType.USER"
            >
              <el-button
                type="info"
                plain
                icon="Upload"
                @click="handleImport"
                v-hasPermi="['system:user:import']"
              >
                导入
              </el-button>
            </ImportFile>
          </el-col>
          <el-col :span="1.5">
            <ExportFile v-hasPermi="['system:user:export']" :exportMethod="userExportMethod" />
          </el-col>
        </el-row>
        <el-table v-loading="loading" :data="userList">
          <el-table-column label="用户编号" align="center" key="userId" prop="userId" />
          <el-table-column
            label="手机号码"
            align="center"
            key="phonenumber"
            prop="phonenumber"
            width="120"
          />
          <el-table-column label="姓名" align="center" prop="realName">
            <template #default="scope">
              {{ scope.row.realName || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            label="昵称"
            align="center"
            prop="nickName"
            :show-overflow-tooltip="true"
          >
            <template #default="scope">
              {{ scope.row.nickName || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="部门" align="center" prop="deptId">
            <template #default="scope">
              {{ scope.row?.dept?.deptName || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" key="status">
            <template #default="scope">
              <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime" width="160">
            <template #default="scope">
              <span>{{ parseDateTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="120"
            class-name="small-padding fixed-width"
          >
            <template #default="scope">
              <el-dropdown trigger="click" v-if="scope.row.userId !== '1'">
                <el-button link type="primary">
                  更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>
                      <el-button
                        link
                        icon="Edit"
                        @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:user:edit']"
                      >
                        修改
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        link
                        icon="Delete"
                        @click="handleDelete(scope.row)"
                        v-hasPermi="['system:user:remove']"
                      >
                        删除
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        link
                        icon="Key"
                        @click="handleResetPwd(scope.row)"
                        v-hasPermi="['system:user:resetPwd']"
                      >
                        重置密码
                      </el-button>
                    </el-dropdown-item>
                    <el-dropdown-item>
                      <el-button
                        link
                        icon="Key"
                        @click="handleAllocation(scope.row)"
                        v-hasPermi="['system:user:allocation']"
                      >
                        分配角色
                      </el-button>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" v-model="open" width="600px" append-to-body>
      <el-form :model="form" :rules="rules" ref="userRef" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input
                v-model="form.phonenumber"
                :disabled="!!form.userId"
                placeholder="请输入手机号码"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="!form.userId">
            <el-form-item label="用户密码" prop="password">
              <el-input
                v-model="form.password"
                placeholder="请输入用户密码"
                type="password"
                :disabled="!!form.userId"
                maxlength="20"
                show-password
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="form.realName" placeholder="请输入姓名" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" :prop="userStore?.deptId ? 'deptId' : ''">
              <el-tree-select
                v-model="form.deptId"
                :data="deptOptions"
                :props="{ value: 'id', label: 'label', children: 'children' }"
                value-key="id"
                clearable
                placeholder="请选择归属部门"
                check-strictly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入昵称" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option
                  v-for="dict in sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证号" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="!form.userId">
            <el-form-item label="角色">
              <template v-if="roleOptionsShow.length !== 0">
                <el-tag :key="tag" v-for="tag in roleOptionsShow" class="m-4px">
                  {{ tag.roleName }}
                </el-tag>
              </template>
              <el-button type="primary" link @click="selectRoles">选择角色</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用户状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="open = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" v-model="roleOpen" width="400px" append-to-body>
      <div class="flex items-center mb8" v-if="selectRoleType">
        <div class="w-[100px] pl-10px text-right flex-shrink-0">手机号码：</div>
        <div class="w-full border-1">
          {{ form.phonenumber }}
        </div>
      </div>
      <div class="flex items-center min-h-[32px]" v-if="selectRoleType">
        <div class="w-[100px] pl-10px text-right flex-shrink-0">拥有角色：</div>
        <div class="w-full border-1">
          <template v-if="roleOptionsShow.length !== 0">
            <el-tag :key="tag" v-for="tag in roleOptionsShow" class="m-4px">
              {{ tag.roleName }}
            </el-tag>
          </template>
          <span v-else>暂无角色</span>
        </div>
      </div>
      <el-divider v-if="selectRoleType" />
      <div class="flex items-center">
        <div class="w-[100px] pl-10px text-right flex-shrink-0">可分配角色：</div>
        <div class="w-full">
          <template v-if="roleOptions.length !== 0">
            <el-checkbox
              v-for="item in roleOptions"
              :key="item.roleId"
              v-model="item.isCheck"
              @change="handleRoles(item)"
            >
              {{ item.roleName }}
            </el-checkbox>
          </template>
          <span v-else>暂无可分配角色,请前往'角色管理'</span>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitRoles">确 定</el-button>
          <el-button @click="roleOpen = false">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'User'
})
import {
  listUser,
  resetUserPwd,
  delUser,
  getUser,
  updateUser,
  addUser,
  updateUserAuthRole,
  userImport,
  userExport,
  getUserRoles,
  deptTreeSelect
} from '@/api/system/user'
import { UserForm } from '@/types/system/user'
import { DICT_TYPE, ModelType, getDictOptions } from '@/utils/tools/dict'
import ExportFile from '@/components/Function/ExportFile/index.vue'
import ImportFile from '@/components/Function/ImportFile/index.vue'
import { addDateRange } from '@/utils/common'
import { parseDateTime } from '@/utils/plugins/dayjs'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()

const { proxy } = getCurrentInstance() as any

const sys_normal_disable = getDictOptions(DICT_TYPE.sys_normal_disable)
const sys_user_sex = getDictOptions(DICT_TYPE.sys_user_sex)

const userList = ref([])
const open = ref(false)
const loading = ref(true)

const total = ref(0)
const title = ref('')
const dateRange = ref()

const roleOptions: any = ref([]) // 当前登录用户的角色列表
const roleOptionsShow: any = ref([]) // 指定用户的角色列表
const roleOpen = ref(false)

const form = ref<UserForm>({
  userId: '',
  deptId: '',
  password: '123456',
  phonenumber: '',
  email: '',
  nickName: '',
  sex: '2',
  status: '0',
  remark: '',
  realName: '',
  idCard: ''
})
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  phonenumber: undefined,
  deptId: '',
  status: ''
})
const rules: any = ref({
  password: [
    { required: true, message: '用户密码不能为空', trigger: 'blur' },
    { min: 6, max: 20, message: '用户密码长度必须介于 6 和 20 之间', trigger: 'blur' }
  ],
  deptId: [{ required: true, message: '部门不能为空', trigger: 'blur' }],
  realName: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
  phonenumber: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ]
})
const deptOptions = ref([])
/** 查询部门下拉树结构 */
function getDeptTree() {
  deptTreeSelect().then((response) => {
    deptOptions.value = response.data
  })
}
const deptTree = ref()
// 部门节点单击事件
const handleNodeClick = (data: any) => {
  queryParams.value.deptId = data.id
  handleQuery()
}

/** 查询用户列表 */
function getList() {
  loading.value = true
  listUser(addDateRange(queryParams.value, dateRange.value)).then((res: any) => {
    loading.value = false
    userList.value = res.data.rows
    total.value = res.data.total
  })
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}
/** 重置按钮操作 */
function resetQuery() {
  dateRange.value = []
  queryParams.value.deptId = ''
  deptTree.value.setCurrentKey(null)
  proxy.resetForm('queryRef')
  handleQuery()
}
/** 删除按钮操作 */
function handleDelete(row: any) {
  const userIds = row.userId
  proxy.$modal
    .confirm('是否确认删除用户数据项？')
    .then(function () {
      return delUser(userIds)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}

/** 重置密码按钮操作 */
function handleResetPwd(row: any) {
  proxy.$modal
    .confirm('确定重置密码', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    .then(() => {
      resetUserPwd(row.userId).then((_response) => {
        proxy.$modal.msgSuccess(_response.data)
      })
    })
    .catch(() => {})
}

/** 导入 */
function userImportMethod(data: any) {
  userImport(data).then(() => {
    getList()
    proxy.$modal.msgSuccess('导入成功')
  })
}

/** 导出 */
function userExportMethod() {
  const params = {
    phonenumber: queryParams.value.phonenumber,
    status: queryParams.value.status
  }
  userExport(addDateRange(params, dateRange.value)).then((result) => {
    proxy.download.downloadByUrl(result.data)
  })
}

/** 新增按钮操作 */
function handleAdd() {
  form.value = {
    userId: '',
    deptId: userStore?.deptId ? userStore?.deptId : '',
    password: '123456',
    phonenumber: '',
    email: '',
    nickName: '',
    sex: '2',
    status: '0',
    remark: '',
    realName: '',
    idCard: ''
  }
  roleOptionsShow.value = []
  // 获取当前登录用户拥有的角色权限
  getUserRoles().then((response: any) => {
    roleOptions.value = response.data.map((item: any) => {
      return {
        ...item,
        isCheck: false
      }
    })
  })
  proxy.resetForm('userRef')
  open.value = true
  title.value = '添加用户'
}
/** 修改按钮操作 */
function handleUpdate(row: any) {
  form.value = {
    userId: row.userId,
    password: '',
    deptId: '',
    phonenumber: '',
    email: '',
    nickName: '',
    sex: '2',
    status: '0',
    remark: '',
    realName: '',
    idCard: ''
  }
  proxy.resetForm('userRef')
  getUser(row.userId).then((response: any) => {
    form.value = response.data.user
    open.value = true
    title.value = '修改用户'
  })
}
const selectRoleType = ref(false)
// 新增选择角色
function selectRoles() {
  roleOpen.value = true
  selectRoleType.value = false
}
/** 分配角色 */
function handleAllocation(row: any) {
  selectRoleType.value = true
  roleOptionsShow.value = []
  getUser(row.userId).then((response: any) => {
    form.value.phonenumber = response.data.user.phonenumber
    form.value.userId = response.data.user.userId
    roleOptionsShow.value = response.data.roles
    // 根据已有角色回显勾选可分配角色
    let userRoles = roleOptionsShow.value
    let currentRoles = roleOptions.value
    // 先全部取消勾选
    currentRoles.forEach((item: any) => {
      item.isCheck = false
    })
    // 在根据实际角色勾选
    for (let i = 0; i < userRoles.length; i++) {
      for (let j = 0; j < currentRoles.length; j++) {
        if (userRoles[i].roleId === currentRoles[j].roleId) {
          currentRoles[j].isCheck = true
        }
      }
    }
    roleOpen.value = true
  })
}
// 用户角色勾选选择
function handleRoles(value: any) {
  if (value.isCheck) {
    roleOptionsShow.value.push(value)
  } else {
    let idx = roleOptionsShow.value.findIndex((item: any) => item.roleId === value.roleId)
    roleOptionsShow.value.splice(idx, 1)
  }
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs['userRef'].validate((valid: any) => {
    if (valid) {
      if (form.value.userId) {
        updateUser(form.value).then(() => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        addUser(form.value).then((res: any) => {
          if (!selectRoleType.value && roleOptionsShow.value.length != 0) {
            updateUserAuthRole({
              userId: res.data.userId,
              roleIds: roleOptionsShow.value.map((item: any) => item.roleId)
            }).then(() => {
              proxy.$modal.msgSuccess('新增成功')
              open.value = false
              getList()
            })
          } else {
            proxy.$modal.msgSuccess('新增成功')
            open.value = false
            getList()
          }
        })
      }
    }
  })
}

/** 提交角色分配 */
function submitRoles() {
  if (selectRoleType.value) {
    updateUserAuthRole({
      userId: form.value.userId,
      roleIds: roleOptionsShow.value.map((item: any) => item.roleId)
    }).then(() => {
      proxy.$modal.msgSuccess('分配成功')
      roleOpen.value = false
      getList()
    })
  } else {
    roleOpen.value = false
  }
}

/** 导入 */
function handleImport() {
  proxy.$refs.ImportFile.openImport()
}

onBeforeMount(() => {
  getList()
  getDeptTree()
  // 获取当前登录用户拥有的角色权限
  getUserRoles().then((response: any) => {
    roleOptions.value = response.data.map((item: any) => {
      return {
        ...item,
        isCheck: false
      }
    })
  })
})
</script>
