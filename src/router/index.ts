import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import LoginView from '../pages/user/UserLoginView.vue'
import type { RouteRecordRaw } from 'vue-router'
import AboutView from '../pages/user/AboutView.vue'
import DonateView from '../pages/user/DonateView.vue'
import UserManagerView from '../pages/admin/UserManagerView.vue'
import UserRegisterView from '../pages/user/UserRegisterView.vue'

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
    name: 'userRegister',
    component: UserRegisterView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/donate',
    name: 'donate',
    component: DonateView,
  },
  {
    path: '/admin/users',
    name: 'userManager',
    component: UserManagerView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
