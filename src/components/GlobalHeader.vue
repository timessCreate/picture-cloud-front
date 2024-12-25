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
      :overflowedIndicator="h(EllipsisOutlined)"
      :wrap="false"
      @click="doMenuClick"
    />

    <div class="login-button">
      <div class="user-login-status">
        <div v-if="!!loginUserStore?.userLoginUser?.id">
          {{ loginUserStore.userLoginUser.userName ?? '无名' }}
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
import { ref, h } from 'vue'
import type { MenuProps } from 'ant-design-vue'
import {
  HomeOutlined,
  InfoCircleOutlined,
  GithubOutlined,
  GiftOutlined,
  EllipsisOutlined,
} from '@ant-design/icons-vue'
import { useLoginUserStore } from '@/stores/useLoginUserStore'

const loginUserStore = useLoginUserStore()
const menuItems = ref<MenuProps['items']>([
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '主页',
    title: '主页',
  },
  {
    key: 'about',
    icon: () => h(InfoCircleOutlined),
    label: '关于',
    title: '关于',
  },
  {
    key: 'github',
    icon: () => h(GithubOutlined),
    label: h('a', { href: 'https://github.com/timessCreate', target: '_blank' }, 'GitHub'),
    title: 'GitHub',
  },
  {
    key: 'donate',
    icon: () => h(GiftOutlined),
    label: '捐赠',
    title: '捐赠',
  },
])
const current = ref<string[]>([])
const router = useRouter()
// 路由跳转事件
const doMenuClick = ({ key }: { key: string }) => {
  router.push({ path: key })
}
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
