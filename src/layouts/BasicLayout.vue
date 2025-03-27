<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout class="layout-content">
        <a-layout-sider width="11%" style="background: #fff" class="sider">
          <GlobalSider />
        </a-layout-sider>
        <a-layout-content class="content">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '../components/GlobalHeader.vue'
import GlobalSider from '../components/GlobalSider.vue'
</script>

<style scoped>
#basicLayout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
#basicLayout .layout-content {
  background-color: #ffffff;
}
#basicLayout .header {
  background-color: #ffffff;
  padding: 0;
  height: 64px;
  line-height: 64px;
  position: fixed;
  width: 100%;
  z-index: 1000;
  border-bottom: 1px solid #e0e0e0;
}

#basicLayout .content {
  flex: 1;
  margin-top: 64px;
  background: #ffffff;
  overflow-y: auto;
  height: calc(100vh - 64px);
}
#basicLayout .sider {
  flex: 1;
  margin-top: 7%;
  background: #ffffff;
  overflow-y: auto;
  height: calc(100vh - 100px);
}
#basicLayout .footer {
  text-align: center;
  background-color: #eeeeee;
  padding: 20px 0;
  height: 50px;
  border-top: 1px solid #e0e0e0;
  position: sticky;
  bottom: 0;
}
</style>
