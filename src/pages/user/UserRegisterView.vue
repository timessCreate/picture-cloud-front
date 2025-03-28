<template>
  <div class="register-container">
    <!-- 动态背景粒子 -->
    <div class="particles">
      <div class="particle"></div>
      <div class="particle"></div>
      <div class="particle"></div>
    </div>

    <!-- 注册卡片 -->
    <div class="register-card glassmorphism">
      <div class="header">
        <h1>加入我们</h1>
        <p>开启您的创作之旅</p>
      </div>

      <a-form
        class="register-form"
        :model="formState"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
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
            placeholder="请输入密码（6-16位）"
            size="large"
            class="modern-input"
          >
            <template #prefix>
              <LockOutlined class="input-icon" />
            </template>
          </a-input-password>
        </a-form-item>

        <!-- 确认密码 -->
        <a-form-item name="checkPassword">
          <a-input-password
            v-model:value="formState.checkPassword"
            placeholder="请确认密码"
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
          <router-link to="/user/login" class="login-link"> 已有账号？立即登录 </router-link>
        </div>

        <!-- 注册按钮 -->
        <a-button
          type="primary"
          html-type="submit"
          :loading="loading"
          block
          size="large"
          class="register-button"
        >
          <template #icon>
            <RocketOutlined />
          </template>
          立即注册
        </a-button>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { UserOutlined, LockOutlined, RocketOutlined } from '@ant-design/icons-vue'
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
  checkPassword: '',
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
      userPassword: values.userPassword,
    })
    if (res.data.code === 0) {
      message.success('注册成功')
      // 跳转到登录页
      await router.push('/user/login')
    } else {
      message.error(res.data.message || '注册失败')
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
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.register-card {
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
  margin: 16px 0;
  text-align: center;
}

.login-link {
  color: #667eea;
  transition: color 0.3s;
}

.login-link:hover {
  color: #764ba2;
}

.register-button {
  height: 48px;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
}

.register-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
}

/* 复用登录页面的粒子动画 */
.particles,
.particle,
@keyframes float {
  /* 与登录页面保持相同动画效果 */
}
</style>
