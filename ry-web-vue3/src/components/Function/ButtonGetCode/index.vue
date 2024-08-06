<template>
  <!--获取验证码组件，点击获取验证码进入倒计时，禁止点击，倒计时结束可以再次获取验证码 最好对应相关的表单字段-->
  <div class="button-getCode">
    <el-button class="getCode-button-btn" @click="getCode" :disabled="canGet">
      {{ codeText }}
    </el-button>
  </div>
</template>

<script lang="ts">
import { verifyCode } from '@/api/login'
import { ElMessage } from 'element-plus'
export default {
  name: 'ButtonGetCode',
  props: {
    account: {
      // 邮寄或者邮箱的账号
      required: true,
      type: String,
      default: ''
    },
    // eslint-disable-next-line vue/require-prop-types
    type: {
      // 在不同环境情况下获取验证码需要传入的参数
      required: false,
      default: 'updatePhone'
    }
  },
  data() {
    return {
      codeText: '获取验证码', // 获取验证码
      timer: -1, // 定时器取名
      canGet: false, // 是否可以获取验证码
      phoneReg: /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/
    }
  },
  beforeUnmount() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    getCode() {
      // 检测是否输入了邮箱或者手机号
      if (!this.account) {
        ElMessage.warning('请先输入手机号')
        return
      }
      // 验证邮箱或者手机号是否正确
      if (this.phoneReg.test(this.account)) {
        this.canGet = true
        let countDown = 60
        this.codeText = countDown + 's'
        setTimeout
        this.timer = setInterval(() => {
          if (--countDown <= 0) {
            clearInterval(this.timer)
            this.codeText = '获取验证码'
            this.canGet = false
            return
          }
          this.codeText = countDown + 's'
        }, 1000)
        let params = {
          phone: this.account,
          messageType: this.type
        }
        // 调用接口获取验证码
        verifyCode(params)
          .then(() => {})
          .catch(() => {
            clearInterval(this.timer)
            this.codeText = '获取验证码'
            this.canGet = false
          })
      } else {
        ElMessage.warning('手机号格式不正确！')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.button-getCode {
  .getCode-button-btn {
  }
}
</style>
