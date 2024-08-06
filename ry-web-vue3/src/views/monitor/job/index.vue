<template>
  <!-- 定时任务由后端人员设定的任务名称枚举决定 -->
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true">
      <el-form-item label="任务名称" prop="jobName">
        <el-input
          v-model="queryParams.jobName"
          placeholder="请输入任务名称"
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
          v-hasPermi="['monitor:job:add']"
          >新增</el-button
        >
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="jobList">
      <el-table-column label="任务编号" width="100" align="center" prop="jobId" />
      <el-table-column label="任务名称" align="center" prop="jobName" />
      <el-table-column label="任务类型" align="center" prop="jobType" />
      <el-table-column label="执行方式" align="center" prop="cronType">
        <template #default="scope">
          {{ scope.row.cronType == '1' ? '周期任务' : '一次性任务' }}
        </template>
      </el-table-column>
      <el-table-column
        label="cron执行表达式"
        align="center"
        prop="cronExpression"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="任务描述"
        align="center"
        prop="jobDescribe"
        :show-overflow-tooltip="true"
      >
        <template #default="scope">
          {{ scope.row.jobDescribe ? scope.row.jobDescribe : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="是否已过期" align="center" prop="cronType">
        <template #default="scope">
          <span v-if="scope.row.cronType == '1'">-</span>
          <div v-else>
            <span v-if="checkTimeIsOut(scope.row, 'check')">已过期</span>
            <CountDown v-else :seconds="Number(checkTimeIsOut(scope.row, 'number'))"></CountDown>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-switch
            v-hasPermi="['monitor:job:status']"
            v-if="scope.row.cronType === '1'"
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
            @change="handleStatusChange(scope.row)"
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
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
                    v-hasPermi="['monitor:job:edit']"
                  >
                    修改
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    link
                    type="primary"
                    icon="CaretRight"
                    @click="handleRun(scope.row)"
                    v-hasPermi="['monitor:job:once']"
                  >
                    执行一次
                  </el-button>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-button
                    link
                    type="primary"
                    icon="View"
                    @click="handleView(scope.row)"
                    v-hasPermi="['monitor:job:detail']"
                  >
                    任务详细
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

    <!-- 添加或修改定时任务对话框 -->
    <el-dialog :title="title" v-model="open" width="400px" append-to-body>
      <el-form ref="jobRef" :model="form" :rules="rules" label-width="110px">
        <el-row>
          <template v-if="!form.jobId">
            <el-col :span="24">
              <el-form-item prop="jobName">
                <template #label>
                  <span>
                    <el-tooltip placement="top">
                      <template #content>
                        <div> 由后端人员设定的定时任务名称枚举 </div>
                      </template>
                      <el-icon><question-filled /></el-icon>
                    </el-tooltip>
                    任务名称：
                  </span>
                </template>
                <el-select v-model="form.jobName" placeholder="请输入任务名称" @change="selectName">
                  <el-option v-for="item in jobNameList" :key="item.name" :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="任务类型：" prop="jobType">
                {{ jobTypeFormat ? jobTypeFormat : '请选择任务名称' }}
              </el-form-item>
            </el-col>
          </template>
          <template v-if="form.jobType == 'cron'">
            <el-col :span="24">
              <el-form-item label="执行方式：" prop="cronType">
                <el-radio-group
                  v-model="form.cronType"
                  :disabled="true"
                  size="small"
                  @change="form.cronExpression = ''"
                >
                  <el-radio-button label="1">周期任务</el-radio-button>
                  <el-radio-button label="2">一次性任务</el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <template v-if="form.cronType === '1'">
                <el-form-item label="cron表达式：" prop="cronExpression">
                  <el-input v-model.trim="form.cronExpression" placeholder="请输入cron执行表达式">
                  </el-input>
                </el-form-item>
                <div class="text-right mb-[12px]">
                  <el-link
                    type="primary"
                    href="https://crontab.guru"
                    target="_blank"
                    :underline="false"
                  >
                    表达式参考网站：https://crontab.guru
                  </el-link>
                </div>
              </template>
              <template v-if="form.cronType === '2'">
                <el-form-item label="执行时间：" prop="cronExpression">
                  <el-date-picker
                    style="width: 100%"
                    v-model="form.cronExpression"
                    type="datetime"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择执行时间"
                  />
                </el-form-item>
                <div class="text-right mb-[12px]">
                  <el-link type="warning" :underline="false">
                    大于当前时间则开启，小于当前时间则停止
                  </el-link>
                </div>
              </template>
            </el-col>
          </template>
          <template v-if="form.jobType == 'timeout'">
            <el-col :span="24">
              <el-form-item label="执行时间：" prop="cronTimeout">
                <el-date-picker
                  v-model="form.cronTimeout"
                  type="datetime"
                  placeholder="请选择执行时间"
                />
              </el-form-item>
            </el-col>
          </template>
          <template v-if="form.jobType == 'interval'">
            <el-col :span="24">
              <el-form-item label="执行间隔：" prop="cronInterval">
                <el-input-number v-model="form.cronInterval" :min="1" />
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="24">
            <el-form-item label="任务描述：">
              <el-input type="textarea" v-model="form.jobDescribe" placeholder="请输入任务描述" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">{{
            form.cronType === '1' ? '确定' : '确定并启动'
          }}</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 任务日志详细 -->
    <el-dialog title="任务详细" v-model="openView" width="700px" append-to-body>
      <el-descriptions title="基础信息" border :column="2">
        <el-descriptions-item label="任务编号">{{ jobDetail.dataInfo.jobId }}</el-descriptions-item>
        <el-descriptions-item label="任务名称">{{
          jobDetail.dataInfo.jobName
        }}</el-descriptions-item>
        <el-descriptions-item label="任务类型">{{
          jobDetail.dataInfo.jobType
        }}</el-descriptions-item>
        <el-descriptions-item label="执行方式">
          {{ jobDetail.dataInfo.cronType == '1' ? '周期任务' : '一次性任务' }}
        </el-descriptions-item>
        <el-descriptions-item label="任务描述">
          {{ jobDetail.dataInfo.jobDescribe ? jobDetail.dataInfo.jobDescribe : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ jobDetail.dataInfo.createTime ? jobDetail.dataInfo.createTime : '-' }}
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions title="执行信息" border :column="2" class="mt-[20px]">
        <el-descriptions-item label="执行状态" width="120">{{
          jobDetail.jobInfo.running ? '启动' : '暂停'
        }}</el-descriptions-item>
        <el-descriptions-item label="是否一次性任务" width="120">{{
          jobDetail.jobInfo.runOnce ? '是' : '否'
        }}</el-descriptions-item>
        <el-descriptions-item label="最后一次执行时间" width="120">{{
          jobDetail.jobInfo.lastExecution ? jobDetail.jobInfo.lastExecution : '暂无'
        }}</el-descriptions-item>
        <el-descriptions-item label="下五次执行时间" width="120" v-if="!jobDetail.jobInfo.runOnce">
          <div v-for="(item, key) in jobDetail.jobInfo.nextDates" :key="item">
            第{{ key + 1 }}次: {{ item }}
          </div>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="openView = false">关 闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Job'
})
import {
  listJob,
  getJob,
  addJob,
  updateJob,
  runJob,
  changeJobStatus,
  getJobNameList
} from '@/api/monitor/job'
import CountDown from '@/components/Base/CountDown/index.vue'
const { proxy } = getCurrentInstance() as any

const jobList = ref([])
const jobNameList = ref()
// 任务类型
const jobTypeFormat = ref()

const open = ref(false)
const loading = ref(true)

const total = ref(0)
const title = ref('')

const openView = ref(false)
const jobDetail = ref()

const form = ref()
const queryParams = ref({
  pageNum: 1,
  pageSize: 10,
  jobName: undefined
})
const rules = ref({
  jobName: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
  jobType: [{ required: true, message: '请选择任务名称', trigger: 'blur' }],
  cronType: [{ required: true, message: '请选择执行方式', trigger: 'blur' }],
  cronExpression: [{ required: true, message: '请输入cron表达式或选择时间', trigger: 'blur' }],
  cronTimeout: [{ required: true, message: '请选择执行日期', trigger: 'blur' }],
  cronInterval: [{ required: true, message: '请输入执行间隔', trigger: 'blur' }]
})

/** 查询定时任务列表 */
function getList() {
  loading.value = true
  listJob(queryParams.value).then((response) => {
    jobList.value = response.data.rows
    total.value = response.data.total
    loading.value = false
  })
}

// 检查执行方案是否已过期
function checkTimeIsOut(row: any, type: any) {
  if (!row.cronExpression || Number.isNaN(row.cronExpression)) {
    return true
  }
  let time = new Date(row.cronExpression).getTime()
  let currentTime = new Date(Date.now()).getTime()
  if (type == 'check') {
    if (time <= currentTime) {
      return true
    } else {
      return false
    }
  } else {
    if (time > currentTime) {
      return (time - currentTime) / 1000
    }
  }
}

/** 取消按钮 */
function cancel() {
  open.value = false
  reset()
}
/** 表单重置 */
function reset() {
  form.value = {
    jobId: undefined,
    jobName: undefined,
    jobType: undefined,
    jobDescribe: undefined,
    cronExpression: undefined,
    cronType: '1',
    cronTimeout: '',
    cronInterval: '',
    status: '1'
  }
  proxy.resetForm('jobRef')
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
// 任务状态修改
function handleStatusChange(row: any) {
  let text = row.status === '0' ? '启用' : '停用'
  proxy.$modal
    .confirm(`确认要${text}${row.jobName}任务吗?`)
    .then(function () {
      return changeJobStatus({ ...row })
    })
    .then(() => {
      proxy.$modal.msgSuccess(text + '成功')
      getList()
    })
    .catch(function () {
      row.status = row.status === '0' ? '1' : '0'
    })
}
/* 立即执行一次 */
function handleRun(row: any) {
  proxy.$modal
    .confirm(`确认要立即执行一次${row.jobName}任务吗?'`)
    .then(function () {
      return runJob({ ...row })
    })
    .then(() => {
      proxy.$modal.msgSuccess('执行成功')
    })
    .catch(() => {})
}
// 任务名称选中
const selectName = (name: string) => {
  let fItem = jobNameList.value.find((item2: any) => item2.name == name)
  form.value.jobType = fItem.type
  const jobType = {
    cron: 'cron表达式执行-对应-@Cron()',
    interval: '间隔执行-对应-@Interval()',
    timeout: '单次执行-对应-@Timeout()'
  }
  // @ts-ignore
  jobTypeFormat.value = jobType[form.value.jobType]
  form.value.cronType = fItem.cronType
  form.value.jobDescribe = fItem.jobDescribe
  form.value.cronExpression = fItem.initCron
}
/** 任务详细信息 */
function handleView(row: any) {
  getJob(row.jobId).then((response) => {
    jobDetail.value = response.data
    openView.value = true
  })
}
/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = '添加任务'
}
/** 修改按钮操作 */
function handleUpdate(row: any) {
  reset()
  const jobId = row.jobId
  getJob(jobId).then((response) => {
    form.value = response.data.dataInfo
    open.value = true
    title.value = '修改任务'
  })
}
/** 提交按钮 */
function submitForm() {
  proxy.$refs['jobRef'].validate((valid: any) => {
    if (valid) {
      if (form.value.jobId != undefined) {
        updateJob(form.value).then(() => {
          proxy.$modal.msgSuccess('修改成功')
          open.value = false
          if (form.value.cronType == '2') {
            window.location.reload()
          } else {
            getList()
          }
        })
      } else {
        addJob(form.value).then(() => {
          proxy.$modal.msgSuccess('新增成功')
          open.value = false
          getList()
        })
      }
    }
  })
}
onBeforeMount(() => {
  getList()
  getJobNameList().then((res) => {
    jobNameList.value = res.data
  })
})
</script>
