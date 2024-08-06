<template>
  <div class="login">
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">后台管理系统</h3>
      <el-form-item prop="phonenumber">
        <el-input
          v-model.trim="loginForm.phonenumber"
          type="text"
          size="large"
          auto-complete="off"
          placeholder="账号(手机号)"
        >
          <template #prefix>
            <svg-icon icon-class="user" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model.trim="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
          <template #prefix>
            <svg-icon icon-class="password" class="el-input__icon input-icon" />
          </template>
        </el-input>
      </el-form-item>
      <el-checkbox v-model="loginForm.rememberMe" style="margin: 0 0 25px">记住密码</el-checkbox>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="large"
          type="primary"
          style="width: 100%"
          @click.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2023 ruoyi.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cookies from 'js-cookie'
import useUserStore from '@/store/modules/user'

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance() as any

const loginForm = ref({
  phonenumber: '',
  password: '',
  rememberMe: false
})

const loginRules = {
  phonenumber: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }]
}

const loading = ref(false)

const redirect = ref()

watch(
  route,
  (newRoute) => {
    redirect.value = newRoute.query && newRoute.query.redirect
  },
  { immediate: true }
)

function handleLogin() {
  proxy.$refs.loginRef.validate((valid: any) => {
    if (valid) {
      loading.value = true
      // 勾选了需要记住密码设置在 cookie 中设置记住用户名和密码
      if (loginForm.value.rememberMe) {
        Cookies.set('phonenumber', loginForm.value.phonenumber, { expires: 30 })
        Cookies.set('password', loginForm.value.password, { expires: 30 })
        Cookies.set('rememberMe', loginForm.value.rememberMe, { expires: 30 })
      } else {
        // 否则移除
        Cookies.remove('phonenumber')
        Cookies.remove('password')
        Cookies.remove('rememberMe')
      }
      // 调用action的登录方法
      userStore
        .login(loginForm.value.phonenumber, loginForm.value.password)
        .then(() => {
          const query = route.query
          const otherQueryParams = Object.keys(query).reduce((acc: any, cur) => {
            if (cur !== 'redirect') {
              acc[cur] = query[cur]
            }
            return acc
          }, {})
          router.push({ path: redirect.value || '/', query: otherQueryParams })
        })
        .catch(() => {
          loading.value = false
        })
    }
  })
}

function getCode() {
  userStore.getPublicKey()
}

function getCookie() {
  const phonenumber = Cookies.get('phonenumber')
  const password = Cookies.get('password')
  const rememberMe = Cookies.get('rememberMe')
  loginForm.value = {
    phonenumber: phonenumber || '18088888888',
    password: password || '123456',
    rememberMe: rememberMe ? Boolean(rememberMe) : false
  }
}

getCode()
getCookie()
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url('../../assets/images/login-background.jpg');
  background-size: cover;
}

.title {
  margin: 0 auto 30px;
  color: #707070;
  text-align: center;
}

.login-form {
  width: 400px;
  padding: 25px 25px 5px;
  background: #fff;
  border-radius: 6px;

  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .input-icon {
    width: 14px;
    height: 39px;
    margin-left: 0;
  }
}

.login-tip {
  font-size: 13px;
  color: #bfbfbf;
  text-align: center;
}

.el-login-footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 40px;
  font-family: Arial;
  font-size: 12px;
  line-height: 40px;
  letter-spacing: 1px;
  color: #fff;
  text-align: center;
}
</style>
