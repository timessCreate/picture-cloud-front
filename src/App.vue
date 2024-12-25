<template>
  <div id="app">
    <BasicLayout />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import BasicLayout from './layouts/BasicLayout.vue'
import { useLoginUserStore } from './stores/useLoginUserStore'

const loginUserStore = useLoginUserStore()

onMounted(async () => {
  await loginUserStore.fetchLoginUser()
})
</script>

<style scoped></style>
