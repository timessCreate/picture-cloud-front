import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { getLoginUserInfoUsingGet } from '../api/userController'
/*
  这是一个全局状态管理，用于存储登录用户信息的状态
*/

export const useLoginUserStore = defineStore('userLoginUser', () => {
  // 使用 ref 创建响应式引用
  const userLoginUser = ref<API.LoginUserVO>({

  })

  /**
   * 远程获取登录用户信息
   */
  async function fetchLoginUser() {
    try {
      const res = await getLoginUserInfoUsingGet({})
      if(res.code === 0 && res.data){
        userLoginUser.value = res.data as API.LoginUserVO
      } else {
        console.error('获取用户信息失败:', res)
      }
    } catch (error) {
      console.error('获取用户信息出错:', error)
      // 可以在这里重置用户信息
      userLoginUser.value = {}
    }
  }

  /**
   * 设置登录用户信息
   * @param userLoginUser 登录用户信息
   */
  function setUserLoginUser(newLoginUser: API.LoginUserVO) {
    try {
      console.log('设置新的用户信息:', newLoginUser)
      userLoginUser.value = newLoginUser
      console.log('设置后的用户信息:', userLoginUser.value)
    } catch (error) {
      console.error('设置用户信息出错:', error)
    }
  }

  //导出数据,其他组件可以调用
  return { userLoginUser, fetchLoginUser, setUserLoginUser }
})
