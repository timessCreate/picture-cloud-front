<template>
  <div class="login-container">
    <a-card title="用户登录" class="login-card">
      <a-form
        :model="formState"
        name="login"
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
          :rules="[{ required: true, message: '请输入密码！' }, { min: 6, message: '密码长度至少为6位' }, { max: 16, message: '密码长度最多为16位' }]"
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

        <a-form-item name="remember" class="remember-register">
          <div class="flex-between">
            <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
            <router-link to="/user/register" class="register-link">去注册</router-link>
          </div>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            block
            :size="'large'"
            class="login-button"
          >
            登录
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
import { userLoginUsingPost } from '@/api/userController'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

interface FormState {
  userAccount: string
  userPassword: string
  remember: boolean
}

const formState = reactive<FormState>({
  userAccount: '',
  userPassword: '',
  remember: true,
})

const loading = ref(false)
const router = useRouter()
const loginUserStore = useLoginUserStore()

const onFinish = async (values: FormState) => {
  loading.value = true
  try {
    const res = await userLoginUsingPost({
      userAccount: values.userAccount,
      userPassword: values.userPassword,
    })
    if (res.code === 0) {
      message.success('登录成功')
      // 更新用户信息
      await loginUserStore.fetchLoginUser()
      // 跳转到首页
      await router.push('/')
    } else {
      // 直接显示后端返回的错误信息
      message.error(res.message)
    }
  } catch (error) {
    message.error('登录失败，请重试')
  } finally {
    loading.value = false
  }
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-card {
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

.login-button {
  height: 40px;
  font-size: 16px;
  transition: all 0.3s;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(24,144,255,0.35);
}

.ant-form-item:last-child {
  margin-bottom: 0;
}

/* 添加输入框动画效果 */
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

.register-link {
  color: #1890ff;
  text-decoration: none;
}

.register-link:hover {
  color: #40a9ff;
}
</style>

