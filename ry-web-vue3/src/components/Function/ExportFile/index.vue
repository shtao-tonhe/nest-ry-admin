<template>
  <div>
    <!-- 文件导出组件 -->
    <el-popover :visible="visible" placement="bottom" :width="220">
      <div style="text-align: center; margin-bottom: 12px">确定导出该搜索条件的数据？</div>
      <div style="text-align: right">
        <el-button size="small" text @click="visible = false">取消</el-button>
        <el-button size="small" type="primary" @click="handleExportConfirm">确定</el-button>
      </div>
      <template #reference>
        <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ElLoading } from 'element-plus'

const props = defineProps({
  // 导出的方法
  exportMethod: {
    require: true,
    type: Function,
    default: () => {}
  }
})
const visible = ref(false)
/** 导出按钮 */
function handleExport() {
  visible.value = true
}
/** 导出操作 */
async function handleExportConfirm() {
  const loadingInstance = ElLoading.service({ fullscreen: true })
  await props.exportMethod()
  loadingInstance.close()
  visible.value = false
}
</script>
