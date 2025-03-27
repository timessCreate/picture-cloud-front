<template>
  <div id="globalSider">
    <a-layout-sider width="90%" style="background: #fff" breakpoint="lg">
      <a-menu v-model:selectedKeys="current" mode="inline" :items="menuItems" @click="doMenuClick">
      </a-menu>
    </a-layout-sider>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, h, onMounted, watch, computed } from 'vue'
import type { MenuProps } from 'ant-design-vue'
import {
  PictureOutlined,
  UserOutlined,
  TeamOutlined,
  BarChartOutlined,
} from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'
import { logoutUsingGet } from '@/api/userController'

const loginUserStore = useLoginUserStore()
const { userLoginUser } = storeToRefs(loginUserStore)
const isLogin = ref(false)

// 菜单列表
const originItems = computed(() => [
  {
    key: '/',
    icon: () => h(PictureOutlined),
    label: '公共空间',
    title: '公共空间',
  },
  {
    key: `/space/myDetail/${loginUserStore.userLoginUser?.id || ''}`,
    icon: () => h(UserOutlined),
    label: '我的空间',
    title: '我的空间',
  },
  // {
  //   key: '/admin/spaceManage',
  //   icon: () => h(TeamOutlined),
  //   label: '团队空间',
  //   title: '团队空间',
  // },
  {
    key: '/chart',
    // 图表分析
    icon: () => h(BarChartOutlined),
    label: '图表分析',
    title: '图表分析',
  },
])

// 过滤菜单项
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    // 需要登录的菜单项检查
    if (menu?.key?.toString().startsWith('/space/myDetail')) {
      if (!isLogin.value) return false
    }
    // 原有admin路由检查
    if (menu?.key?.toString().startsWith('/admin')) {
      const loginUser = loginUserStore.userLoginUser
      return loginUser?.userRole === 'admin' || loginUser?.userRole === 'super_admin'
    }
    return true
  })
}
// 展示在菜单的路由数组
const menuItems = computed<MenuProps['items']>(() => filterMenus(originItems.value))
console.log('过滤结果' + menuItems.value)

const current = ref<string[]>([])
const router = useRouter()
// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({ path: key })
}

// 修改 watch 部分
watch(
  () => loginUserStore.userLoginUser,
  (newVal) => {
    isLogin.value = Object.keys(newVal).length > 0
  },
  { deep: true, immediate: true },
)

// 添加一些日志
console.log('Initial userLoginUser:', userLoginUser.value)

const logout = async () => {
  try {
    // 调用后端退出登录接口
    const res = await logoutUsingGet()
    if (res.data.code === 0) {
      // 清空用户信息
      loginUserStore.setUserLoginUser({})
      isLogin.value = false // 设置登录状态为 false
      // 跳转到登录页
      await router.push('/user/login')
      message.success('退出登录成功')
    } else {
      message.error('退出登录失败，' + res.data.message)
    }
  } catch (error) {
    console.error('退出登录失败:', error)
    message.error('退出登录失败，请重试')
  }
}

onMounted(async () => {
  try {
    //console.log('GlobalHeader mounted')
    await loginUserStore.fetchLoginUser()
    //console.log('After fetchLoginUser:', userLoginUser.value)
  } catch (error) {
    console.error('GlobalHeader mounted error:', error)
  }
})
</script>

<style scoped>
#globalSider {
  width: 100%;
  margin-top: 40%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-link {
  flex-shrink: 0;
  text-decoration: none;
  color: inherit;
}

.title-bar {
  padding: 0 20px;
  display: flex;
  align-items: center;
}

.logo {
  height: 48px;
  margin-right: 16px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(120deg, #1890ff, #722ed1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

:deep(.ant-menu) {
  flex: 1;
  line-height: 46px;
  border-bottom: none;
}

.login-button {
  flex-shrink: 0;
  margin: 1 20px;
}

.login-link {
  background: #1890ff;
  color: #fff;
  padding: 6px 15px;
  border-radius: 4px;
  transition: all 0.3s;
  text-decoration: none;
}

.login-link:hover {
  background: #40a9ff;
}
</style>
