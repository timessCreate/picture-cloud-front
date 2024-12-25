<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>

      <a-layout-content class="content">
        <div class="content-wrapper">
          <router-view />
        </div>
      </a-layout-content>

      <a-layout-footer class="footer">
        <a href="https://github.com/timessCreate" target="_blank">易图 by timess</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '../components/GlobalHeader.vue'
import { onMounted } from 'vue'
import { useLoginUserStore } from '../stores/useLoginUserStore'

const loginUserStore = useLoginUserStore()

onMounted(async () => {
  await loginUserStore.fetchLoginUser()
})
</script>

<style scoped>
#basicLayout .header {
  background-color: #ffffff;
  padding: 0;
  height: 64px;
  line-height: 64px;
  position: fixed;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

#basicLayout .content {
  padding: 24px;
  margin-top: 64px;
  min-height: calc(100vh - 64px - 70px);
  background: linear-gradient(135deg, #f5f7fa 0%, #f7f9fc 100%);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

#basicLayout .footer {
  text-align: center;
  background-color: #ffffff;
  padding: 20px 0;
  height: 70px;
  border-top: 1px solid #f0f0f0;
}

#basicLayout .footer a {
  color: #666;
  text-decoration: none;
  transition: color 0.3s;
}

#basicLayout .footer a:hover {
  color: #1890ff;
}
</style>
