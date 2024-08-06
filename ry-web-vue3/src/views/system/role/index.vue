<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="角色状态"
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
          v-hasPermi="['system:role:add']"
        >
          新增
        </el-button>
      </el-col>
    </el-row>

    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="roleList">
      <el-table-column label="角色编号" prop="roleId" width="120" />
      <el-table-column label="角色名称" prop="roleName" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="权限字符" prop="roleKey" :show-overflow-tooltip="true" width="150" />
      <el-table-column label="显示顺序" prop="roleSort" width="100" />
      <el-table-column label="状态" align="center" width="100">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
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
          <el-dropdown trigger="click" v-if="scope.row.roleId != '1'">
            <el-button link type="primary">
              更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-button
                    link
                    type="primary"
                    icon="Edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['system:role:edit']"
                    >修改
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    link
                    type="primary"
                    icon="Delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['system:role:remove']"
                    >删除
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    link
                    type="primary"
                    icon="User"
                    @click="handleAuthUser(scope.row)"
                    v-hasPermi="['system:role:allocation']"
                    >分配用户
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button link type="primary" icon="User" @click="handleDataScope(scope.row)"
                    >数据权限
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

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="roleRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item>
          <template #label>
            <span>
              <el-tooltip
                content="控制器中定义的权限字符枚举，如：@RequireRoles(`admin`)"
                placement="top"
              >
                <el-icon><question-filled /></el-icon>
              </el-tooltip>
              权限字符
            </span>
          </template>
          <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="角色顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">
              {{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event)">
            展开/折叠
          </el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event)">
            全选/全不选
          </el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event)">
            父子联动
          </el-checkbox>
          <el-tree
            class="tree-border"
            :data="menuOptions"
            show-checkbox
            ref="menuRef"
            node-key="id"
            :check-strictly="!form.menuCheckStrictly"
            empty-text="加载中，请稍候"
            :props="{ label: 'label', children: 'children' }"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title" v-model="openDataScope" width="500px" append-to-body>
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <el-form-item label="权限字符">
          <el-input v-model="form.roleKey" :disabled="true" />
        </el-form-item>
        <el-form-item label="数据权限">
          <el-tree
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            :check-strictly="true"
            ref="refdept"
            node-key="id"
            empty-text="加载中，请稍候"
            :props="{ label: 'label', children: 'children' }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitDataScope">确 定</el-button>
          <el-button @click="closeDataScope">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Role'
})
import { addRole, delRole, getRole, listRole, updateRole, dataScope } from '@/api/system/role'
import { roleMenuTreeselect, treeselect as menuTreeselect } from '@/api/system/menu'
import { RoleForm } from '@/types/system/role'
import { parseDateTime } from '@/utils/plugins/dayjs'
import { DICT_TYPE, getDictOptions } from '@/utils/tools/dict'
import { deptTreeSelect } from '@/api/system/role'

const router = useRouter()
const { proxy } = getCurrentInstance() as any
const sys_normal_disable = getDictOptions(DICT_TYPE.sys_normal_disable)

const roleList = ref([])
const open = ref(false)
const loading = ref(true)
const total = ref(0)
const title = ref('')

const menuOptions = ref([])
const menuExpand = ref(false)
const menuNodeAll = ref(false)

const menuRef: any = ref(null)

let queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  roleName: undefined,
  status: undefined
})
let form = ref<RoleForm>({
  roleName: '',
  roleKey: 'common',
  roleSort: 0,
  menuCheckStrictly: false,
  remark: '',
  status: '0'
})

let rules = ref({
  roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
  roleSort: [{ required: true, message: '角色顺序不能为空', trigger: 'blur' }]
})

// 是否显示弹出层（数据权限）
const openDataScope = ref(false)
const deptOptions = ref([])
/** 查询部门下拉树结构 */
function getDeptTree(roleId = '') {
  deptTreeSelect(roleId).then((response) => {
    deptOptions.value = response.data
    return response.data
  })
}
/** 分配数据权限操作 */
const refdept = ref()
function handleDataScope(row: any) {
  deptTreeSelect(row.roleId).then((res) => {
    const deptTreeSelect = res.data.map((item: { deptId: string }) => item.deptId)
    getRole(row.roleId).then((response) => {
      form.value = response.data
      openDataScope.value = true
      title.value = '分配数据权限'
      nextTick(() => {
        refdept.value.setCheckedKeys(deptTreeSelect)
      })
    })
  })
}
// 确定数据权限范围
const submitDataScope = () => {
  let deptIds = refdept.value.getCheckedKeys()
  // 半选中的菜单节点
  let halfCheckedKeys = refdept.value.getHalfCheckedKeys()
  deptIds.unshift.apply(deptIds, halfCheckedKeys)
  if (deptIds.length === 0) {
    proxy.$modal.msgError('请选择数据权限')
    return
  }
  const params = {
    roleId: form.value.roleId,
    deptIds: deptIds
  }
  dataScope(params).then(() => {
    proxy.$modal.msgSuccess('修改成功')
    openDataScope.value = false
    getList()
  })
}
const closeDataScope = () => {
  openDataScope.value = false
}

/** 查询角色列表 */
function getList() {
  loading.value = true
  listRole(queryParams.value).then((response: any) => {
    roleList.value = response.data.rows
    total.value = response.data.total
    loading.value = false
  })
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}
/** 删除按钮操作 */
function handleDelete(row: any) {
  const roleIds = row.roleId
  proxy.$modal
    .confirm('是否确认删除"' + row.roleName + '"的数据项?')
    .then(function () {
      return delRole(roleIds)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}
/** 分配用户 */
function handleAuthUser(row: any) {
  router.push('/system/role-auth/user/' + row.roleId)
}
/** 查询菜单树结构 */
function getMenuTreeselect() {
  menuTreeselect().then((response: any) => {
    menuOptions.value = response.data
  })
}
/** 重置新增的表单以及其他数据  */
function reset() {
  if (menuRef.value != undefined) {
    menuRef.value.setCheckedKeys([])
  }
  menuExpand.value = false
  menuNodeAll.value = false

  form.value = {
    roleId: undefined,
    roleName: '',
    roleKey: 'common',
    roleSort: 0,
    status: '0',
    menuIds: [],
    menuCheckStrictly: false,
    remark: ''
  }
  proxy.resetForm('roleRef')
}
/** 添加角色 */
function handleAdd() {
  reset()
  open.value = true
  title.value = '添加角色'
}
/** 修改角色 */
async function handleUpdate(row: any) {
  reset()
  const roleId = row.roleId
  getRole(roleId).then((response: any) => {
    form.value = response.data
    form.value.roleSort = Number(form.value.roleSort)
    open.value = true
    nextTick(() => {
      roleMenuTreeselect(roleId)
        .then((res: any) => {
          let checkedKeys = res.data.map((item: { menuId: string }) => item.menuId)
          checkedKeys.forEach((v: any) => {
            nextTick(() => {
              menuRef.value.setChecked(v, true, false)
            })
          })
        })
        .finally(() => {
          form.value.menuCheckStrictly = true
        })
    })
    title.value = '修改角色'
  })
}

/** 树权限（展开/折叠）*/
function handleCheckedTreeExpand(value: any) {
  let treeList: any = menuOptions.value
  for (let i = 0; i < treeList.length; i++) {
    menuRef.value.store.nodesMap[treeList[i].id].expanded = value
  }
}
/** 树权限（全选/全不选） */
function handleCheckedTreeNodeAll(value: any) {
  menuRef.value.setCheckedNodes(value ? menuOptions.value : [])
}
/** 树权限（父子联动） */
function handleCheckedTreeConnect(value: any) {
  form.value.menuCheckStrictly = value ? true : false
}
/** 所有菜单节点数据 */
function getMenuAllCheckedKeys() {
  // 目前被选中的菜单节点
  let checkedKeys = menuRef.value.getCheckedKeys()
  // 半选中的菜单节点
  let halfCheckedKeys = menuRef.value.getHalfCheckedKeys()
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
  return checkedKeys
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs['roleRef'].validate((valid: any) => {
    if (valid) {
      if (form.value.roleId != undefined) {
        form.value.menuIds = getMenuAllCheckedKeys()
        updateRole(form.value).then(() => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        form.value.menuIds = getMenuAllCheckedKeys()
        addRole(form.value).then(() => {
          proxy.$modal.msgSuccess('新增成功')
          open.value = false
          getList()
        })
      }
    }
  })
}
/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}

onBeforeMount(() => {
  getList()
  getDeptTree()
  getMenuTreeselect()
})
</script>
