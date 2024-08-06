<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="140px">
      <el-form-item label="用户账号（手机号）" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户账号（手机号）"
          clearable
          style="width: 240px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="登录时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table ref="tables" v-loading="loading" :data="list">
      <el-table-column label="访问编号" align="center" prop="infoId" />
      <el-table-column
        label="用户账号（手机号）"
        align="center"
        width="180"
        prop="userName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="登录ip地址"
        align="center"
        prop="ipaddr"
        width="130"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="浏览器信息(UserAgent)"
        align="center"
        prop="userAgent"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="登录状态" align="center" prop="status">
        <template #default="scope">
          {{ scope.row.status === '0' ? '成功' : '失败' }}
        </template>
      </el-table-column>
      <el-table-column label="操作信息" align="center" prop="msg" :show-overflow-tooltip="true" />
      <el-table-column label="登录日期" align="center" prop="loginTime" width="180">
        <template #default="scope">
          <span>{{ parseDateTime(scope.row.loginTime) }}</span>
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
  </div>
</template>

<script lang="ts" setup>
import { loginlist } from '@/api/monitor/logininfor'
import { addDateRange } from '@/utils/common'
import { ref } from 'vue'
import { parseDateTime } from '@/utils/plugins/dayjs'
const loading = ref(false) // 遮罩层
const total = ref(0)
const list = ref([])
const dateRange = ref()
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  ipaddr: undefined,
  userName: undefined,
  status: undefined
})
/** 查询登录日志列表 */
function getList() {
  loading.value = true
  loginlist(addDateRange(queryParams.value, dateRange.value)).then((response: any) => {
    list.value = response.data.rows
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
  dateRange.value = []
  queryParams.value = {
    pageNum: 1,
    pageSize: 10,
    ipaddr: undefined,
    userName: undefined,
    status: undefined
  }
  getList()
}

onBeforeMount(() => {
  getList()
})
</script>
