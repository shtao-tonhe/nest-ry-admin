<template>
  <!-- 文件导入组件 -->
  <div>
    <div>
      <slot></slot>
      <!-- 用户导入对话框 -->
      <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
        <div class="text-center mb-4">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
          >
            点击下载模板
          </el-link>
        </div>
        <el-upload
          ref="uploadRef"
          :limit="1"
          accept=".xlsx, .xls"
          action="#"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :http-request="uploadLicencePicNo"
          :auto-upload="false"
          drag
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <template #footer>
          <div class="dialog-footer">
            <el-button type="primary" @click="submitFileForm">确 定</el-button>
            <el-button @click="upload.open = false">取 消</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getModelType } from '@/api/file'
import { ElLoading, UploadRequestOptions } from 'element-plus'
const { proxy } = getCurrentInstance() as any
const props = defineProps({
  // 下载模板类型
  modelType: {
    require: true,
    type: String
  },
  // 上传导入的方法
  uploadMethod: {
    require: true,
    type: Function,
    default: () => {}
  }
})
/*** 导入参数 */
const upload = reactive({
  // 是否显示弹出层（用户导入）
  open: false,
  // 弹出层标题（用户导入）
  title: '',
  // 是否禁用上传
  isUploading: false
})

/** 下载模板操作 */
function importTemplate() {
  getModelType({ type: props.modelType }).then((res) => {
    proxy.download.downloadByUrl(res.data)
  })
}

/**文件上传中处理 */
const handleFileUploadProgress = (_event: any, _file: any, _fileList: any) => {
  upload.isUploading = true
}

/** 提交上传文件 */
function submitFileForm() {
  proxy.$refs['uploadRef'].submit()
}
/** 上传成功 */
async function uploadLicencePicNo(_files: UploadRequestOptions) {
  // 调用上传接口将文件传递给后台
  let formData = new FormData()
  formData.append('file', _files.file)
  const loadingInstance = ElLoading.service({ fullscreen: true })
  await props.uploadMethod(formData)
  proxy.$refs['uploadRef'].clearFiles()
  loadingInstance.close()
  upload.open = false
}

/** 打开导入操作 */
function openImport() {
  upload.title = '导入'
  upload.open = true
}

defineExpose({
  openImport
})
</script>
