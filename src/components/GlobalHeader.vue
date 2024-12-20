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
    />

    <div class="login-button">
      <a href="/user/login" class="login-link">登录</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, h } from 'vue'
import type { MenuProps } from 'ant-design-vue'
import {
  HomeOutlined,
  InfoCircleOutlined,
  GithubOutlined,
  GiftOutlined,
  EllipsisOutlined,
} from '@ant-design/icons-vue'

const current = ref<string[]>(['home'])

const menuItems = ref<MenuProps['items']>([
  {
    key: 'home',
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
    label: h('a', { href: 'https://github.com/timess', target: '_blank' }, 'GitHub'),
    title: 'GitHub',
  },
  {
    key: 'donate',
    icon: () => h(GiftOutlined),
    label: '捐赠',
    title: '捐赠',
  },
])
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
