<template>
  <div id="app">
    <BasicLayout />
  </div>
</template>

<script setup lang="ts">

import BasicLayout from './layouts/BasicLayout.vue'

//已经改为在权限校验中获取用户信息access.ts
//import { onMounted } from 'vue'
//import { useLoginUserStore } from './stores/useLoginUserStore'

// const loginUserStore = useLoginUserStore()

// onMounted(async () => {
//   await loginUserStore.fetchLoginUser()
// })
// </script>

<style scoped></style>
