<template>
  <div class="app-container flex">
    <el-card class="box-card shrink-0 w-80">
      <template #header>
        <div class="clearfix">
          <span>个人信息</span>
        </div>
      </template>
      <div>
        <div class="text-center">
          <userAvatar />
        </div>
        <ul class="list-group list-group-striped">
          <li class="list-group-item">
            <div style="width: 68px" class="flex items-center shrink-0 mr-10px"> 手机号码 </div>
            <div>{{ state.user.phonenumber }}</div>
          </li>
          <li class="list-group-item">
            <div style="width: 68px" class="flex items-center shrink-0 mr-10px"> 所属角色 </div>
            <div>{{ state.roleGroup }}</div>
          </li>
          <li class="list-group-item">
            <div style="width: 68px" class="flex items-center shrink-0 mr-10px"> 所属部门 </div>
            <div>{{ state.user?.dept?.deptName }}</div>
          </li>
        </ul>
      </div>
    </el-card>
    <el-card class="w-full ml-4">
      <template #header>
        <div class="clearfix">
          <span>基本资料</span>
        </div>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基本资料" name="userinfo">
          <el-form ref="userRef" :model="state.user" :rules="state.rules" label-width="100px">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="state.user.nickName" class="w-200px" maxlength="20" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="state.user.email" class="w-200px" maxlength="50" />
            </el-form-item>
            <el-form-item label="性别">
              <el-select v-model="state.user.sex" placeholder="请选择" class="w-200px">
                <el-option
                  v-for="dict in sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submit">保存</el-button>
              <el-button type="danger" @click="close">关闭</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="resetPwd">
          <el-form
            ref="pwdRef"
            :model="state.userPass"
            :rules="state.passRules"
            label-width="100px"
          >
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input
                v-model="state.userPass.oldPassword"
                placeholder="请输入旧密码"
                type="password"
                class="w-200px"
                show-password
              />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="state.userPass.newPassword"
                placeholder="请输入新密码"
                type="password"
                class="w-200px"
                show-password
              />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="state.userPass.confirmPassword"
                placeholder="请确认新密码"
                type="password"
                class="w-200px"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="passSubmit">保存</el-button>
              <el-button type="danger" @click="close">关闭</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="修改手机号" name="resetPhone">
          <el-form
            ref="phoneRef"
            :model="state.userPhone"
            :rules="state.phoneRules"
            label-width="100px"
          >
            <el-form-item label="手机号">
              {{ state.user.phonenumber }}
            </el-form-item>
            <el-form-item label="手机验证码" prop="code">
              <el-input
                v-model="state.userPhone.code"
                placeholder="请输入手机验证码"
                type="password"
                class="w-[200px] mr-[20px]"
                show-password
              />
              <ButtonGetCode :account="state.user.phonenumber"></ButtonGetCode>
            </el-form-item>
            <el-form-item label="新手机号" prop="newPhonenumber">
              <el-input
                v-model="state.userPhone.newPhonenumber"
                placeholder="请输入新手机号"
                class="w-[200px]"
                type="password"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="phoneSubmit">保存</el-button>
              <el-button type="danger" @click="close">关闭</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Profile'
})
import ButtonGetCode from '@/components/Function/ButtonGetCode/index.vue'
import userAvatar from './userAvatar.vue'
import {
  getUserProfile,
  updateUserPhone,
  updateUserProfile,
  updateUserPwd
} from '@/api/system/user'
import { ElMessageBox } from 'element-plus'
import useUserStore from '@/store/modules/user'
import { DICT_TYPE, getDictOptions } from '@/utils/tools/dict'

const { proxy } = getCurrentInstance() as any
const sys_user_sex = getDictOptions(DICT_TYPE.sys_user_sex)

const activeTab = ref('userinfo')
const userStore = useUserStore()

const equalToPassword = (_rule: any, value: any, callback: any) => {
  if (state.userPass.newPassword !== value) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}
const state: any = reactive({
  user: {
    sex: '2',
    nickName: '',
    email: ''
  },
  userPass: {
    oldPassword: '',
    confirmPassword: '',
    newPassword: ''
  },
  userPhone: {
    phonenumber: '',
    code: '',
    newPhonenumber: ''
  },
  // 所属角色列表
  roleGroup: {},
  // 基本资料
  rules: {
    email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }],
    phonenumber: [
      { required: true, message: '手机号码不能为空', trigger: 'blur' },
      {
        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
        message: '请输入正确的手机号码',
        trigger: 'blur'
      }
    ]
  },
  // 修改密码
  passRules: {
    oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
    newPassword: [
      { required: true, message: '新密码不能为空', trigger: 'blur' },
      { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
      { required: true, message: '确认密码不能为空', trigger: 'blur' },
      { required: true, validator: equalToPassword, trigger: 'blur' }
    ]
  },
  phoneRules: {
    code: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
    newPhonenumber: [{ required: true, message: '新手机号不能为空', trigger: 'blur' }]
  }
})

function getUser() {
  getUserProfile().then((response: any) => {
    state.user = response.data.user
    const roles = response.data.roles
    state.roleGroup = roles.map((item: any) => item.roleName)
  })
}

/** 提交按钮 */
function submit() {
  proxy.$refs.userRef.validate((valid: any) => {
    if (valid) {
      let params = {
        email: state.user.email,
        sex: state.user.sex,
        nickName: state.user.nickName,
        userId: state.user.userId
      }
      updateUserProfile(params).then(() => {
        proxy.$modal.msgSuccess('修改成功')
        getUser()
      })
    }
  })
}

/** 密码提交按钮 */
function passSubmit() {
  proxy.$refs.pwdRef.validate((valid: any) => {
    if (valid) {
      updateUserPwd(state.userPass.oldPassword, state.userPass.newPassword).then(() => {
        proxy.$modal.msgSuccess('修改成功')
        userStore.logOut().then(() => {
          location.href = '/index'
        })
      })
    }
  })
}

/**手机修改提交按钮 */
function phoneSubmit() {
  proxy.$refs.phoneRef.validate((valid: any) => {
    if (valid) {
      ElMessageBox.confirm(`确定修改手机号为"${state.userPhone.newPhonenumber}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          updateUserPhone(state.userPhone).then(() => {
            proxy.$modal.msgSuccess('修改成功')
            getUser()
          })
        })
        .catch(() => {})
    }
  })
}
/** 关闭按钮 */
function close() {
  proxy.$tab.closePage()
}

onBeforeMount(() => {
  getUser()
})
</script>

<style lang="scss" scoped>
.list-group-striped > .list-group-item {
  padding-right: 0;
  padding-left: 0;
  border-right: 0;
  border-left: 0;
  border-radius: 0;
}

.list-group {
  padding-left: 0;
  list-style: none;
}

.list-group-item {
  padding: 11px 0;
  margin-bottom: -1px;
  font-size: 13px;
  border-top: 1px solid #e7eaec;
  border-bottom: 1px solid #e7eaec;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
