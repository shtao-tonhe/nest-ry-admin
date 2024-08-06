<template>
  <div class="app-container">
    <el-row>
      <el-card style="width: 100%">
        <div class="flex justify-between items-center">
          <span>缓存监控</span>
          <el-button type="primary" @click="look">查看详情</el-button>
        </div>
      </el-card>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card style="height: calc(100vh - 200px)">
          <template #header>
            <span style="vertical-align: middle">缓存列表</span>
            <el-button
              style="float: right; padding: 3px 0"
              link
              type="primary"
              icon="Refresh"
              @click="refreshCacheNames()"
            >
              刷新
            </el-button>
          </template>
          <el-table
            v-loading="loading"
            :data="cacheNames"
            :height="tableHeight"
            highlight-current-row
            @row-click="getCacheKeys"
            style="width: 100%"
          >
            <el-table-column label="序号" width="60" type="index" />

            <el-table-column
              label="缓存名称"
              align="center"
              prop="cacheName"
              :show-overflow-tooltip="true"
              :formatter="nameFormatter"
            />
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card style="height: calc(100vh - 200px)">
          <template #header>
            <span style="vertical-align: middle">键名列表</span>
          </template>
          <div class="mb-[10px] flex">
            <el-input
              size="small"
              class="w-150px mr-[12px]"
              placeholder="请输入键名"
              v-model="searchValue"
              clearable
            ></el-input>
            <el-button size="small" type="primary" @click.stop="search('search')">搜索</el-button>
            <el-button size="small" @click.stop="search('reset')">重置</el-button>
          </div>
          <el-table
            v-loading="subLoading"
            :data="cacheKeys"
            :height="tableHeight"
            highlight-current-row
            @row-click="handleCacheValue"
            style="width: 100%"
          >
            <el-table-column label="序号" width="60" type="index" />
            <el-table-column
              label="缓存键名"
              align="center"
              :show-overflow-tooltip="true"
              :formatter="keyFormatter"
            />
            <el-table-column
              label="操作"
              width="90"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template #default="scope">
                <el-button
                  link
                  type="primary"
                  icon="Delete"
                  @click="handleClearCacheKey(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card :bordered="false" style="height: calc(100vh - 200px)">
          <template #header>
            <span style="vertical-align: middle">缓存内容</span>
          </template>
          <el-form :model="cacheForm">
            <el-row :gutter="32">
              <el-col :offset="1" :span="22">
                <el-form-item label="缓存名称:" prop="cacheName">
                  {{ cacheForm.cacheName }}
                </el-form-item>
              </el-col>
              <el-col :offset="1" :span="22">
                <el-form-item label="缓存键名:" prop="cacheKey">
                  {{ cacheForm.cacheKey }}
                </el-form-item>
              </el-col>
              <el-col :offset="1" :span="22">
                <el-form-item label="缓存内容:" prop="cacheValue">
                  <div class="w-full" style="overflow: auto">
                    {{ cacheForm.cacheValue }}
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="缓存详细" v-model="openView" width="1000px" append-to-body>
      <Info></Info>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Cache'
})
import { ElLoading } from 'element-plus'
import Info from './info.vue'
import { listCacheName, listCacheKey, getCacheValue, clearCacheKey } from '@/api/monitor/cache'

const { proxy } = getCurrentInstance() as any

const cacheNames = ref([])
const cacheKeys = ref([])
const cacheForm = ref({
  cacheName: '',
  cacheKey: '',
  cacheValue: ''
})

const nowKeysValue = ref()
const nowValues = ref()
const nowKeysName = ref()

const loading = ref(true)
const subLoading = ref(false)
const tableHeight = ref(window.innerHeight - 260)

const openView = ref(false)

const searchValue = ref('')

function search(type: string) {
  subLoading.value = true
  if (type === 'search') {
    listCacheKey(nowKeysValue.value, { searchValue: searchValue.value }).then((response: any) => {
      cacheKeys.value = response.data
      subLoading.value = false
    })
  } else {
    searchValue.value = ''
    listCacheKey(nowKeysValue.value, {}).then((response: any) => {
      cacheKeys.value = response.data
      subLoading.value = false
    })
  }
}

// 查看监控详情
function look() {
  openView.value = true
}

/** 查询缓存名称列表 */
function getCacheNames() {
  loading.value = true
  listCacheName().then((response: any) => {
    cacheNames.value = response.data
    loading.value = false
  })
}

/** 刷新缓存名称列表 */
function refreshCacheNames() {
  getCacheNames()
  proxy.$modal.msgSuccess('刷新缓存列表成功')
}

/** 查询缓存键名列表 */
function getCacheKeys(row: any) {
  subLoading.value = true
  nowKeysValue.value = row.value
  nowKeysName.value = row.cacheName
  listCacheKey(row.value, {}).then((response: any) => {
    cacheKeys.value = response.data
    subLoading.value = false
  })
}

/** 清理指定键名缓存 */
function handleClearCacheKey(item: any) {
  clearCacheKey(item.cacheKey).then(() => {
    proxy.$modal.msgSuccess('清理缓存键名[' + item.cacheKey + ']成功')
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.1)'
    })
    setTimeout(() => {
      getCacheKeys({ value: nowKeysValue.value })
      loading.close()
    }, 1000)
  })
}

/** 列表前缀去除 */
function nameFormatter(row: { cacheName: string }) {
  return row.cacheName.replace(':', '')
}

/** 键名前缀去除 */
function keyFormatter(item: any) {
  return item.cacheKey
}

/** 查询缓存内容详细 */
function handleCacheValue(item: any) {
  nowValues.value = item.cacheKey
  getCacheValue(item.cacheKey).then((response: any) => {
    cacheForm.value.cacheValue = response.data
    cacheForm.value.cacheKey = nowValues.value
    cacheForm.value.cacheName = nowKeysName.value
  })
}

onBeforeMount(() => {
  getCacheNames()
})
</script>
