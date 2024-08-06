<template>
  <div class="user-info-head" @click="editCropper()">
    <img
      crossorigin="anonymous"
      :src="options.img"
      title="点击上传头像"
      class="img-circle img-lg"
    />
    <el-dialog
      :title="title"
      v-model="open"
      width="500px"
      append-to-body
      @opened="modalOpened"
      @close="closeDialog"
    >
      <el-row>
        <el-col :span="24" :style="{ height: '350px' }">
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :fixedBox="options.fixedBox"
            :outputType="options.outputType"
            v-if="visible"
          />
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :span="6">
          <el-upload
            action="#"
            :http-request="requestUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <el-button>
              选择
              <el-icon class="el-icon--right"><Upload /></el-icon>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :span="3">
          <el-button icon="Plus" @click="changeScale(1)" />
        </el-col>
        <el-col :span="3">
          <el-button icon="Minus" @click="changeScale(-1)" />
        </el-col>
        <el-col :span="3">
          <el-button icon="RefreshLeft" @click="rotateLeft()" />
        </el-col>
        <el-col :span="3">
          <el-button icon="RefreshRight" @click="rotateRight()" />
        </el-col>
        <el-col :span="6">
          <div class="text-right">
            <el-button type="primary" @click="uploadImg()">提 交</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { uploadAvatar } from '@/api/system/user'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const { proxy } = getCurrentInstance() as any

const open = ref(false)
const visible = ref(false)
const title = ref('修改头像')

//图片裁剪数据
const options: any = reactive({
  img: userStore.avatar, // 裁剪图片的地址
  autoCrop: true, // 是否默认生成截图框
  autoCropWidth: 200, // 默认生成截图框宽度
  autoCropHeight: 200, // 默认生成截图框高度
  fixedBox: false, // 固定截图框大小 不允许改变
  outputType: 'png', // 默认生成截图为PNG格式
  previews: {} //预览数据
})

/** 编辑头像 */
function editCropper() {
  open.value = true
}
/** 打开弹出层结束时的回调 */
function modalOpened() {
  visible.value = true
}
/** 覆盖默认上传行为 */
function requestUpload(): any {}
/** 向左旋转 */
function rotateLeft() {
  proxy.$refs.cropper.rotateLeft()
}
/** 向右旋转 */
function rotateRight() {
  proxy.$refs.cropper.rotateRight()
}
/** 图片缩放 */
function changeScale(num: number) {
  num = num || 1
  proxy.$refs.cropper.changeScale(num)
}
/** 上传预处理 */
function beforeUpload(file: Blob) {
  if (file.type.indexOf('image/') == -1) {
    proxy.$modal.msgError('文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。')
  } else {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      options.img = reader.result
    }
  }
}
/** 上传图片 */
function uploadImg() {
  proxy.$refs.cropper.getCropBlob((data: string | Blob) => {
    let formData = new FormData()
    formData.append('avatarfile', data)
    uploadAvatar(formData).then((response: any) => {
      open.value = false
      options.img = response.data
      userStore.avatar = response.data
      proxy.$modal.msgSuccess('修改成功')
      visible.value = false
    })
  })
}
/** 关闭窗口 */
function closeDialog() {
  options.img = userStore.avatar
  options.visible = false
}
</script>

<style lang="scss" scoped>
.img-circle {
  border-radius: 50%;
}

.img-lg {
  width: 120px;
  height: 120px;
}

.user-info-head {
  position: relative;
  display: inline-block;
  height: 120px;
}

.user-info-head:hover::after {
  position: absolute;
  inset: 0;
  font-size: 24px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-style: normal;
  line-height: 110px;
  color: #eee;
  cursor: pointer;
  background: rgb(0 0 0 / 50%);
  border-radius: 50%;
  content: '+';
}
</style>
