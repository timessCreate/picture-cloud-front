/*
  全局注册目录
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'
import router from './router'
import checkAccess from './access'



async function bootstrap() {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)
  app.use(Antd)

  // 初始化权限检查
  checkAccess()

  app.mount('#app')
}

bootstrap()
