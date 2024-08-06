<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="字典名称" prop="dictName">
        <el-input
          v-model="queryParams.dictName"
          placeholder="请输入字典名称"
          clearable
          style="width: 200px"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="字典类型" prop="dictType">
        <el-input
          v-model="queryParams.dictType"
          placeholder="请输入字典类型"
          clearable
          style="width: 200px"
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
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['system:dict:add']"
        >
          新增
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="typeList">
      <el-table-column label="字典编号" align="center" prop="dictId" />
      <el-table-column
        label="字典名称"
        align="center"
        prop="dictName"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="字典类型" align="center" :show-overflow-tooltip="true">
        <template #default="scope">
          <el-button type="primary" link @click="openDrawer(scope.row)">
            <span>{{ scope.row.dictType }}</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <dict-tag :options="sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
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
          <el-dropdown trigger="click">
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
                    v-hasPermi="['system:dict:edit']"
                  >
                    修改
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    link
                    type="primary"
                    icon="Delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['system:dict:remove']"
                  >
                    删除
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="dictRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input
            :disabled="typeDataListTotal !== 0"
            v-model="form.dictType"
            placeholder="请输入字典类型"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio v-for="dict in sys_normal_disable" :key="dict.value" :label="dict.value">{{
              dict.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
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

    <!-- 字典类型数据 -->
    <el-drawer v-model="visible" size="60%" :title="dataTile" class="dict-drawer-box">
      <DataComponent ref="dataComponent"></DataComponent>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Dict'
})
import DataComponent from './data.vue'
import { listType, getType, delType, addType, updateType } from '@/api/system/dict/type'
import { listData } from '@/api/system/dict/data'
import { DICT_TYPE, getDictOptions } from '@/utils/tools/dict'
import { parseDateTime } from '@/utils/plugins/dayjs'

const { proxy } = getCurrentInstance() as any
const sys_normal_disable = getDictOptions(DICT_TYPE.sys_normal_disable)

const typeList = ref([])
const open = ref(false)
const loading = ref(true)

const total = ref(0)
const title = ref('')

const visible = ref(false)
const dataComponent = ref()
const dataTile = ref()
const openDrawer = (row: any) => {
  visible.value = true
  dataTile.value = row.dictName + `---${row.dictType}---详细数据`
  nextTick(() => {
    proxy.$refs['dataComponent'].openVisible(row)
  })
}

const form = ref()
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  dictName: undefined,
  dictType: undefined,
  status: undefined
})
const rules = ref({
  dictName: [{ required: true, message: '字典名称不能为空', trigger: 'blur' }],
  dictType: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }]
})

/** 查询字典类型列表 */
function getList() {
  loading.value = true
  listType(queryParams.value).then((response: any) => {
    typeList.value = response.data.rows
    total.value = response.data.total
    loading.value = false
  })
}
/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}
/** 表单重置 */
function reset() {
  form.value = {
    dictId: undefined,
    dictName: undefined,
    dictType: undefined,
    status: '0',
    remark: undefined
  }
  proxy.resetForm('dictRef')
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
const typeDataListTotal = ref(0)
/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  typeDataListTotal.value = 0
  title.value = '添加字典类型'
}
/** 修改按钮操作 */
function handleUpdate(row: any) {
  reset()
  const dictId = row.dictId
  getType(dictId).then((response) => {
    form.value = response.data
    open.value = true
    title.value = '修改字典类型'
  })
  listData({ pageNum: 1, pageSize: 10, dictType: row.dictType }).then((res) => {
    typeDataListTotal.value = res.data.total
  })
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs['dictRef'].validate((valid: any) => {
    if (valid) {
      if (form.value.dictId != undefined) {
        updateType(form.value).then(() => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          getList()
        })
      } else {
        addType(form.value).then(() => {
          proxy.$modal.msgSuccess('新增成功')
          open.value = false
          getList()
        })
      }
    }
  })
}
/** 删除按钮操作 */
function handleDelete(row: any) {
  const dictIds = row.dictId
  proxy.$modal
    .confirm('是否确认删除字典编号为"' + dictIds + '"的数据项？')
    .then(function () {
      return delType(dictIds)
    })
    .then(() => {
      getList()
      proxy.$modal.msgSuccess('删除成功')
    })
    .catch(() => {})
}

onBeforeMount(() => {
  getList()
})
</script>

<style lang="scss">
.dict-drawer-box {
  .el-drawer__header {
    margin-bottom: 0;
  }
}
</style>
