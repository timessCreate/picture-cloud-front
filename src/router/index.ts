import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import LoginView from '../pages/user/UserLoginView.vue'
import type { RouteRecordRaw } from 'vue-router'
import DonateView from '../pages/user/DonateView.vue'
import UserRegisterView from '../pages/user/UserRegisterView.vue'
import UserManageView from '../pages/admin/UserManagerView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/user/login',
    name: 'userLogin',
    component: LoginView,
  },
  {
    path: '/user/register',
    name: 'register',
    component: UserRegisterView
  },
  {
    path: '/admin/userManage',
    name: 'userManage',
    component: UserManageView,
  },
  {
    path: '/donate',
    name: 'donate',
    component: DonateView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
