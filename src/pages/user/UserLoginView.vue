<template>
  <div class="login-container">
    <!-- 动态背景粒子 -->
    <div class="particles">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card glassmorphism">
      <div class="header">
        <h1>欢迎回来</h1>
        <p>开启您的视觉之旅</p>
      </div>

      <a-form class="login-form" :model="formState" @finish="onFinish">
        <!-- 账号输入 -->
        <a-form-item name="userAccount">
          <a-input
            v-model:value="formState.userAccount"
            placeholder="请输入账号"
            size="large"
            class="modern-input"
          >
            <template #prefix>
              <UserOutlined class="input-icon" />
            </template>
          </a-input>
        </a-form-item>

        <!-- 密码输入 -->
        <a-form-item name="userPassword">
          <a-input-password
            v-model:value="formState.userPassword"
            placeholder="请输入密码"
            size="large"
            class="modern-input"
          >
            <template #prefix>
              <LockOutlined class="input-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <!-- 操作区域 -->
        <div class="action-area">
          <a-checkbox v-model:checked="formState.remember">
            <span class="remember-text">记住我</span>
          </a-checkbox>
          <router-link to="/user/register" class="register-link"> 立即注册 </router-link>
        </div>

        <!-- 登录按钮 -->
        <a-button
          type="primary"
          html-type="submit"
          :loading="loading"
          block
          size="large"
          class="login-button"
        >
          <template #icon>
            <RightOutlined />
          </template>
          立即登录
        </a-button>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import {
  UserOutlined,
  LockOutlined,
  RightOutlined,
  WechatOutlined,
  AlipayOutlined,
  GithubOutlined,
} from '@ant-design/icons-vue'
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
    if (res.data.code === 0) {
      message.success('登录成功')
      // 更新用户信息
      await loginUserStore.fetchLoginUser()
      // 跳转到首页
      await router.push('/')
    } else {
      // 直接显示后端返回的错误信息
      message.error(res.data.message)
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
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 15s infinite linear;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
  }
}

.login-card {
  width: 100%;
  max-width: 440px;
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  z-index: 1;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 32px;
  color: #2d3748;
  margin-bottom: 8px;
}

.header p {
  color: #718096;
  font-size: 14px;
}

.modern-input {
  border-radius: 8px;
  transition: all 0.3s;
}

.modern-input:hover {
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.1);
}

.modern-input:deep(.ant-input) {
  padding: 12px 16px;
  height: 48px;
}

.input-icon {
  color: #a0aec0;
  font-size: 16px;
  margin-right: 8px;
}

.action-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
}

.remember-text {
  color: #4a5568;
}

.register-link {
  color: #667eea;
  transition: color 0.3s;
}

.register-link:hover {
  color: #764ba2;
}

.login-button {
  height: 48px;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
}

.social-login {
  margin-top: 32px;
}

.divider {
  position: relative;
  text-align: center;
  margin: 24px 0;
}

.divider-text {
  display: inline-block;
  padding: 0 12px;
  background: white;
  color: #718096;
  font-size: 12px;
  position: relative;
  z-index: 1;
}

.divider:after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e2e8f0;
  z-index: 0;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.icon {
  font-size: 24px;
  color: #718096;
  cursor: pointer;
  transition: all 0.3s;
}

.icon:hover {
  color: #667eea;
  transform: translateY(-2px);
}
</style>
