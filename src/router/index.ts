import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import LoginView from '../pages/user/UserLoginView.vue'
import type { RouteRecordRaw } from 'vue-router'
import UserRegisterView from '../pages/user/UserRegisterView.vue'
import UserManageView from '../pages/admin/UserManagerView.vue'
import AddPicturePage from '../pages/AddPicturePage.vue'
import PictureManagerView from '@/pages/admin/PictureManagerView.vue'
import SpaceManagerView from '@/pages/admin/SpaceManagerView.vue'

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
    component: UserRegisterView,
  },
  {
    path: '/picture/:id',
    name: 'pictureDetail',
    component: () => import('@/pages/PictureDetailView.vue'),
  },
  {
    path: '/admin/userManage',
    name: 'userManage',
    component: UserManageView,
  },
  {
    path: '/add_picture',
    name: '创建图片',
    component: AddPicturePage,
  },
  {
    path: '/admin/pictureManage',
    name: '图片管理',
    component: PictureManagerView,
  },
  {
    path: '/admin/spaceManage',
    name: '空间管理',
    component: SpaceManagerView,
  },
  {
    path: '/space/add',
    name: '添加空间',
    component: () => import('@/pages/AddSpaceView.vue'),
  },
  {
    path: '/space/edit/:id',
    name: '修改空间',
    component: () => import('@/pages/admin/EditSpaceView.vue'),
  },
  // {
  //   path: '/space/detail/:id',
  //   name: '我的空间',
  //   component: () => import('@/pages/SpaceDetailView.vue'),
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
