import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getUserInfoUsingGet } from '@/api/userController'
/*
  这是一个全局状态管理，用于存储登录用户信息的状态
*/

export const useLoginUserStore = defineStore('userLoginUser', () => {
  const userLoginUser = ref<any>({
    userName: '未登录',
  })

  /**
   * 远程获取登录用户信息
   */
  async function fetchLoginUser() {
    //TODO: 后端接口尚未确定
    // const res = await getUserInfoUsingGet({})
    // userLoginUser.value = res.data
  }

  /**
   * 设置登录用户信息
   * @param userLoginUser 登录用户信息
   */
  function setUserLoginUser(newLoginUser: any) {
    userLoginUser.value = newLoginUser
  }

  //导出数据,其他组件可以调用
  return { userLoginUser, fetchLoginUser, setUserLoginUser }
})
