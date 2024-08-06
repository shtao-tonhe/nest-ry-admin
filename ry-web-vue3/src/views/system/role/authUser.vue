<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入手机号码"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="openSelectUser">添加用户</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="Close" @click="handleClose">关闭页面</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="userList">
      <el-table-column label="手机" prop="phonenumber" :show-overflow-tooltip="true" />
      <el-table-column label="昵称" align="center" prop="nickName" :show-overflow-tooltip="true">
        <template #default="scope">
          {{ scope.row.nickName || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" align="center" prop="email" :show-overflow-tooltip="true">
        <template #default="scope">
          {{ scope.row.email || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="真实姓名" align="center" prop="realName">
        <template #default="scope">
          {{ scope.row.realName || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseDateTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button
            v-if="scope.row.userId != userInfo.id"
            link
            type="primary"
            icon="CircleClose"
            @click="cancelAuthUser(scope.row)"
            v-hasPermi="['system:role:revoke']"
          >
            取消授权</el-button
          >
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
    <select-user ref="selectRef" :roleId="queryParams.roleId" @ok="handleQuery" />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AuthUser'
})
import useUserStore from '@/store/modules/user'
import selectUser from './selectUser.vue'
import { allocatedUserList, authUserCancel } from '@/api/system/role'
import { parseDateTime } from '@/utils/plugins/dayjs'
import { DICT_TYPE, getDictOptions } from '@/utils/tools/dict'

const route = useRoute()
const { proxy } = getCurrentInstance() as any
const sys_normal_disable = getDictOptions(DICT_TYPE.sys_normal_disable)

const userInfo = useUserStore()

const userList = ref([])
const loading = ref(true)

const total = ref(0)

const queryParams: any = reactive({
  pageNum: 1,
  pageSize: 10,
  roleId: route.params.roleId,
  phonenumber: undefined
})

/** 查询授权用户列表 */
function getList() {
  loading.value = true
  allocatedUserList(queryParams).then((response: any) => {
    userList.value = response.data.rows
    total.value = response.data.total
    loading.value = false
  })
}
// 返回按钮
function handleClose() {
  const obj = { path: '/system/role' }
  proxy.$tab.closeOpenPage(obj)
}
/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1
  getList()
}
/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}
/** 打开授权用户表弹窗 */
function openSelectUser() {
  proxy.$refs['selectRef'].show()
}

/** 取消授权按钮操作 */
function cancelAuthUser(row: { userId: any }) {
  proxy.$modal
    .confirm('确认要取消该用户角色吗？')
    .then(function () {
      return authUserCancel({ userId: row.userId, roleId: queryParams.roleId })
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('取消授权成功')
    })
    .catch(() => {})
}

getList()
</script>
