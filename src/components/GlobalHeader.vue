<template>
  <div id="globalHeader">
    <router-link to="/" class="logo-link">
      <div class="title-bar">
        <img class="logo" src="../assets/logo.png" alt="logo" />
        <div class="title">易图</div>
      </div>
    </router-link>

    <a-menu
      v-model:selectedKeys="current"
      mode="horizontal"
      :items="menuItems"
      :overflowedIndicator="()=>h(EllipsisOutlined)"
      :wrap="false"
      @click="doMenuClick"
    />


    <div class="login-button">
      <div class="user-login-status">
        <div v-if="isLogin">
          <a-dropdown>
            <a-space>
              <a-avatar :src="userLoginUser.userAvatar" />
              {{ userLoginUser.userName ?? '无名'}}
            </a-space>
            <template #overlay>
              <a-menu>
                <a-menu-item key="logout">
                  <a-button type="primary" @click="logout">
                    <logoutOutlined />
                    退出登录
                  </a-button>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
        <div v-else>
          <router-link to="/user/login">
            <a-button type="primary" class="login-link">登录</a-button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, h, onMounted, watch, computed } from 'vue'
import type { MenuProps } from 'ant-design-vue'
import {
  HomeOutlined,
  InfoCircleOutlined,
  GithubOutlined,
  GiftOutlined,
  EllipsisOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { storeToRefs } from 'pinia'
import { message } from 'ant-design-vue'
import { logoutUsingGet } from '@/api/userController'

const loginUserStore = useLoginUserStore()
const { userLoginUser } = storeToRefs(loginUserStore)
const isLogin = ref(false)


// 菜单列表
const originItems = [
    {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: '/admin/userManage',
    icon: () => h(InfoCircleOutlined),
    label: '用户管理',
    title: '用户管理',
  },
  {
    key: '/admin/pictureManage',
    icon: () => h(InfoCircleOutlined),
    label: '图片管理',
    title: '图片管理',
  },
  {
  key: '/add_picture',
  label: '创建图片',
  title: '创建图片',
  },
  {
    key: 'github',
    icon: () => h(GithubOutlined),
    label: h('a', { href: 'https://github.com/timessCreate', target: '_blank' }, 'GitHub'),
    title: 'GitHub',
  },
]

// 过滤菜单项
const filterMenus = (menus = [] as MenuProps['items']) => {
  return menus?.filter((menu) => {
    if (menu?.key?.toString().startsWith('/admin')) {
      const loginUser = loginUserStore.userLoginUser
      console.log("登录对象信息：",loginUser)
      if (!loginUser || (loginUser.userRole !== "admin" && loginUser.userRole !== "super_admin")) {
        return false
      }
    }
    return true
  })
}
// 展示在菜单的路由数组
const menuItems = computed<MenuProps['items']>(() => filterMenus(originItems))
console.log("过滤结果" + menuItems.value);

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
    console.log('userLoginUser changed:', newVal)
    isLogin.value = Object.keys(newVal).length > 0
  },
  { deep: true, immediate: true }
)

// 添加一些日志
console.log('Initial userLoginUser:', userLoginUser.value)

const logout = async () => {
  try {
    // 调用后端退出登录接口
    const res = await logoutUsingGet();
    if (res.data.code === 0) {
      // 清空用户信息
      loginUserStore.setUserLoginUser({});
      isLogin.value = false;  // 设置登录状态为 false
      // 跳转到登录页
      await router.push('/user/login');
      message.success('退出登录成功');
    } else {
      message.error('退出登录失败，' + res.data.message);
    }
  } catch (error) {
    console.error('退出登录失败:', error);
    message.error('退出登录失败，请重试');
  }
}

onMounted(async () => {
  try {
    console.log('GlobalHeader mounted')
    await loginUserStore.fetchLoginUser()
    console.log('After fetchLoginUser:', userLoginUser.value)
  } catch (error) {
    console.error('GlobalHeader mounted error:', error)
  }
})

</script>

<style scoped>
#globalHeader {
  width: 100%;
  background: #fff;
  display: flex;
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
  margin: 0 20px;
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
