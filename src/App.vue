<template>
  <div id="app">
    <MouseTrail />
    <a-config-provider :locale="locale">
      <BasicLayout>
        <router-view></router-view>
      </BasicLayout>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import BasicLayout from '@/layouts/BasicLayout.vue'
import MouseTrail from '@/components/MouseTrail.vue'

//已经改为在权限校验中获取用户信息access.ts
//import { onMounted } from 'vue'
//import { useLoginUserStore } from './stores/useLoginUserStore'

// const loginUserStore = useLoginUserStore()

// onMounted(async () => {
//   await loginUserStore.fetchLoginUser()
// })

const locale = zhCN
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}

/* 确保鼠标特效容器在最上层 */
#trail-container {
  position: fixed !important;
  z-index: 99999 !important;
}
</style>
