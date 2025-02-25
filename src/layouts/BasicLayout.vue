<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>

      <a-layout-content class="content">
        <router-view />
      </a-layout-content>

      <a-layout-footer class="footer">
        <a href="https://github.com/timessCreate" target="_blank">易图 by timess</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from '../components/GlobalHeader.vue'
</script>

<style scoped>
#basicLayout{
  display: flex;
  flex-direction: column;
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
  flex:1 1 auto;
  margin-top: 84px;
  background: linear-gradient(to bottom, #fffff5, #eeeeee);
}

#basicLayout .footer {
  text-align: center;
  background-color: #eeeeee;
  padding: 20px 0;
  height: 50px;
  border-top: 1px solid #e0e0e0;
  position:sticky;
  bottom: 0;
}
</style>
