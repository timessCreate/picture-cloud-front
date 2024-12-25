import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserInfoUsingGet } from '../api/userController'
/*
  这是一个全局状态管理，用于存储登录用户信息的状态
*/

export const useLoginUserStore = defineStore('userLoginUser', () => {
  const userLoginUser = ref<API.LoginUserVO>({
    userName: '未登录',
  })

  /**
   * 远程获取登录用户信息
   */
  async function fetchLoginUser() {
    const res = await getLoginUserInfoUsingGet({})
    console.log('获取用户信息结果:', res)
    if(res.code === 0 && res.data){
      userLoginUser.value = res.data as API.LoginUserVO
    }
  }

  /**
   * 设置登录用户信息
   * @param userLoginUser 登录用户信息
   */
  function setUserLoginUser(newLoginUser: API.LoginUserVO) {
    userLoginUser.value = newLoginUser
  }

  //导出数据,其他组件可以调用
  return { userLoginUser, fetchLoginUser, setUserLoginUser }
})
