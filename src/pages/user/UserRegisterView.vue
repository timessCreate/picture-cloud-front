<template>
  <div class="register-container">
    <a-card title="用户注册" class="register-card">
      <a-form
        :model="formState"
        name="register"
        :label-col="{ span: 0 }"
        :wrapper-col="{ span: 24 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          name="userAccount"
          :rules="[{ required: true, message: '请输入账号！' }]"
        >
          <a-input
            v-model:value="formState.userAccount"
            placeholder="请输入账号"
            :size="'large'"
          >
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          name="userPassword"
          :rules="[
            { required: true, message: '请输入密码！' },
            { min: 6, message: '密码长度至少为6位' },
            { max: 16, message: '密码长度最多为16位' }
          ]"
        >
          <a-input-password
            v-model:value="formState.userPassword"
            placeholder="请输入密码"
            :size="'large'"
          >
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item
          name="checkPassword"
          :rules="[
            { required: true, message: '请确认密码！' },
            { validator: validatePassword }
          ]"
        >
          <a-input-password
            v-model:value="formState.checkPassword"
            placeholder="请确认密码"
            :size="'large'"
          >
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item class="register-options">
          <div class="flex-between">
            <router-link to="/user/login" class="login-link">返回登录</router-link>
          </div>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            block
            :size="'large'"
            class="register-button"
          >
            注册
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { userRegisterUsingPost } from '@/api/userController'

interface FormState {
  userAccount: string
  userPassword: string
  checkPassword: string
}

const formState = reactive<FormState>({
  userAccount: '',
  userPassword: '',
  checkPassword: ''
})

const loading = ref(false)
const router = useRouter()

// 验证两次输入的密码是否相同
const validatePassword = async (_rule: any, value: string) => {
  if (value !== formState.userPassword) {
    return Promise.reject('两次输入的密码不一致！')
  }
  return Promise.resolve()
}

const onFinish = async (values: FormState) => {
  loading.value = true
  try {
    const res = await userRegisterUsingPost({
      userAccount: values.userAccount,
      userPassword: values.userPassword
    })
    if (res.code === 0) {
      message.success('注册成功')
      // 跳转到登录页
      await router.push('/user/login')
    } else {
      message.error(res.message || '注册失败')
    }
  } catch (error) {
    message.error('注册失败，请重试')
  } finally {
    loading.value = false
  }
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.register-card {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

:deep(.site-form-item-icon) {
  font-size: 18px;
  color: #bfbfbf;
  transition: all 0.3s;
}

:deep(.ant-input-affix-wrapper:hover .site-form-item-icon) {
  color: #1890ff;
}

:deep(.ant-input-affix-wrapper-focused .site-form-item-icon) {
  color: #1890ff;
}

:deep(.ant-card-head) {
  border-bottom: none;
  padding-bottom: 0;
}

:deep(.ant-card-head-title) {
  font-size: 24px;
  text-align: center;
  padding-top: 24px;
}

:deep(.ant-card-body) {
  padding: 24px 32px 32px;
}

:deep(.ant-input-affix-wrapper) {
  padding: 8px 11px;
  transition: all 0.3s;
}

:deep(.ant-input-affix-wrapper:hover) {
  border-color: #40a9ff;
}

.register-button {
  height: 40px;
  font-size: 16px;
  transition: all 0.3s;
}

.register-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(24,144,255,0.35);
}

.ant-form-item:last-child {
  margin-bottom: 0;
}

:deep(.ant-input-affix-wrapper) {
  transform: translateY(0);
  transition: all 0.3s;
}

:deep(.ant-input-affix-wrapper:hover),
:deep(.ant-input-affix-wrapper-focused) {
  transform: translateY(-1px);
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.login-link {
  color: #1890ff;
  text-decoration: none;
}

.login-link:hover {
  color: #40a9ff;
}
</style>
